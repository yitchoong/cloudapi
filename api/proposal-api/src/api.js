'use strict'

const __ = require('./i18n');
const _ = require('lodash');
const moment = require('moment')
const crud = require('crud-api')
const productApi = require('product-api')
const codeTables = require('./proposalCodeTables')
// we get the tenant codes from the database and we cache it
var tenants=[];
crud.init()
.then(status => {
  return crud.getTenantList()
})
.then( tenantList => {
  tenants = tenantList
})
.catch((err) => console.log("OOPS....", err))

var validChannels = ["direct","banca","agency","brokers"] ; // this does not change often, so just keep it here in the codes

var exp = {};

exp.getCodeTables = function() {
    return codeTables
}

exp.validateFirstPartyMedicalSubmission = function(json) {
  // check on mandatory fields and allowable values in the proposal submission
  // 1. must have submission date, submissionType, tenantCode, submissionChannel, submissionData
  // 2. Check that the following have valid values, submissionTypes, tenantCodes, submissionChannel
  // 3. based on proposal type, call the various versions to validate the proposal details
  //
  let errs = []
  if (json.submissionDate) {
      let workDate = json.submissionDate;
      workDate = moment(workDate,['YYYY-MM-DD','YYYY/MM/DD', 'DD-MM-YYYY','DD/MM/YYYY'], true)
      if ( !workDate.isValid() ) {
          errs.push( __("The submission date is invalid"))
      } else {
          if (workDate > moment()) errs.push(__(`The submission date cannot be in the future`))
      }
  } else {
    errs.push(__("The submissionDate is required"))
  }

  if (!json.submissionType) {
    errs.push(__("The submissionType is required"))
  } else {
    const validSubmissionTypes = ['FirstPartyMedicalProposal','FirstPartyTermProposal']
    if (validSubmissionTypes.indexOf(json.submissionType) < 0 ) errs.push( __(`The submissionType (${json.submissionType}) is invalid`))
  }

  if (!json.submissionChannel) {
    errs.push(__("The submissionChannel is required"))
  } else {
    if (validChannels.indexOf(json.submissionChannel) < 0 ) errs.push( __("The submissionChannel is invalid"))
  }
  if (!json.tenantCode) {
    errs.push(__("The tenantCode is required"))
  } else {
    let tenant = tenants.find( t => t.tenantCode === json.tenantCode)
    if (!tenant) errs.push( __(`The tenantCode (${json.tenantCode}) is invalid`))
  }
  if (!json.submissionData) {
    errs.push( __("The submissionData is required"))
  } else {
    if (json.submissionType.toLowerCase() === 'proposal') {
        if (json.submissionData.proposalType.toLowerCase() === 'firstpartymedical') {
            let proposal = json.submissionData;
            proposal.tenantCode = json.tenantCode;
            proposal.submissionChannel = json.submissionChannel;
            errs = errs.concat( exp.validateFirstPartyMedicalProposal(json.submissionData) )
        } else {
            errs.push(__(`The proposal type (${json.submissionData.proposalType})  is currently not supported`))
        }
    }
  }
  return errs

}

exp.validateFirstPartyMedicalProposal = function(proposal) {
  // have to validate the proposedInsurance section and the policyholderSection,
  // paymentSection should be strainght forward, for channel = direct, i.e. assume paymentGateway
  let errs = []
  // do some basic checks firstpartymedical
  if (!proposal.proposalType) {
    errs.push( __("The proposalType is required in the submitted proposal"))
  } else {
    const supportedProposalTypes = ["FirstPartyTerm","FirstPartyMedical"]
    if (supportedProposalTypes.indexOf(proposal.proposalType) < 0) errs.push(__("Invalid proposalType for the submitted proposal"))
    if (proposal.proposalType === 'FirstPartyMedical' || proposal.proposalType === 'FirstPartyTerm' ) {
        if (!proposal.policyholderSection || !proposal.proposedInsuranceSection || !proposal.premiumPaymentSection) {
          errs.push(__("The policyholderSection, proposedInsuranceSection, and premiumPaymentSection are required sections in the submission proposal"))
        }
    }
  }
  if (!proposal.proposerName) errs.push(__("The proposalName is required for the submitted proposal"))


  errs = errs.concat( validateFirstPartyMedicalPolicyholderSection(proposal))
  errs = errs.concat( validateFirstPartyMedicalProposedInsuranceSection(proposal))
  errs = errs.concat( validateFirstPartyMedicalPaymentSection(proposal))


  return errs

}
function validateFirstPartyMedicalPaymentSection(proposal) {
  let errs=[]
  if (proposal.submissionChannel === 'direct') {
      if (!proposal.premiumPaymentSection.initialPaymentMethod) {
          errs.push(__("The initial payment method is required in the proposal submission"))
      } else {
        if (["PaymentGatewayRecurringPayment","PaymentGateway"].indexOf(proposal.premiumPaymentSection.initialPaymentMethod) < 0 ) {
            errs.push(__("The initial payment method is invalid for direct submissions"))
        }
      }
      if (!proposal.premiumPaymentSection.subsequentPaymentMethod) {
        errs.push(__("The subsequent payment method is required in the proposal submission"))
    } else if (["PaymentGatewayRecurringPayment","PaymentGateway"].indexOf(proposal.premiumPaymentSection.subsequentPaymentMethod) < 0 ) {
        errs.push(__("The subsequent payment method is invalid for direct submissions"))
      }
  }
  // ::TODO:: more checks for other payment methods
  return errs;
}
function validateFirstPartyMedicalPolicyholderSection(proposal) {
    let errs = [];
    let section = proposal.policyholderSection
    // assume that all the required fields validation has already been done since it is part of the swagger specifications
    // so we check that the values are valid for the fields that have restricted values
    let row = codeTables.idTypes.codeTableData.find(table => table.code === section.idType)
    if (!row) errs.push(__(`Invalid policyholder Id Type (${section.idType})`))


    // check occupation
    row  = codeTables.occupations.codeTableData.find(table => table.code === section.occupation)
    if (!row) errs.push(__(`Invalid occupation (${section.occupation}) of the policyholder`))

    // check on country of birth
    row  = codeTables.countries.codeTableData.find(table => table.code === section.birthCountry)
    if (!row) errs.push(__(`Invalid country of birth (${section.birthCountry}) of the policyholder`))

    // check on Nationality
    row  = codeTables.nationalities.codeTableData.find(table => table.code === section.nationality)
    if (!row) errs.push(__(`Invalid nationality (${section.nationality}) of the policyholder`))

    // check on gender
    if (["m","f"].indexOf(section.gender.substring(0,1).toLowerCase() ) < 0) errs.push(__(`Invalid gender (${section.gender}) of the policyholder`))

    // check on the insurance objectives -- reason for buying insurance
    row  = codeTables.insuranceObjectives.codeTableData.find(table => table.code === section.insuranceObjective)
    if (!row) errs.push(__(`Invalid insurance objective (${section.insuranceObjective}) specified`))

    // for employmentNature, we only check the value if it is available
    if (section.employmentNature) {
        row  = codeTables.employmentNatures.codeTableData.find(table => table.code === section.employmentNature)
        if (!row) errs.push(__(`Invalid employment nature (${section.employmentNature}) specified`))
    }
    // now we have to check on the contact, at least mobile or telphone or email must be present
    if (!section.contactInfo) {
        errs.push(__("The contact information for the policyholder is required"))
    } else {
        if (!section.contactInfo.homeTelNo || !section.contactInfo.mobileNo || !section.contactInfo.email) {
            errs.push(__("The policyholder contact info must have at least one of home tel no, mobile, or email"))
        }
    }
    // mailing address, mandatory fields in the content should be already handled
    if (!section.mailingAddress) {
        errrs.push(__("The policyholder mailing address is required"))
    } else {
        // check that the country code is valid
        row  = codeTables.countries.codeTableData.find(table => table.code === section.mailingAddress.country)
        if (!row) errs.push(__(`Invalid country (${section.mailingAddress.country}) in the mailing address of the policyholder`))
    }
    return errs;
}

function validateFirstPartyMedicalProposedInsuranceSection(proposal) {
    let errs = []
    // since we are looking at medical insurance, there are no need to run the investment validators
    // make use of the product-api to do the validation
    let validators = ["validateMain", "validateAllRiders"]
    let errmap = productApi.validate(proposal.proposedInsuranceSection,validators)
    Object.keys(errmap).forEach(errkey => errs = errs.concat( errmap[errkey] ) )

    return errs

}

/* api to create a submission that has been received. */

exp.processFirstPartyMedicalProposalSubmission = function(submission) {
    // first thing is to validate the submission, if not ok, return the error messages. If ok, then persist it using save
    // Because we need to save into the database, this API needs to return a promise
    // validation is sync at the moment, do that first
    // here means no errors, so we have to use the crud-api to createProposalSubmission
    // it might still have errors, so have to cater for it
    return new Promise((resolve,reject) => {
        let errs = exp.validateFirstPartyMedicalSubmission(submission);
        if (errs.length > 0) {
            reject( errs )
            return
        }
        // we check for duplicates if the submissionRefNo is there, read the document by ref no, if exists, duplicate
        let p = submission.submissionRefNo ? crud.fetchProposalSubmissionByRefNo(submission.submissionRefNo)
                                                     : new Promise(resolve => resolve({}));

        p.then(doc => {
            if (!doc) {
                return crud.createProposalSubmission(submission)
            } else {
                return new Promise(resolve => resolve({ ok:false, errors: __("Duplicate submission") }))
            }
        })
        .then(result => {
            if (result.ok) {
                resolve(result.response)
            } else {
                reject(result.errors)
            }
        })
        .catch( (err) => {
            console.log("ERROR : -> ", err)
            reject(err)
        })
    });

}

exp.fetchProposalSubmissionByPk = function(pk) {
    return crud.fetchProposalSubmissionByPk(pk);
}

exp.fetchFirstPartyMedicalSubmissionSummaryList = function(userId, submissionType, filter, limit, offset, orderBy) {
    return crud.fetchSubmissionSummaryList(userId, 'FirstPartyMedicalProposal' , filter, limit, offset, orderBy)
}


module.exports = exp;
