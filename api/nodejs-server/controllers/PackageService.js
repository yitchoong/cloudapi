'use strict';

const api = require('product-api');
const crud = require('crud-api');
crud.init()
const _ = require('lodash');
const __ = require('../i18n');
const utils = require('./utils');

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

   let token = args.Token && args.Token.value;
   let userId = token || "default" ; // if no user supplied, we just used the default userId

   crud.getUserDoc(userId)
   .then(userDoc => {
       let data = fetchPackages(userDoc, args, res, next)
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify(data,null, 2));
   })
   .catch( (err) => {
     res.statusCode = 400
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify( {error: err}, null, 2));
   })

   //
   //
   //
  //  let data = fetchPackages(args, res, next)
  //  res.setHeader('Content-Type', 'application/json');
  //  res.end(JSON.stringify(data,null, 2));
  //  return

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


   let lang = args.lang.value;
   let packageCode = args.packageCode.value;
   let pkg = api.getPackage(packageCode)
   if (Object.keys(pkg).length === 0) {
     return send404(res, next, JSON.stringify({error: __('Package is not found') }) ) ;
   }
   res.setHeader('Content-Type', "application/json");
   res.end(JSON.stringify(pkg,null,2));
}

exports.getPackageFilterList = function(args, res, next) {
  /**
   * Fetch the list of pre-defined search fields and values for packages.
   * To support the search function on mobile environments, it is easier to provide a list of pre-defined search values for the search fields. These can then be selected instead of using the keyboard to enter the search value. The predefined values are for insurers, product category, and benefit type fields.
   *
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns inline_response_200_3
   **/
   let lang = args.lang.value;
   let rows = api.getPackageFilters()

   res.setHeader('Content-Type', 'application/json');
   res.end(JSON.stringify(rows,null, 2));
   return
}

exports.getPackageList = function(args, res, next) {

  let token = args.Token && args.Token.value;
  let userId = token || "default" ; // if no user supplied, we just used the default userId

  crud.getUserDoc(userId)
  .then(userDoc => {
      // console.log("*** got the userDoc", userDoc)
      let data = fetchPackages(userDoc, args, res, next)
      let removeList = ["amountLimit", "insurer", "premiumPaymentTerms", "features", "productList", "attachableRiders"];
      data.docs.forEach(doc => removeList.forEach( field => delete doc[field]))
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data,null, 2));
  })
  .catch( (err) => {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify( {error: err}, null, 2));
  })

}

function fetchPackages(userDoc, args, res, next) {

  let lang = args.lang.value;
  let offset = args.offset.value || 0;
  let limit = args.limit.value || 99999999999;
  let sort = args.sort.value || 'insurerName'
  let keys = (args.keys.value || []).map(k => k+'')
  let filter = args.filter.value || ''
  let favourite = args.favourite.value || false;
  let pkgs = api.getPackages() || [];
  let rows = [];
  if (sort) {
     let sortOrder = sort.startsWith('-') ? 'desc' : 'asc';
     sort = sort.startsWith('-') ? sort.substring(1) : sort;
     rows = _.sortBy(pkgs, (row) => sort === 'packageName' ? row.packageName : row.packageId )
     if (sortOrder === 'desc') rows.reverse()
  }
  // done with sort, now look at how to filter, by favourites, keys, or filter
  if (favourite) {
      // get the user's favourite packages
      let favouritePackages = userDoc.favouritePackages
      // now only get the favourites
      rows = rows.filter(row => favouritePackages.indexOf(row.packageCode) >= 0 )
      offset = 0

  } else if (keys.length === 0) {
    // first do a sort first, check if there is a negative in front
    // if ( sort) {
    //   let sortOrder = sort.startsWith('-') ? 'desc' : 'asc';
    //   sort = sort.startsWith('-') ? sort.substring(1) : sort;
    //   rows = _.sortBy(pkgs, (row) => sort === 'packageName' ? row.packageName : row.packageId )
    //   if (sortOrder === 'desc') rows.reverse()
    // }
    // do we have a filter to apply ? allow filter by
    if (filter) {
      let ors = []
      let orList = filter;
      orList.forEach( cond => {
        let andList = cond.split(';')
        let ands = []
        andList.forEach( filter => {
          let parts = filter.split('*');
          let key = parts[0], oper = parts[1], value = parts[2];
          ands.push({key, oper, value})
        })
        ors.push(ands)
      })
      rows = rows.filter( row => {

          let count = ors.map(ands => {
              let  val;
              let cnt = ands.map( filter => {

                val = 0
                let filterOper = filter.oper.toLowerCase()
                let filterKey = filter.key.toLowerCase()
                let filterValue = filterKey === 'insurer' ? parseInt(filter.value) : filter.value + ''
                // if (filterKey === 'insurer') {
                // }
                // if (['insurer','productCategory','liability'].indexOf(filter.key) >= 0 ) {
                  if (filterOper === 'eq') {
                    if ( ['insurer','productCategory','liability'].indexOf(filterKey) >= 0) {
                      if (filterKey === 'insurer' && row.insurer.pk+'' === filterValue+'') val = 1
                      if (filterKey === 'productcategory' && row.productCategory+'' === filterValue+'' ) val = 1 ; // ::TODO:: whether 1 or more product category
                      if (filterKey === 'liability' && row.liabilities.find(r => r.liabId === filterValue)) val = 1;
                    } else {
                      if (row[filter.key] === filterValue) val = 1
                    }
                  }
                  if (filterOper === 'startswith' && _.startsWith(row[filter.key], filterValue)) val = 1;
                  if (filterOper === 'contains' && row[filter.key].indexOf(filterValue) >= 0 ) val = 1;
                // }

                console.log("** packageService", filter.key, filterOper, filterValue, row[filter.key], val);

                return val
              })
              return ands.length === _.sum(cnt) ? 1 : 0
          })
          return _.sum(count) > 0 ? true : false
      })
    }
    rows = rows.splice(offset,limit)

  } else {
    // look for specific keys
    keys = keys.map( k => k.trim() ) ; // get rid of spaces
    rows = rows.filter(row => keys.indexOf(row.packageCode + '' ) >= 0)
  }

  let data = {
      offset: offset,
      totalDocs: pkgs.length,
      docs: rows
  }
  return data;
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
  //  console.log("*** getPackageProduct in PackageServices")
   let packageCode = args.packageCode.value;
   let productId = args.productId.value;

   let packageProduct = api.getPackageProduct(packageCode, productId)
   if (Object.keys(packageProduct).length === 0) {
     return send404(res, next, JSON.stringify({error: __('Package product is not found') }) ) ;
   }
   res.setHeader('Content-Type', "application/json");
   res.end(JSON.stringify(packageProduct,null,2));

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

exports.initialQuoteData = function(args, res, next) {
  /**
   * Fetch the initial quote data for a given package
   * After viewing the package information, the client application proceeds with the quote based on the package. This endpoint will fetch the initial data for a new quote based on the selected package. Based on the package id, the package main product and riders plus additional available riders are included in the initial data. Additionally, the product parameters for all the products (main and riders) also be included in the initial quote data.
   *
   * packageId String Unique id for the package
   * lang String Language to be used in case the response has text data (e.g. error messages) (optional)
   * returns NewQuote
   **/
   res.setHeader('Content-Type', 'application/json');
   let packageCode = args.packageCode.value;
   let packageInitialData = api.getPackageInitialData(packageCode);

   if (Object.keys(packageInitialData).length === 0) {
     return send404(res, next, JSON.stringify({error: __('Package is not found or package has no main product') }) ) ;
   }
   res.setHeader('Content-Type', "application/json");
   res.end(JSON.stringify(packageInitialData,null,2));
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
  //  let packageCode = args.packageCode.value;
  //  let token = args.Token.value;
  //  // for this sample implementation, we are not using JWT or somethink like that, we just store the userId
  //  let userId = token || "default" ; // if no user supplied, we just used the default userId
  //  let result = crud.removeFavouritePackage(userId, packageCode);
  //  res.setHeader('Content-Type', 'application/json');
  //  res.end(JSON.stringify( {message: "OK"}, null, 2));
  //  return

   let packageCode = args.packageCode.value;
   let token = args.Token && args.Token.value;
   // for this sample implementation, we are not using JWT or somethink like that, we just store the userId
   let userId = token || "default" ; // if no user supplied, we just used the default userId
  //  crud.getDB()
  //  .then(status => {
  //     return crud.removeFavouritePackage(userId,packageCode)
  //  })
   crud.removeFavouritePackage(userId,packageCode)
   .then(doc => {
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify( doc, null, 2));
   })
   .catch( (err) => {
     res.statusCode = 400
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify( {error: err}, null, 2));
   })


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
   let packageCode = args.packageCode.value;
   let token = args.Token && args.Token.value;
   // for this sample implementation, we are not using JWT or somethink like that, we just store the userId
   let userId = token || "default" ; // if no user supplied, we just used the default userId
  //  crud.getDB()
  //  .then(database => {
  //     return crud.addFavouritePackage(userId,packageCode)
  //  })
   crud.addFavouritePackage(userId, packageCode)
   .then(doc => {
     console.log("doc after addPackageFav", doc)
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify( doc, null, 2));
   })
   .catch( (err) => {
     res.statusCode = 400
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify( {error: err}, null, 2));
   })
}
