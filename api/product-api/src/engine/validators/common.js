'use strict'

let __ = require('../i18n');
let exp = {};
let _ = require('lodash');
let moment = require('moment')
let utils = require('../utils')

exp.validateInput__01 =  function(ctx, parent, opts) {
  let product = parent;
  let config = ctx.get("_getConfig")(product.productId() );
  let inputFields = Object.keys( config.inputFields );
  let personFields = Object.keys(config.personFields );
  let people = ctx.get("people");
  let la = people[product.val("lifeAssuredNumber")];
  let errs = [];
  let productCode = product.productCode()
  inputFields.forEach((key) => {
    if (product.input(key) === undefined || product.input(key) === null ) {
      errs.push(__(`Missing input field for product ${productCode} (${key})`) )
    }
  })
  if (la) {
      personFields.forEach((key) => {
        if ( la.input(key) === undefined || la.input(key) === null  ) {
          errs.push(__(`Missing input field for person (${key})`) )
        }
      })
  } else {
      errs.push(__(`Unable to find life assured for product ${product.val("productCode")}`))
  }
  errs.push(validateProduct(ctx, product, opts)); // productId is a mandatory field
  if (inputFields.indexOf('coverageTermType') >= 0 ) errs.push(validateCoverageTerm(ctx, product,opts))
  if (inputFields.indexOf("benefitLevel") >= 0 ) errs.push( validateBenefitLevel(ctx, product, opts))
  return errs //.length > 0 ? errs : undefined

}
function validateProduct(ctx, product, opts) {
  // check that the input for product is OK
  let models = require('../models')
  let pid = product.productId() + ''
  let configuredProducts = Object.keys( models.CONFIGS )
  if (configuredProducts.indexOf(pid) < 0 ) {
    return __(`Product specified is not configured ${pid}`)
  }
}
function validateCoverageTerm(ctx, product, opts) {
  let termType = product.input("coverageTermType");
  if ( ["0","1","2","3","4"].indexOf(termType) < 0 ) {
    return __(`Coverage term type value is invalid (${termType})`)
  }
}
function validateBenefitLevel(ctx, product, opts) {
  let levels = product.dbval("benefitLevels");
  let inputLevel = product.input("benefitLevel");
  let row = levels.find( l => l.level === inputLevel)
  return !row ? __(`Benefit level is invalid (${inputLevel})`) : undefined
}



module.exports = exp;
