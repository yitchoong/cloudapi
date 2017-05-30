'use strict';

const api = require('product-api');
const _ = require('lodash');
const __ = require('../i18n');
const utils = require('./utils');

const send404 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 404;
    res.end(msg);
}
const mapper = {
  insurerId : "pk",
  companyName: "insurerName",
  abbrName : "shortName",
  organDesc: "insurerDescription",
  organLogo: "logo",
  telephone: "telephone",
  url : "url",
  organProposalrule : "underwritingRule"
}


// var insurers = [
// {pk:1, doctype:'Insurer',telephone:'+658782782', shortName: 'AIA', insurerName: 'American Internatinal Assurance', url:"http://aia.com.sg"},
// {pk:2, doctype:'Insurer',telephone:'+6578338800', shortName: 'PRU', insurerName: 'Prudential Assurance Ptd', url:"http://www.prudential.com.sg"},
// ]

exports.getInsurer = function(args, res, next) {
  /**
   * Fetch an insurer document
   * This end point is used to get the insurer for the requested insurer id.
   *
   * insurerId String Unique id of the insurer
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns Insurer
   **/

    let pk = args.insurerId.value;
    pk = pk ? parseInt(pk) : -1;
    let insurer = api.getInsurer(pk)
    console.log("Insurer", insurer)
    if (Object.keys(insurer).length === 0) {
      return send404(res, next, JSON.stringify({error:'Insurer is not found'}) ) ;
    }
    // do some column name translations
    let doc = {}
    Object.keys(mapper).forEach( key => {
       if (key in insurer) doc[mapper[key]] = insurer[key]
    })
    doc.doctype = 'Insurer'
    res.setHeader('Content-Type', "application/json");
    res.end(JSON.stringify(doc,null,2));

    // let insurer = pk > 0 ? insurers.filter((i) => i.pk === pk ) : null;
    // if (insurer.length > 0 ) {
    //     res.setHeader('Content-Type', "application/json");
    //     res.end(JSON.stringify(insurer,null,2));
    // } else {
    //     return send400(res, next, JSON.stringify({error:'Unable to find insurer record'}) ) ;
    // }
//  var examples = {};
//  examples['application/json'] = {
//      "doctype" : "aeiou",
//      "extensionFields" : {
//        "key" : "aeiou"
//      },
//      "logo" : "aeiou",
//      "telephone" : "aeiou",
//      "pk" : "aeiou",
//      "shortName" : "aeiou",
//      "insurerName" : "aeiou",
//      "url" : "aeiou"
//  };
//  if (Object.keys(examples).length > 0) {
//    res.setHeader('Content-Type', 'application/json');
//    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
//  } else {
//    res.end();
//  }
}

exports.getInsurerList = function(args, res, next) {
  /**
   * Fetch a list of insurer documents
   * This endpoint returns a list of insurers.There are a number of parameters to help with filtering and sorting of the required insurer documents.
   *
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * offset BigDecimal Number of records to skip in the result list (optional)
   * limit BigDecimal Limit the number of rows to return (optional)
   * sort String Sorting order. Prefix with '-' for descending order (optional)
   * keys List Specify multiple rows to fetch ?keys=123,456 (optional)
   * filter List Filter criteria to apply to the search. The format used is filter=condition|condition. The format of the condition is {key}\\*{operator}\\*{value) e.g. filter=name\\*startsWith\\*A. The \\* is used to delimit the components of the criteria. As an example, to find rows with name that starts with 'A', specify as filter=name\\*startsWith\\*A .  When there are multiple criterias in the condition, e.g. find rows where name startsWith A and age greater than 30, specify as filter=name\\*startsWith\\*A;age\\*GT\\*30 . The ; character is used to separate the criterias. For more complex filters, e.g. Find rows where name starts with 'A' OR name starts with B, then it can be specified as filter=name\\*startsWith\\*A|name\\*startsWith\\*B . Use the | to separate OR conditions. (optional)
   * returns inline_response_200
   **/
   let lang = args.lang.value;
   let offset = args.offset.value || 0;
   let limit = args.limit.value || 99999999999;
   let sort = args.sort.value || 'insurerName'
   let keys = args.keys.value || [];
   keys = keys.map(k => k+'')
   let filter = args.filter.value || ''
   let insurers = api.getInsurers() || [];
   // xlate docs to required fields
   let docs = insurers.map (insurer => {
     let doc = {}
     Object.keys(mapper).forEach( key => {
        if (key in insurer) doc[mapper[key]] = insurer[key]
     })
     doc.doctype = 'Insurer'
     return doc
   })
   let rows = [];
  //  console.log("****keys", args.keys.value)
   if (keys.length === 0) {
     // first do a sort first
     let sorted = _.sortBy(docs, (row) => sort === 'insurerName' ? row.insurerName : row.insurerId )
     rows = sorted.splice(offset,limit)
     // do we have a filter to apply ?
     if (filter) {
       let ors = []
      //  console.log("** orList", filter)
      //  let orList = filter.split('|');
       let orList = filter;
       orList.forEach( cond => {
         let andList = cond.split(';')
         let ands = []
        //  console.log("** andList", andList)
         andList.forEach( filter => {
           let parts = filter.split('*');
           let key = parts[0], oper = parts[1], value = parts[2];
           ands.push({key, oper, value})
         })
         ors.push(ands)
       })
       rows = rows.filter(row => {

           let count = ors.map(ands => {
               let  val;
               let cnt = ands.map( filter => {

                 val = 0
                 let filterOper = filter.oper.toLowerCase()
                 let filterValue = filter.key === 'pk' ? parseInt(filter.value) : filter.value
                 if (filter.key in row) {
                   if (filterOper === 'eq' && row[filter.key] === filterValue) val = 1
                   if (filterOper === 'startswith' && _.startsWith(row[filter.key], filterValue)) val = 1;
                   if (filterOper === 'contains' && row[filter.key].indexOf(filterValue) >= 0 ) val = 1;
                 }
                 return val
               })
               return ands.length === _.sum(cnt) ? 1 : 0
           })
           return _.sum(count) > 0 ? true : false
       })
     }

   } else {
     // look for specific keys
    //  rows = insurers.filter(row => keys.indexOf(row.insurerId + '' ) >= 0)
     rows = docs.filter(row => keys.indexOf(row.pk + '' ) >= 0)

   }


    let data = {
        offset: offset,
        totalDocs: insurers.length,
        docs: rows
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data,null, 2));
//
//
//  var examples = {};
//  examples['application/json'] = {
//  "docs" : [ {
//    "doctype" : "aeiou",
//    "extensionFields" : {
//      "key" : "aeiou"
//    },
//    "logo" : "aeiou",
//    "telephone" : "aeiou",
//    "pk" : "aeiou",
//    "shortName" : "aeiou",
//    "insurerName" : "aeiou",
//    "url" : "aeiou"
//  } ],
//  "offset" : 123,
//  "totalDocs" : 123
//};
//  if (Object.keys(examples).length > 0) {
//    res.setHeader('Content-Type', 'application/json');
//    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
//  } else {
//    res.end();
//  }
}
