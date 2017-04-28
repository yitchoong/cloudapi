module.exports = {
    "policy" : {
                "proposalStartDate" : "01-01-2016",
                "payMethod" : "cash",
                "premiumFrequency"  : "1",
                "people" : [
                    {   "name":"Insured",
                        "dob":"13-12-1982",
                        "gender":"male" ,
                        "jobClass":1,
                        "occupation" : "11",
                        "age" : 33
                    },
                    {   "name":"Policyholder",
                        "dob":"07-07-1980",
                        "gender":"male" ,
                        "jobClass":1,
                        "age" : 35
                    },
                    {   "name":"Spouse",
                        "dob":"13-12-1967",
                        "gender":"female" ,
                        "jobClass":1,
                        "age" : 48
                    },
                ],
                "products": [
                    {   "productId" : 5722,
                        "internalId" : "IFLE03",
                        "targetPremium" : 3000000,
                        "regularTopup" : 5000000,
                        "basicSa" : 250000000,
                        "la" : 0,
                        "premiumTerm" : 10,
                        "funds" : [
                            { "fundCode" : "AER",
                              "fundName" : "ACE Rupiah Equity Fund",
                              "allocation" : 0.25
                            },
                            { "fundCode" : "AER2",
                              "fundName" : "ACE Rupiah Equity Fund 2",
                              "allocation" : 0.25
                            },
                            { "fundCode" : "AER3",
                              "fundName" : "ACE Rupiah Equity Fund 3",
                              "allocation" : 0.25
                            },
                            { "fundCode" : "AER4",
                              "fundName" : "ACE Rupiah Equity Fund 4",
                              "allocation" : 0.25
                            }
                        ],
                        "loadings" : [ { "type" : "amount", "rate": 0.2 }
                        ]
                    },
                    {   "productId" : 5741,
                        "internalId" : "IHSR05",
                        "benefitLevel" : 2,
                        "initialSa" : 800000,
                        "coverageEndAge" : 88,
                        "la" : 0,
                    }


                ],
                "topups": [ {year:10, amount:600000}
                ],
                "withdrawals" : [ {year:10, amount:100000}
                ]

               }
}
