'use strict';

var url = require('url');

var Package = require('./PackageService');

module.exports.getDetailedPackageList = function getDetailedPackageList (req, res, next) {
  Package.getDetailedPackageList(req.swagger.params, res, next);
};

module.exports.getPackage = function getPackage (req, res, next) {
  Package.getPackage(req.swagger.params, res, next);
};

module.exports.getPackageFilterList = function getPackageFilterList (req, res, next) {
  Package.getPackageFilterList(req.swagger.params, res, next);
};

module.exports.getPackageList = function getPackageList (req, res, next) {
  Package.getPackageList(req.swagger.params, res, next);
};

module.exports.getPackageProduct = function getPackageProduct (req, res, next) {
  Package.getPackageProduct(req.swagger.params, res, next);
};

module.exports.initialQuoteData = function initialQuoteData (req, res, next) {
  Package.initialQuoteData(req.swagger.params, res, next);
};

module.exports.removePackageFavourite = function removePackageFavourite (req, res, next) {
  Package.removePackageFavourite(req.swagger.params, res, next);
};

module.exports.setPackageFavourite = function setPackageFavourite (req, res, next) {
  Package.setPackageFavourite(req.swagger.params, res, next);
};
