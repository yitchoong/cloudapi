// import __ from "../i18n";
// import _ from "lodash";

let _ = require('lodash')
let __ = require('../i18n')

let exp = {};

exp.validateAllTopups__01 = function validateAllTopups__01(ctx, parent, opts) {
    let errs = [], tot = 0,
        topups = ctx.get("policy").val("topups");
    try {
        topups.forEach((fund,index) => {
           errs.push(fund.validate("validateMinMaxTopupAmounts") );
        });
    } catch (exc) {
        errs.push(exc.message)
    }
    return errs;
}
exp.validateMinMaxTopupAmounts__01 = function validateMinMaxTopupAmounts__01(ctx, parent, opts) {
    let amount = parent.val("amount"),
        main = ctx.get("main"),
        limitRow = main.dbval("premiumLimit");

    if ( amount < limitRow.minAdTopupPrem ) {
        return __(`The topup amount is less than the allowed minimum (${limitRow.minAdTopupPrem})`) ;
    }  else if (amount > limitRow.maxAdTopupPrem ) {
        return __(`The topup amount is more than the allowed maximum (${limitRow.maxAdTopupPrem })`) ;
    }
}
module.exports = exp;
