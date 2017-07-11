'use strict';

var url = require('url');

var Proposal = require('./ProposalService');

module.exports.fetchCodeTableList = function fetchCodeTableList (req, res, next) {
  Proposal.fetchCodeTableList(req.swagger.params, res, next);
};
