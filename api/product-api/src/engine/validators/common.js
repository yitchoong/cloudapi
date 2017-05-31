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
  let productCode = product.val("productCode") //product.productCode()
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
  if (inputFields.indexOf("currency") >= 0 ) errs.push( validateCurrency(ctx, product, opts))
  if (inputFields.indexOf("paymentMode") >= 0 ) errs.push( validatePaymentMode(ctx, product, opts))
  // validate fields for the person
  if (la) {
    errs.push(validatePersonGender(ctx, product, opts))
    if (personFields.indexOf("smoking") >= 0 ) errs.push(validatePersonSmoking(ctx, product, opts))
    if (personFields.indexOf("occupation") >= 0 ) errs.push(validatePersonOccupation(ctx, product, opts))
    if (personFields.indexOf("jobCateId") >= 0 ) errs.push(validatePersonJobCateId(ctx, product, opts))
    if (personFields.indexOf("socialInsuranceIndi") >= 0 ) errs.push(validatePersonSocialInsuranceIndi(ctx, product, opts))
  }
  // if main product, some extra checks
  // console.log("**** insType", product.val("productCode"), product.val("productLife").insType)
  if (product.val("productLife").insType === '1') {
    let policy = ctx.get("policy")
    let topups = policy.val("topupList")
    let withdrawals = policy.val("withdrawalList")
    let funds  = ctx.get("funds")
    if (topups && topups.length > 0 ) errs.push( parent.validate("validateAllTopups"))
    if (withdrawals && withdrawals.length > 0 ) errs.push( parent.validate("validateAllWithdrawals"))
    if (funds && funds.length > 0 ) errs.push( parent.validate("validateAllFundAllocations"))
  }

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
    return __(`Coverage term type value for product ${product.val("productCode") || product.val("productId")} is invalid (${termType})`)
  }
}
function validateBenefitLevel(ctx, product, opts) {
  // let levels = product.dbval("benefitLevels");
  let levels = product.benefitLevels();
  let inputLevel = product.input("benefitLevel");
  let row = levels.find( l => l.level === inputLevel)
  return !row ? __(`Benefit level for product ${product.val("productCode") || product.val("productId")} is invalid (${inputLevel})`) : undefined
}
function validatePremiumPaymentTerm(ctx, product, opts) {
  let termType = product.input("premiumPaymentTermType");
  if ( ["0","1","2","3","4"].indexOf(termType) < 0 ) {
    return __(`Premium payment term type value is invalid (${termType})`)
  }
}
function validateCurrency(ctx, product, opts) {
  let currencies = product.availableCurrencies()
  let inputCurrency = product.currency()
  // console.log("**Currencies", currencies, inputCurrency)
  let currency = currencies.find( row => row.code === inputCurrency || row.currencyId+'' === inputCurrency+'')
  return currency ? undefined : __(`This is not a valid currency for the product (${inputCurrency})`)
}
function validatePaymentMode(ctx, product, opts) {
  let termType = product.paymentMode()
  if ( ["1","2","3","4","5"].indexOf(termType) < 0 ) {
    return __(`Payment mode is invalid (${termType}). Should be 1,2,3,4, or 5`)
  }
}
function validatePersonGender(ctx, product, opts) {
  let laNo = product.lifeAssuredNumber()
  let person = ctx.get("people")[laNo]
  let gender = (person.gender() || '').toUpperCase()
  return ["MALE","FEMALE"].indexOf(gender) < 0 ? __(`Not a valid gender (${gender}) for person ${ person.name() }`) : undefined
}
function validatePersonSmoking(ctx, product, opts) {
  let laNo = product.lifeAssuredNumber()
  let person = ctx.get("people")[laNo]
  let smoking = (person.smoking() || '').toUpperCase()
  return ["SMOKER","NON-SMOKER"].indexOf(smoking) < 0 ? __(`Not a valid smoking value (${smoking}) for person ${ person.name() }`) : undefined
}
function validatePersonOccupation(ctx, product, opts){
  let laNo = product.lifeAssuredNumber()
  let person = ctx.get("people")[laNo]
  let occupation = (person.occupation() || '').toUpperCase()
  // where to get a list of occupations ? :: TODO :: for the moment return ok
  return
}
function validatePersonJobCateId(ctx, product, opts){
  let laNo = product.lifeAssuredNumber()
  let person = ctx.get("people")[laNo]
  let jobCateId = (person.jobCateId() || '').toUpperCase()
  // where to get a list of job cate ? :: TODO :: for the moment return ok
  return
}
function validatePersonSocialInsuranceIndi(ctx, product, opts){
  let laNo = product.lifeAssuredNumber()
  let person = ctx.get("people")[laNo]
  let socialInsuranceIndi = (person.socialInsuranceIndi() || '').toUpperCase()
  return socialInsuranceIndi === 'Y' || socialInsuranceIndi === 'N' ? undefined : __(`Invalid value for social insurance indicator (${socialInsuranceIndi}) for person ${person.name} `)
}

module.exports = exp;
