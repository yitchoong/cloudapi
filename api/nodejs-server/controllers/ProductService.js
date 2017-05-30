'use strict';

const api = require('product-api');
const _ = require('lodash');
const __ = require('../i18n');
const utils = require('./utils');
var fs = require('fs')

const send404 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 404;
    res.end(msg);
}
const send400 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 400;
    res.end(msg);
}

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
   res.setHeader('Content-Type', 'application/json');
   let json = args.bodyParam.value;
   let proposedInsurance = json.proposedInsurance;
   let illustrationFields = json.illustrationFields || []
   let pid = args.productId.value;

   if (illustrationFields.length === 0 || !proposedInsurance ) {
      return send400(res, next , __("Either the illustration fields are empty or the proposedInsurance is not set"))
   }

   let errors = [];
   // prepare the data to call the product engine
   let fields = [];
   if (proposedInsurance.productList && proposedInsurance.productList.length > 0 ) {
     proposedInsurance.productList.forEach( (p,idx) => {
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
   let productData = api.productInfo(pid)
   let good = false
   if (productData && productData.benefitType === '41')  {

     good = proposedInsurance.fundList && proposedInsurance.fundList.length > 0 ? true : false
   }
  //  console.log("benefitType", productData.benefitType, productData.productId, productData.productName, good)
   if (!good) {
     return send400(res, next, JSON.stringify({error: __('The fund list must be provided for investment products') }) ) ;
   }
   let result = api.validate(proposedInsurance, fields );
   let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
   if (errCount === 0) {

     result = api.calc(proposedInsurance, [], illustrationFields);
     let requestedFields = illustrationFields.map(f => f.indexOf('.') < 0 ? f : f.split('.')[1] )
     let output = {}, policyFields = {}, mainFields = {}

     Object.keys(result).forEach(key => {

         if ( requestedFields.indexOf(key) >= 0 ) {
           // policy level fields -- will be attached to the main product
           policyFields[key] = result[key]
         } else if (key !== "productList") {
              output[key] = result[key]
         } else {
              let plist = [];
              result.productList.forEach(prd => {
                let illustrationFields = {}
                let prod = {}
                Object.keys(prd).filter(k => requestedFields.indexOf(k) < 0 ).forEach(k => prod[k] = prd[k])
                requestedFields.forEach(f => {
                  if (f in prd) illustrationFields[f] = prd[f]
                })
                prod.illustrationFields = illustrationFields
                plist.push(prod)
              })
              output.productList = plist;
         }
     })
     // for the policy level fields, add it back to the main product
     let mainProduct = output.productList[0];
     Object.keys(policyFields).forEach(fname => {mainProduct[fname] = policyFields[fname]})
     res.end(JSON.stringify(output));
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
   let productId = args.productId.value;
   let birthDate = args.birthDate.value;
   let result = api.calcAge4Product(birthDate,productId)
   console.log("result", birthDate, result)
   if (!result) return send400(res, next, JSON.stringify({error: __('Unable to calculate the age. Birth date must be in YYYY-MM-DD format') }) ) ;
   res.setHeader('Content-Type', 'application/json');
   res.end(JSON.stringify({age:result}, null, 2));
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
   res.setHeader('Content-Type', 'application/json');
   let json = args.bodyParam.value;
   let proposedInsurance = json
   let illustrationFields = []
   let pid = args.productId.value;

   if (!proposedInsurance ) {
      return send400(res, next , __("The proposedInsurance is not set in the bodyParam"))
   }

   let errors = [];
   // prepare the data to call the product engine
   let fields = [];
   if (proposedInsurance.productList && proposedInsurance.productList.length > 0 ) {
     proposedInsurance.productList.forEach( (p,idx) => {
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
   let productData = api.productInfo(pid)
   let config = api.getConfig(pid)
   illustrationFields = config.illustrationFields || []
   if (illustrationFields.length === 0) {
      return send400(res, next , __("The illustration fields for the product has not been configured"))
   }
   let good = false
   if (productData && productData.benefitType === '41')  {
     good = proposedInsurance.fundList && proposedInsurance.fundList.length > 0 ? true : false
   }
   if (!good) {
     return send400(res, next, JSON.stringify({error: __('The fund list must be provided for investment products') }) ) ;
   }
   let result = api.validate(proposedInsurance, fields );
   let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
   if (errCount === 0) {

     result = api.calc(proposedInsurance, [], illustrationFields);
     let requestedFields = illustrationFields.map(f => f.indexOf('.') < 0 ? f : f.split('.')[1] )
     let benefitsTable = {columnTitles:[], tableData: [] }
     config.illustrationColNames.forEach( (col, indx) =>  {benefitsTable.columnTitles.push( {columnNo: indx+1, columnTitle: col}) })
     let output = {}, policyFields = {}, mainFields = {}

     // remove the requested fields from the result
     Object.keys(result).forEach(key => {

         if ( requestedFields.indexOf(key) >= 0 ) {
           // policy level fields -- will be attached to the main product
           policyFields[key] = result[key]
         } else if (key !== "productList") {
              output[key] = result[key]
         } else {
              let plist = [];
              result.productList.forEach( (prd,pno) => {
                let prod = {}
                Object.keys(prd).filter(k => requestedFields.indexOf(k) < 0 ).forEach(k => prod[k] = prd[k])
                requestedFields.forEach(f => {
                  if (f in prd) {
                    let indx = config.illustrationFields.indexOf( f )
                    if ( indx >= 0 && pno === 0 ) { // only save into benefitsTable if main product
                      mainFields[f] = prd[f]
                      //benefitsTable.tableData.push( { columnNo: indx + 1, value: prd[f]})
                    }
                  }
                })
                plist.push(prod)
              })
              output.productList = plist;
         }
     })
     // create the benefits table
     illustrationFields.forEach((fname,indx) => {
       let parts = fname.indexOf('.') < 0 ? ["main", fname] : fname.split('.') ;
       let value = (parts[0] === 'pol') ? policyFields[parts[1]] : mainFields[parts[1]]
       benefitsTable.tableData.push( { columnNo: indx + 1, value: value })
     })

     output.tableOfBenefits = benefitsTable
     res.end(JSON.stringify(output));
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
   res.setHeader('Content-Type', 'application/json');
   let json = args.bodyParam.value;
   let pid = args.productId.value;
   let errors = [];
   // prepare the data to call the product engine
   let fields = [], calcFields=[];
   if (json.productList && json.productList.length > 0 ) {
     json.productList.forEach( (p,idx) => {
       if (idx === 0) {
         fields.push("validateInput");
         fields.push("validateMain");
         calcFields.push("monthlyCostOfInsurance")
       } else {
         fields.push( "r" + idx + ".validateInput");
         fields.push( "r" + idx + ".validateRider");
         calcFields.push("r" + idx + ".monthlyCostOfInsurance")
       }
     })
   } else {
     res.statusCode = 400; 
     errors.push({field:"bodyParam", code:"NO_PRODUCT", message: "There are no products specified"})
     return
   }
   // for cost of insurance calculation should be an investment product
   let productData = api.productInfo(pid)
   let good = false
   if (productData && productData.benefitType === '41')  good = true
  //  console.log("benefitType", productData.benefitType, productData.productId, productData.productName, good)
   if (!good) {
     return send400(res, next, JSON.stringify({error: __('Cost of insurance only applies to investment products') }) ) ;
   }
   let result = api.validate(json, fields );
   let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
   if (errCount === 0) {
     result = api.calc(json, calcFields);
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
     result = api.calc(json, ['premiumAmount', 'firstYearPremium']);
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
   // start with getting the parameters in
   let lang = args.lang.value;
   let pk = args.productId.value;
   pk = pk ? parseInt(pk) : -1;
   let proposedInsurance = args.bodyParam.value
   if (pk === -1 || !proposedInsurance) {
     return send400(res,next, __("Please specify the proposed insurance and the product id"))
   }
  // first do some validation
  let products = proposedInsurance.productList
  if (!products) {
    return send400(res,next, __("Please specify the main and rider products in the proposed insurance"))
  }
  let validators = ['validateMain']
  if (products.length > 1 ) validators.push('validateAllRiders')
  let result = api.validate(proposedInsurance, validators)
  let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
  if (errCount > 0) {
     res.statusCode = 400;
     let errorList = []
     Object.keys(result).forEach((errkey) => {
       let errors=[]
       result[errkey].forEach((msg) => {
           errors.push(msg)
       })
       errorList.push( { validator: errkey, errors: errors})
    })
    res.end(JSON.stringify({ errorList: errorList}, null, 2));
    return
  }

  // ok, we have done the validation, now time to grab the data that we want
  let input = _.cloneDeep(proposedInsurance); // create a clone for the output
  // for each of the products, we need to get the product code and name
  input.productList.forEach(prd => {
      let pid = prd.productId, productCode = prd.productCode;
      if (!pid && productCode) {
          let codeMap = api.getProductCodeMap()
          pid = codeMap[productCode]
      }
      let productInfo = api.productInfo(pid)
      prd.productId = pid;
      prd.productCode = productInfo.internalId
      prd.productName = productInfo.productName
  })

  // next is the table of benefits
  // let productData = api.productInfo(pid)
  let config = api.getConfig(pk)
  let illustrationFields = config.illustrationFields || []
  result = api.calc(proposedInsurance, [], illustrationFields);
  let requestedFields = illustrationFields.map(f => f.indexOf('.') < 0 ? f : f.split('.')[1] )
  let benefitsTable = {columnTitles:[], tableData: [] }
  config.illustrationColNames.forEach( (col, indx) =>  {benefitsTable.columnTitles.push( {columnNo: indx+1, columnTitle: col}) })
  let output = {}, policyFields = {}, mainFields = {}, plist=[];
  // only interested in policy level fields and product fields
  Object.keys(result).forEach(key => {
      if ( requestedFields.indexOf(key) >= 0 ) {
        // policy level fields -- will be attached to the main product
        policyFields[key] = result[key]
      } else if (key === "productList") {
        let prd = result.productList[0]; // main product only
        requestedFields.forEach(f => {
          if (f in prd) {
            let indx = config.illustrationFields.indexOf( f )
            if ( indx >= 0) mainFields[f] = prd[f]
          }
        })
      }
  })
  // create the benefits table
  illustrationFields.forEach((fname,indx) => {
    let parts = fname.indexOf('.') < 0 ? ["main", fname] : fname.split('.') ;
    let value = (parts[0] === 'pol') ? policyFields[parts[1]] : mainFields[parts[1]]
    benefitsTable.tableData.push( { columnNo: indx + 1, value: value })
  })
  console.log("*** done with benefits table")
  // last part is to get the package related information for this product, we use lifePackageProduct
  let planInfo = api.planInfo4Product(pk)

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({proposedInsurance:input, tableOfBenefits:benefitsTable, planInfo: planInfo },null,2))
  return
  //  let prd = api.getLifeProduct(pk)



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

   res.setHeader('Content-Type', 'application/json');

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
     result = api.getAvailableRiders(json)
     res.end(JSON.stringify(result))

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

   let data = fetchProductList(args, res, next);
   // remove some of the unwanted fields
  //  let removeList = ["coveragePeriods","premiumPaymentPeriods","currencies","funds","paymentModes","paymentMethods"];
  //  data.docs.forEach(doc => removeList.forEach( field => delete doc[field]))
   res.setHeader('Content-Type', 'application/json');
   res.end(JSON.stringify(data,null, 2));
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
   let lang = args.lang.value;
   let pk = args.productId.value;
   pk = pk ? parseInt(pk) : -1;
   let prd = api.getLifeProduct(pk)
   let config = api.getConfig(pk)
   if ( Object.keys(config) === 0) {
     res.statusCode = 404;
     res.end(JSON.stringify({ message: `Unable to find configuration for product ${pk}`}, null, 2))
     return
   }
   //
   let fields = config.illustrationFields.map(f => f)
   res.end(JSON.stringify(fields,null,2))


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
  //  console.log("*** getPackageProduct in ProductServices")
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

   let lang = args.lang.value;
   let pk = args.productId.value;
   pk = pk ? parseInt(pk) : -1;
  //  let prd = api.getLifeProduct(pk)
   let prd = api.getLifePackageProduct(pk)
   if (Object.keys(prd).length === 0) {
     return send404(res, next, JSON.stringify({error: __('Product is not found') }) ) ;
   }
   res.setHeader('Content-Type', "application/json");
   res.end(JSON.stringify(prd,null,2));
  //
  //
  //
  //
  // var examples = {};
  // examples['application/json'] = "";
  // if (Object.keys(examples).length > 0) {
  //   res.setHeader('Content-Type', 'application/json');
  //   res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  // } else {
  //   res.end();
  // }
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

   let lang = args.lang.value;
   let pk = args.productId.value;
  //  pk = pk ? parseInt(pk) : -1;
   let fname = "./templates/" + pk + '.html'
   fs.readFile(fname, "utf8", function(err, data) {
        if (err) {
          res.statusCode = 404
          res.end(JSON.stringify({message: __(`Unable to locate template for product ${pk}`)}, null,2))
        } else {
          res.setHeader('Content-Type', "application/json");
          res.end(JSON.stringify({template: data},null,2));
        }
    });



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
   let data = fetchProductList(args, res, next);
   // remove some of the unwanted fields
   let removeList = ["coveragePeriods","premiumPaymentPeriods","currencies","funds","paymentModes","paymentMethods"];
   data.docs.forEach(doc => removeList.forEach( field => delete doc[field]))
   res.setHeader('Content-Type', 'application/json');
   res.end(JSON.stringify(data,null, 2));
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
   let lang = args.lang.value;
   let pk = args.productId.value;
   pk = pk ? parseInt(pk) : -1;
   let prd = api.getLifeProduct(pk)
   let config = api.getConfig(pk)
   if ( Object.keys(config) === 0) {
     res.statusCode = 404;
     res.end(JSON.stringify({ message: `Unable to find configuration for product ${pk}`}, null, 2))
     return
   }
   //
   let fields = Object.keys(config.validators).filter(k => config.validators[k] !== 'pass' && config.validators[k] !== 'zero').map(k => k)
   res.end(JSON.stringify(fields,null,2))

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
   res.setHeader('Content-Type', 'application/json');
   let policy = args.bodyParam.value;
   let pid = args.productId.value;
   let proposedInsurance = policy.proposedInsurance
   let validatorList = policy.validatorList || []

   if (validatorList.length === 0 || !proposedInsurance) {
      return send400(res, next, __("Please specify the validatorList and the proposedInsurance fields"))
   }

   let errors = [];
   // prepare the data to call the product engine
  //  let fields = [];
  //  if (proposedInsurance.fundList && proposedInsurance.fundList.length > 0 ) {
  //    fields.push('validateAllFundAllocations')
  //  } else {
  //    res.statusCode = 400;
  //    res.end(JSON.stringify({ errorList: [{validator:"validateAllFundAllocations", errors: [__("There are no fund allocations specified") ] }]}, null, 2))
  //    return
  //  }
   let result = api.validate(proposedInsurance, validatorList );
   let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
   if (errCount === 0) {
     res.end(JSON.stringify({message:"OK"},null,2));
   } else {
      res.statusCode = 400;
      let errorList = []
      Object.keys(result).forEach((errkey) => {
        let errors=[]
        result[errkey].forEach((msg) => {
            errors.push(msg)
        })
        errorList.push( { validator: errkey, errors: errors})
     })
     res.end(JSON.stringify({ errorList: errorList}, null, 2));
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
   res.setHeader('Content-Type', 'application/json');

   let json = args.bodyParam.value;
   let pid = args.productId.value;
   let lang = args.lang.value;
   pid = pid ? parseInt(pid) : -1;
   let prd = api.getLifeProduct(pid)
   if (Object.keys(prd).length === 0) {
     return send404(res, next, JSON.stringify({error: __('Product is not found') }) ) ;
   }

   // need to change the format , the json that is input is just for an insured i.e. {name:"demo", birthDate:"1988-02-20", gender:"MALE"}
  //  let inputjson = {insuredList: [json], productList: [{productId:pid, paymentMode: "1", lifeAssuredNumber: 0}]} // default paymentMode to yearly (1)

   let result = api.validate(json, ["validateMain"])
   let errorList = []; //[{"validateMain": [] }]
   Object.keys(result).filter(validator => result[validator].length > 0).forEach(validator => {
      let errors = []
      result[validator].forEach(err => errors.push(err))
      errorList.push({validator: validator, errors: errors})
   })
   if (errorList.length > 0) {
      res.statusCode = 400
      res.end(JSON.stringify({ errorList: errorList}), null, 2);
      return
   }

   // no errors here -- get the product object and return it
   res.setHeader('Content-Type', "application/json");
   res.end(JSON.stringify({message:"OK"},null,2));
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
   res.setHeader('Content-Type', 'application/json');
   let proposedInsurance = args.bodyParam.value;
   let pid = args.productId.value;

   let errors = [];
   // prepare the data to call the product engine
   let fields = [];
   if (proposedInsurance.fundList && proposedInsurance.fundList.length > 0 ) {
     fields.push('validateAllFundAllocations')
   } else {
     res.statusCode = 400;
     res.end(JSON.stringify({ errorList: [{validator:"validateAllFundAllocations", errors: [__("There are no fund allocations specified") ] }]}, null, 2))
     return
   }
   let result = api.validate(proposedInsurance, fields );
   let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
   if (errCount === 0) {
     res.end(JSON.stringify({message:"OK"},null,2));
   } else {
      res.statusCode = 400;
      let errorList = [{"validateAllFundAllocations":[]}]
      Object.keys(result).forEach((errkey) => {
        result[errkey].forEach((msg) => {
            let fname = "validateAllFundAllocations"
            errorList[0].validateAllFundAllocations.push( fname + ' : ' + msg)
       })
     })
     res.end(JSON.stringify({ errorList: errorList}, null, 2));
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
   res.setHeader('Content-Type', 'application/json');

   let json = args.bodyParam.value;
   let pid = args.productId.value;
   let lang = args.lang.value;
   pid = pid ? parseInt(pid) : -1;
   let prd = api.getLifeProduct(pid)
   if (Object.keys(prd).length === 0) {
     return send404(res, next, JSON.stringify({error: __('Product is not found') }) ) ;
   }

   // need to change the format , the json that is input is just for an insured i.e. {name:"demo", birthDate:"1988-02-20", gender:"MALE"}
   let inputjson = {insuredList: [json], productList: [{productId:pid, paymentMode: "1", lifeAssuredNumber: 0}]} // default paymentMode to yearly (1)

   let result = api.validate(inputjson, ["validatePersonProduct"])
   let errorList = [{"validatePersonProduct": []}]
   if (result.validatePersonProduct.length > 0) {
      result.validatePersonProduct.forEach(err => errorList[0].validatePersonProduct.push(err))
      res.statusCode = 400;
      res.end(JSON.stringify({ errorList: errorList}), null, 2);
      return
   }
   // no errors here -- get the product object and return it
   res.setHeader('Content-Type', "application/json");
   res.end(JSON.stringify(prd,null,2));

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
   res.setHeader('Content-Type', 'application/json');
   let proposedInsurance = args.bodyParam.value;
   let pid = args.productId.value;

   let errors = [];
   // prepare the data to call the product engine
   let fields = [];
   if (proposedInsurance.productList && proposedInsurance.productList.length > 1 ) {
     proposedInsurance.productList.forEach( (p,idx) => {
       if (idx > 0) {
         fields.push( "r" + idx + ".validateInput");
         fields.push( "r" + idx + ".validateRider");
       }
     })
   } else {
     res.statusCode = 400;
     res.end(JSON.stringify({ errorList: [{validator:"validateRiders", errors: [__("There are no riders specified") ] }]}, null, 2))
     return
   }
  //  let productData = api.productInfo(pid)
  //  let good = false
  //  if (productData && productData.benefitType === '41')  {
  //    good = proposedInsurance.fundList && proposedInsurance.fundList.length > 0 ? true : false
  //  }
  //  console.log("benefitType", productData.benefitType, productData.productId, productData.productName, good)
  //  if (!good) {
  //    return send400(res, next, JSON.stringify({error: __('The fund list must be provided for investment products') }) ) ;
  //  }

   let result = api.validate(proposedInsurance, fields );
   let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
   if (errCount === 0) {
     res.end(JSON.stringify({message:"OK"},null,2));
   } else {
     res.statusCode = 400;
     let errorList = [{validateRider:[]}]
     Object.keys(result).forEach((errkey) => {
       result[errkey].forEach((msg) => {
         let parts = errkey.split(".");
         if (parts.length > 1 ) {
           let fname = "Rider - " + parts[0].substring(1);
           errorList[0].validateRider.push( fname + ' : ' + msg)
          //  errors.push({field: fname, code: "VALIDATION_ERROR", message: msg});
         }
       })
     })
     res.end(JSON.stringify({ errorList: errorList}, null, 2));
   }


  //  let errorList = []; //[{"validateMain": [] }]
  //  Object.keys(result).filter(validator => result[validator].length > 0).forEach(validator => {
  //     let errors = []
  //     result[validator].forEach(err => errors.push(err))
  //     errorList.push({validator: validator, errors: errors})
  //  })
  //  if (errorList.length > 0) {
  //     res.statusCode = 400
  //     res.end(JSON.stringify({ errorList: errorList}), null, 2);
  //     return
  //  }




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
   res.setHeader('Content-Type', 'application/json');
   let proposedInsurance = args.bodyParam.value;
   let pid = args.productId.value;

   let errors = [];
   // prepare the data to call the product engine
   let fields = [];
   if (proposedInsurance.topupList && proposedInsurance.topupList.length > 0 ) {
     fields.push('validateAllTopups')
   } else {
     res.statusCode = 400;
     res.end(JSON.stringify({ errorList: [{validator:"validateAllTopups", errors: [__("There are no topups specified") ] }]}, null, 2))
     return
   }
   let result = api.validate(proposedInsurance, fields );
   let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
   if (errCount === 0) {
     res.end(JSON.stringify({message:"OK"},null,2));
   } else {
      res.statusCode = 400;
      let errorList = [{"validateTopups":[]}]
      Object.keys(result).forEach((errkey) => {
        result[errkey].forEach((msg) => {
            let fname = "validateAllTopups"
            errorList[0].validateTopups.push( fname + ' : ' + msg)
       })
     })
     res.end(JSON.stringify({ errorList: errorList}, null, 2));
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
   res.setHeader('Content-Type', 'application/json');
   let proposedInsurance = args.bodyParam.value;
   let pid = args.productId.value;

   let errors = [];
   // prepare the data to call the product engine
   let fields = [];
   if (proposedInsurance.withdrawalList && proposedInsurance.withdrawalList.length > 0 ) {
     fields.push('validateAllWithdrawals')
   } else {
     res.statusCode = 400;
     res.end(JSON.stringify({ errorList: [{validator:"validateAllWithdrawals", errors: [__("There are no withdrawals specified") ] }]}, null, 2))
     return
   }
   let result = api.validate(proposedInsurance, fields );
   let errCount = _.sum( Object.keys(result).map( k => result[k].length ));
   if (errCount === 0) {
     res.end(JSON.stringify({message:"OK"},null,2));
   } else {
      res.statusCode = 400;
      let errorList = [{"validateWithdrawals":[]}]
      Object.keys(result).forEach((errkey) => {
        result[errkey].forEach((msg) => {
            let fname = "validateAllWithdrawals"
            errorList[0].validateWithdrawals.push( fname + ' : ' + msg)
       })
     })
     res.end(JSON.stringify({ errorList: errorList}, null, 2));
   }
}


function fetchProductList(args, res, next) {

  let lang = args.lang.value;
  let offset = args.offset.value || 0;
  let limit = args.limit.value || 99999999999;
  let sort = args.sort.value || 'insurerName'
  // let keys = (args.keys.value || []).map(k => k+'')
  let keys = []
  let salesCategory = args.salesCategory.value || ''
  let mainOrRider = !args.productType.value ? null : args.productType.value.toLowerCase() === 'main' ? '1' : '2'
  let insurerList = args.insurerIds.value || []
  let birthDate = args.birthDate.value;

  let prdList = api.availableProducts() || [];
  let rows = [];
  if (keys.length === 0) {
    // first do a sort first, check if there is a negative in front
    if ( sort) {
      let sortOrder = sort.startsWith('-') ? 'desc' : 'asc';
      sort = sort.startsWith('-') ? sort.substring(1) : sort;
      rows = _.sortBy(prdList, (row) => sort === 'productName' ? row.productName : sort === 'productCode' ? row.productCode : sort === 'insurer' ? row.insurer.insurerName : row.pk )
      if (sortOrder === 'desc') rows.reverse()
    }
    // do we have a filter conditions ??
    if (mainOrRider) {
      rows = rows.filter(row => row.insType === mainOrRider)
    }
    if (salesCategory) {
      rows = rows.filter(row => row.salesCategory === salesCategory)
    }
    if (birthDate) {
      // find the absolute min and max age
      let age = api.calcAge(birthDate)
      rows = rows.filter(row => {
          let minAgeList = row.ageLimitList.map(limit => limit.minInsuredAgeUnit === '1' ? limit.minInsuredAge : limit.minInsuredAgeUnit === '5' && limit.minInsuredAge > 7 ? 1 : 0 )
          let minAge = _.min(minAgeList)
          let maxAge = _.max( row.ageLimitList.map(limit => limit.maxInsuredAge) )
          console.log("** min & max ages", minAge, maxAge, age)
          return age >= minAge && age <= maxAge ? true : false
      })
    }
    if (insurerList.length > 0) {
      insurerList = insurerList.map(item => (item + '').trim() )
      rows = rows.filter(row => row.insurer && insurerList.indexOf(row.insurer.insurerId+'') >= 0 )
    }
    rows = rows.splice(offset,limit)

  } else {
    // look for specific keys
    keys = keys.map( k => k.trim() ) ; // get rid of spaces
    rows = prdList.filter(row => keys.indexOf(row.productId + '' ) >= 0)
   //  console.log("****keys", keys, rows.length , pkgs.map(p => p.packageId))
  }

  let data = {
      offset: offset,
      totalDocs: prdList.length,
      docs: rows
  }
  return data;
}
