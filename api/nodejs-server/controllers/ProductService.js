'use strict';

const utils = require('./utils');
const api = require('product-api');
const _ = require('lodash');

exports.calculateAdhocFields = function(args, res, next) {
  /**
   * Compute the results for the requested list of illustration fields using the product adhoc calculator and the details of the proposed insurance.
   * Use this end point when the client applications needs fine grain control over which of the illustration fields to trigger the calculation for. The requested list of illustration fields is passed in via the request body parameter. The illustrations field are configured when setting up the product in the eBaoTech product factory.
   *
   * productId String Unique id for the product
   * bodyParam BodyParam The parameter that contains the list of illustration fields and the proposed insurance details i.e. insureds, main product, and riders, topups, withdrawals, and fund allocations
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns ProposedInsurance
   **/
  var examples = {};
  examples['application/json'] = {
  "insuredList" : [ {
    "occupation" : "aeiou",
    "gender" : "aeiou",
    "smoking" : "aeiou",
    "name" : "aeiou",
    "insuredId" : 1.3579000000000001069366817318950779736042022705078125,
    "socialInsuranceIndi" : "aeiou",
    "jobCateId" : 1.3579000000000001069366817318950779736042022705078125,
    "birthDate" : "2000-01-23",
    "age" : 1.3579000000000001069366817318950779736042022705078125
  } ],
  "riderList" : [ "" ],
  "fundList" : [ {
    "adhocPercent" : 1.3579000000000001069366817318950779736042022705078125,
    "fundCode" : "aeiou",
    "regularTopupPercent" : 1.3579000000000001069366817318950779736042022705078125,
    "fundName" : "aeiou",
    "targetPremiumPercent" : 1.3579000000000001069366817318950779736042022705078125
  } ],
  "withdrawalList" : [ {
    "amount" : 1.3579000000000001069366817318950779736042022705078125,
    "year" : 1.3579000000000001069366817318950779736042022705078125
  } ],
  "topupList" : [ {
    "amount" : 1.3579000000000001069366817318950779736042022705078125,
    "year" : 1.3579000000000001069366817318950779736042022705078125
  } ],
  "lastModified" : "2000-01-23",
  "mainProduct" : {
    "premiumAmount" : 1.3579000000000001069366817318950779736042022705078125,
    "lifeAssuredNumber" : 123,
    "productName" : "aeiou",
    "saUnit" : 1.3579000000000001069366817318950779736042022705078125,
    "illustrationFields" : {
      "0" : { },
      "99" : "",
      "1" : "",
      "2" : ""
    },
    "sumAssured" : 1.3579000000000001069366817318950779736042022705078125,
    "coverageEndAge" : 1.3579000000000001069366817318950779736042022705078125,
    "premiumTermEndAge" : 1.3579000000000001069366817318950779736042022705078125,
    "extensionFields" : {
      "key" : "aeiou"
    },
    "benefitPlan" : "aeiou",
    "currency" : "aeiou",
    "monthlyCostOfInsurance" : 1.3579000000000001069366817318950779736042022705078125,
    "targetPremium" : 1.3579000000000001069366817318950779736042022705078125,
    "premiumPaymentTermValue" : 1.3579000000000001069366817318950779736042022705078125,
    "premiumPaymentTermType" : "aeiou",
    "firstYearPremium" : 1.3579000000000001069366817318950779736042022705078125,
    "productId" : "aeiou",
    "paymentMode" : "aeiou",
    "coverageTermValue" : 1.3579000000000001069366817318950779736042022705078125,
    "packageId" : "aeiou",
    "benefitLevel" : "aeiou",
    "commencementDate" : "2000-01-23",
    "productCode" : "aeiou",
    "regularTopup" : 1.3579000000000001069366817318950779736042022705078125,
    "coverageTermType" : "aeiou"
  },
  "userName" : "aeiou",
  "version" : 1.3579000000000001069366817318950779736042022705078125,
  "startDate" : "2000-01-23",
  "status" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.calculateAge = function(args, res, next) {
  /**
   * Calculate the age given the product id and birth date
   * Use this end point to calculate the age. The product id is used to determine the age method which will affect the calculation of the age. Pass in the birth date (YYYY-MM-DD) as a query parameter e.g. GET /products/5212/calculators/age?birthDate=1978-06-22
   *
   * productId String Unique id for the product
   * birthDate String The birth date in YYYY-MM-DD format
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns inline_response_200_8
   **/
  var examples = {};
  examples['application/json'] = {
  "age" : 1.3579000000000001069366817318950779736042022705078125
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.calculateIllustrationFields = function(args, res, next) {
  /**
   * Compute the results of the product illustration calculator using the details of the proposed insurance.
   * Use this end point to trigger the calculation of the fields required for the illustration. The illustrations field are configured when setting up the product in the eBaoTech product factory. The table of benefits is also available in the response.
   *
   * productId String Unique id for the product
   * bodyParam ProposedInsurance Proposed insurance details required to calculate the illustration fields, i.e. insureds, main product, and riders, topups, withdrawals, fund allocations
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns inline_response_200_9
   **/
  var examples = {};
  examples['application/json'] = {
  "proposedInsurance" : {
    "insuredList" : [ {
      "occupation" : "aeiou",
      "gender" : "aeiou",
      "smoking" : "aeiou",
      "name" : "aeiou",
      "insuredId" : 1.3579000000000001069366817318950779736042022705078125,
      "socialInsuranceIndi" : "aeiou",
      "jobCateId" : 1.3579000000000001069366817318950779736042022705078125,
      "birthDate" : "2000-01-23",
      "age" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "riderList" : [ "" ],
    "fundList" : [ {
      "adhocPercent" : 1.3579000000000001069366817318950779736042022705078125,
      "fundCode" : "aeiou",
      "regularTopupPercent" : 1.3579000000000001069366817318950779736042022705078125,
      "fundName" : "aeiou",
      "targetPremiumPercent" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "withdrawalList" : [ {
      "amount" : 1.3579000000000001069366817318950779736042022705078125,
      "year" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "topupList" : [ {
      "amount" : 1.3579000000000001069366817318950779736042022705078125,
      "year" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "lastModified" : "2000-01-23",
    "mainProduct" : {
      "premiumAmount" : 1.3579000000000001069366817318950779736042022705078125,
      "lifeAssuredNumber" : 123,
      "productName" : "aeiou",
      "saUnit" : 1.3579000000000001069366817318950779736042022705078125,
      "illustrationFields" : {
        "0" : { },
        "99" : "",
        "1" : "",
        "2" : ""
      },
      "sumAssured" : 1.3579000000000001069366817318950779736042022705078125,
      "coverageEndAge" : 1.3579000000000001069366817318950779736042022705078125,
      "premiumTermEndAge" : 1.3579000000000001069366817318950779736042022705078125,
      "extensionFields" : {
        "key" : "aeiou"
      },
      "benefitPlan" : "aeiou",
      "currency" : "aeiou",
      "monthlyCostOfInsurance" : 1.3579000000000001069366817318950779736042022705078125,
      "targetPremium" : 1.3579000000000001069366817318950779736042022705078125,
      "premiumPaymentTermValue" : 1.3579000000000001069366817318950779736042022705078125,
      "premiumPaymentTermType" : "aeiou",
      "firstYearPremium" : 1.3579000000000001069366817318950779736042022705078125,
      "productId" : "aeiou",
      "paymentMode" : "aeiou",
      "coverageTermValue" : 1.3579000000000001069366817318950779736042022705078125,
      "packageId" : "aeiou",
      "benefitLevel" : "aeiou",
      "commencementDate" : "2000-01-23",
      "productCode" : "aeiou",
      "regularTopup" : 1.3579000000000001069366817318950779736042022705078125,
      "coverageTermType" : "aeiou"
    },
    "userName" : "aeiou",
    "version" : 1.3579000000000001069366817318950779736042022705078125,
    "startDate" : "2000-01-23",
    "status" : "aeiou"
  },
  "tableOfBenefits" : {
    "columnTitles" : [ {
      "columnNo" : 123,
      "columnTitle" : "aeiou"
    } ],
    "tableData" : [ {
      "columnNo" : 123,
      "value" : 1.3579000000000001069366817318950779736042022705078125
    } ]
  }
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.calculateProductCostOnInsurance = function(args, res, next) {
  /**
   * Compute the results of the product's cost of insurance calculator using the details of the proposed insurance.
   * Use this end point to trigger the calculation of the monthly cost of insurance for all the products in the proposed insurance parameter. The proposed insurance details must include the proposed life assured. The monthly cost of insurance is applicable only to investment products.
   *
   * productId String Unique id for the product
   * proposedInsurance ProposedInsurance Proposed insurance details required to calculate the cost of insurance, i.e. insureds, main product, and riders
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns ProposedInsurance
   **/
  var examples = {};
  examples['application/json'] = {
  "insuredList" : [ {
    "occupation" : "aeiou",
    "gender" : "aeiou",
    "smoking" : "aeiou",
    "name" : "aeiou",
    "insuredId" : 1.3579000000000001069366817318950779736042022705078125,
    "socialInsuranceIndi" : "aeiou",
    "jobCateId" : 1.3579000000000001069366817318950779736042022705078125,
    "birthDate" : "2000-01-23",
    "age" : 1.3579000000000001069366817318950779736042022705078125
  } ],
  "riderList" : [ "" ],
  "fundList" : [ {
    "adhocPercent" : 1.3579000000000001069366817318950779736042022705078125,
    "fundCode" : "aeiou",
    "regularTopupPercent" : 1.3579000000000001069366817318950779736042022705078125,
    "fundName" : "aeiou",
    "targetPremiumPercent" : 1.3579000000000001069366817318950779736042022705078125
  } ],
  "withdrawalList" : [ {
    "amount" : 1.3579000000000001069366817318950779736042022705078125,
    "year" : 1.3579000000000001069366817318950779736042022705078125
  } ],
  "topupList" : [ {
    "amount" : 1.3579000000000001069366817318950779736042022705078125,
    "year" : 1.3579000000000001069366817318950779736042022705078125
  } ],
  "lastModified" : "2000-01-23",
  "mainProduct" : {
    "premiumAmount" : 1.3579000000000001069366817318950779736042022705078125,
    "lifeAssuredNumber" : 123,
    "productName" : "aeiou",
    "saUnit" : 1.3579000000000001069366817318950779736042022705078125,
    "illustrationFields" : {
      "0" : { },
      "99" : "",
      "1" : "",
      "2" : ""
    },
    "sumAssured" : 1.3579000000000001069366817318950779736042022705078125,
    "coverageEndAge" : 1.3579000000000001069366817318950779736042022705078125,
    "premiumTermEndAge" : 1.3579000000000001069366817318950779736042022705078125,
    "extensionFields" : {
      "key" : "aeiou"
    },
    "benefitPlan" : "aeiou",
    "currency" : "aeiou",
    "monthlyCostOfInsurance" : 1.3579000000000001069366817318950779736042022705078125,
    "targetPremium" : 1.3579000000000001069366817318950779736042022705078125,
    "premiumPaymentTermValue" : 1.3579000000000001069366817318950779736042022705078125,
    "premiumPaymentTermType" : "aeiou",
    "firstYearPremium" : 1.3579000000000001069366817318950779736042022705078125,
    "productId" : "aeiou",
    "paymentMode" : "aeiou",
    "coverageTermValue" : 1.3579000000000001069366817318950779736042022705078125,
    "packageId" : "aeiou",
    "benefitLevel" : "aeiou",
    "commencementDate" : "2000-01-23",
    "productCode" : "aeiou",
    "regularTopup" : 1.3579000000000001069366817318950779736042022705078125,
    "coverageTermType" : "aeiou"
  },
  "userName" : "aeiou",
  "version" : 1.3579000000000001069366817318950779736042022705078125,
  "startDate" : "2000-01-23",
  "status" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.calculateProductPremium = function(args, res, next) {
  /**
   * Compute the results of the product premium calculator using the details of the proposed insurance.
   * Use this end point to trigger the calculation of the premium for all the products (main and riders) in the proposed insurance. The proposed insurance details must include the proposed life assured.
   *
   * productId String Unique id for the product
   * bodyParam ProposedInsurance Proposed insurance details required to calculate the premium, i.e. insureds, main product, and riders input
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns ProposedInsurance
   **/
   // get the parameters
  //  let insurance = args.bodyParam.value;
  //  let pid = args.productid.value;
   //console.log("args", args.productId.value, args.bodyParam.value);
   res.setHeader('Content-Type', 'application/json');
  //  res.end(JSON.stringify({result:'ok'}))
  //  return

   let json = args.bodyParam.value;
   let pid = args.productId.value;
   let errors = [];
   // prepare the data to call the product engine
   let fields = [];
   if (json.productList && json.productList.length > 0 ) {
     json.productList.forEach( (p,idx) => {
       if (idx === 0) {
         fields.push("validateInput");
         fields.push("validateMain");
       } else {
         fields.push( "r" + idx + ".validateInput");
         fields.push( "r" + idx + ".validateRider");
       }
     })
   } else {
     res.statusCode = 400;
     errors.push({field:"bodyParam", code:"NO_PRODUCT", message: "There are no products specified"})
     return
   }
   let result = api.validate(json, fields );
   let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
   if (errCount === 0) {
     result = api.calc(json, ['premium', 'firstYearPremium']);
     res.end(JSON.stringify(result));
   } else {
     res.statusCode = 400;
     Object.keys(result).forEach((errkey) => {
       result[errkey].forEach((msg) => {
         let parts = errkey.split(".");
         let fname = parts.length === 1 ? "Main Product" : "Rider - " + parts[0].substring(1);
         errors.push({field: fname, code: "VALIDATION_ERROR", message: msg});
       })
     })
     res.end(JSON.stringify({ errors: errors}), null, 2);
   }

//   var examples = {};
//   examples['application/json'] = {
//   "insuredList" : [ {
//     "occupation" : "aeiou",
//     "gender" : "aeiou",
//     "smoking" : "aeiou",
//     "name" : "aeiou",
//     "insuredId" : 1.3579000000000001069366817318950779736042022705078125,
//     "socialInsuranceIndi" : "aeiou",
//     "jobCateId" : 1.3579000000000001069366817318950779736042022705078125,
//     "birthDate" : "2000-01-23",
//     "age" : 1.3579000000000001069366817318950779736042022705078125
//   } ],
//   "riderList" : [ "" ],
//   "fundList" : [ {
//     "adhocPercent" : 1.3579000000000001069366817318950779736042022705078125,
//     "fundCode" : "aeiou",
//     "regularTopupPercent" : 1.3579000000000001069366817318950779736042022705078125,
//     "fundName" : "aeiou",
//     "targetPremiumPercent" : 1.3579000000000001069366817318950779736042022705078125
//   } ],
//   "withdrawalList" : [ {
//     "amount" : 1.3579000000000001069366817318950779736042022705078125,
//     "year" : 1.3579000000000001069366817318950779736042022705078125
//   } ],
//   "topupList" : [ {
//     "amount" : 1.3579000000000001069366817318950779736042022705078125,
//     "year" : 1.3579000000000001069366817318950779736042022705078125
//   } ],
//   "lastModified" : "2000-01-23",
//   "mainProduct" : {
//     "premiumAmount" : 1.3579000000000001069366817318950779736042022705078125,
//     "lifeAssuredNumber" : 123,
//     "productName" : "aeiou",
//     "saUnit" : 1.3579000000000001069366817318950779736042022705078125,
//     "illustrationFields" : {
//       "0" : { },
//       "99" : "",
//       "1" : "",
//       "2" : ""
//     },
//     "sumAssured" : 1.3579000000000001069366817318950779736042022705078125,
//     "coverageEndAge" : 1.3579000000000001069366817318950779736042022705078125,
//     "premiumTermEndAge" : 1.3579000000000001069366817318950779736042022705078125,
//     "extensionFields" : {
//       "key" : "aeiou"
//     },
//     "benefitPlan" : "aeiou",
//     "currency" : "aeiou",
//     "monthlyCostOfInsurance" : 1.3579000000000001069366817318950779736042022705078125,
//     "targetPremium" : 1.3579000000000001069366817318950779736042022705078125,
//     "premiumPaymentTermValue" : 1.3579000000000001069366817318950779736042022705078125,
//     "premiumPaymentTermType" : "aeiou",
//     "firstYearPremium" : 1.3579000000000001069366817318950779736042022705078125,
//     "productId" : "aeiou",
//     "paymentMode" : "aeiou",
//     "coverageTermValue" : 1.3579000000000001069366817318950779736042022705078125,
//     "packageId" : "aeiou",
//     "benefitLevel" : "aeiou",
//     "commencementDate" : "2000-01-23",
//     "productCode" : "aeiou",
//     "regularTopup" : 1.3579000000000001069366817318950779736042022705078125,
//     "coverageTermType" : "aeiou"
//   },
//   "userName" : "aeiou",
//   "version" : 1.3579000000000001069366817318950779736042022705078125,
//   "startDate" : "2000-01-23",
//   "status" : "aeiou"
// };
//   if (Object.keys(examples).length > 0) {
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
//   } else {
//     res.end();
//   }
}

exports.generateProductIllustration = function(args, res, next) {
  /**
   * Generate the illustration (plan) data.
   * This end point is used to generate all the data that is required for presentation the ilustration (plan) to the customer. It differs from /products/{productId}/calculators/illustration as it includes the static product information (writeups) about the products in the plan.
   *
   * productId String Unique id for the product
   * bodyParam ProposedInsurance Details of the proposed insurance including the life assureds, main product details and riders already attached
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns inline_response_200_7
   **/
  var examples = {};
  examples['application/json'] = {
  "proposedInsurance" : {
    "insuredList" : [ {
      "occupation" : "aeiou",
      "gender" : "aeiou",
      "smoking" : "aeiou",
      "name" : "aeiou",
      "insuredId" : 1.3579000000000001069366817318950779736042022705078125,
      "socialInsuranceIndi" : "aeiou",
      "jobCateId" : 1.3579000000000001069366817318950779736042022705078125,
      "birthDate" : "2000-01-23",
      "age" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "riderList" : [ "" ],
    "fundList" : [ {
      "adhocPercent" : 1.3579000000000001069366817318950779736042022705078125,
      "fundCode" : "aeiou",
      "regularTopupPercent" : 1.3579000000000001069366817318950779736042022705078125,
      "fundName" : "aeiou",
      "targetPremiumPercent" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "withdrawalList" : [ {
      "amount" : 1.3579000000000001069366817318950779736042022705078125,
      "year" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "topupList" : [ {
      "amount" : 1.3579000000000001069366817318950779736042022705078125,
      "year" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "lastModified" : "2000-01-23",
    "mainProduct" : {
      "premiumAmount" : 1.3579000000000001069366817318950779736042022705078125,
      "lifeAssuredNumber" : 123,
      "productName" : "aeiou",
      "saUnit" : 1.3579000000000001069366817318950779736042022705078125,
      "illustrationFields" : {
        "0" : { },
        "99" : "",
        "1" : "",
        "2" : ""
      },
      "sumAssured" : 1.3579000000000001069366817318950779736042022705078125,
      "coverageEndAge" : 1.3579000000000001069366817318950779736042022705078125,
      "premiumTermEndAge" : 1.3579000000000001069366817318950779736042022705078125,
      "extensionFields" : {
        "key" : "aeiou"
      },
      "benefitPlan" : "aeiou",
      "currency" : "aeiou",
      "monthlyCostOfInsurance" : 1.3579000000000001069366817318950779736042022705078125,
      "targetPremium" : 1.3579000000000001069366817318950779736042022705078125,
      "premiumPaymentTermValue" : 1.3579000000000001069366817318950779736042022705078125,
      "premiumPaymentTermType" : "aeiou",
      "firstYearPremium" : 1.3579000000000001069366817318950779736042022705078125,
      "productId" : "aeiou",
      "paymentMode" : "aeiou",
      "coverageTermValue" : 1.3579000000000001069366817318950779736042022705078125,
      "packageId" : "aeiou",
      "benefitLevel" : "aeiou",
      "commencementDate" : "2000-01-23",
      "productCode" : "aeiou",
      "regularTopup" : 1.3579000000000001069366817318950779736042022705078125,
      "coverageTermType" : "aeiou"
    },
    "userName" : "aeiou",
    "version" : 1.3579000000000001069366817318950779736042022705078125,
    "startDate" : "2000-01-23",
    "status" : "aeiou"
  },
  "planInfo" : {
    "planFeatures" : [ "" ],
    "planValueAddedList" : [ {
      "valueAddedDesc" : "aeiou",
      "valueAddedPic" : "aeiou",
      "valueAddedId" : "aeiou",
      "displayOrder" : 1.3579000000000001069366817318950779736042022705078125,
      "valueAddedCode" : "aeiou",
      "valueAddedName" : "aeiou"
    } ],
    "planHighlights" : [ "" ],
    "planLiability" : {
      "liabCategoryList" : [ {
        "categoryName" : "aeiou",
        "simpleLiabList" : [ {
          "liabList" : "aeiou",
          "productid" : "aeiou",
          "libDesc" : "aeiou",
          "packageId" : "aeiou",
          "libCalcType" : "aeiou",
          "liabDisplayName" : "aeiou",
          "needDiseaseIndi" : "aeiou",
          "categoryName" : "aeiou",
          "libDescQuote" : "aeiou",
          "totalAmount" : 1.3579000000000001069366817318950779736042022705078125,
          "libCalcMethod" : "aeiou",
          "liabName" : "aeiou",
          "liabAmount" : 1.3579000000000001069366817318950779736042022705078125,
          "liabId" : "aeiou"
        } ],
        "categoryId" : "aeiou"
      } ],
      "multiProduct" : true
    }
  },
  "tableOfBenefits" : {
    "columnTitles" : [ {
      "columnNo" : 123,
      "columnTitle" : "aeiou"
    } ],
    "tableData" : [ {
      "columnNo" : 123,
      "value" : 1.3579000000000001069366817318950779736042022705078125
    } ]
  }
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getAttachableRiders = function(args, res, next) {
  /**
   * Fetch the list of attachable riders for the given main product and currently attached riders.
   * This end point is typically used to generate a list of attachable riders that will be presented as a drop down list in the client application UI. Apart from the main product id, the list of riders that are already attached is also a factor in determining the remaining attachable riders. These can be mutually exclusive riders e.g. \"Waiver Plus\" rider can no longer be attached if the \"Waiver Premium\" rider is already attached.
   *
   * productId String Unique id for the product
   * bodyParam ProposedInsurance Details of the proposed insurance including the life assureds, main product details and riders already attached
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ "" ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getDetailedProductList = function(args, res, next) {
  /**
   * Fetch a list of product (full information)
   * Use this endpoint to get a list of products with their complete information. This end point is similar to GET /products with the exception that the complete product information is returned.
   *
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * offset BigDecimal Number of records to skip in the result list (optional)
   * keys List Specify multiple rows to fetch ?keys=123,456 (optional)
   * limit BigDecimal Limit the number of rows to return (optional)
   * sort String Sorting order. Prefix with '-' for descending order (optional)
   * productType String Filter products based  on the product type i.e. Main or Rider (optional)
   * insurerIds List Filter products that belong to the list of insurers e.g. insurerIds=001,002 (optional)
   * birthDate String Filter products where the calculated age (using the birth date) is within the minimum and maximum age limit. (optional)
   * gender String Filter products which are targeted at specific products. Male or Female (optional)
   * returns inline_response_200_6
   **/
  var examples = {};
  examples['application/json'] = {
  "docs" : [ "" ],
  "offset" : 123,
  "totalDocs" : 123
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getIllustrationCalculatorFields = function(args, res, next) {
  /**
   * Fetch the list of illustration calculator fields for the product
   * This end point should be used at design time to obtain a list of the illustration fields that have been configured for the product. This list can be useful when the client wants to have fine-grain control over which of the illustration fields calculation should be triggered (POST /products/{productId}/calculators/adhoc)
   *
   * productId String Unique id for the product
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ {
  "fieldName" : "aeiou",
  "description" : "aeiou"
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getPackageProduct = function(args, res, next) {
  /**
   * Fetch a package product document
   * Packages will contain main product and rider products. Use this end point when the client wants to fetch additional information about a package-product (main or rider product) document. The document contains mainly textual information to explain the features of the package product.
   *
   * packageId String Unique id for the package
   * productId String Unique id for the product
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns PackageProduct
   **/
  var examples = {};
  examples['application/json'] = "";
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getProduct = function(args, res, next) {
  /**
   * Fetch a product document.
   * This end point can be used to fetch the detailed product information. It will include all the product parameters, including the limits. Additionally, the available values for coverage terms, premium payment terms, payment methods are also be included in the product document.
   *
   * productId String Unique id for the product
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns Product
   **/
  var examples = {};
  examples['application/json'] = "";
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getProductIllustrationTemplate = function(args, res, next) {
  /**
   * Fetch the illustration template for the product
   * This end point should be used at design time as it provides an html template on the illustration for the given product. It typically would contain static and dynamic elements. It is meant to provide a sample of how the illustration output should look like and also where the dynamic elements (fields) are on the template. The data for dynamic elements can be fullfilled by the /products/{productId}/illustration end point. The actual output of the illustration can be implemented in any format and it is the decision of the front end application.
   *
   * productId String Unique id for the product
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns inline_response_200_10
   **/
  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getProductList = function(args, res, next) {
  /**
   * Fetch a list of products
   * Use this endpoint to get a list of available main products given company id and birth date of the insured. The company id and birth date can optionally be supplied to filter the list of available main products. The authenticated user will be used to determine the channel that the intermediary belongs to. The channel is then used to filter the list of available products as well. The company id and the insured's birth date is optional as some client applications allow the user to select the product before determining the client.
   *
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * offset BigDecimal Number of records to skip in the result list (optional)
   * limit BigDecimal Limit the number of rows to return (optional)
   * sort String Sorting order. Prefix with '-' for descending order (optional)
   * productType String Filter products based  on the product type i.e. Main or Rider (optional)
   * insurerIds List Filter products that belong to the list of insurers e.g. insurerIds=001,002 (optional)
   * birthDate String Filter products where the calculated age (using the birth date) is within the minimum and maximum age limit. (optional)
   * gender String Filter products which are targeted at specific products. Male or Female (optional)
   * returns inline_response_200_5
   **/
  var examples = {};
  examples['application/json'] = {
  "docs" : [ {
    "ageRange" : {
      "maxAge" : 1.3579000000000001069366817318950779736042022705078125,
      "minAgeUnit" : "aeiou",
      "minAge" : 1.3579000000000001069366817318950779736042022705078125,
      "maxAgeUnit" : "aeiou"
    },
    "jobIndi" : "aeiou",
    "pointToPh" : "aeiou",
    "smokingIndi" : "aeiou",
    "productName" : "aeiou",
    "ageLimitList" : [ {
      "paymentTermType" : "aeiou",
      "maxPolicyHolderAge" : 1.3579000000000001069366817318950779736042022705078125,
      "gender" : "aeiou",
      "maxInsuredAge" : 1.3579000000000001069366817318950779736042022705078125,
      "coverageTermValue" : 1.3579000000000001069366817318950779736042022705078125,
      "minPolicyholderAge" : 1.3579000000000001069366817318950779736042022705078125,
      "premiumTermType" : "aeiou",
      "benefitLevel" : "aeiou",
      "premiumTermValue" : 1.3579000000000001069366817318950779736042022705078125,
      "minInsuredAge" : 1.3579000000000001069366817318950779736042022705078125,
      "coverageTermType" : "aeiou",
      "paymentTermValue" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "pointToSpouse" : "aeiou",
    "isPackageProduct" : "aeiou",
    "inputFields" : [ {
      "fieldName" : "aeiou",
      "dataType" : "aeiou"
    } ],
    "attachCompulsory" : "aeiou",
    "benefitLevelList" : [ {
      "levelDesc" : "aeiou",
      "benefitLevel" : "aeiou"
    } ],
    "insType" : "aeiou",
    "unitFlag" : "aeiou",
    "pointToSecInsured" : "aeiou",
    "displayPremiumIndi" : "aeiou",
    "isWaiver" : "aeiou",
    "liabilityList" : [ {
      "liabName" : "aeiou",
      "liabDesc" : "aeiou",
      "liabType" : "aeiou",
      "displayOrder" : 1.3579000000000001069366817318950779736042022705078125,
      "liabId" : "aeiou",
      "ifDisplayInIllustration" : "aeiou"
    } ],
    "isAnnuityProduct" : "aeiou",
    "insurerId" : "aeiou",
    "doctype" : "aeiou",
    "saEqual" : "aeiou",
    "productCode" : "aeiou",
    "sumAssuredLimitList" : [ {
      "minAmount" : 1.3579000000000001069366817318950779736042022705078125,
      "maxAge" : 1.3579000000000001069366817318950779736042022705078125,
      "minAge" : 1.3579000000000001069366817318950779736042022705078125,
      "currencyId" : "aeiou",
      "maxAmount" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "socialInsureIndi" : "aeiou",
    "pk" : "aeiou",
    "premiumLimitList" : [ {
      "maxInitialPremium" : 1.3579000000000001069366817318950779736042022705078125,
      "maxAge" : 1.3579000000000001069366817318950779736042022705078125,
      "minAge" : 1.3579000000000001069366817318950779736042022705078125,
      "minInitialPremium" : 1.3579000000000001069366817318950779736042022705078125,
      "premiumTermType" : "aeiou",
      "premiumTermValue" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "displayMonthlyCoi" : "aeiou"
  } ],
  "offset" : 123,
  "totalDocs" : 123
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getProductValidators = function(args, res, next) {
  /**
   * Fetch the list of available validators for the product
   * This end point is expected to be used at design time. It can be used to get a listing of the available validators for the product. This is useful when the client application requires fine grain control over the triggering of the various validators. Triggering of the specific validators can be done using the /products/{productId}/validators/adhoc end point.
   *
   * productId String Unique id for the product
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ {
  "fieldName" : "aeiou",
  "description" : "aeiou"
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.validateAdhocProductValidators = function(args, res, next) {
  /**
   * Generate the results for the requested list of validators using the adhoc validator and the details of the proposed insurance submitted in the body paramater.
   * Use this end point to trigger specific validators when the client application requires fine grain control over the validation. The list of validators to trigger must be in the request details as part of the body parameter. An an example, this endpoint can be used to validate the topups and withdrawals, which may be on the same page of the client application e.g. validatorList= [\"validateTopups\", \"validateWithdrawals\"]
   *
   * productId String Unique id for the product
   * bodyParam BodyParam_2 An object containing the validator list and the proposed insurance details, minimally with the insureds, and main product information
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns ValidatorSuccessResult
   **/
  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.validateMainProduct = function(args, res, next) {
  /**
   * Trigger the validateMain validator to check the main product in the proposed insurance details.
   * Use this end point to validate the main product details. Typically in the front end client application, the main product details are captured in its own page (section). This end point can be called to validate the input of the main product when the client application navigates away from the page (section).
   *
   * productId String Unique id for the product
   * bodyParam ProposedInsurance The proposed insurance details, minimally with the insureds and main product input
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns ValidatorSuccessResult
   **/
  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.validateProductFunds = function(args, res, next) {
  /**
   * Trigger the validateFunds validator to check the fund allocations in the proposed insurance details in the body parameter.
   * Use this end point to validate all the fund allocations using the proposed insurance details supplied in the request body. Input of fund allocations are required for investment proposals. Validation include minimum allocation (e.g. min of 10%) and allowed quantums (e.g. allocations must be multiples of 5%)
   *
   * productId String Unique id for the product
   * bodyParam ProposedInsurance The proposed insurance details, minimally with the insureds, main product, and fund allocation information
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns ValidatorSuccessResult
   **/
  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.validateProductInsured = function(args, res, next) {
  /**
   * Validate the eligibility of life assured to purchase the product.
   * This end point is used in certain scenarios, where the product is selected and then followed by the selection of the life assured. Where the life assured is selected first, the available list of products will have been filter for their age and gender requirements. The validateInsured validator will check that the age and gender requirements for the product are met.
   *
   * productId String Unique id for the product
   * bodyParam BodyParam_1 An object that holds the details of the insured person
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns Product
   **/
  var examples = {};
  examples['application/json'] = "";
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.validateProductRiders = function(args, res, next) {
  /**
   * Trigger the validateRiders validator to check the riders input in the proposed insurance details.
   * Use this end point to validate all the riders attached to the main product for the proposed insurance details supplied in the request body. Checks typically include the minimum and maximum coverage amounts, the age limits of the insured, etc. Typically used when navigating away from the page (section) which captures the riders input.
   *
   * productId String Unique id for the product
   * bodyParam ProposedInsurance The proposed insurance details, minimally with the insureds, main product, and riders information
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns ValidatorSuccessResult
   **/
  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.validateProductTopups = function(args, res, next) {
  /**
   * Trigger the validateTopups validator to check the top-up values in the proposed insurance details.
   * Use this end point to validate all the topups in the proposed insurance details supplied in the request body. Input of topups are only required for investment policies.
   *
   * productId String Unique id for the product
   * bodyParam ProposedInsurance The proposed insurance details, minimally with the insureds, main product, and topups information
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns ValidatorSuccessResult
   **/
  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.validateProductWithdrawals = function(args, res, next) {
  /**
   * Trigger the validateWithdrawals validator to check the withdrawals in the proposed insurance details.
   * Use this end point to validate all the withdrawals using the proposed insurance details supplied in the request body. Input of withdrawals are only required for investment policies. Validation include minimum withdrawal amounts and whether the year of the withdrawals are allowed (e.g. withdrawals may not be allowed in the initial 5 years)
   *
   * productId String Unique id for the product
   * bodyParam ProposedInsurance The proposed insurance details, minimally with the insureds, main product, and withdrawals information
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns ValidatorSuccessResult
   **/
  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}
