var api = require('product-api');
var _ = require('lodash')
var json = {
     "startDate" : "2017-05-01",
      "insuredList" : [
                    {   "name":"Policyholder",
                        "birthDate":"1990-07-02",
                        "gender":"MALE" ,
                        "smoking" : "NON-SMOKER"
                    }
                ],
                "productList": [ {
                        "productId" : 7001,
                        "productCode" : "UAL14",
                        "productName" : "Union Advantage Plan",
                        "sumAssured" : 50000,
                        "lifeAssuredNumber" : 0,
                        "coverageTermType" : "2",
                        "coverageTermValue" : 20,
                        "paymentMode" : "4"
                    },
                   {
                         "productId": 6202,
                         "productCode": "HCP",
                         "productName": "Hospital Cash Plan",
                        "lifeAssuredNumber" : 0,
                         "benefitLevel": "6"
                    }
               ]
}
var res = api.validate(json, ['validateInput','validateMain', 'r1.validateInput','r1.validateRider'])
var errcount = _.sum( Object.keys(res).map(key => res[key].length) )
if (errcount === 0)
    res = api.calc(json,['premiumAmount','firstYearPremium', 'r1.premiumAmount', 'r1.firstYearPremium']);
console.log("output", res);
