'use strict';

var url = require('url');

var Insurer = require('./InsurerService');

module.exports.getInsurer = function getInsurer (req, res, next) {
  Insurer.getInsurer(req.swagger.params, res, next);
};

module.exports.getInsurerList = function getInsurerList (req, res, next) {
  Insurer.getInsurerList(req.swagger.params, res, next);
};
