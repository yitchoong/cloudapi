// import __ from "../i18n";
// import _ from "lodash";

let __ = require('../i18n');
let _ = require('lodash')
let exp = {};

exp.validateAllWithdrawals__01 = function validateAllWithdrawals__01(ctx, parent, opts) {
    let errs = [], tot = 0,
        withdrawals = ctx.get("policy").val("withdrawals");
    try {
        withdrawals.forEach((fund,index) => {
           errs.push(fund.validate("validateMinMaxWithdrawal") );
        });
    } catch (exc) {
        errs.push(exc.message)
    }

    return _.uniq(errs);
}
exp.validateMinMaxWithdrawal__01 = function validateMinMaxWithdrawal__01(ctx, parent, opts) {

    let amount = parent.val("amount"),
        main = ctx.get("main"),
        productLife = main.dbval("productLife");

    let minSurVal = productLife.minSurValue || 0;
    let maxSurVal = productLife.maxSurValue || 99999999999999;
    console.info("validateMinMax", minSurVal, maxSurVal);

    if ( amount < minSurVal  ) {
        return __(`The withdrawal amount is less than the allowed minimum (${minSurVal}) for the product`) ;
    }  else if (amount > maxSurVal ) {
        return __(`The withdrawal amount is more than the allowed maximum (${ maxSurVal }) for the product`) ;
    }
}

module.exports = exp;
