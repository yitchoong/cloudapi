// import _ from "lodash";
// import moment from "moment";
// import * as utils from "../utils.js";

let _ = require('lodash')
let moment = require('moment')
let utils = require('../utils')
let exp = {};

exp.deathBenefitGtd__01 = function deathBenefitGtd__01( ctx, policy, people, product, fund, t, factors) {
    let sa = product.val("saCalculated") || 0;
    return utils.roundTo(sa);
}
exp.deathBenefitGtdAtT__01 = function deathBenefitGtdAtT__01( ctx, policy, people, product, fund, t, factors) {
    let sa = product.val("saCalculated") || 0;
    return utils.roundTo(sa);
}

exp.totalDeathBenefitGtd__01 = function totalDeathBenefitGtd__01( ctx, policy, people, product, fund, t, factors) {
    let sa = product.val("initialSa") || 0,
        rate = product.val("saSchedule",t).saRate || 1,  // no sa_schedule means multiple is 1
        lienRate = product.val("lienRate",t).lienRate || 1 ; // no lien rate means no lien

    return sa * rate * lienRate;
}

exp.deathBenefit__01 = function deathBenefit__01( ctx, policy, people, product, fund, t, factors) {
    return product.val("totalDeathBenefitGtd") + product.val("deathBenefitNonGtd");
}

exp.deathBenefitAtT__01 = function deathBenefitAtT__01( ctx, policy, people, product, fund, t, factors) {
    return product.val("deathBenefitGtdAtT",t) + product.val("deathBenefitNonGtdAtT",t);
}

exp.totalDeathBenefitAtT__01 = function totalDeathBenefitAtT__01( ctx, policy, people, product, fund, t, factors) {
    return product.val("deathBenefitAtT",t) + product.val("accumSurvivalBenefitAtT",t);
}

module.exports = exp;
