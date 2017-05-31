'use strict'

// import _ from "lodash";
// import moment from "moment";
// import * as utils from "../utils.js";
// import __ from "../i18n";

let _ = require('lodash')
let __ = require('../i18n')
let moment = require('moment')
let utils = require('../utils')
let exp = {};

/** formulas to use where t = month */

exp.ilpAnnualPremium__20 = function ilpAnnualPremium__20(ctx, policy, people, product, fund, t=0, factors) {
    let modalFactor = product.val("modalFactor").chargeRate;
    let result =  ( product.input("targetPremium") + product.input("regularTopup") ) * modalFactor;
    return result;
}
exp.targetPremiumAtYear__20 = function targetPremiumAtYear__20(ctx, policy, people, product, fund, t=0, factors) {
    // need the value at t where it is a multiple of 12
    if (t % 12 == 0) {
        let start = Math.floor((t-1)/12) * 12  + 1;
        return _.sum( _.range(start,t+1).map(tt => product.val("targetPremiumAtT",tt) ) );
    } else {
        return 0
    }
}
exp.targetPremiumAtT__20 = function targetPremiumAtT__20(ctx, policy, people, product, fund, t=0, factors) {
  // use for cases where we iterate by month
  if (product.val('yr',t) > product.val("premiumTerm") || product.val("premiumHolidayAtT",t)) { return 0}
  let tp = product.input("targetPremium"), freq = policy.val("premiumFrequency") || product.paymentMode() ,
      mod = freq === '1' ? 12 : freq === '2' ? 6 : freq === '3' ? 3 : 0;
  return freq === '4' ? tp : t % mod === 1 ? tp : 0;
}

exp.netTargetPremiumAtT__20 = function netTargetPremiumAtT__20(ctx, policy, people, product, fund, t=0, factors) {
  // target premium that is investable , note that we do not consider the modal factor as it should be in considered in targetPremumAtT
  let tpAtT = product.val("targetPremiumAtT",t),
      allocationRate = 1 - product.dbval("tpExpenseFee",t).assignRate;
  return tpAtT * allocationRate ;
}

exp.adminChargesAtT__20 = function adminChargesAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) > product.val("coverageTerm")) { return 0 }
    return product.val("moneyId") === 30 ? 27500 : 5;
}

exp.costOfInsuranceAtT__20 = function costOfInsuranceAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) > product.val("coverageTerm")) { return 0 }
    return ( product.val("saCalculated") / product.dbval("unitRate").saUnitAmount ) * product.db0("coiRate",t, factors);
}

exp.monthlyCostOfInsurance__20 = function monthlyCostOfInsurance__20(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("costOfInsuranceAtT",1) ; // get cost at t = 1
}
exp.monthlyCostOfInsurance__21 = function monthlyCostOfInsurance__20(ctx, policy, people, product, fund, t=0, factors) {
  debugger
  return product.val("annualPremium") / 12 ; // get cost at t = 1
}

exp.targetPremiumInvestmentAtT__20 = function targetPremiumInvestmentAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) > product.val("coverageTerm")) { return 0 }
    let start = product.val("debtAccumPeriod") ? 1 : 999999, end = product.val("debtAccumPeriod") ?  product.val("debtAccumPeriod") : 999999;
    let suspend = t >= start && t <= end ? true : false; // period where we accumulation admin + coi to debt
    if (suspend) {
        return product.val("netTargetPremiumAtT",t)  - product.val("totalCostOfRidersAtT",t);
    } else {
        return product.val("netTargetPremiumAtT",t) - product.val("adminChargesAtT",t) - product.val("costOfInsuranceAtT", t) -
            product.val("totalCostOfRidersAtT",t) - product.val("debtRepayAtT",t)
    }
}
exp.regularTopupAtT__20 = function regularTopupAtT__20(ctx, policy, people, product, fund, t=0, factors) {
  // use for cases where we iterate by month
  if (product.val('yr',t) > product.val("premiumTerm") || product.val("premiumHolidayAtT",t) ) { return 0 }
  let rtu = product.input("regularTopup"), freq = policy.val("premiumFrequency") || product.paymentMode(),
      mod = freq === '1' ? 12 : freq === '2' ? 6 : freq === '3' ? 3 : 0;
  return freq === '4' ? rtu : t % mod === 1 ? rtu : 0;
}
exp.regularTopupAtYear__20 = function regularTopupAtYear__20(ctx, policy, people, product, fund, t=0, factors) {
    // need the value at t where it is a multiple of 12
    if (t % 12 == 0) {
        let start = Math.floor((t-1)/12) * 12  + 1;
        return _.sum( _.range(start,t+1).map(tt => product.val("regularTopupAtT",tt)) );
    } else {
        return 0
    }
}

exp.netRegularTopupAtT__20 = function netRegularTopupAtT__20(ctx, policy, people, product, fund, t=0, factors) {
  // regular topup that is investable , note that we do not consider the modal factor as it should be in considered in regularTopupAtT
  let rtuAtT = product.val("regularTopupAtT",t),
      allocationRate = 1 - product.dbval("rtuExpenseFee",t).assignRate;
  return rtuAtT * allocationRate ;
}
exp.adhocTopupAtT__20 = function adhocTopupAtT__20(ctx, policy, people, product, fund, t=0, factors) {
  if (t % 12 !== 1) return 0; // topups are only done in 1st month of the year -- assume
  let topups = _.filter(policy.val("topups"),(topup,index) => topup.val("year") === product.val('yr',t) );
  return topups.length > 0 ? topups[0].val("amount") : 0;
}
exp.adhocTopupAtYear__20 = function adhocTopupAtYear__20(ctx, policy, people, product, fund, t=0, factors) {
    // need the value at t where it is a multiple of 12
    if (t % 12 == 0) {
        let start = Math.floor((t-1)/12) * 12  + 1;
        return _.sum( _.range(start,t+1).map(tt => product.val("adhocTopupAtT",tt)) );
    } else {
        return 0
    }
}

exp.netAdhocTopupAtT__20 = function netAdhocTopupAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    let topupAtT = product.val("adhocTopupAtT",t),
        allocationRate = 1 - product.dbval("atuExpenseFee",t).assignRate;
    return topupAtT * allocationRate ;
}
exp.withdrawalAtT__20 = function withdrawalAtT__20(ctx, policy, people, product, fund, t=0, factors) {
  if (t % 12 !== 1) return 0; // topups are only done in 1st month of the year -- assume
  let rows;
  rows = _.filter(policy.val("withdrawals"), (row,index) => row.val("year") === product.val('yr',t) );
  return rows.length > 0 ? rows[0].val("amount") : 0 ;
}
exp.withdrawalAtYear__20 = function withdrawalAtYear__20(ctx, policy, people, product, fund, t=0, factors) {
    if (t % 12 !== 0) return 0; // topups are only done in 1st month of the year -- assume
    let rows;
    rows = _.filter(policy.val("withdrawals"), (row,index) => row.val("year") === product.val('yr',t) );
    return rows.length > 0 ? rows[0].val("amount") : 0 ;
}

// charge surrender fee only in year 1 & 2
exp.withdrawalFeeRateAtT__20 = function withdrawalFeeRateAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    return product.val('yr',t) <= 2 ? 0.01 : 0 ;
}
exp.withdrawalFeeRateAtT__20 = function withdrawalFeeRateAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    return product.db0("ilpSurrenderChargeRate",t);
}
exp.netWithdrawalAtT__20 = function netWithdrawalAtT__20(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("withdrawalAtT",t) * ( 1 - product.val("withdrawalFeeRateAtT",t) );
}

exp.topupsInvestmentAtT__20 =  function topupsInvestmentAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) > product.val("coverageTerm")) { return 0 }
    return product.val("netRegularTopupAtT",t) + product.val("netAdhocTopupAtT",t); // did not consider admin fee for topups, can add if required
}

exp.premiumAtT__20 = function premiumAtT__20(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("targetPremiumAtT",t) +  product.val("regularTopupAtT",t) ;
}

/* switch over to looking at the tiv value for each of the funds -- define a set of formulas to be used by the each of the funds */

exp.fundInvestmentAllocationAtT__20 = function fundInvestmentAllocationAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    let main = ctx.get("main"), allocation = fund.input("allocation") ?  fund.input("allocation") / 100 : 0;
    // debugger
    return (main.val("targetPremiumInvestmentAtT",t) + main.val("topupsInvestmentAtT",t) ) * allocation; // allocation rate for the fund
}
exp.fundWithdrawalAtT__20 = function fundWithdrawalAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    let main = ctx.get("main"), allocation = fund.input("allocation") ?  fund.input("allocation") / 100 : 0;
    return main.val("netWithdrawalAtT",t) * allocation;
}
exp.fundInvestableAmountAtT__20 = function fundInvestableAmountAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    return fund.val("fundInvestmentAllocationAtT",t) - fund.val("fundWithdrawalAtT",t)
}
exp.fundLowCapitalGainAtT__20 = function fundLowCapitalGainAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    return _fundCapitalGainAtT(ctx, policy, people, product, fund, t, {rateType:'fundLowRate', fundCode: fund.val("fundCode")})
}
exp.fundMidCapitalGainAtT__20 = function fundMidCapitalGainAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    return _fundCapitalGainAtT(ctx, policy, people, product, fund, t, {rateType:'fundMidRate', fundCode: fund.val("fundCode")})
}
exp.fundHighCapitalGainAtT__20 =function fundHighCapitalGainAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    return _fundCapitalGainAtT(ctx, policy, people, product, fund, t, {rateType:'fundHighRate', fundCode: fund.val("fundCode")})
}
function _fundCapitalGainAtT(ctx, policy, people, product, fund, t=0, factors) {
    let {rateType, fundCode } = factors;
    let effectiveMonthlyRate = Math.pow( 1 + fund.db0(rateType,t) , 1/12 ) - 1; // (1 + yearlyRate) ^ 1/12 - 1
    let fundValueType = rateType === 'fundLowRate' ? 'fundLowValueAtT' : rateType === 'fundMidRate' ? 'fundMidValueAtT' : 'fundHighValueAtT';
    // let rate = product.db0(rateType,t,{fundCode:fundCode});
    return  ( fund.val(fundValueType,t-1) + fund.val("fundInvestableAmountAtT",t) )  * effectiveMonthlyRate;
}
exp.fundMgmtFeeRateAtT__20 = function fundMgmtFeeRateAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    return fund.dbval("fundData").fundMgmtFeeRate / 12 ; // convert from yearly to monthly
    // return 0;
    // return 0.03 / 12 ; // just divide by 12 using 3 percent, maybe setup in table later on ::TODO:: this is in the t_fund
}
exp.fundLowMgmtFeeAtT__21 = function fundLowMgmtFeeAtT__21(ctx, policy, people, product, fund, t=0, factors) {
    return ( fund.val("fundLowValueAtT",t-1) + fund.val("fundInvestableAmountAtT",t) + fund.val("fundLowCapitalGainAtT",t) )
              * fund.val("fundMgmtFeeRateAtT",t);
}
exp.fundLowValueAtT__20 = function fundLowValueAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    if (t===0){return 0}
    return ( fund.val("fundLowValueAtT",t-1) + fund.val("fundInvestableAmountAtT",t) + fund.val("fundLowCapitalGainAtT",t) )
              * (1 - fund.val("fundMgmtFeeRateAtT",t) ) ;
}
exp.fundMidValueAtT__20 = function fundMidValueAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    if (t===0){return 0}
    return ( fund.val("fundMidValueAtT",t-1) + fund.val("fundInvestableAmountAtT",t) + fund.val("fundMidCapitalGainAtT",t) )
              * (1 - fund.val("fundMgmtFeeRateAtT",t) ) ;
}
exp.fundHighValueAtT__20 = function fundHighValueAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    if (t===0){return 0}
    // debugger
    return ( fund.val("fundHighValueAtT",t-1) + fund.val("fundInvestableAmountAtT",t) + fund.val("fundHighCapitalGainAtT",t) )
              * (1 - fund.val("fundMgmtFeeRateAtT",t) ) ;
}
/* ***************** end of formulas attached to fund objects *****************/
/* ***************** define a set of formulas at the policy level -- mainly for aggregating the fund values ****************/
exp.polLowFundValueAtT__20 = function polLowFundValueAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    // return _.sum( policy.val('products')[0].val('funds').map(f => f.val("fundLowValueAtT",t)));
    return _.sum( policy.val('fundList').map(f => f.val("fundLowValueAtT",t)));
}
exp.polMidFundValueAtT__20 = function polMidFundValueAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    return _.sum( policy.val('fundList').map(f => f.val("fundMidValueAtT",t)));
    //return _.sum( policy.val('products')[0].val('funds').map(f => f.val("fundMidValueAtT",t)));
}
exp.polHighFundValueAtT__20 = function polHighFundValueAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    // return _.sum( policy.val('products')[0].val('funds').map(f => f.val("fundHighValueAtT",t)));
    return _.sum( policy.val('fundList').map(f => f.val("fundHighValueAtT",t)));
}
exp.polDeathBenefitLowAtT__20 = function polDeathBenefitLowAtT__20( ctx, policy, people, product, fund, t, factors) {
    return product.val("polLowFundValueAtT",t,factors) + product.val("polDeathBenefitGtdAtT",t,factors);
}
exp.polDeathBenefitMidAtT__20 = function polDeathBenefitMidAtT__20( ctx, policy, people, product, fund, t, factors) {
    return product.val("polMidFundValueAtT",t,factors) + product.val("polDeathBenefitGtdAtT",t,factors);
}
exp.polDeathBenefitHighAtT__20 =  function polDeathBenefitHighAtT__20( ctx, policy, people, product, fund, t, factors) {
    return product.val("polHighFundValueAtT",t,factors) + product.val("polDeathBenefitGtdAtT",t,factors);
}
exp.polDeathBenefitGtdAtT__20 = function polDeathBenefitGtdAtT__20( ctx, policy, people, product, fund, t, factors) {
    let sa = product.val("saCalculated") || 0,
        lienRate = product.dbval("lienRate",t).lienRate || 1 ;
    return sa * lienRate;
}

/* ***************** end formulas at the policy level -- mainly for aggregating the fund values ****************/
/* *************** debt calculation for case where t = monthly **************** */

exp.debtAccumPeriod__20 = function debtAccumPeriod__20(ctx, policy, people, product, fund, t=0, factors) {
  return 12;
}
exp.debtRepayPeriod__20 = function debtRepayPeriod__20(ctx, policy, people, product, fund, t=0, factors) {
    return 12;
}
exp.debtRepayAtT__20 = function debtRepayAtT__20(ctx, policy, people, product, fund, t=0, factors) {
    let main = ctx.get('main'), start = main.val("debtAccumPeriod") + 1, end = start + main.val('debtRepayPeriod') - 1 ,

        value = t < start || t > end ? 0 : t === end ? main.val("accumDebtAtT",t-1) - main.val("accumDebtPaidAtT", t-1) :
                main.val("accumDebtAtT",t-1) / main.val("debtRepayPeriod");
        return value;
}
exp.debtAtT__20 = function debtAtT__20(ctx, policy, people, product, fund, t=0, factors) {
        let main = ctx.get('main'), start=1, end = main.val("debtAccumPeriod");
        return t >= start && t <= end ? main.val("costOfInsuranceAtT",t) + main.val("adminChargesAtT",t) : 0 ;
}
/**** for riders *******/
/* spelt correctly, this set used when t = montly */

exp.costOfRiderAtT__21 = function costOfRiderAtT__21(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) > product.val("coverageTerm")) { return 0 }
    return ( product.val("saCalculated") / product.dbval("unitRate").saUnitAmount ) * product.db0("premiumRateaccident",t, factors);
}
exp.costOfRiderAtT__22 = function costOfRiderAtT__22(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) > product.val("coverageTerm")) { return 0 }
    return ( product.val("saCalculated") / product.dbval("unitRate").saUnitAmount ) * product.db0("premiumRatereimbursement",t, factors);
}
exp.costOfRiderAtT__23 = function costOfRiderAtT__23(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val('yr',t) > product.val("coverageTerm")) { return 0 }
    return ( product.val("saCalculated") / product.dbval("unitRate").saUnitAmount ) * product.db0("premiumRatecashBenefit",t, factors);
}
exp.costOfRiderAtT__24 = function costOfRiderAtT__24(ctx, policy, people, product, fund, t=0, factors) {
    // used for product where premiumRates are yearly and we are iterating monthly
    if (product.val('yr',t) > product.val("coverageTerm")) { return 0 }
    if ( t % 12 !== 1) { return 0 } // we only have cost in the 1st month of the year, not sure on name of the rate table
    return ( product.val("saCalculated") / product.dbval("unitRate").saUnitAmount ) * product.db0("premiumRatecashBenefit",t, factors);
}
exp.totalCostOfRidersAtT__20 = function totalCostOfRidersAtT__20(ctx, policy, people, product, fund, t=0, factors) {
  return _.sum( policy.val('products').map((prd,index) => index === 0 ? 0 : prd.val("costOfRiderAtT",t, {}) ));
}
exp.monthlyCostOfRiders__20 = function monthlyCostOfRiders__20(ctx, policy, people, product, fund, t=1, factors) {
    let main = ctx.get("main");
    return  main.val("totalCostOfRidersAtT",1) ; // chargeType - 4 == monthly
}

exp.productOptions__01 = function productOptions__01(ctx, policy, people, product, fund, t, factors) {
    return [
        {optionName: __("Package 1"), premiumAmount: 350000, targetPremiumRate: 0.6, regularTopupRate: 0.4 },
        {optionName: __("Package 2"), premiumAmount: 700000, targetPremiumRate: 0.6, regularTopupRate: 0.4 },
        {optionName: __("Package 3"), premiumAmount: 1050000, targetPremiumRate: 0.6, regularTopupRate: 0.4 },
    ]
}
exp.productOptions__02 = function productOptions__02(ctx, policy, people, product, fund, t, factors) {
    return [
        {optionName: __("Proteksi"), premiumAmount: null, targetPremiumRate: 0.8, regularTopupRate: 0.2 },
        {optionName: __("Warisan"), premiumAmount: null, targetPremiumRate: 0.8, regularTopupRate: 0.2 },
        {optionName: __("Sejahtera"), premiumAmount: null, targetPremiumRate: 0.2, regularTopupRate: 0.8 },
        {optionName: __("Prestasi"), premiumAmount: null, targetPremiumRate: 0.2, regularTopupRate: 0.8 },
    ]
}

/** --END--  formulas to use where t = month */
/* ************************************************************************************* */


exp.targetPremiumAtT__01 = function targetPremiumAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  // gross target premium amount
  let result =  t > product.val("premiumTerm") ? 0
            : product.input("targetPremium") * product.dbval("modalFactor").chargeRate ;
   return result;
}
exp.netTargetPremiumAtT__01 = function netTargetPremiumAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  // target premium that is investable
  if (t > 0 && t < 10) debugger
  let allocationRate = 1 - product.dbval("tpExpenseFee",t).assignRate;
  return product.val('yr',t) > product.val("premiumTerm") ? 0
            : product.input("targetPremium") * product.dbval("modalFactor").chargeRate * allocationRate;
}
exp.adhocTopupAtT__01 = function adhocTopupAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  let topups = _.filter(policy.val("topups"),(topup,index) => topup.val("year") === product.val('yr',t) );

  return topups.length > 0 ? topups[0].val("amount") : 0;
}
exp.netAdhocTopupAtT__01 = function netAdhocTopupAtT__01(ctx, policy, people, product, fund, t=0, factors) {
    let topupAtT = product.val("topupAtT",t),
        allocationRate = 1 - product.dbval("atuExpenseFee",t).assignRate;
    return topupAtT * allocationRate ;
}

exp.withdrawalAtT__01 = function withdrawalAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  let rows;
  rows = _.filter(policy.val("withdrawals"), (row,index) => row.val("year") === t );
  // is there a surrender charge ?
  return rows.length > 0 ? rows[0].val("amount") : 0 ;
}

exp.ilpSurrenderChargeAtT__01 = function ilpSurrenderChargeAtT__01(ctx, policy, people, product, fund, t=0, factors) {
    let rate = product.db0("ilpSurrenderChargeRate",t),
        amount = product.val("withdrawalAtT", t);
    return amount * rate;
}

exp.costOfInsuranceAtT__01 = function costOfInsuranceAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("basicCostAtT",t,factors) + product.val("totalLoadings",t,factors)
}

exp.costOfInsurance__01 = function costOfInsurance__01(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("costOfInsuranceAtT",1,factors); // use t = 1 to derive the cost of insurance
}

exp.monthlyCostOfInsurance__01 = function monthlyCostOfInsurance__01(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("costOfInsuranceAtT",1) / 12 ;
}

exp.monthlyCostOfInsurance__02 = function monthlyCostOfInsurance__02(ctx, policy, people, product, fund, t=0, factors) {
  // get the monthly modal factor -- charge_type = 4
  return product.val("costOfInsuranceAtT",1) * product.db0("modalFactor", '*', {chargeType: '4'}) // charge type 4 = monthly
}

exp.basicCostAtT__01 = function basicCostAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  // this is the basic risk charge amount
  let la = people[product.input("la")],
      sa = product.input("basicSa"),
      unitRate = product.dbval("unitRate").saUnitAmount,
      lsadRate = product.db0("lsadRate") || 0,
      coiRate = product.db0("coiRate",t);

  return (sa / unitRate)  *  (coiRate - lsadRate);
}
exp.basicCostAtT__02 = function basicCostAtT__02(ctx, policy, people, product, fund, t=0, factors) {
  let la = people[product.input("la")],
      sa = product.val("saCalculated"),
      unitRate = product.dbval("unitRate").saUnitAmount,
      lsadRate = product.db0("lsadRate") || 0,
      coiRate = product.db0("coiRate",t);

  return (sa / unitRate)  *  (coiRate - lsadRate);
}

exp.totalLoadings__01 =function totalLoadings__01(ctx, policy, people, product, fund, t=0, factors) {
  let type, rate;
  return _.sum( _.map(product.val("loadings"), (loading,index) => {
    rate = loading.val("rate");
    return loading.val("type") === 'percentage' ? (product.val("basicCostAtT",t) * rate) / 100
                                                : product.val("saCalculated") * rate  / product.dbval("unitRate").saUnitAmount;
  }));
}

// export function out_at_t__01(ctx, policy, people, product, fund, t=0, factors) {
//   let rows;
//   rows = _.filter(policy.val("withdrawals"), (row,index) => row.val("year") === t );
//
//   return rows.length > 0 ? rows[0].val("amount") : 0 ;
// }


exp.ilpAnnualPremium__10 = function ilpAnnualPremium__10(ctx, policy, people, product, fund, t=0, factors) {
    let result = product.val("targetPremiumAtT",1) + product.val("regularTopupAtT",1);
    return result;
}
exp.ilpAnnualPremium__11 = function ilpAnnualPremium__11(ctx, policy, people, product, fund, t=0, factors) {
    let modalFactor = product.val("modalFactor").chargeRate;
    let result =  ( product.input("targetPremium") + product.input("regularTopup") ) * modalFactor;
    return result;
}

exp.ilpPremium__10 = function ilpPremium__10(ctx, policy, people, product, fund, t=0, factors) {
    return product.input("targetPremium") + product.input("regularTopup");
}

exp.netRegularTopupAtT__01 = function netRegularTopupAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  // investable rtu
  let premiumTerm = product.val("premiumTerm"),
      allocRate = 1 - product.dbval("rtuExpenseFee",t).assignRate ;

  return t > premiumTerm ? 0 : product.input("regularTopup") * product.val("modalFactor").chargeRate * allocRate ;
}
exp.regularTopupAtT__01 = function regularTopupAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  // gross rtu
  let premiumTerm = product.val("premiumTerm");

  return t > premiumTerm ? 0 : product.input("regularTopup") * product.val("modalFactor").chargeRate ;
}

exp.singlePremiumAtT__01 = function singlePremiumAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  // gross single premium
  let premiumTerm = 1; // always 1 since we are dealing with single premium

  return t > premiumTerm ? 0 : product.input("targetPremium") * product.val("modalFactor").chargeRate  ;
}
exp.netSinglePremiumAtT__01 = function netSinglePremiumAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  // investable single premium
  let premiumTerm = 1, // always 1 since we are dealing with single premium
      allocRate = 1 - product.val("spExpenseFee",t).assignRate ;
  return t > premiumTerm ? 0 : product.input("targetPremium") * product.val("modalFactor").chargeRate * allocRate ;
}


exp.polFeeAtT__01 = function polFeeAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  return product.dbval("ilpPolFeeRate",t).assignRate;
}

exp.polFeeAtT__02 = function polFeeAtT__02(ctx, policy, people, product, fund, t=0, factors) {
  return product.dbval("ilpPolFeeRate",t).assign_rate * 12 ; // fees are monthly, change to yearly if t is in years
}
exp.polFeeAfterModalFactor__01 = function polFeeAfterModalFactor__01(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("polFeeAtT",1) * (1/12) ;
}
exp.polFeeAfterModalFactor__02 = function polFeeAfterModalFactor__02(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("polFeeAtT",1) / product.db0("policyFeeModalFactor");
}
exp.polFeeBeforeModalFactor__01 =  function polFeeBeforeModalFactor__01(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("polFeeAtT",1);
}


exp.accumDebtAtT__01 =  function accumDebtAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  return _.sum( _.map( _.range(1,t+1),(tt) => product.val("debtAtT",tt)));
}
exp.debtAtT__01 = function debtAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  let start = 1, end = product.val("debtAccumPeriod");
  return (t >= start && t <= end ) ? product.val("polFeeAtT",t) + product.val("costOfInsuranceAtT",t) + product.val("totalCostOfRidersAtT",t) : 0 ;
}
exp.accumDebtPaidAtT__01 = function accumDebtPaidAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  return _.sum( _.map(_.range(1,t+1), (tt) => product.val("debtRepayAtT",tt ) ) );
}
exp.debtRepayAtT__01 = function debtRepayAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  // debt repayment starts after debt accumulation period
  let main = ctx.get("main"),
      start = main.val("debtAccumPeriod") + 1 ,
      paymPeriod = main.val("debtRepayPeriod"),
      end = start + paymPeriod - 1;

  if ( t >= start && t <= end ) {
    return t < end ? product.val("accumDebtAtT",t-1) / paymPeriod : product.val("accumDebtAtT",t-1) - product.val("accumDebtPaidAtT",t-1);
  }
  return 0;
}
exp.debtAccumPeriod__02 =  function debtAccumPeriod__02(ctx, policy, people, product, fund, t=0, factors) {
  return 2;
}
exp.debtRepayPeriod__01 =  function debtRepayPeriod__01(ctx, policy, people, product, fund, t=0, factors) {
  return 2;
}
exp.accumFactor__01 =  function accumFactor__01( ctx, policy, people, product, fund, t, factors) {
    let freq = policy.val("premiumFrequency") || product.paymentMode() , factor;
    factor = freq === '1' ? 12 : freq === '5' ? 12 : freq === '2' ? 9 : freq === '3' ? 7.5 : 6.5 ;
    return factor;
}
exp.outstdDebtAtT__01 =  function outstdDebtAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  let debt=0,paym=0;
  _.forEach( _.range(1,t+1), (tt,index) => { debt+=product.val("debtAtT",tt) ; paym+= product.val("debtRepayAtT",tt) });
  return debt - paym;
}
exp.tivLowAtT__01 = function tivLowAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  return _tivAtT(ctx, policy,people, product, fund, t, _.extend(factors,{'rateType':'fundLowRate'}));
}
exp.tivMidAtT__01 = function tivMidAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  return _tivAtT(ctx, policy,people, product, fund, t, _.extend(factors,{'rateType':'fundMidRate'}));
}
exp.tivHighAtT__01 = function tivHighAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  return _tivAtT(ctx, policy,people, product, fund, t, _.extend(factors,{'rateType':'fundHighRate'}));
}
function _tivAtT(ctx, policy, people, product, fund, t=0, factors) {
  if (t===0) { return 0 }

  if (!'rateType' in factors) { throw Error("Function tivAtT__01, please specify the rateType")}
  let rateType = factors.rateType;
  let tivType = rateType === 'fundLowRate' ? 'tivLowAtT' : rateType === 'fundMidRate' ? 'tivMidAtT' : 'tivHighAtT';
  let amt=0, debtAccumPeriod = product.val("debtAccumPeriod"), debtRepayPeriod = product.val("debtRepayPeriod");
  let debtStart = 1, debtEnd = product.val("debtAccumPeriod");
  let debtRepayStart = debtEnd + 1, debtRepayEnd = debtRepayStart + debtRepayPeriod - 1;

  let intrate = product.val(rateType,t).rate, accumFactor = product.val("accumFactor"); //
  let debtRepayForT = t >= debtRepayStart && t <= debtRepayEnd ? product.val("debtRepayAtT",t) : 0;
  let charges = t >= debtStart && t <= debtEnd ? 0 :
      ( product.val("costOfInsuranceAtT",t) + product.val("totalCostOfRidersAtT",t) + product.val("macAtT",t) + product.val("polFeeAtT",t) + debtRepayForT )
      * Math.pow((1+intrate),(6.5/12)) ;

  amt += ( policy.val("netTopupAtT",t) + product.val(tivType,t-1) ) * ( 1+intrate ); // topups until t-1, assume topup done at begiining of year thus compound
  amt += ( product.val("netRegularTopupAtT",t) + product.val("netTargetPremiumAtT",t)  ) *  Math.pow(( 1+intrate ) , (accumFactor/12) ); // need to find out more about accum factor
  amt -= charges;
  amt -= policy.val("withdrawalAtT",t);
  // console.log("tiv t & amt, charges", t, amt, charges)
  return amt ;
}

exp.tivLowAtT__02 =  function tivLowAtT__02(ctx, policy, people, product, fund, t=0, factors) {
  return tivAtT__02(ctx, policy,people, product, fund, t, _.extend(factors,{'rateType':'fundLowRate'}));
}
exp.tivMidAtT__02 =  function tivMidAtT__02(ctx, policy, people, product, fund, t=0, factors) {
  return tivAtT__02(ctx, policy,people, product, fund, t, _.extend(factors,{'rateType':'fundMidRate'}));
}
exp.tivHighAtT__02 =  function tivHighAtT__02(ctx, policy, people, product, fund, t=0, factors) {
  return tivAtT__02(ctx, policy,people, product, fund, t, _.extend(factors,{'rateType':'fundHighRate'}));
}
function tivAtT__02(ctx, policy, people, product, fund, t=0, factors) {
  // used for single premium @ bni
  if (t===0) { return 0 }

  let rateType = factors.rateType;
  let tivType = rateType === 'fundLowRate' ? 'tivLowAtT' : rate_type === 'fundMidRate' ? 'tivMidAtT' : 'tivHighAtT';
  let amt=0;
  let intrate = product.dbval(rateType,t).rate,
      accumFactor = product.val("accumFactor");
  let charges = ( product.val("costOfInsuranceAtT",t) + product.val("totalCostOfRidersAtT",t) + product.val("polFeeAtT",t) )
      * (1+intrate) ;
  amt += ( policy.val("netTopUpAtT",t) + product.val("singlePremiumAtT",t) + product.val(tivType,t-1) ) * ( 1 + intrate );
  amt -= charges;
  let withdraw = policy.val("withdrawalAtT",t ) - policy.val("ilpSurrenderChargeAtT",t)
  amt -= withdraw;
  return amt ;
}

exp.deathBenefitGtdAtT__10 = function deathBenefitGtdAtT__10( ctx, policy, people, product, fund, t, factors) {
    let sa = product.val("saCalculated") || 0,
        lienRate = product.dbval("lienRate",t).lienRate || 1 ;
    return utils.roundTo(sa * lienRate);
}

exp.deathBenefitLowAtT__10 =  function deathBenefitLowAtT__10( ctx, policy, people, product, fund, t, factors) {
    return product.val("tivLowAtT",t,factors) + product.val("deathBenefitGtdAtT",t,factors);
}
exp.deathBenefitMidAtT__10 = function deathBenefitMidAtT__10( ctx, policy, people, product, fund, t, factors) {
    return product.val("tivMidAtT",t,factors) + product.val("deathBenefitGtdAtT",t,factors);
}
exp.deathBenefitHighAtT__10 =  function deathBenefitHighAtT__10( ctx, policy, people, product, fund, t, factors) {
    return product.val("tivHighAtT",t,factors) + product.val("deathBenefitGtdAtT",t,factors);
}

exp.singlePremiumModalFactor__10 =  function singlePremiumModalFactor__10(ctx, policy, people, product, fund, t=0, factors) {
    return product.input("targetPremium") * product.db0("modalFactor");
}
exp.singlePremium__10 =  function singlePremium__10(ctx, policy, people, product, fund, t=0, factors) {
    return product.input("targetPremium");
}

/*

CODE for Riders specifically

*/
exp.monthlyCostOfRider__01 =  function monthlyCostOfRider__01(ctx, policy, people, product, fund, t=0, factors) {
  return product.val("costOfRiderAtT",1) ; // get cost at t = 1
}

exp.monthlyCostOfRiders__01 =  function monthlyCostOfRiders__01(ctx, policy, people, product, fund, t=1, factors) {
    let main = ctx.get("main");
    return  main.val("totalCostOfRidersAtT",1) / main.db0("modalFactor",'*',{chargeType:'4'}) ; // chargeType - 4 == monthly
}
exp.monthlyCostOfRiders__02 =  function monthlyCostOfRiders__02(ctx, policy, people, product, fund, t=1, factors) {
    let main = ctx.get("main");
    return  main.val("totalCostOfRidersAtT",1) * main.db0("modalFactor",'*',{chargeType:'4'}) ; // chargeType - 4 == monthly
}


/* really should be call costOfRiderAtT instead of costOfRidersAtT */

exp.costOfRidersAtT__01 =  function costOfRidersAtT__01(ctx, policy, people, product, fund, t=0, factors) {
    let rate = product.db0("premiumRateaccident",t,factors),
        sa = product.val("saCalculated"),
        loadings = product.val("totalLoadings",'*',factors);
    return t <= product.val("coverageTerm") ? ((sa*rate) / 1000 ) + loadings : 0;
}
exp.costOfRidersAtT__02 =  function costOfRidersAtT__02(ctx, policy, people, product, fund, t=0, factors) {
    if (product.val("ageAtT",t) > product.val("coverageEndAge")) { return 0 }
    let rate = product.db0("premiumRatereimbursement",t,factors) || 0 , // use for reimbursement riders
        inflation = product.db0("inflationRate",t,factors), //.rate,
        loadings = product.val("totalLoadings",'*',factors);
    return (rate * inflation) + loadings;
}
exp.costOfRidersAtT__03 =  function costOfRidersAtT__03(ctx, policy, people, product, fund, t=0, factors) {
    if ( t > product.val("coverageTerm") ) { return 0 }
    let rate = product.db0("premiumRatecashBenefit",t,factors), // use for Cash Benefit riders
        sa = product.val("saCalculated",t,factors),
        loadings = product.val("totalLoadings",1,factors);
    return (rate * sa) + loadings;
}
exp.costOfRidersAtT__04 =  function costOfRidersAtT__04(ctx, policy, people, product, fund, t=0, factors) {
    if (product.input("coverageEndAge")) {
        if ( product.val("ageAtT",t) > product.val("coverageEndAge") ) { return 0 }
    } else {
        if (t > product.val("coverageTerm"),t) { return 0}
    }
    if (product.input("benefitLevel")) { factors.benefitLevel = product.input("benefitLevel") }
    let rate = product.db0("premiumRatecashBenefit",t,factors), // cash benefit
        loadings = product.val("totalLoadings",1,factors);
    return rate + loadings;
}


exp.totalCostOfRidersAtT__01 =  function totalCostOfRidersAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  return _.sum( _.map(policy.val("products"),(prd,idx) => idx === 0 ? 0 : prd.val("costOfRidersAtT",t,{})));
}

exp.accumCostOfRidersAtT__01 = function accumCostOfRidersAtT__01(ctx, policy, people, product, fund, t=0, factors) {
  return t === 0 ? 0 : policy.val("accumCostOfRidersAtT",t-1) + policy.val("totalCostOfRidersAtT",t) ;
}
module.exports = exp;
