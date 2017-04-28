module.exports = {
    "policy" : {
                "proposalStartDate" : "01-10-2016",
                "outputInYears": "1",
                "payMethod" : "cash",
                "premiumFrequency"  : "4",
                "premiumHolidayStartYear" : 14,
                "people" : [
                    {   "name":"Policyholder",
                        "dob":"07-07-1991",
                        "gender":"Male" ,
                        "jobClass":1,
                    },
                    {   "name":"Son",
                        "dob":"13-12-1988",
                        "gender":"Male" ,
                        "jobClass":1,
                    },
                    {   "name":"Spouse",
                        "dob":"13-12-1997",
                        "gender":"Female" ,
                        "jobClass":1,
                    },
                ],
                "products": [
                    {   "productId" : 6500,
                        "internalId" : "TMIN4LINK",
                        "targetPremium" : 630000,
                        "regularTopup" : 420000,
                        "basicSa" : 100000000,
                        "la" : 0,
                        "premiumTerm" : 15,
                        "policyTerm" : 40,
                        "moneyId" : 30,
                        "funds" : [
                            { "fundCode" : "TMEQUITY",
                              "fundName" : "TM Equity Fund",
                              "allocation" : 1.00
                            }
                        ],
                        "loadings" : []
                    },
                ],
                "topups": [{year:3, amount:1000000},
                           {year:4, amount:1000000},
                           {year:5, amount:1000000},
                           {year:6, amount:1000000},
                           {year:7, amount:1000000},
                           {year:8, amount:1000000},
                           {year:9, amount:1000000}
                          ],
                "withdrawals" : [{year:2, amount:3000000}]
               }
}
