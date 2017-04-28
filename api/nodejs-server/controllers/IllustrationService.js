'use strict';

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

