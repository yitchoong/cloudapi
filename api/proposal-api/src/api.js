'use strict'

const __ = require('./i18n');
const _ = require('lodash');
const moment = require('moment')
const crud = require('crud-api')
const productApi = require('product-api')
const codeTables = require('./proposalCodeTables')

const sampleDisclosureSpecs = {
    questionList: [
        {"qid": "10", "widget" : "numberInput", "required": true, "qlabel": __("Height (cms)")},

        {"qid": "20", "widget" : "numberInput", "required": true, "qlabel": __("Weight (kgs)")},

        {"qid": "30", "widget" : "yesno", "required": true, "qlabel": __("Did you smoke cigarette / cigar / nicotine / pipe / waterpipe (hookah) / others during the last twelve (12) months? *"), "showChildrenValue": 'Yes', "objectChildren" : ["30-10","30-20","30-30"]},
            {"qid": "30-10", "widget" : "enum", "required": true, "qlabel": "Type", "codeTable": "SmokingType"},
            {"qid": "30-20", "widget" : "numberInput", "required": true, "qlabel": "Sticks per day"},
            {"qid": "30-30", "widget" : "numberInput", "required": true, "qlabel": "Duration"},

        {"qid": "40", "widget" : "yesno", "required": true, "qlabel": __("Do you have any physical disability or have you ever had or been treated for any congenital conditions, mental/nervous nesses, epilepsy, stroke, chest pain or heart diseases, circulatory system diseases, digestive system diseases, liver diseases (include hepatitis B/C carrier), hypertension, respiratory system diseases (exclude allergic rhinitis), reproductive stem diseases (including breast), urinary system diseases, musculoskeletal system diseases, diseases of the e/ear/nose/throat, HIV infection, sexually transmitted diseases, any tumor/abnormal tissue growth/cancer, diabetes, docrine (including thyroid) diseases? *"), "showChildrenValue":"Yes", "listChildren": ["40-10","40-20","40-30","40-40","40-50"]},
            {"qid": "40-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
            {"qid": "40-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
            {"qid": "40-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
            {"qid": "40-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
            {"qid": "40-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},

        {"qid": "50", "widget" : "yesno", "required": true, "qlabel": __("Do you have any application for life insurance, critical illness, disability benefits, income protection, long-term care or health isurance that has ever been declined, postponed, or accepted on special terms?"), "showChildrenValue":"Yes", "listChildren": ["50-10","50-20","50-30","50-40","50-50"]},
            {"qid": "50-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
            {"qid": "50-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
            {"qid": "50-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
            {"qid": "50-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
            {"qid": "50-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},


        {"qid": "60", "widget" : "yesno", "required": true, "qlabel": __("During the past 2 years, have you had surgical operation in a hospital or continuously receive medication or treatment for a period of 14 days or more, or had any tests or investigation (other than an investigation carried out for employment or migration purposes)?"), "showChildrenValue":"Yes", "listChildren": ["60-10","60-20","60-30","60-40","60-50"]},
            {"qid": "60-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
            {"qid": "60-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
            {"qid": "60-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
            {"qid": "60-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
            {"qid": "60-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},

        {"qid": "70", "widget" : "yesno", "required": true, "qlabel": __("Are you either waiting for any form of medical treatment, consultations or investigations or the results from a test or investigation, or are you having any ongoing treatment?"), "showChildrenValue":"Yes", "listChildren": ["70-10","70-20","70-30","70-40","70-50"]},
            {"qid": "70-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
            {"qid": "70-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
            {"qid": "70-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
            {"qid": "70-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
            {"qid": "70-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},

        {"qid": "80", "widget" : "yesno", "required": true, "qlabel": __("Have you been taking any drugs which can become addictive or have you ever been treated for drug or alcohol addiction? "), "showChildrenValue":"Yes", "listChildren": ["80-10","80-20","80-30","80-40","80-50"]},
            {"qid": "80-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
            {"qid": "80-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
            {"qid": "80-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
            {"qid": "80-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
            {"qid": "80-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},

        {"qid": "90", "widget" : "yesno", "required": true, "qlabel": __("Have either of your direct family member (parents, brothers and sisters) whether living or dead, ever suffered from cancer including carcinoma-in-situ), heart problems (include murmur), stroke, diabetes, renal failure, liver disease or any hereditary isease before age 60?"), "showChildrenValue":"Yes", "listChildren": ["90-10","90-20","90-30","90-40"]},
            {"qid": "90-10", "widget" : "enum", "codeTable":"RelationshipType","required": true, "qlabel": "Relationship"},
            {"qid": "90-20", "widget" : "textInput", "required": true, "qlabel": "Medical Condition / Cause of death"},
            {"qid": "90-30", "widget" : "numberInput", "required": false, "qlabel": "Age of condition onset"},
            {"qid": "90-40", "widget" : "numberInput", "required": false, "qlabel": "Age at death (if applicable)"}
    ]

}


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
    const validSubmissionTypes = ['FirstPartyMedicalProposal','FirstPartyTermProposalSubmission', 'FirstPartyEndowmentProposalSubmission',
            'FirstPartyWholeLifeProposalSubmission'];
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
    if (json.submissionType.toLowerCase() === 'firstpartymedicalproposal') {
        if (json.submissionData.proposalType.toLowerCase() === 'firstpartymedical') {
            // let proposal = Object.assign({} , json.submissionData) ;
            let proposal = _.cloneDeep(json.submissionData); // create a clone for the proposal

            // there is a need to re-structure the json message to be compatible with the product api
            // check a few things first, i.e. must have field directMedicalProduct, and the insured must be a an object within the product
            let proceed = true;
            if (!proposal.proposedInsuranceSection.directMedicalProduct) {
                errs.push(__("There is no field called directMedicalProduct in the proposed insurance"))
                proceed = false
            } else {
                if (!proposal.proposedInsuranceSection.directMedicalProduct.insured) {
                    errs.push(__("There is no insured details for the medical product"))
                    proceed = false
                }
            }
            if (proceed) {
                proposal.tenantCode = json.tenantCode;
                proposal.submissionChannel = json.submissionChannel;
                proposal.proposedInsuranceSection.insuredList = [ proposal.proposedInsuranceSection.directMedicalProduct.insured ]
                proposal.proposedInsuranceSection.productList = [ proposal.proposedInsuranceSection.directMedicalProduct ]
                proposal.proposedInsuranceSection.productList[0].lifeAssuredNumber = 0 ; // only one
                // debugger;
                errs = errs.concat( exp.validateFirstPartyMedicalProposal(proposal) )
            }

        } else {
            errs.push(__(`The proposal type (${json.submissionData.proposalType})  is currently not supported`))
        }
    } else {
        errs.push(__(`The submissionl type (${json.submissionType})  is currently not supported`))
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
    const supportedProposalTypes = ["FirstPartyTerm","FirstPartyMedical","FirstPartyEndowment","FirstPartyWholeLife"]
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

exp.validateFirstPartySubmission = function(json) {

  let errs = []
  const validSubmissionTypes = ['FirstPartyMedicalProposal','FirstPartyTermProposalSubmission', 'FirstPartyEndowmentProposalSubmission',
                                'FirstPartyWholeLifeProposalSubmission','FirstPartyILPProposalSubmission'];

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

    let proposal = _.cloneDeep(json.submissionData); // create a clone for the proposal
    if (json.submissionType === 'FirstPartyMedicalProposal') {
        errs = errs.concat( processFirstPartyMedicalProposal(json, proposal) )
    } else if (json.submissionType === 'FirstPartyTermProposalSubmission') {
        errs = errs.concat( processFirstPartyTermProposal(json, proposal) )     // ::TODO::
    } else if (json.submissionType === 'FirstPartyEndowmentProposalSubmission') {
        errs = errs.concat( processFirstPartyEndowmentProposal(json, proposal) )     // ::TODO::
    } else if (json.submissionType === 'FirstPartyWholeLifeProposalSubmission') {
        errs = errs.concat( processFirstPartyWholeLifeProposal(json, proposal) )     // ::TODO::
    } else if (json.submissionType === 'FirstPartyILPProposalSubmission') {
        errs = errs.concat( processFirstPartyILPProposal(json, proposal) )     // ::TODO::
    } else {
        errs.push(__(`Submission type (${json.submissionType}) is not supported`))
    }
  }
  return errs
}

function processFirstPartyMedicalProposal(submission,proposal) { return processFirstPartyProposal(submission, proposal, "directMedicalProduct") }
function processFirstPartyTermProposal(submission,proposal) {return processFirstPartyProposal(submission, proposal) }
function processFirstPartyEndowmentProposal(submission,proposal) {return processFirstPartyProposal(submission, proposal, "coverageList") }
function processFirstPartyWholeLifeProposal(submission,proposal) {return processFirstPartyProposal(submission, proposal, "coverageList") }
function processFirstPartyProposal(submission, proposal, productFieldName) {
    let errs = [];
    // there is a need to re-structure the json message to be compatible with the product api
    // check a few things first, i.e. must have field directMedicalProduct, and the insured must be a an object within the product
    let proceed = true;
    if (proposal.proposalType === 'FirstPartyEndowment' || proposal.proposalType === 'FirstPartyWholeLife') {
        if (!proposal.proposedInsuranceSection.coverageList) {
            errs.push(__(`There is no coverages (coverageList) specified in the proposed insurance`))
            proceed = false
        } else {
            if (!proposal.proposedInsuranceSection.insuredList) {
                errs.push(__("There is no insured details specified for the proposed insurance"))
                proceed = false
            }
        }

    } else {
        productFieldName = productFieldName || "coverage"; // default name is coverage
        if (!proposal.proposedInsuranceSection[productFieldName]) {
            errs.push(__(`There is no field called ${productFieldName} in the proposed insurance`))
            proceed = false
        } else {
            if (!proposal.proposedInsuranceSection[productFieldName].insured) {
                errs.push(__("There is no insured details for the product"))
                proceed = false
            }
        }
    }
    if (proceed) {
        proposal.tenantCode = submission.tenantCode;
        proposal.submissionChannel = submission.submissionChannel;
        if (!proposal.proposedInsuranceSection.insuredList) {
            proposal.proposedInsuranceSection.insuredList = [ proposal.proposedInsuranceSection[productFieldName].insured ]
            proposal.proposedInsuranceSection.productList = [ proposal.proposedInsuranceSection[productFieldName] ]
            proposal.proposedInsuranceSection.productList[0].lifeAssuredNumber = 0 ; // only one
        }
        if (proposal.proposedInsuranceSection.coverageList && !proposal.proposedInsuranceSection.productList) {
            proposal.proposedInsuranceSection.productList = proposal.proposedInsuranceSection.coverageList
        }

        errs = errs.concat( exp.validateFirstPartyProposal(proposal) )
    }
    return errs
}
function processFirstPartyILPProposal(submission, proposal) {
    let errs = [];
    let proceed = true;

    if (!proposal.proposedInsuranceSection.coverageList) {
        errs.push(__(`There is no coverages (coverageList) specified in the proposed insurance`))
        proceed = false
    } else {
        if (!proposal.proposedInsuranceSection.insuredList) {
            errs.push(__("There is no insured details specified for the proposed insurance"))
            proceed = false
        }
    }

    if (proceed) {
        proposal.tenantCode = submission.tenantCode;
        proposal.submissionChannel = submission.submissionChannel;
        if (proposal.proposedInsuranceSection.coverageList && !proposal.proposedInsuranceSection.productList) {
            proposal.proposedInsuranceSection.productList = proposal.proposedInsuranceSection.coverageList
        }
        errs = errs.concat( exp.validateFirstPartyProposal(proposal) )
    }
    return errs
}



exp.validateFirstPartyProposal = function(proposal) {
  // have to validate the proposedInsurance section and the policyholderSection,
  // paymentSection should be strainght forward, for channel = direct, i.e. assume paymentGateway
  let errs = []

  if (!proposal.proposerName) errs.push(__("The proposalName is required for the submitted proposal"))

  // do some basic checks on the proposal-type
  if (!proposal.proposalType) {
    errs.push( __("The proposalType is required in the submitted proposal"))
  } else {
    const supportedProposalTypes = ["FirstPartyTerm","FirstPartyMedical","FirstPartyEndowment","FirstPartyWholeLife", "FirstPartyILP"]
    if (supportedProposalTypes.indexOf(proposal.proposalType) < 0) errs.push(__("Invalid proposalType for the submitted proposal"))

    if (proposal.proposalType === 'FirstPartyMedical' || proposal.proposalType === 'FirstPartyTerm' ) {
        if (!proposal.policyholderSection || !proposal.proposedInsuranceSection || !proposal.premiumPaymentSection) {
          errs.push(__("The policyholderSection, proposedInsuranceSection, and premiumPaymentSection are required sections in the submission proposal"))
        } else {
          errs = errs.concat( validateDirectPolicyholderSection(proposal))
          errs = errs.concat( validateProposedInsuranceSection(proposal, ["validatePersonProduct","validateMain"]))
          errs = errs.concat( validateDirectPaymentSection(proposal))
        }
    }

    if (proposal.proposalType === 'FirstPartyEndowment' || proposal.proposalType === 'FirstPartyWholeLife' ) {
        let requiredSections = ["policyholderSection", "proposedInsuranceSection","premiumPaymentSection"]
        if (proposal.tenantCode === 'ebao') requiredSections.push("policyholderDisclosureSection")
        requiredSections.forEach(section => {
            if (!proposal[section]) {
                errs.push(__(`The ${section} is required for ${proposal.proposalType} proposal submission`))
            } else {
                if (section === 'policyholderSection') errs = errs.concat( validatePolicyholderSection(proposal))
                if (section === 'proposedInsuranceSection') errs = errs.concat( validateProposedInsuranceSection(proposal,
                    ["validatePersonProduct","validateMain","validateAllRiders"]))
                if (section === 'premiumPaymentSection') errs = errs.concat( validatePremiumPaymentSection(proposal))
                if (section === 'policyholderDisclosureSection') errs = errs.concat( validatePolicyholderDisclosureSection(proposal))
            }
        })
    }

    if (proposal.proposalType === 'FirstPartyILP') {
        let requiredSections = ["policyholderSection", "proposedInsuranceSection","premiumPaymentSection"]
        if (proposal.tenantCode === 'ebao') requiredSections.push("policyholderDisclosureSection")
        requiredSections.forEach(section => {
            if (!proposal[section]) {
                errs.push(__(`The ${section} is required for ${proposal.proposalType} proposal submission`))
            } else {
                if (section === 'policyholderSection') errs = errs.concat( validatePolicyholderSection(proposal))
                if (section === 'proposedInsuranceSection') errs = errs.concat( validateProposedInsuranceSection(proposal,
                    ["validatePersonProduct","validateMain","validateAllRiders","validateAllFundAllocations","validateAllTopups","validateAllWithdrawals"]))
                if (section === 'premiumPaymentSection') errs = errs.concat( validatePremiumPaymentSection(proposal))
                if (section === 'policyholderDisclosureSection') errs = errs.concat( validatePolicyholderDisclosureSection(proposal))
            }
        })
    }


    // check for required sections for the first-party-endowment and first-party-whole-life proposal ::TODO::
  }

  return errs

}

// validate payment method
function validateFirstPartyMedicalPaymentSection(proposal) {return validateDirectPaymentMethod(proposal)} // due to change in name
function validateDirectPaymentSection(proposal) {

  let errs=[]
  if (proposal.submissionChannel === 'direct') {
      let initMethod = _.isString(proposal.premiumPaymentSection.initialPaymentMethod) ? proposal.premiumPaymentSection.initialPaymentMethod : proposal.premiumPaymentSection.initialPaymentMethod.paymentMethod
      let renewalMethod = _.isString(proposal.premiumPaymentSection.renewalPaymentMethod) ? proposal.premiumPaymentSection.renewalPaymentMethod : proposal.premiumPaymentSection.renewalPaymentMethod.paymentMethod

      if (!initMethod) {
          errs.push(__("The initial payment method is required in the proposal submission"))
      } else {
        if (["PaymentGatewayRecurringPayment","PaymentGateway","Cash"].indexOf(initMethod) < 0 ) {
            errs.push(__(`The initial payment method (${initMethod}) is invalid for direct submissions`))
        }
      }
      if (!renewalMethod) {
        errs.push(__("The renewal payment method is required in the proposal submission"))
    } else if (["PaymentGatewayRecurringPayment","PaymentGateway","Cash"].indexOf(renewalMethod) < 0 ) {
        errs.push(__(`The subsequent payment method (${renewalMethod}) is invalid for direct submissions`))
      }
  }
  // ::TODO:: more checks for other payment methods
  return errs;
}
function validatePremiumPaymentSection(proposal) {
  let errs=[]
  let initMethod = proposal.premiumPaymentSection.initialPaymentMethod.paymentMethod;
  let renewalMethod = proposal.premiumPaymentSection.renewalPaymentMethod.paymentMethod

  if (!initMethod) {
      errs.push(__("The initial payment method is required in the proposal submission"))
  }
  if (!renewalMethod) {
      errs.push(__("The renewal payment method is required in the proposal submission"))
  }

  // check the payment methods for other channels, first get the allowed payment methods based on the product
  let mainId = proposal.proposedInsuranceSection.productList[0].productId
  let methods = _.uniq(productApi.availablePaymentMethods(parseInt(mainId)).map( m => m.paymentMethod))
  methods.push('PaymentGatewayRecurringPayment'); // added for testing
  methods.push('PaymentGateway'); // added for testing
  let nbPay = methods.find(m => initMethod === m)
  let renewPay = methods.find(m => renewalMethod === m)
  if (!nbPay) { errs.push(__(`The initial payment method (${initMethod}) is invalid`)) }
  if (!renewPay) { errs.push(__(`The renewal payment method (${renewalMethod}) is invalid`)) }

  return errs;
}


// validate policyholder-section
function validateFirstPartyMedicalPolicyholderSection(proposal) { return validatePolicyholderSection(proposal) }
function validateDirectPolicyholderSection(proposal){ return validatePolicyholderSection(proposal) }
function validatePolicyholderSection(proposal){
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


// validate proposed-insurance-section
function validateFirstPartyMedicalProposedInsuranceSection(proposal) {
    return validateProposedInsuranceSection(proposal,["validatePersonProduct","validateMain", "validateAllRiders"] )
}
function validateProposedInsuranceSection(proposal, validators) {
    let errs = []
    // since we are looking at medical insurance, there are no need to run the investment validators
    // make use of the product-api to do the validation
    // let validators = ["validatePersonProduct","validateMain", "validateAllRiders"]
    let errmap = productApi.validate(proposal.proposedInsuranceSection,validators)
    Object.keys(errmap).forEach(errkey => errs = errs.concat( errmap[errkey] ) )
    return errs
}

function deriveDataType(widget) {
    return ['textInput','enum','yesno','radio','hidden','multiLineTextInput'].indexOf(widget) >= 0 ? 'text'
            : widget === 'numberInput' ? 'number'
            : widget === 'dateInput' ? 'date'
            : widget === 'checkbox' ? 'boolean' : 'text'
}
// validate policyholderDisclosureSection
function validatePolicyholderDisclosureSection(proposal) {
    let errs = []
    let specMap = {}, workmap = {}, spec, disclosure;
    sampleDisclosureSpecs.questionList.forEach(q => specMap[q.qid] = q )
    let disclosures = proposal.policyholderDisclosureSection.disclosures;
    // use the specs to ensure that all the mandatory fields are filled in
    let specKeys = Object.keys(specMap).sort()
    // drive using the specs , check if all root level mandatory fields are present
    let errors = specKeys.map(key => {
        if (key.indexOf('-') < 0 ) {
            spec = specMap[key]
            disclosure = disclosures[key]
            if (spec.required && !disclosure) {
                errs.push( __(`Please supply the answer for question "${spec.qlabel}"`))
            } else {
                 let val = disclosure.value;
                 if (!val)  errs.push( __(`Please supply a non-blank answer for question "${spec.qlabel}"`))
                 if (val && spec.widget === 'enum' && spec.codeTable)  {
                     let row = codeTables[spec.codeTable].codeTableData.find(table => table.code === val)
                     if (!row) errs.push(__(`Invalid value (${val}) provided for question "${spec.qlabel}" `))
                 }
                 if (val && spec.showChildrenValue ) {
                     if ((val+'').toLowerCase() === spec.showChildrenValue.toLowerCase() ) {
                        //  debugger
                         let isList = spec.listChildren && spec.listChildren.length > 0 ? true : false;
                         let isObject = spec.objectChildren && spec.objectChildren.length > 0 ? true : false;
                         let children = isList ? spec.listChildren : isObject ? spec.objectChildren : []
                         children.forEach( (child,index) => {
                            // if (child.startsWith('90-30')) debugger
                            let childSpec = specMap[child]
                            let childDisclosure = disclosures[child]
                            if (childSpec) {
                                if (childSpec.required && !childDisclosure) {
                                    errs.push( __(`Please supply the value of "${childSpec.qlabel}" for question "${spec.qlabel}"` ))
                                } else {
                                    if (isList) {
                                        let values = childDisclosure ? childDisclosure.multiValues : []
                                        if (childSpec.required) {
                                            let counter = _.sum( values.map(v => v === undefined || v === null  || v === '' ? 0 : 1))
                                            if (counter < values.length) errs.push( __(`Please supply a non-blank answer for value "${childSpec.qlabel}" of question "${spec.qlabel}"`))
                                        }
                                    } else {
                                        let value = childDisclosure.value;
                                        if (childSpec.required && !value) errs.push( __(`Please supply a non-blank answer for value "${childSpec.qlabel}" of question "${spec.qlabel}"`))
                                    }
                                    if (childSpec.widget === 'enum' && childSpec.codeTable) {
                                        if (isList) {
                                            let values = childDisclosure.multiValues;
                                            values.map( (v,idx) => {
                                                let row = codeTables[childSpec.codeTable].codeTableData.find(table => table.code === v )
                                                if (!row) errs.push(__(`Invalid value (${v}) provided for value "${childSpec.qlabel}" at index ${idx+1} for question "${spec.qlabel}" `))
                                            })
                                        } else {
                                            let value = childDisclosure.value;
                                            let row = codeTables[childSpec.codeTable].codeTableData.find(table => table.code === value)
                                            if (!row) errs.push(__(`Invalid value (${value}) provided for question "${childSpec.qlabel}" `))
                                        }

                                    }
                                }
                            }
                         })
                     }
                 }

            }
        } // if child disclosure, handled within the parent node
    })
    return errs;
}

/* api to create a submission that has been received. */

exp.processFirstPartyMedicalProposalSubmission = function(submission) {
    // first thing is to validate the submission, if not ok, return the error messages. If ok, then persist it using save
    // Because we need to save into the database, this API needs to return a promise
    // validation is sync at the moment, do that first
    // here means no errors, so we have to use the crud-api to createProposalSubmission
    // it might still have errors, so have to cater for it
    return createProposalSubmission(submission, exp.validateFirstPartyMedicalSubmission)
}
exp.processFirstPartyTermProposalSubmission = function(submission) {
    return createProposalSubmission(submission, exp.validateFirstPartySubmission)
}

exp.processFirstPartyTraditionalProposalSubmission = function(submission) {
    return createProposalSubmission(submission, exp.validateFirstPartySubmission)
}
exp.processFirstPartyILPProposalSubmission = function(submission){
    return createProposalSubmission(submission, exp.validateFirstPartySubmission )
}


function createProposalSubmission( submission, validator) {

    return new Promise((resolve,reject) => {
        let errs = validator(submission);
        // console.log("***** Errors from validation", errs)
        if (errs.length > 0) {
            reject( errs )
            return
        }

        // we check for duplicates if the submissionRefNo is there, read the document by ref no, if exists, duplicate
        let p = submission.submissionRefNo ? crud.fetchProposalSubmissionByRefNo(submission.submissionRefNo)
                                                     : new Promise(resolve => resolve(null ));

        p.then(doc => {
            // console.log("proposalApi ---> doc", doc)
            if (!doc) {
                return crud.createProposalSubmission(submission)
            } else {
                return new Promise(resolve => resolve({ ok:false, errors: __(`Duplicate submission. The submissionRefNo should be unique (${submission.submissionRefNo}) `) }))
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

exp.fetchProposalSubmissionByPk = function(pk, submissionType="") {
    return crud.fetchProposalSubmissionByPk(pk, submissionType);
}

exp.fetchFirstPartyMedicalSubmissionSummaryList = function(userId, submissionType, filter, limit, offset, orderBy) {
    return crud.fetchSubmissionSummaryList(userId, submissionType , filter, limit, offset, orderBy)
    // return crud.fetchSubmissionSummaryList(userId, 'FirstPartyMedicalProposal' , filter, limit, offset, orderBy)
}

exp.fetchSubmissionSummaryList = function(userId, submissionType, filter, limit, offset, orderBy) {
    return crud.fetchSubmissionSummaryList(userId, submissionType , filter, limit, offset, orderBy)
    // return crud.fetchSubmissionSummaryList(userId, 'FirstPartyMedicalProposal' , filter, limit, offset, orderBy)
}

exp.fetchPolicyholderDiscloureSpec = function(tenantCode, productId) {
    return sampleDisclosureSpecs
}

module.exports = exp;
