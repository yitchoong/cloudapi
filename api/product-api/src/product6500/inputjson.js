module.exports = {
    
                "startDate" : "2017-05-01",
                "convertToYears" : "Y",
                "insuredList" : [
                    {   "name":"Policyholder",
                        "birthDate":"1980-07-07",
                        "gender":"MALE" ,
                        "smoking" : "NON-SMOKER"
                    }
                ],
                "productList": [
                    {
                        "productId" : 6500,
                        "productCode" : "IN4LINK",
                        "productName" : "TM IN4Link",
                        "sumAssured" : 20000000,
                        "lifeAssuredNumber" : 0,
                        "coverageTermType" : "2",
                        "coverageTermValue" : 20,
                        "currency" : "IDR",
                        "paymentMode" : "1",
                        "targetPremium" : 3500000,
                        "regularTopup"  : 5000000
                    },
                    {
                        "productId" : 6202,
                        "productCode" : "HCP",
                        "productName" : "Hospital Cash Plan",
                        "lifeAssuredNumber": 0,
                        "benefitLevel" : "3"
                        
                    }
                ],
                "fundList" : [
                    { "fundCode" : "TMEQUITY",
                      "fundName" : "TM Equity Fund",
                      "allocation" : 100,
                    }
                ],

                "topupList": [{"year":3, "amount":1000000},
                           {"year":4, "amount":1000000},
                           {"year":5, "amount":1000000},
                           {"year":6, "amount":1000000},
                           {"year":7, "amount":1000000},
                           {"year":8, "amount":1000000},
                           {"year":9, "amount":1000000}
                          ],
                "withdrawalList" : [{"year":7, "amount":3000000}]
    
}