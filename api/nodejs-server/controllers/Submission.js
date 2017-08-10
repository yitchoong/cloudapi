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


module.exports.fetchLifeAssuredDisclosureSpecs = function fetchLifeAssuredDisclosureSpecs (req, res, next) {
  Submission.fetchLifeAssuredDisclosureSpecs(req.swagger.params, res, next);
};

// first party ILP services

module.exports.createFirstPartyIlpProposalSubmission = function createFirstPartyIlpProposalSubmission (req, res, next) {
  Submission.createFirstPartyIlpProposalSubmission(req.swagger.params, res, next);
};

module.exports.fetchFirstPartyIlpProposalSubmission = function fetchFirstPartyIlpProposalSubmission (req, res, next) {
  Submission.fetchFirstPartyIlpProposalSubmission(req.swagger.params, res, next);
};

module.exports.fetchFirstPartyIlpProposalSubmissionList = function fetchFirstPartyIlpProposalSubmissionList (req, res, next) {
  Submission.fetchFirstPartyIlpProposalSubmissionList(req.swagger.params, res, next);
};

// third party traditional

module.exports.createThirdPartyTraditionalProposalSubmission = function createThirdPartyTraditionalProposalSubmission (req, res, next) {
  Submission.createThirdPartyTraditionalProposalSubmission(req.swagger.params, res, next);
};
module.exports.fetchThirdPartyTraditionalProposalSubmission = function fetchThirdPartyTraditionalProposalSubmission (req, res, next) {
  Submission.fetchThirdPartyTraditionalProposalSubmission(req.swagger.params, res, next);
};

module.exports.fetchThirdPartyTraditionalProposalSubmissionList = function fetchThirdPartyTraditionalProposalSubmissionList (req, res, next) {
  Submission.fetchThirdPartyTraditionalProposalSubmissionList(req.swagger.params, res, next);
};

// third party ilp

module.exports.createThirdPartyIlpProposalSubmission = function (req, res, next) {
  Submission.createThirdPartyIlpProposalSubmission(req.swagger.params, res, next);
};
module.exports.fetchThirdPartyIlpProposalSubmission = function (req, res, next) {
  Submission.fetchThirdPartyIlpProposalSubmission(req.swagger.params, res, next);
};

module.exports.fetchThirdPartyIlpProposalSubmissionList = function (req, res, next) {
  Submission.fetchThirdPartyIlpProposalSubmissionList(req.swagger.params, res, next);
};
