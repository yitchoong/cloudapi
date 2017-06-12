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
