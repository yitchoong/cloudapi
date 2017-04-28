module.exports = {
    "policy" : {
                "proposalStartDate" : "15-09-2016",
                "payMethod" : "cash",
                "premiumFrequency"  : "1",
                "premiumHolidayStartYear" : 9,
                "people" : [
                    {   "name":"Insured",
                        "dob":"13-12-1982",
                        "gender":"Male" ,
                        "Smoker" : 'Non-Smoker',
                        "isLifeAssured" : true,
                        "isPolicyholder" : true,
                        "occupation": "2",
                    },
                    {   "name":"Policyholder",
                        "dob":"07-07-1980",
                        "gender":"male" ,
                    },
                    {   "name":"Spouse",
                        "dob":"13-12-1967",
                        "gender":"female" ,
                    },
                ],
                "products": [
                    {   "productId" : 5722,
                        "internalId" : "IFLE03",
                        "targetPremium" : 3000,
                        "regularTopup" : 5000000,
                        "basicSa" : 250000000,
                        "la" : 0,
                        "premiumTerm" : 10,
                        "funds" : [
                            { "fundCode" : "AER",
                              "fundName" : "ACE Rupiah Equity Fund",
                              "allocation" : 1
                            },
                            { "fundCode" : "AER2",
                              "fundName" : "ACE Rupiah Equity Fund 2",
                              "allocation" : 0
                            },
                            { "fundCode" : "AER3",
                              "fundName" : "ACE Rupiah Equity Fund 3",
                              "allocation" : 0
                            },
                            { "fundCode" : "AER4",
                              "fundName" : "ACE Rupiah Equity Fund 4",
                              "allocation" : 0
                            }
                        ],
                        "loadings" : [ { "type" : "amount", "rate": 0 } ]
                    }
                ],
                "topups": [ {year:10, amount:1000000} ],
                "withdrawals" : [ {year:10, amount:900000} ]
               }
}
