'use strict';

var insurers = [
{pk:1, doctype:'Insurer',telephone:'+658782782', shortName: 'AIA', insurerName: 'American Internatinal Assurance', url:"http://aia.com.sg"},
{pk:2, doctype:'Insurer',telephone:'+6578338800', shortName: 'PRU', insurerName: 'Prudential Assurance Ptd', url:"http://www.prudential.com.sg"},    
]

exports.getInsurer = function(args, res, next) {
  /**
   * Fetch an insurer document
   * This end point is used to get the insurer for the requested insurer id.
   *
   * insurerId String Unique id of the insurer
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns Insurer
   **/
    var send400 = function send400 (res, next, msg) {
      res.setHeader('Content-Type', "application/json");
      res.statusCode = 404;
        res.end(msg);
      //return next(msg);
        //res.status(400).send({error:"boo"})
    }    
//    console.log("**--", args)
    
    let pk = args.insurerId.value;
    pk = pk ? parseInt(pk) : -1;
    let insurer = pk > 0 ? insurers.filter((i) => i.pk === pk ) : null;
    if (insurer.length > 0 ) {
        res.setHeader('Content-Type', "application/json");
        res.end(JSON.stringify(insurer,null,2));        
    } else {
        return send400(res, next, JSON.stringify({error:'Unable to find insurer record'}) ) ;
    }
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
    let data = {
        offset: 0,
        totalDocs: 2,
        docs: insurers
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

