module.exports = {
    internalId             : "IHSR05",
    formulas : {
        yr                          : "yr__01",
        proposalStartDate           : "proposalStartDate__01",
        jobClass                    : "jobClass__01",
        ageMethod                   : "ageMethod__01",
        maxT                        : "zero",
        coverageTerm                : "coverageTerm__04",
        coverageEndAge              : "maturityAge__02",
        premium                     : "zero",
        maturityAge                 : "maturityAge__01",
        ageAtT                      : "ageAtT__02",
        entryAge                    : "entryAge__01",
        phEntryAge                  : "zero",
        totalLoadings               : "totalLoadings__01",
        saCalculated                : "saCalculated__05",
        annualPremium               : "zero",
        halfYearlyPremium           : "zero",
        quarterlyPremium            : "zero",
        monthlyPremium              : "zero",
        annualPremiumAtT            : "zero",
        totalPremiumPaidAtT         : "zero",
        totalPremium                : "zero",
        polAnnualPremiumAtT         : "zero",
        polTotalPremiumPaidAtT      : "zero",
        polFeeAtT                   : "zero",
        polFeeAfterModalFactor      : "zero",
        polFeeBeforeModalFactor     : "zero",
        deathBenefit                : "zero",
        deathBenefitGtd             : "zero",
        deathBenefitGtdAtT          : "zero",
        totalDeathBenefitGtd        : "zero",
        deathBenefitNonGtdAtT       : "zero",
        deathBenefitLowAtT          : "zero",
        deathBenefitMidAtT          : "zero",
        deathBenefitHighAtT         : "zero",
        deathBenefitGtdAtT          : "zero",
        totalDeathBenefitAtT        : "zero",
        totalSurrenderValueAtT      : "zero",
        terminalBonusAtT            : "zero",
        cashBonusAtT                : "zero",
        accumCashBonusAtT           : "zero",
        revBonusAtT                 : "zero",
        accumRevBonusAtT            : "zero",
        survivalBenefitGtd          : "zero",
        accumSurvivalBenefitAtT     : "zero",
        accumSurvivalBenefitRate    : "zero",
        surrenderValueGtdAtT        : "zero",
        maturityBenefitGtd          : "zero",
        totalDistributionCost       : "zero",
        // ILP specific
        costOfInsuranceAtT          : "zero",
        costOfInsurance             : "zero",
        monthlyCostOfInsurance      : "zero",
        costOfRiderAtT              : "costOfRidersAtT__02",
        costOfRidersAtT             : "costOfRidersAtT__02",
        totalCostOfRidersAtT        : "totalCostOfRidersAtT__01",
        accumCostOfRidersAtT        : "accumCostOfRidersAtT__02",
        monthlyCostOfRiders         : "monthlyCostOfRiders__01",
        monthlyCostOfRider          : "monthlyCostOfRider__01",
        basicCostAtT                : "zero",
        tivLowAtT                   : "zero",
        tivMidAtT                   : "zero",
        tivHighAtT                  : "zero",
        tiv                         : "zero",
        topupAtT                    : "zero",
        netTopupAtT                 : "zero",
        withdrawalAtT               : "zero",
        netWithdrawalAtT            : "zero",
        regularTopupAtT             : "zero",
        netRegularTopupAtT          : "zero",
        targetPremiumAtT            : "zero",
        netTargetPremiumAtT         : "zero",
        singlePremium               : "zero",
        singlePremiumModalFactor    : "zero",
        singlePremiumAtT            : "zero",
        netSinglePremiumAtT         : "zero",
        debtAtT                     : "zero",
        outstdDebtAtT               : "zero",
        debtForT                    : "zero",
        debtPaidAtT                 : "zero",
        debtRepayForT               : "zero",
        debtAccumPeriod             : "zero",
        debtRepayPeriod             : "zero",
        accumFactor                 : "zero",
        macAtT                      : "zero",
    },
    validators              : {
        validateMain                : 'pass',
        validateAllRiders           : 'validateAllRiders__01',
        validateRider               : 'validateRider__01',
        validateSaLimit             : 'validateSaLimit__01',
        validateAgeLimit            : 'validateAgeLimit__01',
        validatePremiumLimit        : 'pass',
        validateAllFundAllocations  : 'pass',
        validateFundAllocation      : 'pass',
        validateMinFundAllocation   : 'pass',
        validateTargetPremiumLimit  : 'pass',
        validateRegularTopupLimit   : 'pass',
        validateMinRegularTopup     : 'pass',
        validateTopupLimit          : 'pass',
        validateWithdrawalLimit     : 'pass',
        validateSaMultiple          : 'pass',
        validateMinMaxSaUnits       : 'pass',
        validateCoverageEndAge      : 'pass',

    },
    input                   : {
        la                  : 'number',
        benefitLevel        : 'str'
    },
    siColnames             : [],
    siFields               : [],
    siColwidths            : []

}
