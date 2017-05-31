// import _ from "lodash";
// import moment from "moment";
// import * as utils from "../utils.js";
let _ = require('lodash')
let moment = require('moment')
let utils = require('../utils')
let exp = {};

exp.annualPremium__02 = function annualPremium__02( ctx, policy, people, product, fund, t, factors) {
    let la = people[product.val("la")],
        sa = product.val("saCalculated"),
        unitRate = product.dbval("unitRate").saUnitAmount,
        lsadRate = product.dbval("lsadRate").discountRate || 0,
        premiumRate = product.db0("premiumRate");

    return (sa / unitRate) * (premiumRate - lsadRate) ;
}

exp.annualPremium__03  = function(ctx, policy, people, product, fund, t, factors) {
  let la = people[product.val("lifeAssuredNumber")],
      sa = product.input("sumAssured"),
      premiumRate = product.db0("premiumRate");
  return sa  / premiumRate ;
}
exp.annualPremium__04  = function(ctx, policy, people, product, fund, t, factors) {
  let premiumRate = product.db0("premiumRateCash");
  return premiumRate ;
}
exp.annualPremium__05  = function(ctx, policy, people, product, fund, t, factors) {
  let la = people[product.val("lifeAssuredNumber")],
      sa = product.input("sumAssured"),
      premiumRate = product.db0("premiumRateendowment");
  return sa  / premiumRate ;
}

exp.annualPremiumAtT__02 = function annualPremiumAtT__02(ctx, policy, people, product, fund, t, factors) {
    return product.val('yr',t) > product.val("premiumTerm") ? 0 : product.val("annualPremium");
}

exp.totalPremiumPaidAtT__01 = function totalPremiumPaidAtT__01 (ctx, policy, people, product, fund, t=0, factors) {
    return product.val('yr',t) === 0 ? 0 : product.val("annualPremiumAtT",t) + product.val("totalPremiumPaidAtT",t-1) ;
}

exp.halfYearlyPremium__01 = function halfYearlyPremium__01(ctx, policy, people, product, fund, t, factors) {
    let opts = _.extend({}, factors, { chargeType : '2'}); // 2 is for half yearly
    let modalFactor = product.db0("modalFactor", t, opts);

    return product.val("annualPremium") * modalFactor ;
}
exp.quarterlyPremium__01 =  function quarterlyPremium__01(ctx, policy, people, product, fund, t, factors) {
    let opts = _.extend({}, factors, { chargeType : '3'}); // 3 is for quarterly
    let modalFactor = product.db0("modalFactor", t, opts);
    return product.val("annualPremium") * modalFactor ;
}
exp.monthlyPremium__01 = function monthlyPremium__01(ctx, policy, people, product, fund, t, factors) {
    let opts = _.extend({}, factors, { chargeType : '4'}); // 4 is for monthly
    let modalFactor = product.db0("modalFactor", t, opts);
    return product.val("annualPremium") * modalFactor ;
}
/* a second set where instead of multiply, we divide by the modal factor */

exp.halfYearlyPremium__02 = function halfYearlyPremium__02(ctx, policy, people, product, fund, t, factors) {
    let opts = _.extend({}, factors, { chargeType : '2'}); // 2 is for half yearly
    let modalFactor = product.db0("modalFactor", t, opts);
    return product.val("annualPremium") / modalFactor ;
}
exp.quarterlyPremium__02 =  function quarterlyPremium__02(ctx, policy, people, product, fund, t, factors) {
    let opts = _.extend({}, factors, { chargeType : '3'}); // 3 is for quarterly
    let modalFactor = product.db0("modalFactor", t, opts);
    return product.val("annualPremium") / modalFactor ;
}
exp.monthlyPremium__02 =  function monthlyPremium__02(ctx, policy, people, product, fund, t, factors) {
    let opts = _.extend({}, factors, { chargeType : '4'}); // 4 is for monthly
    let annualPremium = product.fmval("annualPremium");
    let modalFactor = product.db0("modalFactor", t, opts);
    return annualPremium / modalFactor ;
}

exp.premiumAmount__01 = function (ctx, policy, people, product, fund, t, factors) {
    let modalFactor = product.val("modalFactor").chargeRate;
    return product.val("annualPremium") * modalFactor ;
}
exp.premiumAmount__02 = function (ctx, policy, people, product, fund, t, factors) {
    let modalFactor = product.val("modalFactor").chargeRate;
    return product.val("annualPremium") / modalFactor ;
}

exp.totalPremium__01 = function totalPremium__01(ctx, policy, people, product, fund, t, factors) {
    return _.sum( _.map( policy.val("products"), (prd,idx) => prd.val("premium") ) );
}

exp.polAnnualPremiumAtT__01 =  function polAnnualPremiumAtT__01(ctx, policy, people, product, fund, t=0, factors) {
    if ( product.val('yr',t) === 0 ) { return 0; }
    return _.sum( _.map( policy.val("products"), (prd) => { return prd.val("annualPremiumAtT",t); }) );
}

exp.polTotalPremiumPaidAtT__01 = function polTotalPremiumPaidAtT__01(ctx, policy, people, product, fund, t=0, factors) {
    if ( product.val('yr',t) === 0 ) { return 0; }
    return policy.val("polTotalPremiumPaidAtT",t-1) + policy.val("polAnnualPremiumAtT",t);
}

module.exports = exp;
