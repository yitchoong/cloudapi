// import _ from "lodash";
// import moment from "moment";
// import * as utils from "../utils.js";

let _ = require('lodash')
let moment = require('moment')
let utils = require('../utils')
let exp = {};

exp.survivalBenefitGtdAtT__01 = function survivalBenefitGtdAtT__01(ctx, policy, people, product, fund, t=0, factors) {
    if ( product.val("yr",t) === product.val("coverageTerm") ) { return 0; }

    let unitRate = product.val("sbConfig",t).surAmount || 0 ,
        sbRate = product.val("sbPay",t).payAmount || 0 ,
        sa = product.val("initialSa");
    return sa * ( sbRate / unitRate );
}

exp.accumSurvivalBenefitRate__01 = function accumSurvivalBenefitRate__01(ctx, policy, people, product, fund, t=0, factors) {
    return 0.045;
}

exp.accumSurvivalBenefitAtT__01 =  function accumSurvivalBenefitAtT__01(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) === 0) { return 0 ;}
    let intRate = product.val("accumSurvivalBenefitRate"),
        accsb = ( product.val("accumSurvivalBenefitAtT",t-1) * (1 + product.val("accumSurvivalBenefitRate")) ) + product.val("survivalBenefitGtdAtT",t);

    return accsb;
}

module.exports = exp;
