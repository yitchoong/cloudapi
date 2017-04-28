// import _ from "lodash";
// import moment from "moment";
// import * as utils from "../utils.js";

let _ = require('lodash')
let moment = require('moment')
let utils = require('../utils')
let exp = {};

exp.surrenderValueGtdAtT__01 = function surrenderValueGtdAtT__01(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) === 0)  { return 0; }

    let row = product.val("cashValue",t),
        cashValue = product.val('yr',t) === product.val("coverageTerm") ? row.svSb : row.sv ,
        unitRate = product.dbval("unitRate",t).saUnitAmount ,
        sa = product.input("initialSa");

    return (sa * cashValue) / unitRate ;
}

exp.surrenderValueGtdAtT__02 = function surrenderValueGtdAtT__02(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) === 0)  { return 0; }

    let rate = t > 96 && t <= 108 ? 0.5 : t > 108 && t <= 999 ? 0.8 : 0;

    return product.val("totalPremiumPaid",t) * rate;

}

exp.totalSurrenderValueAtT__01  = function totalSurrenderValueAtT__01(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) === 0)  { return 0; }
    return product.val("surrenderValueGtdAtT",t) + product.val("accumSurvivalBenefitAtT",t);
}

module.exports = exp;
