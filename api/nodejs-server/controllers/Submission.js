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
