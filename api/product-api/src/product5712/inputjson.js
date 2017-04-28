module.exports = {
    "policy" : {
                "proposalStartDate" : "01-10-2015",
                "payMethod" : "cash",
                "premiumFrequency"  : "1",
                "people" : [
                    {   "name":"Insured",
                        "dob":"12-03-1990",
                        "gender":"male" ,
                        "occupation":"2",
                        "age" : 29
                    },
                    {   "name":"Policyholder",
                        "dob":"12-03-1982",
                        "gender":"male" ,
                        "age" : 33
                    },
                    {   "name":"Spouse",
                        "dob":"12-03-1985",
                        "gender":"female" ,
                        "age" : 30
                    },

                ],
                 "products": [
                    {   "productId" : 5712,
                        "internalId" : "TEND02",
                        "initialSa" : 30000000,
                        "la" : 0,
                        "premiumTerm" : 5
                    }]

               }
}
