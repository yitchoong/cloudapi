'use strict';

exports.getDetailedPackageList = function(args, res, next) {
  /**
   * Fetch a list of detailed packages (full information).
   * This endpoint returns a list of packages with complete information about the package. There are a number of parameters to help with filtering and sorting of the required prospects. This endpoint differs from GET /packages in that it returns packages with full information instead of just basic information. A use case is when multiple packages are selected for further processing.
   *
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * offset BigDecimal Number of records to skip in the result list (optional)
   * limit BigDecimal Limit the number of rows to return (optional)
   * keys List Specify multiple rows to fetch ?keys=123,456 (optional)
   * sort String Sorting order. Prefix with '-' for descending order (optional)
   * filter List Filter criteria to apply to the search. The format used is filter=condition|condition. The format of the condition is {key}\\*{operator}\\*{value) e.g. filter=name\\*startsWith\\*A. The \\* is used to delimit the components of the criteria. As an example, to find rows with name that starts with 'A', specify as filter=name\\*startsWith\\*A .  When there are multiple criterias in the condition, e.g. find rows where name startsWith A and age greater than 30, specify as filter=name\\*startsWith\\*A;age\\*GT\\*30 . The ; character is used to separate the criterias. For more complex filters, e.g. Find rows where name starts with 'A' OR name starts with B, then it can be specified as filter=name\\*startsWith\\*A|name\\*startsWith\\*B . Use the | to separate OR conditions. (optional)
   * favourite String Specific filter to get the favourite packages for the user (optional)
   * returns inline_response_200_2
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

exports.getPackage = function(args, res, next) {
  /**
   * Fetch a package document document (complete information)
   * Use this end point to fetch a complete package document
   *
   * packageId String Unique id for the package
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns Package
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

exports.getPackageFilterList = function(args, res, next) {
  /**
   * Fetch the list of pre-defined search fields and values for packages.
   * To support the search function on mobile environments, it is easier to provide a list of pre-defined search values for the search fields. These can then be selected instead of using the keyboard to enter the search value. The predefined values are for insurers, product category, and benefit type fields.
   *
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns inline_response_200_3
   **/
  var examples = {};
  examples['application/json'] = {
  "productCategories" : [ {
    "displayOrder" : 1.3579000000000001069366817318950779736042022705078125,
    "categoryName" : "aeiou",
    "categoryId" : "aeiou"
  } ],
  "insurers" : [ {
    "insurerName" : "aeiou",
    "insurerId" : "aeiou"
  } ],
  "benefitTypes" : [ {
    "benefitName" : "aeiou",
    "benefitDesc" : "aeiou",
    "benefitId" : "aeiou"
  } ]
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getPackageList = function(args, res, next) {
  /**
   * Fetch a list of packages (basic information).
   * This endpoint returns a list of packages with basic information about the package. There are a number of parameters to help with filtering and sorting of the required documents.
   *
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * offset BigDecimal Number of records to skip in the result list (optional)
   * limit BigDecimal Limit the number of rows to return (optional)
   * keys List Specify multiple rows to fetch ?keys=123,456 (optional)
   * sort String Sorting order. Prefix with '-' for descending order (optional)
   * filter List Filter criteria to apply to the search. The format used is filter=condition|condition. The format of the condition is {key}\\*{operator}\\*{value) e.g. filter=name\\*startsWith\\*A. The \\* is used to delimit the components of the criteria. As an example, to find rows with name that starts with 'A', specify as filter=name\\*startsWith\\*A .  When there are multiple criterias in the condition, e.g. find rows where name startsWith A and age greater than 30, specify as filter=name\\*startsWith\\*A;age\\*GT\\*30 . The ; character is used to separate the criterias. For more complex filters, e.g. Find rows where name starts with 'A' OR name starts with B, then it can be specified as filter=name\\*startsWith\\*A|name\\*startsWith\\*B . Use the | to separate OR conditions. (optional)
   * favourite String Specific filter to get the favourite packages for the user (optional)
   * returns inline_response_200_1
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
    "examplePremium" : 1.3579000000000001069366817318950779736042022705078125,
    "coveragePeriods" : [ {
      "coverageType" : "aeiou",
      "coverageValue" : 1.3579000000000001069366817318950779736042022705078125
    } ],
    "visitNumber" : 1.3579000000000001069366817318950779736042022705078125,
    "packageId" : "aeiou",
    "isNew" : true,
    "favourite" : true,
    "productCategory" : "aeiou",
    "tagList" : [ {
      "tagId" : "aeiou",
      "tagPic" : "aeiou",
      "tagName" : "aeiou"
    } ],
    "highlights" : [ {
      "highLightId" : "aeiou",
      "displayOrder" : 1.3579000000000001069366817318950779736042022705078125,
      "description" : "aeiou"
    } ],
    "extensionFields" : {
      "key" : {
        "key" : "aeiou"
      }
    },
    "liabilities" : [ {
      "liabDesc" : "aeiou",
      "liabType" : "aeiou",
      "displayOrder" : 1.3579000000000001069366817318950779736042022705078125,
      "liabId" : "aeiou"
    } ],
    "packageName" : "aeiou"
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

exports.initialQuoteData = function(args, res, next) {
  /**
   * Fetch the initial quote data for a given package
   * After viewing the package information, the client application proceeds with the quote based on the package. This endpoint will fetch the initial data for a new quote based on the selected package. Based on the package id, the package main product and riders plus additional available riders are included in the initial data. Additionally, the product parameters for all the products (main and riders) also be included in the initial quote data.
   *
   * packageId String Unique id for the package
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns NewQuote
   **/
  var examples = {};
  examples['application/json'] = {
  "insuranceSpiritList" : [ {
    "spiritName" : "aeiou",
    "spiritId" : "aeiou",
    "defaultSpirit" : "aeiou"
  } ],
  "extensionFields" : {
    "key" : {
      "key" : "aeiou"
    }
  },
  "insurer" : {
    "doctype" : "aeiou",
    "extensionFields" : {
      "key" : "aeiou"
    },
    "logo" : "aeiou",
    "telephone" : "aeiou",
    "pk" : "aeiou",
    "shortName" : "aeiou",
    "insurerName" : "aeiou",
    "url" : "aeiou"
  },
  "packageId" : "aeiou",
  "valueAddedList" : [ {
    "valueAddedDesc" : "aeiou",
    "valueAddedPic" : "aeiou",
    "valueAddedId" : "aeiou",
    "displayOrder" : 1.3579000000000001069366817318950779736042022705078125,
    "valueAddedCode" : "aeiou",
    "valueAddedName" : "aeiou"
  } ],
  "packageName" : "aeiou",
  "suggestedReason" : "aeiou",
  "productList" : [ "" ]
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.removePackageFavourite = function(args, res, next) {
  /**
   * Remove a package as favourite
   * This end point is used to unmark a package as a favourite package. It is linked to the currently authenticated user.
   *
   * packageId String Unique id for the package
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns inline_response_200_4
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

exports.setPackageFavourite = function(args, res, next) {
  /**
   * Set a package as favourite
   * This end point is used to mark a package as a favourite package. It is linked to the currently authenticated user.
   *
   * packageId String Unique id for the package
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns inline_response_200_4
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

