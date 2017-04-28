// import _ from "lodash";
// import moment from "moment";
// import * as utils from "./utils.js";
// import * as models from "./models.js";
// import * as roundings from "./roundings.js";
// import * as validators from "./validators";

'use strict'

let exp = {}
let _ = require('lodash')
let moment = require('moment')
let utils = require('./utils')
let models = require('./models')
let roundings = require('./roundings')

function calcAge( dob, ageMethod="ALAB") {
    //  default to ALAB if not provided. Can happen when we are only entering the person info and no product is selected
    return utils.calcAge(ageMethod, dob);
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
    _.sortBy(levels,['level']).forEach(level => result[level.level] = level.sa );
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
  // need to go to 2 separate tables , fund & product fund
  let ctx = new models.Context({});
  let pdt = new models.Entity( ctx, 'product', 0, {} ); // note _product0
  ctx.set("product",pdt);
  let field = new models.Field( ctx, "currencies", { parentType : "product", parent : pdt } );
  let currencies = field.getValue({productId:0});
  let ccyMap = {};

  _.forEach(currencies, (ccy) => ccyMap[ccy.moneyId] = ccy.moneyName  );
  let pdt2 = new models.Entity( ctx, 'product', _.parseInt(productId), {} ); // note product id - our required product id
  let field2 = new models.Field( ctx, "availableCurrencies", { parentType : "product", parent : pdt2 } );
  let wantedRows = field2.getValue({productId:productId});

  let result = {},row;
  wantedRows.forEach(ccy => result[ccy.moneyId] = ccyMap[ parseInt(ccy.moneyId)] );
//  _.forEach(wantedRows, (item) => {
//      row={};
//      row['moneyId'] = parseInt(item.moneyId)
//      row['moneyName'] = ccyMap[ parseInt(item.moneyId ) ] ;
//      result.push(row);
//  })
  return result;
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

/* Get the coverageTerms */
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
        _.range(start, row.year + 1).forEach(yr => tt.push( String(row.year - yr) ))
        _.orderBy( _.uniq( tt) ).filter( t => t > 4 ).forEach( t => rowmap[t+''] = t+'');
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
So expect a normal input json = { policy : "products" : [ {"main".....},{"rider"....} ], "people" : [ { "Insured"....} ] }
*/
function availableRiders( inputjson ) {
    // validate json should be in the above structure
    if ( ! _.isPlainObject(inputjson)) { throw Error("Parameter must be an object representing the input JSON")}
    //if ( "policy" in inputjson ) {
        let policy = inputjson ; // .policy;
        if ( "productList" in policy && "insuredList" in policy) {
            let products = policy.productList;
            if ( products.length > 0 ) {
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

function productInfo(productId) {
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
      // let mainProductId = inputjson.mainProduct.productId;
      let mainProductId = inputjson.productList[0].productId;
      if ( ! _.has(models.CONFIGS, mainProductId ) ) {
          let err = {};
          err[validatorList[0]] = ["The main product requested is not configured in the system"];
          return err;
          //return { (validatorList[0]) : ["The product requested is not configured in the system"]}
      }
  } else {
      let err = {};
      err[validatorList[0]] = ["There are no main product specified in the input json"];
      return err;
      //return { (validatorList[0]) : ["There are no products specified in the input json"]}
  }
  let errors = {};
  let ctx = new models.Context({});
  _prepareInput(ctx, inputjson);
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
        let mainProductId = inputjson.productList[0].productId;
        if ( ! _.has(models.CONFIGS, mainProductId ) ) {
            return ["The product requested is not configured in the system"];
        }
    } else {
        return ["There are no products specified in the input json "];
    }
    /* done with basic check */
    let errors = [];
    let ctx = new models.Context({});
    _prepareInput(ctx, inputjson);
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
    _prepareInput(ctx, inputjson);
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
    // console.log("calc function", svFields)
    if ( inputJson.insuredList && inputJson.insuredList === 0 ) { return inputJson }
    if ( inputJson.productList && inputJson.productList.length > 0  ) {
        let mainProductId = inputJson.productList[0].productId;
        if ( ! _.has(models.CONFIGS, mainProductId ) ) {
            return inputJson;
        }
    } else { return inputJson; }

    /* ok, done with basic check */
    let ctx = new models.Context({});
    let output = _.cloneDeep(inputJson); // create a clone for the output
    _prepareInput(ctx, inputJson);
    let main = ctx.get("main");
    let maxT = main.val("maxT");
    ctx.set("currentT","*"); // so that it is easier
    // re-adjust the sequence of the fields, funds, before product, before policy
    let workFields = _.sortBy(svFields,(item) => {
        // return item.indexOf("fund.") === 0 ? 0 : item.indexOf("pol.") === 0 ? 2 : 1 ;
        return item.indexOf("fund") === 0 ? 1 : item.indexOf("pol.") === 0 ? 2 : 0 ;
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
    let requestedFields = [].concat(svFields).concat(mvFields);
    // default is to output in years instead of months
    let  convertToYears = policy.convertToYears && policy.convertToYears === "Y" ? true : false ;
    let people = policy.insuredList ;
    let main = policy.productList[0] || {};
    let riders = policy.productList.slice(1);
    // let products = [].concat([main]).concat(riders);
    let products = policy.productList;
    let funds = policy.fundList || [];
    //let funds = products.length > 0 ? products[0].funds || [] : [];
    let save;
    _.forOwn(ctx.get("policy").getFields(), (f, k) => {
        if ((f instanceof models.Field) && f.fmlaField && requestedFields.indexOf(k) >= 0 ) {
            fmter = _.isNull(f.format1) ? roundings['roundCentsHalfUp'] : roundings[f.format1]; // default is round to nearest cent

            if ( Object.keys( f.values).length > 1 ) {
                policy[k] = {};
                _.forOwn(f.values, (vv,kk) => {
                        if (inYears) {
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
              if ((f instanceof models.Field) && f.fmlaField && requestedFields.indexOf(k) >= 0 ) {
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

    let mainProductId = main.productId;
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
        pol.setField('topupList',[]);
        pol['topupList'] = function(t){ return pol.val('topupList',t)}
    }
    if (!('withdrawalList' in policyFields)){
        pol.setField('withdrawalList',[]);
        pol['withdrawalList'] = function(t){ return pol.val('withdrawalList',t)}
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

exp =   { calc, calcAge, calcAge4Product, availablePlans, availablePaymentFrequencies, availablePremiumTerms, availablePolicyTerms,
          availableCurrencies, availableRiders, getConfig, validateRider, validate, availableFunds, availableBenefitPlans,
          availablePaymentMethods, productInfo, availablePolicyEndAges, availableBenefitLevels, getProductOptions
        }

module.exports = exp;
