'use strict';

const api = require('product-api');
const crud = require('crud-api');
const proposalApi = require('proposal-api');
crud.init()
const _ = require('lodash');
const __ = require('../i18n');
const utils = require('./utils');

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
   proposalApi.fetchProposalSubmissionByPk(pk)
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
