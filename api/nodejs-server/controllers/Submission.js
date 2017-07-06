'use strict';

var url = require('url');

var Submission = require('./SubmissionService');

module.exports.createFirstPartyMedicalSubmission = function createFirstPartyMedicalSubmission (req, res, next) {
  Submission.createFirstPartyMedicalSubmission(req.swagger.params, res, next);
};

module.exports.fetchFirstPartyMedicalSubmission = function fetchFirstPartyMedicalSubmission (req, res, next) {
  Submission.fetchFirstPartyMedicalSubmission(req.swagger.params, res, next);
};

module.exports.fetchFirstPartyMedicalSubmissionList = function fetchFirstPartyMedicalSubmissionList (req, res, next) {
  Submission.fetchFirstPartyMedicalSubmissionList(req.swagger.params, res, next);
};

// module.exports.fetchSubmissionList = function (req, res, next) {
//   Submission.fetchSubmissionList(req.swagger.params, res, next);
// };
module.exports.fetchSubmissionList = function (req, res, next) {
  Submission.fetchSubmissionList(req.swagger.params, res, next);
};
module.exports.createFirstPartyTermProposalSubmission = function (req, res, next) {
  Submission.createFirstPartyTermProposalSubmission(req.swagger.params, res, next);
};
module.exports.fetchFirstPartyTermProposalSubmissionList = function (req, res, next) {
  Submission.fetchFirstPartyTermProposalSubmissionList(req.swagger.params, res, next);
};
module.exports.fetchFirstPartyTermProposalSubmission = function (req, res, next) {
  Submission.fetchFirstPartyTermProposalSubmission(req.swagger.params, res, next);
};

// first party traditional proposal submission

module.exports.createFirstPartyTraditionalProposalSubmission = function (req, res, next) {
  Submission.createFirstPartyTraditionalProposalSubmission(req.swagger.params, res, next);
};
module.exports.fetchFirstPartyTraditionalProposalSubmissionList = function (req, res, next) {
  Submission.fetchFirstPartyTraditionalProposalSubmissionList(req.swagger.params, res, next);
};
module.exports.fetchFirstPartyTraditionalProposalSubmission = function (req, res, next) {
  Submission.fetchFirstPartyTraditionalProposalSubmission(req.swagger.params, res, next);
};
module.exports.fetchPolicyholderDisclosureSpecs = function (req, res, next) {
  Submission.fetchPolicyholderDisclosureSpecs(req.swagger.params, res, next);
};

// first party ILP services

module.exports.createFirstPartyILPProposalSubmission = function createFirstPartyILPProposalSubmission (req, res, next) {
  Submission.createFirstPartyILPProposalSubmission(req.swagger.params, res, next);
};

module.exports.fetchFirstPartyILPProposalSubmission = function fetchFirstPartyILPProposalSubmission (req, res, next) {
  Submission.fetchFirstPartyILPProposalSubmission(req.swagger.params, res, next);
};

module.exports.fetchFirstPartyILPProposalSubmissionList = function fetchFirstPartyILPProposalSubmissionList (req, res, next) {
  Submission.fetchFirstPartyILPProposalSubmissionList(req.swagger.params, res, next);
};
