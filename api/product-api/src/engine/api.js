// import _ from "lodash";
// import moment from "moment";
// import * as utils from "./utils.js";
// import * as models from "./models.js";
// import * as roundings from "./roundings.js";
// import * as validators from "./validators";
const fieldMappings = require('./fieldMappings');

'use strict'

let exp = {}
let _ = require('lodash')
let moment = require('moment')
let utils = require('./utils')
let models = require('./models')
let roundings = require('./roundings')

function calcAge( dob, ageMethod="ALAB") {
    //  default to ALAB if not provided. Can happen when we are only entering the person info and no product is selected
    return moment(dob,['YYYY-MM-DD','YYYY/MM/DD'],true).isValid() ? utils.calcAge(ageMethod, dob) : undefined
    //
    // return utils.calcAge(ageMethod, dob);
}

function calcAge4Product(dob, productId) {
    if ( ! _.has(models.CONFIGS,productId ) ) {
        return calcAge(dob);
    }
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "ageMethod", { parentType : "product", parent : pdt } );
    let ageMethod = field.getValue('*',{productId:productId});
    console.log("calcAge4Method, ageMethod", ageMethod);
    // check the format of the dob

    return calcAge(dob, ageMethod);
}
function ageMethod(productId) {
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "ageMethod", { parentType : "product", parent : pdt } );
    let ageMethod = field.getValue('*',{productId:productId});
    return ageMethod;
}

/* function to get the productMap -- product.internalId -> productId */
function getProductCodeMap() {
  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', 0, {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "productCodeMap", { parentType : "policy", parent : null } );
  let productCodeMap = field.getValue({productId:0});
  return productCodeMap
}

/*
from chrome console, call api.availablePlans() , returns a list of products objects
*/
function availablePlans() {
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', 0, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "availableMainPlans", { parentType : "policy", parent : null } );
    let plans = field.getValue({productId:0});
    let configured = _.keys(models.CONFIGS).map(function(item) { return parseInt(item); });
    let availablePlans = _.filter(plans, (p) => { return _.includes(configured, p.productId) });
    return availablePlans;
}
function availableProducts() {
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', 0, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "availableProducts", { parentType : "policy", parent : null } );
    let products = field.getValue({productId:0});
    let configured = _.keys(models.CONFIGS).map(function(item) { return parseInt(item); });
    let availableProducts = _.filter(products, (p) => { return _.includes(configured, p.productId) });

    // augment the data further - saLimitList, premiumLimitList, ageLimitList, benefitLevelList, and inputFields
    let newp = {}, productList=[], doc;
    availableProducts.forEach(prd => {
      productList.push( prdData(ctx,prd))
    })

    return productList
    // return availableProducts;
}
function getLifePackageProduct(productId) {
  if ( ! _.has(models.CONFIGS,productId ) ) {
      return {} ; // empty object if not configured
  }
  return lifePackageProduct(productId)
}
function getLifeProduct(productId) {
  if ( ! _.has(models.CONFIGS,productId ) ) {
      return {} ; // empty object if not configured
  }
  let ctx = new models.Context({});

  let common = new models.Entity( ctx, 'product', 0, {} );
  let productData = new models.Field(ctx, 'productData', {parentType:'product',parent:common, dbField:true});
  ctx.set("commonData", productData)


  let pdt = new models.Entity( ctx, 'product', productId, {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "productLife", { parentType : "product", parent : pdt } );
  let prd = field.getValue({productId:productId});
  prd.productId = productId;
  let newp = prdData(ctx, prd)
  return newp

}

function prdData(ctx, prd) {
  // do translations now
  newp = {}
  newp.pk = prd.productId
  newp.doctype = "Product"
  newp.productCode = prd.internalId
  newp.productName = prd.productName
  newp.packageCode = prd.packageCode
  newp.insType = prd.insType
  newp.unitFlag = prd.unitFlag
  newp.salesCategory = prd.salesCategory || ''
  newp.salesCategoryName = prd.salesCategoryName || ''
  newp.ageRange = prd.ageRange
  newp.isWaiver = prd.isWaiver
  newp.pointToPh = prd.pointToPh
  newp.isAnnuityProduct = prd.isAnnuityProduct
  newp.pointToSpouse = prd.pointToSpouse
  newp.pointToSecInsured = prd.pointToSecInsured
  newp.smokingIndi = prd.smokingIndi
  newp.jobIndi = prd.jobIndi
  newp.socialInsureIndi = prd.socialInsureIndi
  newp.displayPremiumIndi = prd.displayPremiumIndi

  pdt = new models.Entity( ctx, 'product', prd.productId, {} );
  ctx.set("product",pdt);
  field = new models.Field( ctx, "saLimitList", { parentType : "policy", parent : null } )
  let res = field.getValue({productId:pdt.productId})

  newp.sumAssuredLimitList = res.map(rec => {
    doc = {}
    Object.keys(fieldMappings.saLimitMapper).forEach(key => {
      if (key in rec) doc[fieldMappings.saLimitMapper[key]] = rec[key]
    })
    return doc
  })

  field = new models.Field( ctx, "premiumLimitList", { parentType : "policy", parent : null } )
  res = field.getValue({productId:pdt.productId})
  // prd.premiumLimitList = res;
  newp.premiumLimitList = res.map(rec => {
    doc = {}
    Object.keys(fieldMappings.premiumLimitMapper).forEach(key => {
      if (key in rec) doc[fieldMappings.premiumLimitMapper[key]] = rec[key]
    })
    return doc
  })

  field = new models.Field( ctx, "ageLimitList", { parentType : "policy", parent : null } )
  res = field.getValue({productId:pdt.productId})
  // prd.ageLimitList = res
  newp.ageLimitList = res.map(rec => {
    doc = {}
    Object.keys(fieldMappings.ageLimitMapper).forEach(key => {
      if (key in rec) doc[fieldMappings.ageLimitMapper[key]] = rec[key]
    })
    return doc

  })
  field = new models.Field( ctx, "benefitLevels", { parentType : "policy", parent : null } )
  res = field.getValue({productId:pdt.productId})
  // prd.benefitLevelList = res
  newp.benefitLevelList = res.map(rec => {
    doc = {}
    Object.keys(fieldMappings.benefitLevelMapper).forEach(key => {
      if (key in rec) doc[fieldMappings.benefitLevelMapper[key]] = rec[key]
    })
    return doc
  })

  field = new models.Field( ctx, "coverageTerms", { parentType : "policy", parent : null } )
  res = field.getValue({productId:pdt.productId})
  // newp.coverageTerms = res
  newp.coveragePeriods = res.map(rec => {
    doc = {}
    Object.keys(fieldMappings.coveragePeriodMapper).forEach(key => {
      if (key in rec) doc[fieldMappings.coveragePeriodMapper[key]] = rec[key]
    })
    return doc
  })

  field = new models.Field( ctx, "premiumTerms", { parentType : "policy", parent : null } )
  res = field.getValue({productId:pdt.productId})
  // newp.premiumPaymentPeriods = res
  newp.premiumPaymentPeriods = res.map(rec => {
    doc = {}
    Object.keys(fieldMappings.premiumPaymentTermMapper).forEach(key => {
      if (key in rec) doc[fieldMappings.premiumPaymentTermMapper[key]] = rec[key]
    })
    return doc
  })

  newp.currencies = availableCurrencies(prd.productId)
  newp.funds = availableFunds(prd.productId)
  newp.paymentModes = availablePaymentFrequencies(prd.productId)
  newp.paymentMethods = availablePaymentMethods(prd.productId)
  newp.inputFields = getConfig(prd.productId).inputFields

  doc = {};
  Object.keys(fieldMappings.insurerMapper).forEach( key => {
      if (prd.insurer && key in prd.insurer) doc[fieldMappings.insurerMapper[key]] = prd.insurer[key]
  })
  newp.insurer = doc;

  let liabilities = prd.liabilities || prd.liabilityList;

  newp.liabilities = !liabilities ? [] : liabilities.map( row => {
    doc = {}
    Object.keys(fieldMappings.liabilityMapper).forEach( key => {
      if (key === 'pk' && key in row) {
        doc['liabId'] = row[key].split(':')[2]
        doc['displayOrder'] =  row[key].split(':')[3];
      } else {
        if (key in row) doc[fieldMappings.liabilityMapper[key]] = row[key]
      }
    })
    return doc
  })
  //
  return newp
}


/* getBenefitLevelPlans , input is the productId , output = [ {levelDesc:'Plan400', productLevel : 1, levelAmount: 600000 } ] */
function availableBenefitPlans(productId) {
    if ( ! _.has(models.CONFIGS,productId ) ) {
        return {};
    }
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "benefitPlans", { parentType : "product", parent : pdt } );
    // let field = new models.Field( ctx, "benefitLevel", { parentType : "product", parent : pdt } );
    let levels = field.getValue('*',{productId:productId});
    let result = {};

    console.log("availableBenefitPlans", levels);
    let xlateMap = {1:'Plan A', 2:'Plan B', 3:'Plan C', 4:'Plan D', 5:'Plan E', 6:'Plan F', 7: 'Plan G', 8: 'Plan H', 9: 'Plan I'}
    _.sortBy(levels,['level']).forEach(level => {
        result[level.level+''] = xlateMap[level.level] ? xlateMap[level.level] : 'Others';
    });
    return result;
}
function availableBenefitLevels(productId) {
//    debugger;
    if ( ! _.has(models.CONFIGS,productId ) ) {
        return {};
    }
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "benefitLevels", { parentType : "product", parent : pdt } );
    let levels = field.getValue('*',{productId:productId});
    let result = {};
    _.sortBy(levels,['level']).forEach(level => result[level.level] = level.levelAmount);
    return result;
}
/* getAvailableFunds -- input is the main plan productId */
function availableFunds(productId) {
  // need to go to 2 separate tables , fund & product fund
  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', 0, {} ); // note _product0
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "funds", { parentType : "product", parent : pdt } );
  let funds = field.getValue({productId:0});
  let fundMap = {};
  _.forEach(funds, (fund) => fundMap[fund.fundCode] = fund.fundName  );
  let pdt2 = new models.Entity( ctx, 'product', _.parseInt(productId), {} ); // note product id - our required product id
  let field2 = new models.Field( ctx, "availableFunds", { parentType : "product", parent : pdt2 } );
  let wantedFunds = field2.getValue({productId:productId});
  let result = [],row;
  _.forEach(wantedFunds, (fund) => {
      row={};
      row['fundCode'] = fund.fundCode;
      row['fundName'] = fundMap[ row.fundCode];
      result.push(row);
  })
  // console.log(" availableFunds", result);
  return result;
}

function availableCurrencies(productId) {

  let ctx = new models.Context({});
  let common = new models.Entity( ctx, 'product', 0, {} );
  let productData = new models.Field(ctx, 'productData', {parentType:'product',parent:common, dbField:true});
  ctx.set("commonData", productData)
  let pdt = new models.Entity( ctx, 'product', _.parseInt(productId), {} );
  let field = new models.Field( ctx, "availableCurrencies", { parentType : "product", parent : pdt } );
  let rows = field.getValue({productId:productId});
  return rows;
//
//
//
//   // need to go to 2 separate tables , fund & product fund
//   let ctx = new models.Context({});
//   let pdt = new models.Entity( ctx, 'product', 0, {} ); // note _product0
//
//   ctx.set("product",pdt);
//   let field = new models.Field( ctx, "currencies", { parentType : "product", parent : pdt } );
//   let currencies = field.getValue({productId:0});
//   let ccyMap = {};
//
//   _.forEach(currencies, (ccy) => ccyMap[ccy.moneyId] = ccy.moneyName  );
//   let pdt2 = new models.Entity( ctx, 'product', _.parseInt(productId), {} ); // note product id - our required product id
//   let field2 = new models.Field( ctx, "availableCurrencies", { parentType : "product", parent : pdt2 } );
//   let wantedRows = field2.getValue({productId:productId});
//
//   let result = {},row;
//   wantedRows.forEach(ccy => result[ccy.moneyId] = ccyMap[ parseInt(ccy.moneyId)] );
// //  _.forEach(wantedRows, (item) => {
// //      row={};
// //      row['moneyId'] = parseInt(item.moneyId)
// //      row['moneyName'] = ccyMap[ parseInt(item.moneyId ) ] ;
// //      result.push(row);
// //  })
//   return result;
}


/*
Get the payment frequency for that is allowed for the product
*/
function availablePaymentFrequencies(/*productId*/ productId ){
    if ( ! _.has(models.CONFIGS,productId ) ) {
        return [];
    }
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "paymentFrequencies", { parentType : "product", parent : pdt } );
    let freqs = field.getValue('*',{productId:productId});
    let freqMap = {'1':'Yearly','2':'Half-yearly','3':'Quarterly','4':'Monthly','5':'Single Premium' }
    let result = {};
    _.sortBy(freqs).forEach( freq => result[freq+''] = freqMap[freq]);
    return result;
//    console.log("freqs", _.sortBy(freqs)
//    // we only get the codes, so we have to provide descriptions as well
//    let sorted = _.sortBy(freqs);
//    return _.zip( sorted, _.map(sorted,function(idx){ return freqMap[idx]; }) ); // return a list of 2 element tuples
}

function getConfig(productId){
    if ( _.has( models.CONFIGS, productId) ) {
        return Object.assign( {}, models.CONFIGS[productId] );
    } else {
        return {}
    }
}
/* Get the premiumTerms */
function availablePremiumTerms( productId ,  dob = null){
    /* check if product is configured */
    if ( ! _.has(models.CONFIGS,productId ) ) {
        return {};
    }
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "premiumTerms", { parentType : "product", parent : pdt} );
    let terms = field.getValue('*', {productId:productId});
    // will get a list of maps, each map will have period & term keys
    let [numYears, untilAge] = [ [], [] ];
    _.forEach(terms,(row) => {
        if (row.period === '3') {
            untilAge.push( row.year );
        } else {
            numYears.push( row.year);
        }
    });
    if (untilAge.length > 0) {
        let terms = [];
        if ( _.isNull(dob) ) {
            // not handled -- how ? calculate years until from age 1 to age
            untilAge.forEach( (endAge) => {
                _.range(1, endAge+1).forEach(t => terms.push(endAge - t))
            })

        } else {
            let start;
            _.forEach(untilAge,(endAge) => {
                start = utils.calcAge( ageMethod(productId), dob ) ; //toDate(dob).add(age,'year').diff(utils.now(),'year');
                _.range(start, endAge+1).forEach(t => terms.push(endAge - t))
            });
        }
        let res = _.orderBy( _.uniq(terms) ).filter( t => t > 4 );

        numYears = numYears.concat(res);
    }
    let result = {};
    _.sortBy(numYears).forEach(yr => result[yr+''] = yr+'' )
    return result;
//    return numYears; // list of years
}

function availablePremiumPaymentTerms( productId ,  dob = null){
    if ( ! _.has(models.CONFIGS,productId ) ) {
        return {};
    }
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "premiumTerms", { parentType : "product", parent : pdt} );
    let terms = field.getValue('*', {productId:productId});
    return terms

}

/* Get the coverageTerms */
function availableCoverageTerms(productId) {
  if ( ! _.has(models.CONFIGS,productId ) ) {
      return [];
  }
  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', productId, {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "coverageTerms", { parentType : "product", parent : pdt} );
  let terms = field.getValue('*', {productId:productId});
  return terms
}

function availablePolicyTerms( productId, dob=null ){
    /* check if product is configured */
    if ( ! _.has(models.CONFIGS,productId ) ) {
        return [];
    }
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "coverageTerms", { parentType : "product", parent : pdt} );
    let terms = field.getValue('*', {productId:productId});
    // will get a list of maps, each map will have period & term keys
    let rowmap = {} ;
    terms.filter(row => row.period === '2').forEach(row => rowmap[row.year+''] = row.year+'' );
    let tt = [], info = productInfo(productId);
    terms.filter(row => row.period === '3').forEach(row => {
        let start = _.isNull(dob) ? 1 : utils.calcAge( ageMethod(productId), dob );
        _.range(start, row.year + 1).forEach(yr => tt.push( String(row.year - yr + 1) ))
        _.orderBy( _.uniq( tt) ).filter( t => t > start ).forEach( t => rowmap[t+''] = t+'');
    })
    return rowmap;
}


function availablePolicyEndAges( productId){
    /* check if product is configured */
    if ( ! _.has(models.CONFIGS,productId ) ) {
        return [];
    }
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "coverageTerms", { parentType : "product", parent : pdt} );
    let terms = field.getValue('*', {productId:productId});
    // will get a list of maps, each map will have period & term keys
    let rowmap = {} ;
    terms.filter(row => row.period === '3').forEach(row => rowmap[row.year+''] = row.year + '');
    return rowmap;
}

/* duplicate of availablePremiumTerms ? */
// function getChargePeriods( productId){
//     /* check if product is configured */
//     if ( ! _.has(models.CONFIGS,productId ) ) {
//         return [];
//     }
//     let ctx = new models.Context({});
//     let pdt = new models.Entity( ctx, 'product', productId, {} );
//     ctx.set("product",pdt);
//     let field = new models.Field( ctx, "premiumTerms", { parentType : "product", parent : pdt} );
//     let terms = field.getValue('*', {productId:productId});
//     // will get a list of maps, each map will have period & term keys
//     let rows = [];
//     _.forEach(terms,(row) => {
//         rows.push( { termType : row.period, year : row.year })
//     });
//     return rows;
// }

/* Get the chargeTypes */
function availablePaymentMethods( productId){
// function getChargeTypes( productId){
    /* check if product is configured */
    if ( ! _.has(models.CONFIGS,productId ) ) {
        return [];
    }
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "payMethods", { parentType : "product", parent : pdt} );
    let terms = field.getValue('*', { productId : productId});
    let rows = [], keys = [];
    let xlateMap = {'0':'NA','1':'Yearly','2':'Half-yearly','3':'Quarterly','4':'Monthly','5':'Single','8':'Daily'}
    let payMap = {'0':'NA','1':'Cash','2':'Cheque','3':'Direct Debit'}
    _.forEach(terms,(row) => {
        if (keys.indexOf(row.chargeType) < 0) {
            rows.push( { paymentFrequency : xlateMap[row.chargeType+''], paymentMethod : payMap[row.payMode+''] });
            keys.push(row.chargeType);
        }
    });
    return rows;
}


/*
Get the available riders given the main & riders already attached, also people info to look at the age limits
So expect a normal input json = {  "productList" : [ {"main".....},{"rider"....} ], "insuredList" : [ { "Insured"....} ] }
*/
function availableRiders( inputjson ) {
    // validate json should be in the above structure
    if ( ! _.isPlainObject(inputjson)) { throw Error("Parameter must be an object representing the input JSON")}
    //if ( "policy" in inputjson ) {
        let policy = inputjson ; // .policy;
        let productCodeMap = getProductCodeMap();
        let configuredProducts = Object.keys( models.CONFIGS )
        if ( "productList" in policy && "insuredList" in policy) {
            let products = policy.productList;
            if ( products.length > 0 ) {

              products.forEach(prd => {
                  if (!prd.productId && prd.productCode) {prd.productId = productCodeMap[prd.productCode]}
                  if (configuredProducts.indexOf(prd.productId+'') < 0) {
                    throw new Error(`Product ${prd.productCode + '(' + prd.productId + ')'} is not a configured product`)
                  }
              })
                // let people = policy.people;
                let people = policy.insuredList;
                let main = products[0];
                let mainProductId = main.productId;
                let riders = [];
                _.forEach(products.slice(1), (rider) => { riders.push( rider.productId ); });
                //let la = people[ main.la ];
                let ctx = new models.Context({});
                let pdt = new models.Entity( ctx, 'product', mainProductId, {} );
                ctx.set("product",pdt);
                let field = new models.Field( ctx, "attachableRiders", { parentType : "product", parent : pdt } );
                let attachableRiders = field.getValue('*', {productId: mainProductId});
                // this will be a list of maps
                let product0 = new models.Entity( ctx, 'product', 0, {} );
                let mexField = new models.Field( ctx, "mutuallyExclusiveRiders", { parentType : "product", parent : product0 } );
                let depField = new models.Field( ctx, "dependentRiders", { parentType : "product", parent : product0 } );
                let riderId, attachType, compulsory, gender
                let availableRiders = _.filter(attachableRiders, (row) => {
                    let mex, dep, pid ;
                    pid = row.attachId;
                    // have to reset fields otherwise it will use cached values
                    mexField.reset();
                    depField.reset();
                    mex = mexField.getValue('*', { riderId: pid } ); // use productId = 0
                    dep = depField.getValue('*', { riderId: pid } ); // for these use productId = 0

                    if ( row.attachType == "1" && _.includes(riders, pid)) { // attach only once & already attached
                        return false;
                    }
                    let exclude = false;
                    _.forEach(mex, (pair) => {
                        let [r1,r2] = pair;
                        if (r1 === pid && _.includes(riders, r2)) {
                            exclude = true;
                        }
                        if (r2 === pid && _.includes(riders, r1)) {
                            exclude = true;
                        }
                    });
                    if (exclude) { return false; }
                    _.forEach(dep, (pair) => {
                        let [r1,r2] = pair;
                        if ( pid === r1 && !_.includes(riders,r2) ) {
                            exclude = true;
                        }
                    });
                    if (exclude) { return false; }
                    // by right need to check the age limit for the rider -- but can leave it to validation of the rider

                    return true;
                });

                let field2 = new models.Field( ctx, "availableRiders", { parentType : "product", parent : product0 } );
                let riderList = field2.getValue('*', {});
                //let riderIds = _.pluck(riderList,'productId');
                let riderIds = _.map(riderList,(row) => row.productId);
                let idx;
                _.forEach( availableRiders,function(rider){
                    idx = riderIds.indexOf(rider.attachId);
                    if ( idx >= 0 ){
                        rider["masterId"] = mainProductId;
                        rider["riderName"] = riderList[idx].productName;
                        rider["riderCode"] = riderList[idx].internalId;
                        rider["riderId"] = rider["attachId"];
                        rider['waiver'] = riderList[idx].waiver;
                        rider['spouseWaiver'] = riderList[idx].spouseWaiver;
                    }
                });
                let configured = _.keys(models.CONFIGS).map(function(item) { return parseInt(item); });
                return _.filter(availableRiders, (p) => { return _.includes(configured, p.riderId) });
            }
        }
    //}
    return []; // nothing
}
function getAvailableRiders( inputjson ) {
  // somewhat same as availableRiders, but the output needs to have more information
  let rows = availableRiders(inputjson);
  if (rows.length > 0) {
      let rider, riderList=[];
      rows.forEach(row => {
        rider = getLifeProduct(row.riderId)
        rider.attachCompulsory = rider.attachCompulsory
        rider.saEqual = rider.noEqual
        riderList.push(rider)
      })
      rows = riderList
  }
  return rows

}

function productInfo(productId) {
  if ( ! _.has(models.CONFIGS,productId ) ) {
      return {} ; // empty object if not configured
  }

  // need to go to 2 separate tables , fund & product fund
  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', productId, {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "productLife", { parentType : "product", parent : pdt } );
  let product = field.getValue({productId:productId});
  return product;
}

/* for Tugu Mandiri -- some products have options , given productId, we can determine the (a) totalPremium (b) the split between targetPremium & regularTopup */

function getProductOptions(productId) {
    // implement as formulas for the moment, as we do not have it configured in the tables
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', productId, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "productOptions", { parentType : "product", parent : pdt } );
    return field.getValue({productId:productId});
}

/*
inputjson should include the people and main, i.e. main to be validated.
Basic validations to do are as follows:
1. validate the SA limits
2. validate the age limits
3. validate the premium limits
4. If there are funds, we should also validate the fund limits ? -- later
5. there is no need to validate the coverage terms and premium terms as these should have been drop down lists provided to the ui
6. also no need to check on the attachable riders as these should have been provided as drop down lists
7. other checks relating to rtu / tot prem ratio to do later (a form of premium limit)

So for the moment, only check for SA limit, age limit and premium limits
Return an empty array if there are no errors, else an array of error messages
*/
function validate(inputjson, validatorList) {
  if ( inputjson.insuredList && inputjson.insuredList.length === 0 ) {
      let err = {};
      err[validatorList[0]] = ["There are no insureds specified in the input json"];
      return err;
      //return { "Error" : ["There are no people specified in the input json"]}
      //return { (validatorList[0]) : ["There are no people specified in the input json "] };
  }
  if ( inputjson.productList && inputjson.productList.length > 0 ) {
      // let res = inputjson.productList.map((prd) => {
      //   return (Object.keys(models.CONFIGS).indexOf(prd.productId+'') < 0 ) ? prd.productId : undefined;
      // }).filter(r => r !== undefined);
      // if (res.length <= 0){
      //   let err = {};
      //   err[validatorList[0]] = [`The product is not configured in the system (${res})`];
      //   return err;
      // }
      // let mainProductId = inputjson.mainProduct.productId;
      // let mainProductId = inputjson.productList[0].productId;
      // if ( ! _.has(models.CONFIGS, mainProductId ) ) {
      //     let err = {};
      //     err[validatorList[0]] = [`The main product requested is not configured in the system (${mainProductId})`];
      //     return err;
      //     //return { (validatorList[0]) : ["The product requested is not configured in the system"]}
      // }
  } else {
      let err = {};
      err[validatorList[0]] = ["There are no main product specified in the input json"];
      return err;
      //return { (validatorList[0]) : ["There are no products specified in the input json"]}
  }
  let errors = {};
  let ctx = new models.Context({});
  try {
    _prepareInput(ctx, inputjson);
  } catch (e) {
    return [e.message]
  }
  // tiggered using engine.validate(json, ['validateMain'])
  let ordering = {main: 0, fund: 10, loading: 20, pdt:30, r: 31, pol: 40, topup: 50, withdraw: 60};
  let keys = Object.keys(ordering), itemlist, entity, k;
  let workFields = _.sortBy(validatorList,(item) => {
      itemlist = item.split(".");
      entity = itemlist.length === 1 ? 'main' : itemlist[0];
      k = _.find(keys, (value, key) => _.startsWith(entity,value));
      return ordering[k];
  });
  _.forEach(workFields, (item,index) => {
      let errs = runValidator(ctx, item);
      if (!(_.isArray(errs))){ errs = [errs]}
      errs = _.flattenDeep(errs);
      errs = _.filter(errs, (err) => err && err.length > 0 );
    //   console.log( "** Errors for validator  ", item, errs);
      errors[item] = errs
  });
  return errors;

}


function validateMain( inputjson ) {
    if ( inputjson.insuredList && inputjson.insuredList.length === 0 ) {
        return ["There are no people specified in the input json "];
    }
    if ( inputjson.productList && inputjson.productList.length > 0 ) {
        // let mainProductId = inputjson.productList[0].productId;
        // if ( ! _.has(models.CONFIGS, mainProductId ) ) {
        //     return ["The product requested is not configured in the system"];
        // }
    } else {
        return ["There are no products specified in the input json "];
    }
    /* done with basic check */
    let errors = [];
    let ctx = new models.Context({});
    try {
      _prepareInput(ctx, inputjson);
    } catch (e) {
      return e.message
    }

    let mainConfig = getConfig(ctx.get("main").productId);
    // console.log("validateMain--> mainConfig", mainConfig.validators.validateMain);
//
// callValidator( validatorName, ctx, requestType, opts={} )

    // let main = ctx.get("main");
    // // ok what do we need to check ? start with sa limit, look at sa_limit
    // let limitRow = main.val("sa_limit");
    // let initial_sa = main.val("initial_sa");
    // if ( initial_sa < limitRow.insd_min_amount ) {
    //     errors.push("The sum assured is less than the minimum required for this product");
    // }  else if (initial_sa > limitRow.insd_max_amount ) {
    //     errors.push("The sum assured is more than the maximum allowed for this product");
    // }
    // /* next look at the age limit */
    // let entryAge = main.val("entry_age"),
    //     ageRow = main.val("age_limit");
    // if ( ageRow.min_insd_nb_age_unit === '1' && entryAge < ageRow.min_insd_nb_age) {
    //     errors.push("The insured age is less than the required minimum age for this product");
    // } else if (ageRow.max_insd_nb_age_unit === '1' && entryAge > ageRow.max_insd_nb_age) {
    //     errors.push("The insured is older than the allowed maximum age for this product");
    // }

    return errors;
}
/*
inputjson should include the people, main, and the riders that have been attached and also the rider to validate (not yet attached)
riderno specifies the rider that needs to be validated
1. Validate the sa limit
2. Validate the age limit

Return an empty array if there are no errors, else an array of error messages
*/
function validateRider( inputjson, riderno=1 ) {
    if ( inputjson.insuredList && inputjson.insuredList.length === 0 ) {
        return ["There are no people specified in the input json "];
    }
    if ( inputjson.productList && inputjson.productList.length > 0 ) {
        let mainProductId = inputjson.productList[0].productId;
        if ( ! _.has(models.CONFIGS, mainProductId ) ) {
            return ["There main plan requested is not configured in the system"];
        }
    } else {
        return ["There are no products specified in the input json "];
    }
    if (inputjson.productList && inputjson.productList.length < 2 ){
        return ["There should be at least one rider specified in the input json for validation"];
    }
    /* done with basic check */

    let errors = [];
    let ctx = new models.Context({});
    try {
      _prepareInput(ctx, inputjson);
    } catch (e) { return e.message }
    let main = ctx.get("main");
    let ridercode = "r" + riderno ; // main is always the 1st product, rider number starts from one
    let rider = ctx.get("products")[riderno];
    let riderInitialSa = rider.val("initialSa");
    let mainInitialSa = main.val("initialSa");
    let saRow = rider.val("saLimit");
    let mainRiderSaRow = main.val("mainRiderSaLimit",'*', {riderId: rider.val("productId")} );
    let riderMainRatio = riderInitialSa / mainInitialSa ;

    if ( riderInitialSa < saRow.insdMinAmount ) {
        errors.push("The sum assured is less than the minimum required for the rider");
    }  else if ( riderInitialSa > saRow.insdMaxAmount ) {
        errors.push("The sum assured is more than the maximum allowed for the rider");
    }
    if ( mainInitialSa < mainRiderSaRow.minMastSaAmt ) {
        errors.push("The main plan sum assured is less that the required minimum when atatching this rider");
    }

    if (riderInitialSa > mainRiderSaRow.maxAthSaAmt) {
        errors.push("The sum assured is more the maximum allowed when attached to the main plan");
    }
    if (riderMainRatio < mainRiderSaRow.minAthSaRate) {
        errors.push("The sum assured rate is less than the minimum required when attached to the main plan");
    }
    if (riderMainRatio > mainRiderSaRow.maxAthSaRate) {
        errors.push("The sum assured rate is more than the maximum allowed when attached to the main plan");
    }
    /* time to look at the age limits */
    let ageRow = rider.val("ageLimit"),
        mainRiderAgeRow = main.val("mainRiderAgeLimit", '*', {riderId:rider.val("productId")} ),
        mainAge = main.val("entryAge"),
        riderAge = rider.val("entryAge");
    if (ageRow.minInsdNbAgeUnit === '1') {
        if (riderAge < ageRow.minInsdNbAge) {
            errors.push("The age of the insured for the rider is less than the minimum allowed");
        } else if (riderAge > ageRow.maxInsdNbAge) {
            errors.push("The age of the insured for the rider is more than the maximum allowed");
        }
    }
    if (riderAge < mainRiderAgeRow.minAthAge) {
        errors.push("The age of the insured for the rider is less than the minimum allowed when attached to the main plan");
    }
    if (riderAge > mainRiderAgeRow.maxAthAge) {
        errors.push("The age of the insured for the rider is more than the maximum allowed when attached to the main plan");
    }
    if (mainAge < mainRiderAgeRow.minAthMastAge) {
        errors.push("The age of the insured for the main is less than the minimum allowed when the rider is attached");
    }
    if (mainAge > mainRiderAgeRow.maxAthMastAge) {
        errors.push("The age of the insured for the main is more than the maximum allowed when the rider is attached");
    }
    return errors;

}

/*
 from chrome console, call as follows for TEND02 i.e. product 5712
 engine.calc(_product5712.inputjson ,svFields=["prem"],mvFields=["ageAtT", "apt", "tpp", "sbg","accsb","svg","tsv", "dbt","pol.totPrem", "totDbt"])

 */
function calc(inputJson, svFields=[], mvFields=[]) {
    /* do a quick check that there is a main product id , and there are people */
    if ( inputJson.insuredList && inputJson.insuredList === 0 ) {
      inputJson.error = true
      return inputJson
    }
    if ( inputJson.productList && inputJson.productList.length > 0  ) {
        // defer this check till later -- as we may not have the productId but productCode instead
        // let mainProductId = inputJson.productList[0].productId;
        // if ( ! _.has(models.CONFIGS, mainProductId ) ) {
        //     return inputJson;
        // }
    } else {
      inputJson.error = true
      return inputJson;
    }

    /* ok, done with basic check */
    let ctx = new models.Context({});
    let output = _.cloneDeep(inputJson); // create a clone for the output
    try {
      _prepareInput(ctx, inputJson);
    } catch (e) {
      return e.message
    }

    let main = ctx.get("main");
    let maxT = main.val("maxT");
    ctx.set("currentT","*"); // so that it is easier
    // re-adjust the sequence of the fields, funds, before product, before policy
    let workFields = _.sortBy(svFields,(item) => {
        // return item.indexOf("fund.") === 0 ? 0 : item.indexOf("pol.") === 0 ? 2 : 1 ;
        return item.indexOf("fund") === 0 ? 1 : item.indexOf("pol.") === 0 ? 2 : 0 ;
    });

    let allFields = [].concat(svFields).concat(mvFields)
    _.forEach(allFields, (item,index) => {
        let pieces = item.split('.');
        if (pieces.length === 1) {
            pieces = ['main', item];
        }
        let product, fieldName = pieces[1];
        if ( /^r\d$/.test(pieces[0]) ) {
          // let productNo = parseInt( pieces[0].split('.')[0].substr(1) );
          let productNo = parseInt( pieces[0].substr(1) );
          product = ctx.get("products")[productNo];
          console.log("product & productNO", productNo, ctx.get("products").length )
        } else {
          product = ctx.get("main")
        }
        let config = getConfig(product.val("productId") )
        let formulas = config.formulas
        if (Object.keys(formulas).indexOf(fieldName) < 0 ) {
          throw new Error("Requested calculator is not configured")
        }
      });


    _.forEach(workFields, (item,index) => {
        let fieldValue = _getField(ctx, item);
        // console.log( "** Value for svField item ", item, fieldValue);
    });
    //  product before fund before policy
    workFields = _.sortBy(mvFields,(item) => {
        // return item.indexOf("fund") === 0 ? 0 : item.indexOf("pol.") === 0 ? 2 : 1 ;
        return item.indexOf("fund") === 0 ? 1 : item.indexOf("pol.") === 0 ? 2 : 0 ;
    });
    _.forEach(workFields, (item,index) => {
        _.forEach( _.range(1,maxT+1), (t) => {
            ctx.set("currentT", t);
            let fieldValue = _getField(ctx, item, t);
            if ( t === maxT ) {
                console.log( "** Value for item for t ", item, t, fieldValue);
            }
        });
    });
    _prepareOutput(output, ctx, svFields, mvFields );
    ctx = null;
    return output;
}
function _prepareOutput(output,ctx, svFields, mvFields) {
    let fmter;
    let policy = output;
    let people = policy.insuredList ;
    let main = policy.productList[0] || {};
    let riders = policy.productList.slice(1);
    // let products = [].concat([main]).concat(riders);
    let products = policy.productList;
    let funds = policy.fundList || [];

    let requestedFields = [].concat(svFields).concat(mvFields);
    requestedFields = requestedFields.map(f => f.split('.').length === 2 ? f.split('.')[1] : f )
    // default is to output in years instead of months
    let convertToYears
    if (policy.convertToYears) {
      convertToYears = policy.convertToYears === "Y" || policy.convertToYears === 'y' ? true : false ;
    } else {
      let config;
      if (main.productId) {
          config = getConfig(main.productId)
      } else {
        let productCodeMap = getProductCodeMap();
        config = getConfig( productCodeMap[main.productCode] )
      }
      convertToYears = config.convertToYears && config.convertToYears.toLowerCase() === 'y' ? true : false
    }
    //let funds = products.length > 0 ? products[0].funds || [] : [];
    let save;
    _.forOwn(ctx.get("policy").getFields(), (f, k) => {
        if ((f instanceof models.Field) && f.fmlaField && requestedFields.indexOf(k) >= 0 ) {
            fmter = _.isNull(f.format1) ? roundings['roundCentsHalfUp'] : roundings[f.format1]; // default is round to nearest cent

            if ( Object.keys( f.values).length > 1 ) {
                policy[k] = {};
                _.forOwn(f.values, (vv,kk) => {
                        if (convertToYears) {
                            if ( f.resolved[kk] && kk % 12 === 0) { policy[k][kk/12] = _.isNull(fmter) ? vv : _.isNumber(vv) ? fmter(vv) : vv ; }
                        } else {
                            if ( f.resolved[kk]) { policy[k][kk] = _.isNull(fmter) ? vv : _.isNumber(vv) ? fmter(vv) : vv ; }
                        }
                });
            } else if ( '*' in f.values && f.resolved['*'] ) {
                    let vv = f.values['*'];
                    policy[k] = _.isNull(fmter) ? vv : _.isNumber(vv) ? fmter(vv) : vv ;
            }
        }
    });

    let product, fund;
    _.forEach(ctx.get("products"), (pdt, index) => {
        // product = index === 0 ? main : riders[index-1]; // points to mainProduct or riderList
        product = products[index]; // point to the product to update
        _.forOwn(pdt.getFields(), (f, k) => {
            if ((f instanceof models.Field) && f.fmlaField && requestedFields.indexOf(k) >= 0 ) {
                fmter = _.isNull(f.format1) ? roundings['roundCentsHalfUp'] : roundings[f.format1]; // default is round to nearest cent
                if ( Object.keys( f.values).length > 1 ) {
                    product[k] = {};
                    _.forOwn(f.values, (vv,kk) => {
                        if (convertToYears) {
                            if ( f.resolved[kk] && kk % 12 === 0) { product[k][kk/12] = _.isNull(fmter) ? vv : _.isNumber(vv) ? fmter(vv) : vv ; }
                        } else {
                            if ( f.resolved[kk] ) { product[k][kk] = _.isNull(fmter) ? vv : _.isNumber(vv) ? fmter(vv) : vv ; }
                        }
                    });
                } else if ( '*' in f.values && f.resolved['*'] ) {
                      let vv = f.values['*'];
                    product[k] = _.isNull(fmter) ? vv : _.isNumber(vv) ? fmter(vv) : vv ;
                }
            }
        });
      });

      _.forEach(ctx.get("funds"),(fnd,indx) => {
          fund = funds[indx];
          _.forOwn(fnd.getFields(), (f,key) => {
              // debugger
              if ((f instanceof models.Field) && f.fmlaField && requestedFields.indexOf(key) >= 0 ) {
                  fmter = _.isNull(f.format1) ? roundings['roundCentsHalfUp'] : roundings[f.format1]; // default is round to nearest cent
                  if ( Object.keys( f.values).length > 1 ) { // multi valued fields
                      fund[key] = {};
                      _.forOwn(f.values, (vv,kk) => {
                          if (convertToYears) {
                              if ( f.resolved[kk] && kk % 12 === 0 ) { fund[key][kk] = _.isNull(fmter) ? vv : _.isNumber(vv) ? fmter(vv) : vv ; }
                          } else {
                              if ( f.resolved[kk] ) { fund[key][kk] = _.isNull(fmter) ? vv : _.isNumber(vv) ? fmter(vv) : vv ; }
                          }
                      });
                  } else if ( '*' in f.values && f.resolved['*'] ) { //single value field
                      let vv = f.values['*'];
                      fund[key] = _.isNull(fmter) ? vv : _.isNumber(vv) ? fmter(vv) : vv ;
                  }
              }
          });
      });

    return output;
    // console.log( "*** output", output);
}

function runValidator(ctx,item,t='*') {
    let pieces = item.split('.');
    if (pieces.length === 1) {
        pieces = ['main', item];
    }
    if (pieces[0].substr(0,4).toLowerCase() === '_pdt' || pieces[0].toLowerCase() === 'main') {
        let validatorName = pieces[1];
        let product;
        if ( pieces[0].toLowerCase() === 'main' ){
            product = ctx.get("main");
        } else {
            let pdtCode = pieces[0].substr(4);
            let products = ctx.get("products");
            let theProduct = _.filter(products, (product) => {
                return product.val("productCode") === pdtCode ;
            });
            product = theProduct.length > 0 ? theProduct[0] : null;
        }
        ctx.set("product", product);
        ctx.set("productId", product.val("productId"));
        return product.validate(validatorName);

    } else if ( /^r\d$/.test(pieces[0]) ) {
        // e.g. r1.prem, pieces[0] = r1
        let productNo = parseInt( pieces[0].split('.')[0].substr(1) );
        let product = ctx.get("products")[productNo];
        // debugger;
        ctx.set("product", product);
        ctx.set("productId", product.input("productId"));
        return product.validate(pieces[1]);

    } else if ( pieces[0].substr(0,3) === 'pol' ) {
        let validatorName = pieces[1];
        let policy = ctx.get("policy");
        let main = ctx.get("main");
        ctx.set("product",main);
        ctx.set("productId",main.val("productId"));
        return policy.validate(validatorName);
    } else if ( pieces[0].toLowerCase().substr(0,4) === 'fund' ) {
        let fundCode = pieces[0].substr(4).toLowerCase();
        let funds = ctx.get("funds");
        let wantedFund = _.filter(funds, (fund) => {
            return fund.val("fundCode") === fundCode ;
        });
        let ffund = wantedFund.length > 0 ? wantedFund[0] : null;
        let validatorName = pieces[1];
        ctx.set("fund", ffund);
        ctx.set("product", ctx.get("main") );
        ctx.set("productId", ctx.get("main").val("productId"));
        return ffund.validate(validatorName);
    } else if (pieces[0].toLowerCase().substr(0,5) === 'topup'){ // syntax is topup.1 where 1 == year
        let policy = ctx.get("policy");
        let topups = policy.val("topups");
        let year = parseInt(pieces[1]);
        let wlist = _.filter(topups,(atu) => atu.val("year") === year );
        if (wlist.length > 0) {
          let topup = wlist[0];
          return topup.validate(validatorName);
        }
        throw Error("Unable to locate topup validator " + validatorName);

    } else if (pieces[0].toLowerCase().substr(0,5) === 'withdraw') { // syntax is withdraw.1 where 1 == year
      let policy = ctx.get("policy");
      let topups = policy.val("withdrawals");
      let year = parseInt(pieces[1]);
      let wlist = _.filter(topups,(atu) => atu.val("year") === year );
      if (wlist.length > 0) {
        let withdrawal = wlist[0];
        return withdrawal.validate(validatorName);
      }
      throw Error("Unable to locate withdrawal validator " + validatorName);
    }
}

function _getField(ctx,item,t='*') {
    let pieces = item.split('.');
    if (pieces.length === 1) {
        pieces = ['main', item];
    }
    if (pieces[0].substr(0,4).toLowerCase() === '_pdt' || pieces[0].toLowerCase() === 'main') {
        let fname = pieces[1];
        let product;
        if ( pieces[0].toLowerCase() === 'main' ){
            product = ctx.get("main");
        } else {
            let pdtCode = pieces[0].substr(4);
            let products = ctx.get("products");
            let theProduct = _.filter(products, (product) => {
                return product.val("productCode") === pdtCode ;
            });
            product = theProduct.length > 0 ? theProduct[0] : null;
        }
        ctx.set("product", product);
        ctx.set("productId", product.val("productId"));
        // console.log("_getField", ctx.get("productId") );
        return product.val(fname,t);
    } else if ( /^r\d$/.test(pieces[0]) ) {
        // e.g. r1.prem, pieces[0] = r1
        let productNo = parseInt( pieces[0].split('.')[0].substr(1) );
        let product = ctx.get("products")[productNo];
        // debugger
        ctx.set("product", product);
        ctx.set("productId", product.val("productId"));
        return product.val(pieces[1],t);

    } else if ( pieces[0].substr(0,3) === 'pol' ) {
        let fname = pieces[1];
        let policy = ctx.get("policy");
        let main = ctx.get("main");
        ctx.set("product",main);
        ctx.set("productId",main.val("productId"));
        return policy.val(fname,t);
    } else if ( pieces[0].toLowerCase().substr(0,4) === 'fund' ) {
        let fundCode = pieces[0].substr(4).toLowerCase();
        let funds = ctx.get("funds");
        let wantedFund = _.filter(funds, (fund) => {
            return fund.val("fundCode").toLowerCase() === fundCode ;
        });
        let ffund = wantedFund.length > 0 ? wantedFund[0] : null;
        let fname = pieces[1];
        ctx.set("fund", ffund);
        ctx.set("product", ctx.get("main") );
        ctx.set("productId", ctx.get("main").val("productId"));
        return ffund.val(fname,t);
    }
}
function _prepareInput(ctx, inputJson) {
    let input = _.cloneDeep(inputJson);
    let policy = input || {};
    let people = policy.insuredList || [] ;
    // let main = policy.mainProduct || {};
    // let riders = policy.riderList || [];
    // let products = [].concat([main]).concat(riders);
    let products = policy.productList || [];
    let main = products.length > 0 ? products[0] : {};
    let topups = policy.topupList || [];
    let withdrawals = policy.withdrawalList || [];
    let funds = policy.fundList || [];
    let loadings;
    loadings = [];
    // console.log("B4....", new Date());
    let productCodeMap = getProductCodeMap();
    // console.log("After....", new Date());
    let configuredProducts = Object.keys( models.CONFIGS )
    products.forEach(prd => {
        if (!prd.productId && prd.productCode) {prd.productId = productCodeMap[prd.productCode]}
        if (configuredProducts.indexOf(prd.productId+'') < 0) {
          throw new Error(`Product ${prd.productCode + '(' + prd.productId + ')'} is not a configured product`)
        }
    })
    let mainProductId = main.productId;
    // now we check if the mainProduct is configured
    // if ( ! _.has(models.CONFIGS, mainProductId ) ) {
    //     return input;
    // }
    let pol = new models.Entity(ctx, 'policy', mainProductId, {});
    ctx.set("policy", pol);
    _.forOwn(policy, (v,k) => {
        if (! ( k === 'insuredList' || k === 'mainProduct' || k === 'fundList' || k === 'riderList' || k === "topupList" || k === "withdrawalList") ) {
            let f = new models.Field(ctx, k, {parentType:'policy',parent:pol, inputField:true, value:v} );
            pol.setField(k,f);
            pol[k] = function(t) { return pol.val(k,t) } ;
        } else {
          if (k === 'topupList' || k === 'withdrawalList') {
            // how do we expect the data ? [ {'year':1, amount:100000},{'year':20,'amount':203000}]
            let doc, ff, rows = [];
            let entityType = (k === 'topupList') ? 'topup' : 'withdrawal';
            _.forEach(v,(row,index)=> {
                doc = new models.Entity( ctx, entityType, mainProductId, {} );
                _.forOwn(row,(vv,kk) => {
                    ff = new models.Field(ctx, k, {parentType:entityType, parent:doc, inputField:true, value:vv});
                    doc.setField(kk,ff);
                    doc[kk] = function(t) { return doc.val(kk,t) } ; // what is this for again ? topup.amount(2) ?? new syntax
                });
                rows.push(doc);
            });
            pol.setField(k,rows); // just set it as array as it passed in from input -- array of objects
            pol[k] = function(t){ return pol.val(k,t)}
          }
        }
    });
    let policyFields = pol.getFields();
    // this code below needs to be validated again :: TODO ::
    if (!('topupList' in policyFields)){
        pol.setField('topups',[]);
        pol['topups'] = function(t){ return pol.val('topups',t)}
    }
    if (!('withdrawalList' in policyFields)){
        pol.setField('withdrawals',[]);
        pol['withdrawals'] = function(t){ return pol.val('withdrawals',t)}
    }
    let fnds = []
    _.forEach(funds, (fund,index) => {
        let row = new models.Entity( ctx, 'fund', mainProductId, {} );
        _.forOwn(fund, (v,k) => {
            let f = new models.Field(ctx, k, {parentType:'fund', parent:row, inputField:true, value:v});
            row.setField(k,f);
            row[k] = function (t) {return  row.val(k,t) };
        });
        fnds.push(row);
    });
    ctx.set("funds",fnds);
    pol.setField("fundList",fnds);
    pol['fundList'] = function(t){return pol.val('funds',t)}

    let prds = []
    _.forEach(products, (prod,i) => {
        let productId = prod.productId;
        let row = new models.Entity( ctx, 'product', productId, {} );
        // debugger
        let hasLoadings = false;
        _.forOwn(prod, (v,k) => {
            // if ( i === 0 && k === 'funds' ) {
            //     row.setField("funds", fnds);
            //     row['funds'] = function(t) { return row.val('funds',t)}
            // } else {
                if (k === 'loadings') {
                  hasLoadings = true;
                  let doc, ff,loadings=[];
                  _.forEach(v,(loading,index) => {
                      doc = new models.Entity( ctx, 'loading', productId, {} );
                      _.forOwn(loading,(vv,kk) => {
                          ff = new models.Field(ctx, kk, {parentType:'loading',parent:doc,inputField:true, value:vv});
                          doc.setField(kk,ff);
                          doc[kk] = function(t) { return doc.val(kk,t) } ;
                      });
                      loadings.push(doc);
                  });
                  row.setField(k, loadings);
                  row[k] = function(t){ return row.val(k,t)}
                } else {
                  let f = new models.Field(ctx, k, {parentType:'product',parent:row,inputField:true, value:v});
                  row.setField(k,f);
                  row[k] = function(t) { return row.val(k,t) } ;
                }
            //}
        });
        if (!hasLoadings) {
          row.setField("loadings",[]);
          row['loadings'] = function(t){ return row.val('loadings',t)}
        }
        prds.push(row);
        if (i === 0) { ctx.set("main", row); }
        pol.setField("products",prds);
        pol['products'] = function(t){return pol.val('products',t)}
        ctx.set("products", prds);
        let riders = prds.length > 1 ? prds.slice(1) : [];
        ctx.set("riders", riders)
    });


    let ppls = []
    _.forEach(people, (person,i) => {
        let row = new models.Entity( ctx, 'insuredList', mainProductId , {} );
        _.forOwn(person, (v,k) => {
            let f = new models.Field(ctx, k, {parentType:'Insured',parent:row, inputField:true, value:v});
            row.setField(k,f);
            row[k] = function (t) { return row.val(k,t) } ;
        });
        ppls.push(row);
    });
    pol.setField("insuredList",ppls);
    pol['insuredList'] = function(t){return pol.val('insuredList',t)}
    ctx.set("people",ppls);
    let common = new models.Entity( ctx, 'product', 0, {} );
    let productData = new models.Field(ctx, 'productData', {parentType:'product',parent:common, dbField:true});
    ctx.set("commonData", productData)
    input = null;
    ctx.set("_getConfig", getConfig); // used for formulas and validators to get hold of the config object
    return ctx;

}
function getInsurers() {
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', 0, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "getInsurers", { parentType : "policy", parent : null } );
    let insurers = field.getValue({productId:0});
    return insurers
}
function getInsurer(insurerId) {
  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', 0 , {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "insurer", { parentType : "product", parent : pdt } );
  let row = field.getValue('*',{organId: insurerId + '' });
  return row
}
function getPackages() {
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', 0, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "getPackages", { parentType : "policy", parent : null } );
    let packages = field.getValue({productId:0});
    // need to do more work using the main product in the productList
    let pkgList = [], newpkg;
    packages.forEach( pkg => {
      let mainProduct, products = [];
      pkg.productList.forEach(pp => {
         let productLife = productInfo(pp.productId);
         products.push( Object.assign({insType: productLife.insType , packageProductName: productLife.productName, version: null, doctype:'PackageProduct' },pp)) // no version no yet
         if (productLife.insType === '1') mainProduct = pp;
      })
      pkg.productList = products; // overwrite with enhanced object
      if (mainProduct) {
         let coverageTerms = availableCoverageTerms(mainProduct.productId);
         let paymentTerms = availablePremiumPaymentTerms(mainProduct.productId)
         pkg.coveragePeriods = coverageTerms;
         pkg.premiumPaymentTerms = paymentTerms;

         // get the attachable riders based on what is in the productList
         let riders = pkg.productList.filter( prd  => prd.insType !== '1').map(prd => {return {productId: prd.productId, lifeAssuredNumber:0 } })
         let json = {insuredList:[{name:'example', gender: 'MALE', age: pkg.minAgeUnit === '1' ? pkg.minAge : 20}],
                     productList: [mainProduct]}
         let res = availableRiders(json)
         pkg.attachableRiders = res

      } else {
        pkg.coveragePeriods = []
        pkg.premiumPaymentTerms = []
        pkg.attachableRiders = []
      }


      // convert to required format
      newpkg = {};
      newpkg.packageId = pkg.packageId
      newpkg.productId = pkg.productId
      newpkg.packageCode = pkg.packageCode
      newpkg.packageName = pkg.packageName
      newpkg.examplePremium = pkg.examPrem;
      newpkg.favourite = false; // fix later ::TODO::
      newpkg.isNew = false ; // -- ditto --
      newpkg.productCategory = pkg.salesType;
      newpkg.ageLimit = {minAge:pkg.minAge, minAgeUnit: pkg.minAgeUnit, maxAge: pkg.maxAge, maxAgeUnit: pkg.maxAgeUnit}
      newpkg.amountLimit = {minAmount:pkg.minAmount, maxAmount: pkg.maxAmount, currency: pkg.moneyId }
      newpkg.visitNumber = 0;
      let doc;
      newpkg.tagList = pkg.tagList.map( tag => {
          doc = {}
          Object.keys(fieldMappings.tagListMapper).forEach( key => {
            if (key in tag) doc[fieldMappings.tagListMapper[key]] = key === 'pk' ? tag[key].split(':')[1] : tag[key]
          })
          return doc
      })
      newpkg.coveragePeriods = pkg.coveragePeriods.map( row => {
        doc = {}
        Object.keys(fieldMappings.coveragePeriodMapper).forEach( key => {
          if (key in row) doc[fieldMappings.coveragePeriodMapper[key]] =  row[key]
        })
        return doc
      })
      newpkg.premiumPaymentTerms = pkg.premiumPaymentTerms.map( row => {
        doc = {}
        Object.keys(fieldMappings.premiumPaymentTermMapper).forEach( key => {
          if (key in row) doc[fieldMappings.premiumPaymentTermMapper[key]] =  row[key]
        })
        return doc
      })
      newpkg.highlights = pkg.highlights.map( row => {
        doc = {}
        Object.keys(fieldMappings.highlightsMapper).forEach( key => {
          if (key === 'pk' && key in row) {
            doc['displayOrder'] =  row[key].split(':')[2];
            doc['highlightId'] = row[key].split(':')[1]
          } else {
            if (key in row) doc[fieldMappings.highlightsMapper[key]] = row[key]
          }

        })
        return doc
      })
      newpkg.liabilities = pkg.liabilities.map( row => {
        doc = {}
        Object.keys(fieldMappings.liabilityMapper).forEach( key => {
          if (key === 'pk' && key in row) {
            doc['liabId'] = row[key].split(':')[2]
            doc['displayOrder'] =  row[key].split(':')[3];
          } else {
            if (key in row) doc[fieldMappings.liabilityMapper[key]] = row[key]
          }

        })
        return doc
      })
      doc = {};
      Object.keys(fieldMappings.insurerMapper).forEach( key => {
          if (key in pkg.insurer) doc[fieldMappings.insurerMapper[key]] = pkg.insurer[key]
      })
      newpkg.insurer = doc;

      // features
      newpkg.features = pkg.features.map( tag => {
          doc = {}
          Object.keys(fieldMappings.featureMapper).forEach( key => {
            if (key in tag) doc[fieldMappings.featureMapper[key]] = key === 'pk' ? tag[key].split(':')[1] : tag[key]
          })
          return doc
      })

      newpkg.productList = pkg.productList.map( tag => {
          doc = {}
          Object.keys(fieldMappings.packageProductMapper).forEach( key => {
            if (key in tag) doc[fieldMappings.packageProductMapper[key]] =  tag[key]
          })
          return doc
      })
      newpkg.attachableRiders = pkg.attachableRiders.map( tag => {
          doc = {}
          Object.keys(fieldMappings.productAttachableRiderMapper).forEach( key => {
            if (key in tag) doc[fieldMappings.productAttachableRiderMapper[key]] =  tag[key]
          })
          return doc
      })

      pkgList.push(newpkg)
    })
    return pkgList
    // return packages
}
function getPackage(packageCode) {

  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', 0 , {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "getPackage", { parentType : "product", parent : pdt } );
  let pkg = field.getValue('*',{packageCode});

  if ( Object.keys(pkg).length == 0 ) return {}

  let mainProduct, products = [];
  pkg.productList.forEach(pp => {
     let productLife = productInfo(pp.productId);
     products.push( Object.assign({insType: productLife.insType , packageProductName: productLife.productName, version: null, doctype:'PackageProduct' },pp)) // no version no yet
     if (productLife.insType === '1') mainProduct = pp;
  })
  pkg.productList = products; // overwrite with enhanced object
  if (mainProduct) {
     let coverageTerms = availableCoverageTerms(mainProduct.productId);
     let paymentTerms = availablePremiumPaymentTerms(mainProduct.productId)
     pkg.coveragePeriods = coverageTerms;
     pkg.premiumPaymentTerms = paymentTerms;

     // get the attachable riders based on what is in the productList
     let riders = pkg.productList.filter( prd  => prd.insType !== '1').map(prd => {return {productId: prd.productId, lifeAssuredNumber:0 } })
     let json = {insuredList:[{name:'example', gender: 'MALE', age: pkg.minAgeUnit === '1' ? pkg.minAge : 20}],
                 productList: [mainProduct]}
     let res = availableRiders(json)
     pkg.attachableRiders = res

  } else {
    pkg.coveragePeriods = []
    pkg.premiumPaymentTerms = []
    pkg.attachableRiders = []
  }
  // convert to required format
  newpkg = {};
  newpkg.packageId = pkg.packageId
  newpkg.productId = pkg.productId
  newpkg.packageCode = pkg.packageCode
  newpkg.packageName = pkg.packageName
  newpkg.examplePremium = pkg.examPrem;
  newpkg.favourite = false; // fix later ::TODO::
  newpkg.isNew = false ; // -- ditto --
  newpkg.productCategory = pkg.salesType;
  newpkg.ageLimit = {minAge:pkg.minAge, minAgeUnit: pkg.minAgeUnit, maxAge: pkg.maxAge, maxAgeUnit: pkg.maxAgeUnit}
  newpkg.amountLimit = {minAmount:pkg.minAmount, maxAmount: pkg.maxAmount, currency: pkg.moneyId }
  newpkg.visitNumber = 0;
  let doc;
  newpkg.tagList = pkg.tagList.map( tag => {
      doc = {}
      Object.keys(fieldMappings.tagListMapper).forEach( key => {
        if (key in tag) doc[fieldMappings.tagListMapper[key]] = key === 'pk' ? tag[key].split(':')[1] : tag[key]
      })
      return doc
  })
  newpkg.coveragePeriods = pkg.coveragePeriods.map( row => {
    doc = {}
    Object.keys(fieldMappings.coveragePeriodMapper).forEach( key => {
      if (key in row) doc[fieldMappings.coveragePeriodMapper[key]] =  row[key]
    })
    return doc
  })
  newpkg.premiumPaymentTerms = pkg.premiumPaymentTerms.map( row => {
    doc = {}
    Object.keys(fieldMappings.premiumPaymentTermMapper).forEach( key => {
      if (key in row) doc[fieldMappings.premiumPaymentTermMapper[key]] =  row[key]
    })
    return doc
  })
  newpkg.highlights = pkg.highlights.map( row => {
    doc = {}
    Object.keys(fieldMappings.highlightsMapper).forEach( key => {
      if (key === 'pk' && key in row) {
        doc['displayOrder'] =  row[key].split(':')[2];
        doc['highlightId'] = row[key].split(':')[1]
      } else {
        if (key in row) doc[fieldMappings.highlightsMapper[key]] = row[key]
      }

    })
    return doc
  })
  newpkg.liabilities = pkg.liabilities.map( row => {
    doc = {}
    Object.keys(fieldMappings.liabilityMapper).forEach( key => {
      if (key === 'pk' && key in row) {
        doc['liabId'] = row[key].split(':')[2]
        doc['displayOrder'] =  row[key].split(':')[3];
      } else {
        if (key in row) doc[fieldMappings.liabilityMapper[key]] = row[key]
      }

    })
    return doc
  })
  doc = {};
  Object.keys(fieldMappings.insurerMapper).forEach( key => {
      if (key in pkg.insurer) doc[fieldMappings.insurerMapper[key]] = pkg.insurer[key]
  })
  newpkg.insurer = doc;

  // features
  newpkg.features = pkg.features.map( tag => {
      doc = {}
      Object.keys(fieldMappings.featureMapper).forEach( key => {
        if (key in tag) doc[fieldMappings.featureMapper[key]] = key === 'pk' ? tag[key].split(':')[1] : tag[key]
      })
      return doc
  })

  newpkg.productList = pkg.productList.map( tag => {
      doc = {}
      Object.keys(fieldMappings.packageProductMapper).forEach( key => {
        if (key in tag) doc[fieldMappings.packageProductMapper[key]] =  tag[key]
      })
      return doc
  })
  newpkg.attachableRiders = pkg.attachableRiders.map( tag => {
      doc = {}
      Object.keys(fieldMappings.productAttachableRiderMapper).forEach( key => {
        if (key in tag) doc[fieldMappings.productAttachableRiderMapper[key]] =  tag[key]
      })
      return doc
  })

  return newpkg
  // return pkg || {}
}
function lifePackageProduct(productId) {
  if ( ! _.has(models.CONFIGS,productId ) ) {
      return {} ; // empty object if not configured
  }
  let ctx = new models.Context({});

  // have to include the common data as we need it
  let common = new models.Entity( ctx, 'product', 0, {} );
  let productData = new models.Field(ctx, 'productData', {parentType:'product',parent:common, dbField:true});
  ctx.set("commonData", productData)

  let pdt = new models.Entity( ctx, 'product', productId, {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "packageProductLife", { parentType : "product", parent : pdt } );
  let prd = field.getValue('*',{productId:productId, prdId : productId});
  prd.productId = productId
  let newp = prdData(ctx, prd)
  return newp

}


function getPackageInitialData(packageCode){
  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', 0 , {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "getPackage", { parentType : "product", parent : pdt } );
  let pkg = field.getValue('*',{packageCode});
  if (Object.keys(pkg).length  === 0 ) return pkg ; // returns a blank object
  // find the main product in the product list
  let mainProduct = pkg.productList.map(p => Object.assign({productId: p.productId},productInfo(p.productId)) ).find(prd => prd.insType === '1')
  // return pkg
  // console.log("mainProductId", mainProduct)
  if (!mainProduct) return {} // if there are no main product

  let main = new models.Entity( ctx, 'product', mainProduct.productId, {} )
  ctx.set("product",main);
  let mainField = new models.Field( ctx, "attachableRiders", { parentType : "product", parent : main } );
  let attachableRiders = mainField.getValue('*', {productId: mainProduct.productId});

  let data = {};
  data.packageId = pkg.packageId;
  data.packageCode = packageCode;
  data.packageName = pkg.packageName
  doc = {};
  Object.keys(fieldMappings.insurerMapper).forEach( key => {
      if (pkg.insurer && key in pkg.insurer) doc[fieldMappings.insurerMapper[key]] = pkg.insurer[key]
  })
  data.insurer = doc;

  data.suggestedReason = pkg.suggestReason
  let lifeProduct, rider;

  let prods = pkg.productList.map(pp => {
      lifeProduct = lifePackageProduct(pp.productId)
      rider = attachableRiders.find(r => r.attachId === pp.productId)
      lifeProduct.attachCompulsory = rider ? rider.attachCompulsory : "0"
      lifeProduct.saEqual = rider ? rider.noEqual : "W"
      return lifeProduct
  });
  data.productList = prods;
  return data

}

function getPackageFilters() {
    let ctx = new models.Context({});
    let pdt = new models.Entity( ctx, 'product', 0, {} );
    ctx.set("product",pdt);
    let field = new models.Field( ctx, "getInsurers", { parentType : "policy", parent : null } );
    let pkgLiabs = new models.Field( ctx, "salesPackageLiabilities", { parentType : "policy", parent : null } );
    let categories = new models.Field( ctx, "salesPackageProductCategories", { parentType : "policy", parent : null } );
    let insurers = field.getValue({productId:0}).map(doc => { return {insurerId: doc.insurerId , insurerName: doc.companyName}})
    let salesPackageLiabilities = pkgLiabs.getValue({productId:0}).map(doc => { return {liabId: doc.liabId, liabDesc: doc.liabDesc}})
    let salesPackageProductCategories = categories.getValue({productId:0}).map(doc => {return {categoryId:doc.productCategory, categoryName: doc.typeName }})
    return {insurers, salesPackageLiabilities, salesPackageProductCategories}
}
function getPackageProduct(packageCode, prdId) {
  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', 0, {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "getPackageProduct", { parentType : "product", parent : pdt } );
  let packageProduct =  field.getValue('*',{packageCode,prdId});
  doc = {}
  Object.keys(fieldMappings.packageProductMapper).forEach( key => {
    if (key in packageProduct) doc[fieldMappings.packageProductMapper[key]] =  packageProduct[key]
  })
  return doc
}
function planInfo4Product(productId) {
  if ( ! _.has(models.CONFIGS,productId ) ) {
      return {} ; // empty object if not configured
  }
  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', 0 , {} );
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "planInfo", { parentType : "product", parent : pdt } );
  let planInfo =  field.getValue('*',{prdId:productId});
  // put the insurer through the field mapping
  doc = {};
  Object.keys(fieldMappings.insurerMapper).forEach( key => {
      if (planInfo.insurer && key in planInfo.insurer) doc[fieldMappings.insurerMapper[key]] = planInfo.insurer[key]
  })
  planInfo.insurer = doc;

  return planInfo

}


exp =   { calc, calcAge, calcAge4Product, availablePlans, availablePaymentFrequencies, availablePremiumTerms, availablePolicyTerms,
          availableCurrencies, availableRiders, getConfig, validateRider, validate, availableFunds, availableBenefitPlans,
          availablePaymentMethods, productInfo, availablePolicyEndAges, availableBenefitLevels, getProductOptions, getProductCodeMap,
          getInsurers, getInsurer, getPackages, getPackage, availableCoverageTerms, availablePremiumPaymentTerms, getPackageFilters,
          getPackageProduct, availableProducts, getLifeProduct, getAvailableRiders, getPackageInitialData, getLifePackageProduct, planInfo4Product
        }

module.exports = exp;
