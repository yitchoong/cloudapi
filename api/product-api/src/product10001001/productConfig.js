module.exports = {
    productCode             : "PRIME88CIR",
    formulas : {
        yr : "yr__01",
        zero : "zero",
        ageAtT : "ageAtT__04",
        ageMethod : "ageMethod__01",
        entryAge : "entryAge__01",
        maxT : "maxT__03",
        phEntryAge : "phEntryAge__01",
        annualPremium : "annualPremium__03",
        annualPremiumAtT : "zero",
        premiumAmount : "premiumAmount__01",
        premiumAtT : "zero",
        coverageTerm : "coverageTerm__08",
        firstYearPremium: "annualPremium__03",

        accumCostOfRidersAtT : "zero",
        accumDebtAtT : "zero",
        accumDebtPaidAtT : "zero",
        accumFactor : "zero",
        accumSurvivalBenefitAtT : "zero",
        accumSurvivalBenefitRate : "zero",
        adhocTopupAtT : "zero",
        adhocTopupAtYear : "zero",
        adminChargesAtT : "adminChargesAtT__20",
        basicCostAtT : "zero",
        costOfInsurance : "costOfInsurance__01",
        costOfInsuranceAtT : "costOfInsuranceAtT__20",
        costOfRiderAtT : "zero",
        costOfRidersAtT : "zero",
        deathBenefit : "zero",
        deathBenefitAtT : "zero",
        deathBenefitGtd : "zero",
        deathBenefitGtdAtT : "zero",
        deathBenefitHighAtT : "zero",
        deathBenefitLowAtT : "zero",
        deathBenefitMidAtT : "zero",
        debtAccumPeriod : "debtAccumPeriod__20",
        debtAtT : "debtAtT__20",
        debtRepayAtT : "debtRepayAtT__20",
        debtRepayPeriod : "debtRepayPeriod__20",
        fundHighCapitalGainAtT : "fundHighCapitalGainAtT__20",
        fundHighValueAtT : "fundHighValueAtT__20",
        fundInvestableAmountAtT : "fundInvestableAmountAtT__20",
        fundInvestmentAllocationAtT : "fundInvestmentAllocationAtT__20",
        fundLowCapitalGainAtT : "fundLowCapitalGainAtT__20",
        fundLowMgmtFeeAtT : "fundLowMgmtFeeAtT__21",
        fundLowValueAtT : "fundLowValueAtT__20",
        fundMgmtFeeRateAtT : "fundMgmtFeeRateAtT__20",
        fundMidCapitalGainAtT : "fundMidCapitalGainAtT__20",
        fundMidValueAtT : "fundMidValueAtT__20",
        fundWithdrawalAtT : "fundWithdrawalAtT__20",
        halfYearlyPremium : "halfYearlyPremium__02",
        ilpSurrenderChargeAtT : "zero",
        jobClass : "jobClass__01",
        maturityAge : "maturityAge__01",
        monthlyCostOfInsurance : "monthlyCostOfInsurance__20",
        monthlyCostOfRider : "monthlyCostOfRider__20",
        monthlyCostOfRiders : "monthlyCostOfRiders__20",
        monthlyPremium : "monthlyPremium__02",
        netAdhocTopupAtT : "netAdhocTopupAtT__20",
        netRegularTopupAtT : "netRegularTopupAtT__20",
        netSinglePremiumAtT : "zero",
        netTargetPremiumAtT : "netTargetPremiumAtT__20",
        netWithdrawalAtT : "netWithdrawalAtT__20",
        outstdDebtAtT : "outstdDebtAtT__01",
        polAnnualPremiumAtT : "zero",
        polDeathBenefitGtdAtT : "polDeathBenefitGtdAtT__20",
        polDeathBenefitHighAtT:["polDeathBenefitHighAtT__20","roundThousandHalfUp"],
        polDeathBenefitLowAtT : ["polDeathBenefitLowAtT__20","roundThousandHalfUp"],
        polDeathBenefitMidAtT : ["polDeathBenefitMidAtT__20","roundThousandHalfUp"],
        polFeeAfterModalFactor : "zero",
        polFeeAtT : "zero",
        polFeeBeforeModalFactor : "zero",
        polHighFundValueAtT : ["polHighFundValueAtT__20","roundThousandHalfUp"],
        polLowFundValueAtT : ["polLowFundValueAtT__20","roundThousandHalfUp"],
        polMidFundValueAtT : ["polMidFundValueAtT__20","roundThousandHalfUp"],
        polTotalPremiumPaidAtT : "polTotalPremiumPaidAtT__01",
        premiumHolidayAtT : "premiumHolidayAtT__01",
        premiumTerm : "zero",
        productOptions : 'productOptions__01', // added for tugu
        proposalStartDate : "zero",
        quarterlyPremium : "quarterlyPremium__02",
        regularTopupAtT : "regularTopupAtT__20",
        regularTopupAtYear : ["regularTopupAtYear__20","roundThousandHalfUp"],
        saCalculated : "saCalculated__04",
        singlePremium : "zero",
        singlePremiumAtT : "zero",
        singlePremiumModalFactor : "zero",
        surrenderValueGtdAtT : "zero",
        survivalBenefitGtdAtT : "zero",
        targetPremiumAtT : "targetPremiumAtT__20",
        targetPremiumAtYear : ["targetPremiumAtYear__20","roundThousandHalfUp"],
        targetPremiumInvestmentAtT : "targetPremiumInvestmentAtT__20",
        tivHighAtT : "zero",
        tivLowAtT : "zero",
        tivMidAtT : "zero",
        topupsInvestmentAtT : "topupsInvestmentAtT__20",
        totalCostOfRidersAtT : "totalCostOfRidersAtT__20",
        totalDeathBenefitAtT : "zero",
        totalDeathBenefitGtd : "zero",
        totalLoadings : "zero",
        totalPremium : "zero",
        totalPremiumPaidAtT : "zero",
        totalSurrenderValueAtT : "zero",
        withdrawalAtT : "withdrawalAtT__20",
        withdrawalAtYear : "withdrawalAtYear__20",
        withdrawalFeeRateAtT : "withdrawalFeeRateAtT__20",

    },
    validators              : {
        validateInput               : 'validateInput__01',
        validateMain                : 'validateMain__01',
        validateSaLimit             : 'validateSaLimit__01',
        validateAgeLimit            : 'validateAgeLimit__02',
        validatePremiumLimit        : 'pass',
        validateAllRiders           : 'pass',
        validateRider               : 'pass',
        validateAllFundAllocations  : 'pass',
        validateFundAllocation      : 'pass',
        validateMinFundAllocation   : 'pass',
        validateTargetPremiumLimit  : 'pass',
        validateRegularTopupLimit   : 'pass',
        validateMinRegularTopup     : 'pass',
        validateTopupLimit          : 'pass',
        validateWithdrawalLimit     : 'pass',
        validateSaMultiple          : 'pass',
        validateCoverEndAge         : 'pass',
        validateAllTopups           : 'pass',
        validateMinMaxTopupAmounts  : 'pass',
        validateAllWithdrawals      : 'pass',
        validateMinMaxWithdrawal    : 'pass',
    },
    inputFields  : {
        productId            : 'num',
        productCode          : 'str',
        productName          : "num",
        lifeAssuredNumber    : "num" ,
        sumAssured           : "num",
        coverageTermType     : "str",
        coverageTermValue    : "num",
        paymentMode          : "str",
        currency             : "str",
    },
    personFields : {
      name : "str",
      gender : "str",
      birthDate : "str",
      smoking : "string"
    },
    convertToYears : "N",
    calculationFields       : ['entryAge','phEntryAge','coverageTerm','annualPremium','premium'],
    illustrationFields      : ['yr','ageAtT', 'targetPremiumAtYear', 'regularTopupAtYear',
                               'adhocTopupAtYear','withdrawalAtYear','pol.polLowFundValueAtT','pol.polMidFundValueAtT',
                               'pol.polHighFundValueAtT','pol.polDeathBenefitLowAtT',
                               'pol.polDeathBenefitMidAtT','pol.polDeathBenefitHighAtT'],
    illustrationColNames    : ['Yr','Age','Target Premium','RTU', 'Topup', 'Withdrawals',
                               'TIV(L)','TIV(M)','TIV(H)','DB(L)','DB(M)','DB(H)'],
    illustrationColWidths   : [5,5,10,10,10,10,10,10,10,10,10,10,10],
}
