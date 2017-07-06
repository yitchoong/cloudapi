'use strict';

const api = require('product-api');
const crud = require('crud-api');
const proposalApi = require('proposal-api');
crud.init()
const _ = require('lodash');
const __ = require('../i18n');
const utils = require('./utils');
// const sampleDisclosureSpecs = {
//     questionList: [
//         {"qid": "10", "widget" : "numberInput", "required": true, "qlabel": __("Height (cms)")},
//
//         {"qid": "20", "widget" : "numberInput", "required": true, "qlabel": __("Weight (kgs)")},
//
//         {"qid": "30", "widget" : "yesno", "required": true, "qlabel": __("Did you smoke cigarette / cigar / nicotine / pipe / waterpipe (hookah) / others during the last twelve (12) months? *"), "showChildrenValue": 'Yes', "listChildren" : ["30-10","30-20","30-30"]},
//             {"qid": "30-10", "widget" : "enum", "required": true, "qlabel": "Type", "codeTable": "SmokingType"},
//             {"qid": "30-20", "widget" : "numberInput", "required": true, "qlabel": "Sticks per day"},
//             {"qid": "30-30", "widget" : "numberInput", "required": true, "qlabel": "Duration"},
//
//         {"qid": "40", "widget" : "yesno", "required": true, "qlabel": __("Do you have any physical disability or have you ever had or been treated for any congenital conditions, mental/nervous nesses, epilepsy, stroke, chest pain or heart diseases, circulatory system diseases, digestive system diseases, liver diseases (include hepatitis B/C carrier), hypertension, respiratory system diseases (exclude allergic rhinitis), reproductive stem diseases (including breast), urinary system diseases, musculoskeletal system diseases, diseases of the e/ear/nose/throat, HIV infection, sexually transmitted diseases, any tumor/abnormal tissue growth/cancer, diabetes, docrine (including thyroid) diseases? *"), "showChildrenValue":"Yes", "listChildren": ["40-10","40-20","40-30","40-40","40-50"]},
//             {"qid": "40-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
//             {"qid": "40-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
//             {"qid": "40-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
//             {"qid": "40-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
//             {"qid": "40-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},
//
//         {"qid": "50", "widget" : "yesno", "required": true, "qlabel": __("Do you have any application for life insurance, critical illness, disability benefits, income protection, long-term care or health isurance that has ever been declined, postponed, or accepted on special terms?"), "showChildrenValue":"Yes", "listChildren": ["50-10","50-20","50-30","50-40","50-50"]},
//             {"qid": "50-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
//             {"qid": "50-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
//             {"qid": "50-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
//             {"qid": "50-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
//             {"qid": "50-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},
//
//
//         {"qid": "60", "widget" : "yesno", "required": true, "qlabel": __("During the past 2 years, have you had surgical operation in a hospital or continuously receive medication or treatment for a period of 14 days or more, or had any tests or investigation (other than an investigation carried out for employment or migration purposes)?"), "showChildrenValue":"Yes", "listChildren": ["60-10","60-20","60-30","60-40","60-50"]},
//             {"qid": "60-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
//             {"qid": "60-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
//             {"qid": "60-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
//             {"qid": "60-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
//             {"qid": "60-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},
//
//         {"qid": "70", "widget" : "yesno", "required": true, "qlabel": __("Are you either waiting for any form of medical treatment, consultations or investigations or the results from a test or investigation, or are you having any ongoing treatment?"), "showChildrenValue":"Yes", "listChildren": ["70-10","70-20","70-30","70-40","70-50"]},
//             {"qid": "70-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
//             {"qid": "70-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
//             {"qid": "70-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
//             {"qid": "70-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
//             {"qid": "70-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},
//
//         {"qid": "80", "widget" : "yesno", "required": true, "qlabel": __("Have you been taking any drugs which can become addictive or have you ever been treated for drug or alcohol addiction? "), "showChildrenValue":"Yes", "listChildren": ["80-10","80-20","80-30","80-40","80-50"]},
//             {"qid": "80-10", "widget" : "textInput", "required": true, "qlabel": "Condition Name"},
//             {"qid": "80-20", "widget" : "dateInput", "required": true, "qlabel": "Condition Date"},
//             {"qid": "80-30", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Name"},
//             {"qid": "80-40", "widget" : "textInput", "required": true, "qlabel": "Clinic/Hospital Address"},
//             {"qid": "80-50", "widget" : "textInput", "required": true, "qlabel": "Remarks"},
//
//         {"qid": "90", "widget" : "yesno", "required": true, "qlabel": __("Have either of your direct family member (parents, brothers and sisters) whether living or dead, ever suffered from cancer including carcinoma-in-situ), heart problems (include murmur), stroke, diabetes, renal failure, liver disease or any hereditary isease before age 60?"), "showChildrenValue":"Yes", "listChildren": ["90-10","90-20","90-30","90-40"]},
//             {"qid": "90-10", "widget" : "enum", "codeTable":"RelationshipType","required": true, "qlabel": "Relationship"},
//             {"qid": "90-20", "widget" : "textInput", "required": true, "qlabel": "Medical Condition / Cause of death"},
//             {"qid": "90-30", "widget" : "numberInput", "required": true, "qlabel": "Age of condition onset"},
//             {"qid": "90-40", "widget" : "numberInput", "required": true, "qlabel": "Age at death (if applicable)"}
//     ]
//
// }


exports.createFirstPartyMedicalSubmission = function(args, res, next) {
  /**
   * Create a new direct first party medical proposal submission document (containing proposal details)
   * This end point is used for the submission of a proposal. This end point is useful when proposals are not persisted prior to submission.
   *
   * bodyParam DirectFirstPartyMedicalSubmission The submission document containing the proposal
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * token String The security token, for the moment it is equal to the authenticated user id (optional)
   * returns DirectFirstPartyMedicalSubmission
   **/
   let lang = args.lang.value;
   let submission = args.bodyParam.value;
   let tenantCode = args.tenantCode.value;
   let token = args.Token && args.Token.value;
   let userId = token || "default" ; // if no user supplied, we just used the default userId
   submission.tenantCode = tenantCode ? tenantCode : submission.tenantCode;
   submission.userId = userId ? userId : submission.userId;
   proposalApi.processFirstPartyMedicalProposalSubmission(submission)
   .then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        // console.log("***result ***", result)
        res.end(JSON.stringify( result, null, 2));
   })
   .catch( (err) => {
     res.statusCode = 400
    //  console.log("***err ***", err);
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify( {errors: err}, null, 2));
   })


}

exports.fetchFirstPartyMedicalSubmission = function(args, res, next) {
  /**
   * Fetch a proposal submission document
   * Use this end-point to fetch a proposal submissions. This will fetch the full document including the proposal data, and the submission status.
   *
   * submissionId String Unique id for the submission
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * token String The security token, for the moment it is equal to the authenticated user id (optional)
   * returns DirectFirstPartyMedicalSubmission
   **/
   let lang = args.lang.value;
   let pk = args.submissionId.value
   let token = args.Token && args.Token.value;
   let userId = token || "default" ; // if no user supplied, we just used the default userId
   proposalApi.fetchProposalSubmissionByPk(pk, "FirstPartyMedicalProposal")
   .then(doc => {

       let data = doc && doc.submissionType === 'FirstPartyMedicalProposal' && doc.userId === userId ? doc : null ; // limit by the submissionType
       if (data) {
           res.setHeader('Content-Type', 'application/json');
           res.end(JSON.stringify( data , null, 2));
       } else {
           res.statusCode = 404
           res.setHeader('Content-Type', 'application/json');
           res.end(JSON.stringify( {message: __(`The proposal with primary key (${pk}) does not exists for user '${userId}'`)}, null, 2));
       }

   })
   .catch( (err) => {
     res.statusCode = 400
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify( {error: err}, null, 2));
   })
}

exports.fetchFirstPartyMedicalSubmissionList = function(args, res, next) {
  /**
   * Fetch a list of direct first party medical proposal submissions
   * Use this end point to fetch all the direct first party medical proposal submissions.
   *
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * offset BigDecimal Number of records to skip in the result list (optional)
   * limit BigDecimal Limit the number of rows to return (optional)
   * keys List Specify multiple rows to fetch ?keys=123,456 (optional)
   * sort String Sorting order. Prefix with '-' for descending order (optional)
   * filter List Filter criteria to apply to the search. The format used is filter=condition|condition. The format of the condition is {key}\\*{operator}\\*{value) e.g. filter=name\\*startsWith\\*A. The \\* is used to delimit the components of the criteria. As an example, to find rows with name that starts with 'A', specify as filter=name\\*startsWith\\*A .  When there are multiple criterias in the condition, e.g. find rows where name startsWith A and age greater than 30, specify as filter=name\\*startsWith\\*A;age\\*GT\\*30 . The ; character is used to separate the criterias. For more complex filters, e.g. Find rows where name starts with 'A' OR name starts with B, then it can be specified as filter=name\\*startsWith\\*A|name\\*startsWith\\*B . Use the | to separate OR conditions. (optional)
   * token String The security token, for the moment it is equal to the authenticated user id (optional)
   * returns List
   **/

   let token = args.Token && args.Token.value;
   let userId = token || "default" ; // if no user supplied, we just used the default userId

   let lang = args.lang.value;
   let offset = args.offset.value || 0;
   let limit = args.limit.value || 99999999999;
   let sort = args.sort.value || 'submissionDate'
   // let keys = (args.keys.value || []).map(k => k+'')
   // let filter = args.filter.value || ''
   let sqlFilter = buildFilterClause(args)
   // if (keys.length > 0 ) {
   //     sqlFilter = keys.map(key => { return [{key:"pk",oper: "eq", value: key}] }) ; [ [{}], [{}] ]
   // } else {
   //     // sqlFilter = [ [{},{}], [{}] ]
   //     if (filter) {
   //       let ors = []
   //       let orList = filter;
   //       orList.forEach( cond => {
   //         let andList = cond.split(';')
   //         let ands = []
   //         andList.forEach( filter => {
   //           let parts = filter.split('*');
   //           let key = parts[0], oper = parts[1], value = parts[2];
   //           ands.push({key, oper, value})
   //         })
   //         ors.push(ands)
   //       })
   //       sqlFilter = ors;
   //     } else { sqlFilter = null }
   // }
   proposalApi.fetchFirstPartyMedicalSubmissionSummaryList(userId, 'FirstPartyMedicalProposal', sqlFilter, limit, offset, sort)
   .then(submissions => {
       let data = {
           offset: offset,
           totalDocs: submissions.length,
           docs: submissions
       }
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify(data,null, 2));
   })
   .catch( (err) => {
     res.statusCode = 400
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify( {error: err}, null, 2));
   })
}
function buildFilterClause(args) {

    let lang = args.lang.value;
    let offset = args.offset.value || 0;
    let limit = args.limit.value || 99999999999;
    let sort = args.sort.value || 'submissionDate'
    let keys = (args.keys.value || []).map(k => k+'')
    let filter = args.filter.value || ''
    let sqlFilter = [];
    if (keys.length > 0 ) {
        sqlFilter = keys.map(key => { return [{key:"pk",oper: "eq", value: key}] }) ; [ [{}], [{}] ]
    } else {
        // sqlFilter = [ [{},{}], [{}] ]
        if (filter) {
          let ors = []
          let orList = filter;
          orList.forEach( cond => {
            let andList = cond.split(';')
            let ands = []
            andList.forEach( filter => {
              let parts = filter.split('*');
              let key = parts[0], oper = parts[1], value = parts[2];
              ands.push({key, oper, value})
            })
            ors.push(ands)
          })
          sqlFilter = ors;
        } else { sqlFilter = null }
    }
    return sqlFilter
}

exports.fetchFirstPartyTermProposalSubmission = function(args, res, next) {
    let lang = args.lang.value;
    let pk = args.submissionId.value
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.fetchProposalSubmissionByPk(pk, "FirstPartyTermProposalSubmission")
    .then(doc => {
        let data = doc && doc.submissionType === 'FirstPartyTermProposalSubmission' && doc.userId === userId ? doc : null ; // limit by the submissionType
        if (data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify( data , null, 2));
        } else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify( {message: __(`The proposal with primary key (${pk}) does not exists for user '${userId}'`)}, null, 2));
        }
    })
    .catch( (err) => {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {error: err}, null, 2));
    })
}

exports.createFirstPartyTermProposalSubmission = function(args, res, next) {
    let lang = args.lang.value;
    let submission = args.bodyParam.value;
    let tenantCode = args.tenantCode.value;
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    submission.tenantCode = tenantCode ? tenantCode : submission.tenantCode;
    submission.userId = userId ? userId : submission.userId;
    proposalApi.processFirstPartyTermProposalSubmission(submission)
    .then(result => {
         res.statusCode = 200
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify( result, null, 2));
    })
    .catch( (err) => {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {errors: err}, null, 2));
    })

}
exports.fetchFirstPartyTermProposalSubmissionList = function(args, res, next) {
    return _fetchSubmissionList(args, res, next, "FirstPartyTermProposalSubmission")
}
exports.fetchSubmissionList = function(args, res, next) {
    return _fetchSubmissionList(args, res, next, null)
}
function _fetchSubmissionList (args, res, next, submissionType) {
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    let lang = args.lang.value;
    let offset = args.offset.value || 0;
    let limit = args.limit.value || 99999999999;
    let sort = args.sort.value || 'submissionDate'
    let sqlFilter = buildFilterClause(args);
    proposalApi.fetchSubmissionSummaryList(userId, submissionType, sqlFilter, limit, offset, sort)
    .then(submissions => {
        let data = {
            offset: offset,
            totalDocs: submissions.length,
            docs: submissions
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data,null, 2));
    })
    .catch( (err) => {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {error: err}, null, 2));
    })
}

exports.createFirstPartyTraditionalProposalSubmission =  function(args, res, next) {
    let lang = args.lang.value;
    let submission = args.bodyParam.value;
    let tenantCode = args.tenantCode.value;
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    submission.tenantCode = tenantCode ? tenantCode : submission.tenantCode;
    submission.userId = userId ? userId : submission.userId;
    proposalApi.processFirstPartyTraditionalProposalSubmission(submission)
    .then(result => {
         res.statusCode = 200
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify( result, null, 2));
    })
    .catch( (err) => {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {errors: err}, null, 2));
    })

}

exports.fetchFirstPartyTraditionalProposalSubmissionList = function(args, res, next) {
    return _fetchSubmissionList(args, res, next, ["FirstPartyTermProposalSubmission","FirstPartyMedicalProposal","FirstPartyEndowmentProposalSubmission", "FirstPartyWholeLifeProposalSubmission"])

}

exports.fetchFirstPartyTraditionalProposalSubmission = function(args, res, next) {

    let lang = args.lang.value;
    let pk = args.submissionId.value
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.fetchProposalSubmissionByPk(pk, "FirstPartyTermProposalSubmission")
    .then(doc => {
        let data = doc && doc.submissionType === 'FirstPartyTermProposalSubmission' && doc.userId === userId ? doc : null ; // limit by the submissionType
        if (data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify( data , null, 2));
        } else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify( {message: __(`The proposal with primary key (${pk}) does not exists for user '${userId}'`)}, null, 2));
        }
    })
    .catch( (err) => {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {error: err}, null, 2));
    })

}
// ILP related
exports.createFirstPartyILPProposalSubmission =  function(args, res, next) {

    // res.setHeader('Content-Type', 'application/json');
    // res.end(JSON.stringify( {message: "TODO"}, null, 2));
    // return

    let lang = args.lang.value;
    let submission = args.bodyParam.value;
    let tenantCode = args.tenantCode.value;
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    submission.tenantCode = tenantCode ? tenantCode : submission.tenantCode;
    submission.userId = userId ? userId : submission.userId;
    proposalApi.processFirstPartyILPProposalSubmission(submission)
    .then(result => {
         res.statusCode = 200
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify( result, null, 2));
    })
    .catch( (err) => {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {errors: err}, null, 2));
    })

}

exports.fetchFirstPartyILPProposalSubmissionList = function(args, res, next) {
    // res.setHeader('Content-Type', 'application/json');
    // res.end(JSON.stringify( {message: "TODO"}, null, 2));
    // return

    return _fetchSubmissionList(args, res, next, ["FirstPartyILPProposalSubmission"])

}
exports.fetchFirstPartyILPProposalSubmission = function(args, res, next) {

    // res.setHeader('Content-Type', 'application/json');
    // res.end(JSON.stringify( {message: "TODO"}, null, 2));
    // return

    let lang = args.lang.value;
    let pk = args.submissionId.value
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.fetchProposalSubmissionByPk(pk, "FirstPartyILPProposalSubmission")
    .then(doc => {
        let data = doc && doc.submissionType === 'FirstPartyILPProposalSubmission' && doc.userId === userId ? doc : null ; // limit by the submissionType
        if (data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify( data , null, 2));
        } else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify( {message: __(`The proposal with primary key (${pk}) does not exists for user '${userId}'`)}, null, 2));
        }
    })
    .catch( (err) => {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {error: err}, null, 2));
    })

}



exports.fetchPolicyholderDisclosureSpecs = function(args, res, next) {
    let tenantCode = args.tenantCode.value;
    let productId = null; // for the moment, set to null
    let spec = proposalApi.fetchPolicyholderDiscloureSpec(tenantCode, productId)

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify( {policyholderDisclosureSpecs: spec}, null, 2));

}
