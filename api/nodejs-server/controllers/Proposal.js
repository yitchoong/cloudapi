'use strict';

var url = require('url');

var Proposal = require('./ProposalService');

module.exports.fetchCodeTableList = function fetchCodeTableList (req, res, next) {
  Proposal.fetchCodeTableList(req.swagger.params, res, next);
};

// proposal end-points
module.exports.fetchFirstPartyTraditionalProposalList = function (req, res, next) {
  Proposal.fetchFirstPartyTraditionalProposalList(req.swagger.params, res, next);
};
module.exports.fetchFirstPartyIlpProposalList = function (req, res, next) {
  Proposal.fetchFirstPartyIlpProposalList(req.swagger.params, res, next);
};
module.exports.createFirstPartyTraditionalProposal = function (req, res, next) {
  Proposal.createFirstPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.createFirstPartyIlpProposal = function (req, res, next) {
  Proposal.createFirstPartyIlpProposal(req.swagger.params, res, next);
};


module.exports.validateFirstPartyTraditionalProposalSections = function (req, res, next) {
  Proposal.validateFirstPartyTraditionalProposalSections(req.swagger.params, res, next);
};
module.exports.validateFirstPartyIlpProposalSections = function (req, res, next) {
  Proposal.validateFirstPartyIlpProposalSections(req.swagger.params, res, next);
};

module.exports.fetchThirdPartyTraditionalProposalList = function (req, res, next) {
  Proposal.fetchThirdPartyTraditionalProposalList(req.swagger.params, res, next);
};
module.exports.fetchThirdPartyIlpProposalList = function (req, res, next) {
  Proposal.fetchThirdPartyIlpProposalList(req.swagger.params, res, next);
};
module.exports.createThirdPartyTraditionalProposal = function (req, res, next) {
  Proposal.createThirdPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.createThirdPartyIlpProposal = function (req, res, next) {
  Proposal.createThirdPartyIlpProposal(req.swagger.params, res, next);
};

module.exports.validateThirdPartyTraditionalProposalSections = function (req, res, next) {
  Proposal.validateThirdPartyTraditionalProposalSections(req.swagger.params, res, next);
};
module.exports.validateThirdPartyIlpProposalSections = function (req, res, next) {
  Proposal.validateThirdPartyIlpProposalSections(req.swagger.params, res, next);
};
module.exports.submitFirstPartyTraditionalProposal = function (req, res, next) {
  Proposal.submitFirstPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.submitFirstPartyIlpProposal = function (req, res, next) {
  console.log(">>> submitFirstPartyIlpProposal")
  Proposal.submitFirstPartyIlpProposal(req.swagger.params, res, next);
};
module.exports.submitThirdPartyTraditionalProposal = function (req, res, next) {
  Proposal.submitThirdPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.submitThirdPartyIlpProposal = function (req, res, next) {
  Proposal.submitThirdPartyIlpProposal(req.swagger.params, res, next);
};
module.exports.fetchFirstPartyTraditionalProposal = function (req, res, next) {
  Proposal.fetchFirstPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.fetchFirstPartyIlpProposal = function (req, res, next) {
  Proposal.fetchFirstPartyIlpProposal(req.swagger.params, res, next);
};
module.exports.fetchThirdPartyTraditionalProposal = function (req, res, next) {
  Proposal.fetchThirdPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.fetchThirdPartyIlpProposal = function (req, res, next) {
  Proposal.fetchThirdPartyIlpProposal(req.swagger.params, res, next);
};
module.exports.fetchProposalList = function (req, res, next) {
  Proposal.fetchProposalList(req.swagger.params, res, next);
};

module.exports.deleteFirstPartyTraditionalProposal = function (req, res, next) {
  Proposal.deleteFirstPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.deleteFirstPartyIlpProposal = function (req, res, next) {
  Proposal.deleteFirstPartyIlpProposal(req.swagger.params, res, next);
};
module.exports.deleteThirdPartyTraditionalProposal = function (req, res, next) {
  Proposal.deleteThirdPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.deleteThirdPartyIlpProposal = function (req, res, next) {
  Proposal.deleteThirdPartyIlpProposal(req.swagger.params, res, next);
};

module.exports.updateFirstPartyTraditionalProposal = function (req, res, next) {
  Proposal.updateFirstPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.updateFirstPartyIlpProposal = function (req, res, next) {
  Proposal.updateFirstPartyIlpProposal(req.swagger.params, res, next);
};
module.exports.updateThirdPartyTraditionalProposal = function (req, res, next) {
  Proposal.updateThirdPartyTraditionalProposal(req.swagger.params, res, next);
};
module.exports.updateThirdPartyIlpProposal = function (req, res, next) {
  Proposal.updateThirdPartyIlpProposal(req.swagger.params, res, next);
};
