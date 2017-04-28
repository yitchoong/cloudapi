'use strict';

var url = require('url');

var Illustration = require('./IllustrationService');

module.exports.generateProductIllustration = function generateProductIllustration (req, res, next) {
  Illustration.generateProductIllustration(req.swagger.params, res, next);
};
