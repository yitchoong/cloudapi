module.exports = {
    "policy" : {
                "proposaStartDate" : "01-10-2015",
                "payMethod" : "cash",
                "premiumFrequency"  : "1",
                "people" : [
                    {   "name":"Insured",
                        "dob":"12-03-1986",
                        "gender":"male" ,
                        "jobClass":1,
                        "occupation" : "2",
                    },
                    {   "name":"Policyholder",
                        "dob":"12-03-1982",
                        "gender":"male" ,
                    },
                    {   "name":"Spouse",
                        "dob":"12-03-1985",
                        "gender":"female" ,
                    },

                ],
                 "products": [
                    {   "productId" : 5712,
                        "internalId" : "TEND02",
                        "initialSa" : 150000000,
                        "la" : 0,
                        "premiumTerm" : 10
                    },
                    {   "productId" : 4671,
                        "internalId" : "TADD01",
                        "initialSa" : 300000000,
                        "la" : 0,
                    },

                    ]

               }
}
