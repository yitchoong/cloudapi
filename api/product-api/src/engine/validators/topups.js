// import __ from "../i18n";
// import _ from "lodash";

let _ = require('lodash')
let __ = require('../i18n')

let exp = {};

exp.validateAllTopups__01 = function validateAllTopups__01(ctx, parent, opts) {
    let errs = [], tot = 0,
        topups = ctx.get("policy").val("topupList");
    try {
        topups.forEach((topup,index) => {
           let res = validateTopupInput(topup, ctx, parent, opts)
           if (!res) res = topup.validate("validateMinMaxTopupAmounts")
           errs.push( res && res.length > 0 ? __("Topup no ") + (index+1) + " : " +  res.join('\n')  : undefined )
        });
    } catch (exc) {
        errs.push(exc.message)
    }
    return errs;
}
let validateTopupInput = function (topup, ctx, parent, opts) {
    // check that we have all the fields
    let errs =[]
    let coverageTerm = parent.val("coverageTerm") || 999
    if (!topup.val("year")) errs.push(__("Topup does not have year"))
    if (!topup.val("amount")) errs.push(__("Topup does not have amount"))
    if (topup.val("year") && topup.val("year") > coverageTerm ) errs.push(__(`Topup year is beyond the coverage term (${coverageTerm})`))

    return errs.length > 0 ? errs : undefined
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
