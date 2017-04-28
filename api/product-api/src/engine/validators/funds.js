// import __ from "../i18n";
let __ = require('../i18n');
let exp = {};


exp.validateAllFundAllocations__01 = function validateAllFundAllocations__01(ctx, parent, opts) {
    // validator should be attached to the main plan to check on all funds
    let errs = [], tot = 0,
        funds = ctx.get("main").val("funds");
    try {
        funds.forEach((fund,index) => {
           tot += fund.val("allocation") * 100;
           errs.push(fund.validate("validateFundAllocation") );
           errs.push(fund.validate("validateMinFundAllocation") );
        });
        if ( tot !== 100) {
           errs.push("Combined funds allocation must be 100%");
        }

    } catch (exc) {
        errs.push(exc.message)
    }

    return errs;
}
exp.validateFundAllocation__01 =  function validateFundAllocation__01(ctx, parent, opts) {
    // validator attached to a fund, check that allocation is in multiples of 5 % (hard coded as no params exists)
    let percent = parent.val("allocation") * 100;
    if (percent % 5 !== 0) { return __("Fund ({{0}}) allocation must be multiples of 5%", parent.val("fundCode") ); }
}

exp.validateMinFundAllocation__01 =  function validateMinFundAllocation__01(ctx, parent, opts) {
    // validator attached to a fund, min allocation is 10% -- hard coded as we do not have it in ratetables
    let percent = parent.val("allocation") * 100;
    if (percent < 10) { return __("Fund ({{0}}) allocations must be at least 10% " ,  parent.val("fundCode") ); }
}
module.exports  = exp;
