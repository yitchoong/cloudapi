'use strict';

var url = require('url');

var Product = require('./ProductService');

module.exports.calculateAdhocFields = function calculateAdhocFields (req, res, next) {
  Product.calculateAdhocFields(req.swagger.params, res, next);
};

module.exports.calculateAge = function calculateAge (req, res, next) {
  Product.calculateAge(req.swagger.params, res, next);
};

module.exports.calculateIllustrationFields = function calculateIllustrationFields (req, res, next) {
  Product.calculateIllustrationFields(req.swagger.params, res, next);
};

module.exports.calculateProductCostOnInsurance = function calculateProductCostOnInsurance (req, res, next) {
  Product.calculateProductCostOnInsurance(req.swagger.params, res, next);
};

module.exports.calculateProductPremium = function calculateProductPremium (req, res, next) {
  Product.calculateProductPremium(req.swagger.params, res, next);
};

module.exports.generateProductIllustration = function generateProductIllustration (req, res, next) {
  Product.generateProductIllustration(req.swagger.params, res, next);
};

module.exports.getAttachableRiders = function getAttachableRiders (req, res, next) {
  Product.getAttachableRiders(req.swagger.params, res, next);
};

module.exports.getDetailedProductList = function getDetailedProductList (req, res, next) {
  Product.getDetailedProductList(req.swagger.params, res, next);
};

module.exports.getIllustrationCalculatorFields = function getIllustrationCalculatorFields (req, res, next) {
  Product.getIllustrationCalculatorFields(req.swagger.params, res, next);
};

module.exports.getPackageProduct = function getPackageProduct (req, res, next) {
  Product.getPackageProduct(req.swagger.params, res, next);
};

module.exports.getProduct = function getProduct (req, res, next) {
  Product.getProduct(req.swagger.params, res, next);
};

module.exports.getProductIllustrationTemplate = function getProductIllustrationTemplate (req, res, next) {
  Product.getProductIllustrationTemplate(req.swagger.params, res, next);
};

module.exports.getProductList = function getProductList (req, res, next) {
  Product.getProductList(req.swagger.params, res, next);
};

module.exports.getProductValidators = function getProductValidators (req, res, next) {
  Product.getProductValidators(req.swagger.params, res, next);
};

module.exports.validateAdhocProductValidators = function validateAdhocProductValidators (req, res, next) {
  Product.validateAdhocProductValidators(req.swagger.params, res, next);
};

module.exports.validateMainProduct = function validateMainProduct (req, res, next) {
  Product.validateMainProduct(req.swagger.params, res, next);
};

module.exports.validateProductFunds = function validateProductFunds (req, res, next) {
  Product.validateProductFunds(req.swagger.params, res, next);
};

module.exports.validateProductInsured = function validateProductInsured (req, res, next) {
  Product.validateProductInsured(req.swagger.params, res, next);
};

module.exports.validateProductRiders = function validateProductRiders (req, res, next) {
  Product.validateProductRiders(req.swagger.params, res, next);
};

module.exports.validateProductTopups = function validateProductTopups (req, res, next) {
  Product.validateProductTopups(req.swagger.params, res, next);
};

module.exports.validateProductWithdrawals = function validateProductWithdrawals (req, res, next) {
  Product.validateProductWithdrawals(req.swagger.params, res, next);
};
