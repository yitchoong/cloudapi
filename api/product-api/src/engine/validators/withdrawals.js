// import __ from "../i18n";
// import _ from "lodash";

let __ = require('../i18n');
let _ = require('lodash')
let exp = {};

exp.validateAllWithdrawals__01 = function validateAllWithdrawals__01(ctx, parent, opts) {
    let errs = [], tot = 0,
        withdrawals = ctx.get("policy").val("withdrawalList") || [];
    try {
        withdrawals.forEach((row,index) => {

          let res = validateWithdrawalInput(row, ctx, parent, opts)
          if (!res) res = row.validate("validateMinMaxWithdrawal")
          errs.push( res && res.length > 0 ? __("Withdrawal no ") + (index+1) + " : " +  res.join('\n')  : undefined )
          //  errs.push(row.validate("validateMinMaxWithdrawal") );
        });
    } catch (exc) {
        errs.push(exc.message)
    }

    return _.uniq(errs);
}
let validateWithdrawalInput = function (row, ctx, parent, opts) {
    // check that we have all the fields
    // console.log("coverageTerm", parent.val("coverageTerm"))
    let coverageTerm = parent.val("coverageTerm") || 999,
        year = row.val("year"),
        amount = row.val("amount");

    let errs =[]
    if (!year) errs.push(__("Withdrawal does not have year"))
    if (!amount) errs.push(__("Withdrawam does not have amount"))
    if (year && year > coverageTerm) errs.push(__(`Withdrawal year is beyond the coverage term (${coverageTerm})`))

    return errs.length > 0 ? errs : undefined
}

exp.validateMinMaxWithdrawal__01 = function validateMinMaxWithdrawal__01(ctx, parent, opts) {

    let amount = parent.val("amount"),
        main = ctx.get("main"),
        productLife = main.dbval("productLife");

    let minSurVal = productLife.minSurValue || 0;
    let maxSurVal = productLife.maxSurValue || 99999999999999;
    // console.info("validateMinMax", minSurVal, maxSurVal);

    if ( amount < minSurVal  ) {
        return __(`The withdrawal amount is less than the allowed minimum (${minSurVal}) for the product`) ;
    }  else if (amount > maxSurVal ) {
        return __(`The withdrawal amount is more than the allowed maximum (${ maxSurVal }) for the product`) ;
    }
}

module.exports = exp;
