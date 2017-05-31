// import __ from "../i18n";
let __ = require('../i18n');
let exp = {};


exp.validateAllFundAllocations__01 = function validateAllFundAllocations__01(ctx, parent, opts) {
    // validator should be attached to the main plan to check on all funds
    let errs = [], totalAllocation = 0, totalAdhoc=0, totalRegular=0 , totalTarget =0,
        funds = ctx.get("policy").val("fundList");
    try {
        funds.forEach((fund,index) => {
          let res = validateFundAllocationInput(fund, ctx, parent, opts)
          let errstr =''
          if (res) {
            errs.push( res && res.length > 0 ? __(`Fund ${fund.val("fundCode")} : `)  +  res.join('\n')  : undefined )
          } else  {
            res = fund.validate("validateFundAllocation",{index})
            errs.push( res && res.length > 0 ? __(`Fund ${fund.val("fundCode")} : `)  +  res.join('\n')  : undefined )
            res = fund.validate("validateMinFundAllocation",{index})
          }
          totalAllocation += fund.val("allocation") || 0;
          totalAdhoc += fund.val("adhocPercent") || 0;
          totalRegular += fund.val("regularTopupPercent") || 0
          totalTarget += fund.val("targetPremiumPercent") || 0
        });
        if (totalAllocation !== 0) {
            if (totalAllocation !== 100) errs.push(__("Combined funds allocation must be 100%"));
        } else {
          if (totalAdhoc > 0 && totalAdhoc !== 100) errs.push( __("Combined funds allocation for adhoc premium must be 100%") )
          if (totalRegular > 0 && totalRegular !== 100) errs.push(__("Combined funds allocation for regular topup premium must be 100%"));
          if (totalTarget > 0 && totalTarget !== 100) errs.push(__("Combined funds allocation for target premium must be 100%"));
        }

    } catch (exc) {
        errs.push(exc.message)
    }

    return errs;
}
let validateFundAllocationInput = function (fund, ctx, parent, opts) {

    let main = ctx.get("main")
    let availableFunds = main.val("availableFunds");
    let fundData = availableFunds.find(f => f.fundCode === fund.val("fundCode"))
    let errs =[]
    if (!fundData) {
        errs.push( __(`Fund (${fund.val("fundCode")}) is not valid for this product (${main.val("productCode") || main.val("productId")})`))
    }
    // check that we have all the fields
    let allocation = fund.val("allocation") || 0
    let adhocPercent = fund.val("adhocPercent") || 0;
    let regularTopupPercent = fund.val("regularTopupPercent") || 0
    let targetPremiumPercent = fund.val("targetPremiumPercent") || 0
    let ok = false;
    if (allocation > 0 || targetPremiumPercent > 0)  ok = true;
    if (!ok) {
      if (allocation === 0 &&  ( targetPremiumPercent === 0) ) {
        errs.push(__(`Please specify the allocation (for all premium types) or the targetPremiumPercent, adhocPercent, regularTopupPercent individually)`))
      } else if (allocation === 0) {
          if (adhocPercent <= 0) errs.push(__("Fund allocation percentage for adhoc premium is not specified -") + fund.val("fundCode"))
          if (regularTopupPercent <= 0) errs.push(__("Fund allocation percentage for regular topup premium is not specified -")+ fund.val("fundCode"))
          if (targetPremiumPercent <= 0) errs.push(__("Fund allocation percentage for target premium is not specified - ")+ fund.val("fundCode"))
      } else {
        errs.push(__("Fund allocation percentage is not specified ")+ fund.val("fundCode"))
      }
    }
    return errs.length > 0 ? errs : undefined
}

exp.validateFundAllocation__01 =  function validateFundAllocation__01(ctx, parent, opts) {
    // validator attached to a fund, check that allocation is in multiples of 5 % (hard coded as no params exists)
    // let percent = parent.val("allocation") * 100;
    let percent = parent.val("allocation");
    // let index = opts.index || 0
    if (percent % 5 !== 0) { return __("Fund ({{0}}) allocation must be multiples of 5%", parent.val("fundCode") ); }
}

exp.validateMinFundAllocation__01 =  function validateMinFundAllocation__01(ctx, parent, opts) {
    // validator attached to a fund, min allocation is 10% -- hard coded as we do not have it in ratetables
    // let percent = parent.val("allocation") * 100;
    let percent = parent.val("allocation") ;
    // let index = opts.index || 0
    if (percent < 10) { return __("Fund ({{0}}) allocations must be at least 10% " ,  parent.val("fundCode") ); }
}
module.exports  = exp;
