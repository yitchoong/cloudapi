'use strict';

const _ = require('lodash');
const __ = require('../i18n');
const utils = require('./utils');
//const codes = require('./proposalCodeTables');
const proposalApi = require('proposal-api')
const codes = proposalApi.getCodeTables();

var fs = require('fs')

const send404 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 404;
    res.end(msg);
}
const send400 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 400;
    res.end(msg);
}

exports.fetchCodeTableList = function(args, res, next) {
  /**
   * Fetch a list of codeTables (with the valid codes and values) used in the proposal application.
   * This end point should be used at design time to get the list of codeTables with the valid values that can be used for the fields with drop down values in the proposal form.
   *
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns List
   **/
   res.setHeader('Content-Type', 'application/json');
   let lang = args.lang.value;

   let keys = Object.keys(codes)
   let sortedKeys = [].concat(keys).sort()
   let rows = [], table;
   sortedKeys.forEach(key => rows.push( codes[key] ) );
   res.end(JSON.stringify(rows,null,2))

}

function stub(args, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify( {message: "Not yet implemented"}, null, 2));
}

// check the proposals for completeness -- i.e. which sections are complete, and update the status of the sections
function getProposalSectionStatuses( args, res, next, validProposalTypes) {
    let lang = args.lang ? args.lang.value : null ;
    let proposal = args.bodyParam.value;
    let tenantCode = args.tenantCode ? args.tenantCode.value : null
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId

    if (validProposalTypes.indexOf(proposal.proposalType) < 0 ) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify( {errors: __(`The proposal type (${proposal.proposalType}) is incorrect for this end-point`)}, null, 2));
        return
    }

    proposalApi.deriveProposalSectionStatuses(proposal, tenantCode, userId, lang)
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

exports.validateFirstPartyTraditionalProposalSections  = function(args,res, next) {
    return getProposalSectionStatuses(args, res, next, ["FirstPartyTerm","FirstPartyMedical","FirstPartyWholeLife","FirstPartyEndowment"])
}

exports.validateFirstPartyIlpProposalSections  = function(args,res, next) {
    return getProposalSectionStatuses(args, res, next, ["FirstPartyIlp"])
}

exports.validateThirdPartyTraditionalProposalSections  = function(args,res, next) {
    return getProposalSectionStatuses(args, res, next, ["ThirdPartyTerm","ThirdPartyMedical","ThirdPartyWholeLife","ThirdPartyEndowment"])
}

exports.validateThirdPartyIlpProposalSections  = function(args,res, next) {
    return getProposalSectionStatuses(args, res, next, ["ThirdPartyIlp"])
}

// submit the proposal as a submission

exports.submitFirstPartyTraditionalProposal  = function(args,res, next) {
    const lang = args.lang ? args.lang.value : null ;
    const proposalId = args.proposalId.value;
    const version = args.version.value;
    const tenantCode = args.tenantCode ? args.tenantCode.value : null
    const token = args.Token && args.Token.value;
    const userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.verifyAndSubmitFirstPartyTraditionalProposal(proposalId,version,userId,tenantCode,lang)
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

exports.submitFirstPartyIlpProposal  = function(args,res, next) {
    const lang = args.lang ? args.lang.value : null ;
    const proposalId = args.proposalId.value;
    const version = args.version.value;
    const tenantCode = args.tenantCode ? args.tenantCode.value : null
    const token = args.Token && args.Token.value;
    const userId = token || "default" ; // if no user supplied, we just used the default userId
    console.log(">>>> nodejsm, submitFirstPartyIlpProposal", proposalId, version)
    proposalApi.verifyAndSubmitFirstPartyIlpProposal(proposalId,version,userId,tenantCode,lang)
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

exports.submitThirdPartyTraditionalProposal  = function(args,res, next) {
    const lang = args.lang ? args.lang.value : null ;
    const proposalId = args.proposalId.value;
    const version = args.version.value;
    const tenantCode = args.tenantCode ? args.tenantCode.value : null
    const token = args.Token && args.Token.value;
    const userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.verifyAndSubmitThirdPartyTraditionalProposal(proposalId,version,userId,tenantCode,lang)
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

exports.submitThirdPartyIlpProposal  = function(args,res, next) {
    const lang = args.lang ? args.lang.value : null ;
    const proposalId = args.proposalId.value;
    const version = args.version.value;
    const tenantCode = args.tenantCode ? args.tenantCode.value : null
    const token = args.Token && args.Token.value;
    const userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.verifyAndSubmitThirdPartyIlpProposal(proposalId,version,userId,tenantCode,lang)
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

function _fetchProposal(args, res, next, validProposalTypes) {
    let lang = args.lang.value;
    let pk = args.proposalId.value
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.fetchProposalByPk(pk)  // no need to filter by type in this call, filter the results here
    .then(doc => {
        let data = doc && validProposalTypes.indexOf(doc.proposalType) >= 0 && doc.userId === userId ? doc : null ; // limit by the proposalType, user
        console.log("_fetchProposal", doc.pk, doc.version, doc.proposalType, doc.userId, validProposalTypes)
        if (data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify( data , null, 2));
        } else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify( {message: __(`The first party proposal with primary key (${pk}) does not exists for user '${userId}'`)}, null, 2));
        }
    })
    .catch( (err) => {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( {error: err}, null, 2));
    })
}
exports.fetchFirstPartyTraditionalProposal  = function(args,res, next) {
    const validProposalTypes = ["FirstPartyTerm","FirstPartyMedical","FirstPartyWholeLife","FirstPartyEndowment"]
    return _fetchProposal(args,res, next, validProposalTypes)
}

exports.fetchFirstPartyIlpProposal  = function(args,res, next) {
    const validProposalTypes = ["FirstPartyIlp"]
    return _fetchProposal(args,res, next, validProposalTypes)
}

exports.fetchThirdPartyTraditionalProposal  = function(args,res, next) {
    const validProposalTypes = ["ThirdPartyTerm","ThirdPartyMedical","ThirdPartyWholeLife","ThirdPartyEndowment"]
    return _fetchProposal(args,res, next, validProposalTypes)
}

exports.fetchThirdPartyIlpProposal  = function(args,res, next) {
    const validProposalTypes = ["ThirdPartyIlp"]
    return _fetchProposal(args,res, next, validProposalTypes)
}

// get a list of proposals (summary)

exports.fetchFirstPartyTraditionalProposalList  = function(args,res, next) {
    return _fetchProposalList(args, res, next, ["FirstPartyTerm","FirstPartyMedical","FirstPartyWholeLife","FirstPartyEndowment"] )
}
exports.fetchFirstPartyIlpProposalList  = function(args,res, next) {
    return _fetchProposalList(args, res, next, ["FirstPartyIlp"] )
}

exports.fetchThirdPartyTraditionalProposalList  = function(args,res, next) {
    return _fetchProposalList(args, res, next, ["ThirdPartyTerm","ThirdPartyMedical","ThirdPartyWholeLife","ThirdPartyEndowment"])
}
exports.fetchThirdPartyIlpProposalList  = function(args,res, next) {
    return _fetchProposalList(args, res, next, ["ThirdPartyIlp"] )
}
exports.fetchProposalList  = function(args,res, next) {
    return _fetchProposalList(args, res, next, null)
}

function _fetchProposalList (args, res, next, proposalType) {
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    let lang = args.lang.value;
    let offset = args.offset.value || 0;
    let limit = args.limit.value || 99999999999;
    let sort = args.sort.value || 'creationDate'
    let sqlFilter = buildFilterClause(args);
    proposalApi.fetchProposalSummaryList(userId, proposalType, sqlFilter, limit, offset, sort)
    .then(proposals => {
        let data = {
            offset: offset,
            totalDocs: proposals.length,
            docs: proposals
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

// creation / saving a new proposal

exports.createFirstPartyTraditionalProposal  = function(args,res, next) {
    let lang = args.lang.value;
    let proposal = args.bodyParam.value;
    let tenantCode = args.tenantCode.value;
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.newFirstPartyTraditionalProposal(proposal)
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
exports.createFirstPartyIlpProposal  = function(args,res, next) {
    let lang = args.lang.value;
    let proposal = args.bodyParam.value;
    let tenantCode = args.tenantCode.value;
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.newFirstPartyIlpProposal(proposal)
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

exports.createThirdPartyTraditionalProposal  = function(args,res, next) {
    let lang = args.lang.value;
    let proposal = args.bodyParam.value;
    let tenantCode = args.tenantCode.value;
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.newThirdPartyTraditionalProposal(proposal)
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
exports.createThirdPartyIlpProposal  = function(args,res, next) {
    let lang = args.lang.value;
    let proposal = args.bodyParam.value;
    let tenantCode = args.tenantCode.value;
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.newThirdPartyIlpProposal(proposal)
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

exports.deleteFirstPartyTraditionalProposal  = function(args,res, next) {
    let lang = args.lang ? args.lang.value : null ;
    let tenantCode = args.tenantCode ? args.tenantCode.value : null
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    let pk = args.proposalId.value
    let version = args.version.value
    proposalApi.deleteFirstPartyTraditionalProposal(pk, version, userId)
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
exports.deleteFirstPartyIlpProposal  = function(args,res, next) {
    let lang = args.lang ? args.lang.value : null ;
    let tenantCode = args.tenantCode ? args.tenantCode.value : null
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    let pk = args.proposalId.value
    let version = args.version.value
    proposalApi.deleteFirstPartyIlpProposal(pk, version, userId)
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
exports.deleteThirdPartyTraditionalProposal  = function(args,res, next) {
    let lang = args.lang ? args.lang.value : null ;
    let tenantCode = args.tenantCode ? args.tenantCode.value : null
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    let pk = args.proposalId.value
    let version = args.version.value
    proposalApi.deleteThirdPartyTraditionalProposal(pk, version, userId)
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
exports.deleteThirdPartyIlpProposal  = function(args,res, next) {
    let lang = args.lang ? args.lang.value : null ;
    let tenantCode = args.tenantCode ? args.tenantCode.value : null
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    let pk = args.proposalId.value
    let version = args.version.value
    proposalApi.deleteThirdPartyIlpProposal(pk, version, userId)
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

exports.updateFirstPartyTraditionalProposal  = function(args,res, next) {
    let lang = args.lang ? args.lang.value : null ;
    let proposal = args.bodyParam.value;
    let tenantCode = args.tenantCode ? args.tenantCode.value : null
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.updateFirstPartyTraditionalProposal(proposal)
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
exports.updateFirstPartyIlpProposal  = function(args,res, next) {
    let lang = args.lang ? args.lang.value : null ;
    let proposal = args.bodyParam.value;
    let tenantCode = args.tenantCode ? args.tenantCode.value : null
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.updateFirstPartyIlpProposal(proposal)
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
exports.updateThirdPartyTraditionalProposal  = function(args,res, next) {
    let lang = args.lang ? args.lang.value : null ;
    let proposal = args.bodyParam.value;
    let tenantCode = args.tenantCode ? args.tenantCode.value : null
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.updateThirdPartyTraditionalProposal(proposal)
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
exports.updateThirdPartyIlpProposal  = function(args,res, next) {
    let lang = args.lang ? args.lang.value : null ;
    let proposal = args.bodyParam.value;
    let tenantCode = args.tenantCode ? args.tenantCode.value : null
    let token = args.Token && args.Token.value;
    let userId = token || "default" ; // if no user supplied, we just used the default userId
    proposalApi.updateThirdPartyIlpProposal(proposal)
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
