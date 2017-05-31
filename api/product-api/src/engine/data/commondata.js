// import _ from "lodash";
// import moment from "moment";
// import * as utils from "../utils.js";

let _ = require('lodash');
let moment = require('moment');
let utils = require('../utils');

let exp = {};

/**
* this function needs to be overridden for each product
*/
exp.producData =  function producData(ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    return {}; // default implementation returns nothing -- code for each product needs to implement this
}

function _getRow(ctx, pol, ppl, pdt, fund, t, opts, tname, stopOnMissingRow=true) {
    let pid = _.has(opts,'productId') ? opts.productId : pdt.val("productId");
    let data = pdt.val("productData", t, { pid : pid } );
    if ( tname in data ) {
        let table = data[tname];
        let key = utils.toKey(tname, table._meta, opts, stopOnMissingRow);
        if ( key in table) {
            let row = utils.toRow(table._meta._cols, table[key]);
            return row ;
        }
    }
    return {};
}
exp.productLife =  function ( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    let tname = 'productLife';
    let opts = { productId : pdt.val("productId")}
    opts = _.extend(opts,factors);
    let row =  _getRow(ctx, pol, ppl, pdt, fund, t,opts,tname)
    return row
}
exp.packageProductLife = function ( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {

    let productData = pdt.val("productData")
    let table = productData["productLife"];
    let commonData = ctx.get("commonData");
    let data = commonData.getValue({productId:0});

    let productPackage = data["productPackage"]
    let productPkgProduct = data["productPkgProduct"]
    let salesPackageExtend = data["salesPackageExtend"]
    let salesProductExtend = data["salesProductExtend"]
    let salesPackageLiability = data["salesPackageLiability"]
    let salesPackageType = data["salesPackageType"]
    let insurers = data["salesCompany"]
    let cols = table._meta._cols;
    // let products = [];
    let opts = { productId : pdt.val("productId")}
    opts = _.extend(opts,factors);
    let productId = _.parseInt(opts.productId || opts.prdId)
    let row = utils.toRow(table._meta._cols, table[productId])
    if (!row) return {}

    row['productId'] = productId+''
    row.pk = row.productId
    // getting the insurer code is a pain
    let dockey = Object.keys(productPkgProduct).find(key => key.split(':')[1] === productId+'' )
    let doc, insurerId, packageId;
    let docProductLife = utils.toRow(table._meta._cols, table[row.productId])
    row.isWaiver = docProductLife.waiver
    row.pointToPh = docProductLife.waiver === 'Y' || docProductLife.isPayerWop === 'Y' ? "Y" : "N"
    row.isAnnuityProduct = docProductLife.benefitType === '41' ? "Y" : "N"
    row.pointToSpouse = docProductLife.spouseProdIndi
    wantedRows = Object.keys(salesPackageLiability).filter(k => k !== '_meta').
                 filter(pk => pk.split(':')[1] === row.productId + '').
                 map(key => Object.assign({pk:key}, utils.toRow(salesPackageLiability._meta._cols, salesPackageLiability[key] )));
    row["liabilityList"] = wantedRows
    if (dockey) {
        row.isPackageProduct = "Y"
        packageId = dockey.split(':')[0]

        doc = Object.keys(salesPackageExtend).filter(key => key !== '_meta').map(key => Object.assign({pk:key},utils.toRow(salesPackageExtend._meta._cols, salesPackageExtend[key]))).find(item => item.packageId + '' === packageId )
        if (doc) {
          insurerId = doc.companyId + '';
          row.insurer = insurerId in insurers ? Object.assign({insurerId:insurerId},utils.toRow(insurers._meta._cols, insurers[insurerId])) : {}
          row.packageCode = doc.pk
          let doc2 = utils.toRow(productPackage._meta._cols, productPackage[row.packageCode])
          row.ageRange = {minAge: doc2.minAge, minAgeUnit: doc2.minAgeUnit, maxAge: doc2.maxAge, maxAgeUnit: doc2.maxAgeUnit }
          let docSpe = utils.toRow(salesProductExtend._meta._cols, salesProductExtend[row.productId])
          row.pointToSecInsured = docSpe.relatedSecInsured
          row.smokingIndi = docSpe.smokingIndi
          row.jobIndi = docSpe.docIndi
          row.socialInsureIndi = docSpe.socialInsureIndi
          row.displayPremiumIndi = doc.salesPremIndi

        }
        // get the saleCategory
        doc = Object.keys(salesPackageType).filter(key => key !== '_meta').map(key => Object.assign({pk:key},utils.toRow(salesPackageType._meta._cols, salesPackageType[key]))).find(item => item.pk.split(':')[0] === packageId )
        if (doc) { row.salesCategory = doc.pk.split(':')[1]; row.salesCategoryName = doc.typeName}
    }

  return row
}
exp.planInfo = function ( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {

    // let productData = pdt.val("productData")
    // let table = productData["productLife"];
    // let commonData = ctx.get("commonData");


    let data = pdt.val("productData")
    let productLife = data['productLife']

    let productPackage = data["productPackage"]
    let productPkgProduct = data["productPkgProduct"]
    let salesPackageExtend = data["salesPackageExtend"]
    let salesProductExtend = data["salesProductExtend"]
    let salesPackageLiability = data["salesPackageLiability"]
    let salesPackageType = data["salesPackageType"]
    let insurers = data["salesCompany"]
    let insuranceSpirit = data["salesCompanySpirit"]
    let valueAdded = data["salesCompanyValueadded"]
    let features = data["salesPackageFeature"]
    let highlights = data["salesPackageRight"]

    // let cols = productLife._meta._cols;
    // let products = [];
    let opts = { productId : pdt.val("prdId")}
    opts = _.extend(opts,factors);
    let productId = _.parseInt(opts.productId || opts.prdId)
    let tpl = utils.toRow(productLife._meta._cols, productLife[productId], false)
    if (!tpl) return {}

    let row = {}

    // row['productId'] = productId+''
    // row.pk = row.productId
    // row['productCode'] = tpl.internalId
    // row['productName'] = tpl.productName

    // getting the insurer code is a pain
    let dockey = Object.keys(productPkgProduct).find(key => key.split(':')[1] === productId+'' )
    if (!dockey) return {}

    let doc, insurerId, packageId;
    let docProductLife = row; //utils.toRow(table._meta._cols, table[row.productId])
    // row.isWaiver = docProductLife.waiver
    // row.pointToPh = docProductLife.waiver === 'Y' || docProductLife.isPayerWop === 'Y' ? "Y" : "N"
    // row.isAnnuityProduct = docProductLife.benefitType === '41' ? "Y" : "N"
    // row.pointToSpouse = docProductLife.spouseProdIndi
    wantedRows = Object.keys(salesPackageLiability).filter(k => k !== '_meta').
                 filter(pk => pk.split(':')[1] === row.productId + '').
                 map(key => Object.assign({liabId:key.split(':')[2], displayOrder: parseInt(key.split(':')[3])}, utils.toRow(salesPackageLiability._meta._cols, salesPackageLiability[key], false )));

    row["planliabilityList"] = wantedRows
        // row.isPackageProduct = "Y"
    packageId = dockey.split(':')[0]
    doc = Object.keys(salesPackageExtend).filter(key => key !== '_meta').map(key => Object.assign({pk:key},utils.toRow(salesPackageExtend._meta._cols, salesPackageExtend[key]))).find(item => item.packageId + '' === packageId )
    if (doc) {

      insurerId = doc.companyId + '';
      row.insurer = insurerId in insurers ? Object.assign({insurerId:insurerId},utils.toRow(insurers._meta._cols, insurers[insurerId], false) ) : {}
      row.packageCode = doc.pk
      let doc2 = utils.toRow(productPackage._meta._cols, productPackage[row.packageCode])
      row.packageName = doc2.packageName
      // row.ageRange = {minAge: doc2.minAge, minAgeUnit: doc2.minAgeUnit, maxAge: doc2.maxAge, maxAgeUnit: doc2.maxAgeUnit }
      let docSpe = utils.toRow(salesProductExtend._meta._cols, salesProductExtend[row.productId])

      // get the value added
      row.planValueAdded = Object.keys(valueAdded).filter(k => k !== '_meta').filter(pk => pk.split(':')[0] === insurerId).
                   map(k => Object.assign( {valueAddedId: k.split(':')[1]} , utils.toRow(valueAdded._meta._cols, valueAdded[k], false ) ) )

      row.planInsuranceSpirit = Object.keys(insuranceSpirit).filter(k => k !== '_meta').filter(pk => pk.split(':')[0] === insurerId).
                    map(k => Object.assign( {spiritId: k.split(':')[1]} , utils.toRow(insuranceSpirit._meta._cols, insuranceSpirit[k], false ) ) )

      row.planHighlistList = Object.keys(highlights).filter(k => k !== '_meta').filter(pk => pk.split(':')[0] === packageId).
                    map(k => Object.assign( {highlightId: k.split(':')[1], displayOrder: k.split(':')[2]} , utils.toRow(highlights._meta._cols, highlights[k], false ) ) )


      row.planFeatureList = Object.keys(features).filter(k => k !== '_meta').filter(pk => pk.split(':')[0] === packageId).
                    map(k => Object.assign( {featureId: k.split(':')[1]} , utils.toRow(features._meta._cols, features[k], false ) ) )

      row.showValueAdd = "Y"; // for moment say yes and display all the value add
      row.valueAddedIdList = row.planValueAdded.map(r => r.valueAddedId)
      row.insuranceSpirit = docSpe.defaultSpirit || ''

      // row.pointToSecInsured = docSpe.relatedSecInsured
      // row.smokingIndi = docSpe.smokingIndi
      // row.jobIndi = docSpe.docIndi
      // row.socialInsureIndi = docSpe.socialInsureIndi
      // row.displayPremiumIndi = doc.salesPremIndi

    }
    // get the saleCategory
    // doc = Object.keys(salesPackageType).filter(key => key !== '_meta').map(key => Object.assign({pk:key},utils.toRow(salesPackageType._meta._cols, salesPackageType[key]))).find(item => item.pk.split(':')[0] === packageId )
    // if (doc) { row.salesCategory = doc.pk.split(':')[1]; row.salesCategoryName = doc.typeName}

  return row
}

exp.jobUnderwrite =  function jobUnderwrite( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    let tname = 'jobUnderwrite';
    // assume we are trying to retrieve for the life assured
    let person = ppl[ pdt.input('lifeAssuredNumber') ];
    let uwTable = pdt.dbval('productLife').underwriteJob;
    let opts = { jobCateId : person.val('occupation') || '999', underwriteJob : uwTable } // need to get hold of productLife
    opts = _.extend(opts,factors);
    let commonData = ctx.get("commonData");
    let data = commonData.getValue({productId:0});
    if (tname in data) {
        let table = data[tname];
        let key = utils.toKey(tname, table._meta, opts,false);
        if ( key in table) {
            let row = utils.toRow(table._meta._cols, table[key]);
            return row ;
        }
    }
    return {}
}
exp.fundData =  function fundData( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    let tname = 'fund';
    let opts = { fundCode : fund.val("fundCode") } // need to get hold of productLife
    opts = _.extend(opts,factors);
    let commonData = ctx.get("commonData");
    let data = commonData.getValue({productId:0});
    if (tname in data) {
        let table = data[tname];
        let key = utils.toKey(tname, table._meta, opts);
        if ( key in table) {
            let row = utils.toRow(table._meta._cols, table[key]);
            return row ;
        }
    }
    return {}
}

exp.saUnitRate = function saUnitRate ( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = _.extend({},factors );
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'unitAmount')
}

exp.lsadRate = function lsadRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = _.extend({},factors );
    if (!('saAmount' in opts)) { opts['saAmount'] = pdt.val("saCalculated"); }
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'largeSaDiscountRate')
}

function _premiumFactors( ctx, pol, ppl, pdt, fund, t='*', factors ) {
        let la = ppl[pdt.val("lifeAssuredNumber")];
        let ageMethod = pdt.val("ageMethod");
        let dob = la.val("birthDate");
        let gender = la.input("gender").substring(0,1).toLowerCase();
        let smoker = la.input("smoking").toLowerCase() === 'smoker' ? 'Y' : la.input("smoking").toLowerCase() === 'non-smoker' ? "N" : "*";
        //let jobClass = la.val("jobClass");
        let jobClass = pdt.val("jobClass");
        let coverageTerm = pdt.val("coverageTerm",t);
        let benefitLevel = pdt.val("benefitLevel",t);
        let initialSa = pdt.val("sumAssured");
        let saUnitRate = pdt.val("saUnitRate");
        let insuredStatus = la.val("insuredStatus");
        let loanRate = pdt.val("loanRate",t);
        let premiumTerm = pdt.val("premiumTerm",t);
        return {
            age : utils.calcAge(ageMethod, dob),
            gender : gender === 'm' ? "M" : gender === 'f' ? "F" : "W", // map into internal values
            smoking : smoker === null ? "W" : smoker ? "Y" : "N",
            jobClass : jobClass,
            period : coverageTerm ? parseInt(coverageTerm) * 12 : null, // multiply by 12 as period is in months
            coverageTerm : coverageTerm,
            benefitLevel : benefitLevel ? benefitLevel : null,
            amount : initialSa ? initialSa : null,
            // units : saUnitRate,
            insuredStatus : insuredStatus ? insuredStatus : null,
            loanRate : loanRate ? loanRate : "0.0",
            premiumYear : premiumTerm ? premiumTerm : null
        }
}
exp.premiumRate =  function premiumRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = _.extend( _premiumFactors( ctx, pol, ppl, pdt, fund, t='*', factors) , factors );
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'')
}
exp.premiumRateendowment =  function( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = _.extend( _premiumFactors( ctx, pol, ppl, pdt, fund, t='*', factors) , factors );
    opts.entryAge = opts.age
    debugger
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'premiumRateendowment')}


exp.ageLimit = function ageLimit( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {

        let opts = {
            chargePeriod : pdt.val("chargePeriod"),
            chargeYear : pdt.val("chargeYear"),
            coveragePeriod : pdt.val("coveragePeriod"),
            coverageYear : pdt.val("coverageYear"),
            payPeriod : pdt.val("payPeriod"),
            payYear : pdt.val("payYear"),
            endPeriod : pdt.val("endPeriod"),
            endYear : pdt.val("endYear"),
            chargeType : pol.val("premiumFrequency") || pdt.val("paymentMode"),
            sa : pdt.val("saCalculated")
        };
        opts = _.extend(opts, factors);
        return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'ageLimit')
}

exp.mainRiderAgeLimit = function mainRiderAgeLimit( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    if ( !factors.riderId && !factors.attachId) { return {} } // must provide the rider_id or attach_id
    let opts = {
        attachId : factors.riderId || factors.attachId
    }
    opts = _.extend(opts, factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'mainRiderAgeLimit')
}

exp.mainRiderSaLimit = function mainRiderSaLimit( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    if ( !factors.riderId && !factors.attachId) { return {} } // must provide the rider_id or attach_id
    let la = ppl[ parseInt( pdt.input("lifeAssuredNumber")) ],
        gender = la.input("gender").toLowerCase(),
        opts = {
            attachId : factors.riderId || factors.attachId,
            age : pdt.val("entryAge"),
            gender : gender === "male" ? "M" : gender === "female" ? "F" : "W" ,
            jobClass : '*', // we do not have, just default to '*'
        };
    opts = _.extend(opts,factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'mainRiderSaLimit')
}

exp.riderRiderSaLimit = function riderRiderSaLimit( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    if ( !factors.riderId && !factors.attachId) { return {} } // must provide the rider_id or attach_id
    let la = ppl[ parseInt( pdt.input("lifeAssuredNumber")) ],
        gender = la.input("gender").toLowerCase(),
        opts = {
            attachId : factors.riderId || factors.attachId,
            age : pdt.val("entryEge"),
            gender : gender === "male" ? "M" : gender === "female" ? "F" : "W" ,
            jobClass : '*', // we do not have, just default to '*'
        };
    opts = _.extend(opts,factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'riderRiderSaLimit')
}

exp.saLimit = function saLimit( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let la = ppl[ parseInt( pdt.input("lifeAssuredNumber")) ],
        opts = {
            payMode : pdt.val("paymentMethod"),
            insuredStatus : la.val("insuredStatus"),
            ageMonth : pdt.val("entryAge") * 12 ,
            // jobCate : la.val("jobClass"),
            jobCate : pdt.val("jobClass"),
            moneyId : pdt.input("moneyId") ? pdt.input("moneyId") : null,
        };

    opts = _.extend(opts, factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'saLimit')

}

exp.premiumLimit =  function premiumLimit( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let ccy = pdt.input("moneyId") ? pdt.input("moneyId") : null,
        opts = {
            payMode : pdt.val("paymentMethod"),
            chargeType :pol.val("premiumFrequency") || pdt.val("paymentMode"),
            moneyId : ccy,
            age : pdt.val("entryAge")
        };
    opts = _.extend(opts, factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'premLimit')
}

exp.cashValue = function cashValue( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    let la = ppl[ parseInt( pdt.input("lifeAssuredNumber")) ],
        dob = la.input("dob"),
        ageMethod = pdt.val("ageMethod"),
        age = utils.calcAge(ageMethod, dob),
        gender = la.input("gender").toLowerCase(),
        opts = {
            age : age,
            ageMonth : age * 12,
            benefitLevel : pdt.val("benefitLevel") || pdt.val("benefitPlanLevel",t,factors).level || null,
            chargeType : pol.val("premiumFrequency") || pdt.val("paymentMode"),
            gender : gender === 'male' ? "M" : gender === 'female' ? "F" : "W" ,
            smoking : la.input("smoker") === null ? "W" : la.input("smoker") ? "Y" : "N",
            payYear : pdt.val("payYear"),
            insuredCategory : la.val("insuredCategory"),
            insuredStatus : la.val("insuredStatus"),
            // jobCate : la.val("jobClass"),
            jobCate : pdt.val("jobClass"),
            period : pdt.val("coverTerm") * 12,
            premiumYear : pdt.val("premiumTerm"),
            year : t,
        };
    opts = _.extend(opts, factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'cashValue')
}

exp.chargesModalFactor =  function chargesModalFactor( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    factors.modelType = 3;
    return modalFactor(ctx, pol, ppl, pdt, fund, t, factors);
}
exp.policyFeeModalFactor =  function policyFeeModalFactor( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    factors.modelType = 2;
    return modalFactor(ctx, pol, ppl, pdt, fund, t, factors);
}
exp.modalFactor =  function modalFactor( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let main = ctx.get("main");
    let opts = {
            chargeType : main.input("paymentMode"),
            modelType : 1, // default is for premium modal factor
    };
    opts = _.extend(opts, factors);
    let data = _getRow(ctx, pol, ppl, pdt, fund, t, opts,'modelFactor')
    return data;
}

exp.unitRate =  function unitRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = {};
    opts = _.extend(opts, factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'productUnitRate')
}


exp.sbConfig = function sbConfig( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    let opts = { liabId : 301 }
    opts = _.extend(opts, factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'liabilityConfig')
}

exp.sbPay =  function sbPay( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    let opts = { liabId : 301, month : pdt.val('yr',t) * 12 ,  }
    opts = _.extend(opts, factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'payLiability', false)
}

exp.saSchedule = function saSchedule( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    let opts = { policyYear : pdt.val("yr",t) }
    opts = _.extend(opts, factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'saSchedule')
}

exp.lienRate = function lienRate( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    let opts = { age : pdt.val("ageAtT",t) }
    opts = _.extend(opts, factors);
    return _getRow(ctx, pol, ppl, pdt, fund, t, opts,'lienRate')

}

/* functions for helping with apis  */

exp.availableMainPlans = function availableMainPlans( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let data = pdt.val("productData");
    let table = data["productLife"];
    let cols = table._meta._cols;
    let products = [];
    _.forOwn(table,(data,k)=> {
       if (k !== '_meta') {
            let row = utils.toRow(cols,data);
            row['productId'] = _.parseInt(k); // include back the productId
            if (row.insType === '1') { products.push( row ); } // only main plans
       }
    });
    return products;
}
exp.availableProducts = function( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let data = pdt.val("productData");
    let table = data["productLife"];
    let productPackage = data["productPackage"]
    let productPkgProduct = data["productPkgProduct"]
    let salesPackageExtend = data["salesPackageExtend"]
    let salesProductExtend = data["salesProductExtend"]
    let salesPackageLiability = data["salesPackageLiability"]
    let salesPackageType = data["salesPackageType"]
    let insurers = data["salesCompany"]
    let cols = table._meta._cols;
    let products = [];
    _.forOwn(table,(tableData,k)=> {
       if (k !== '_meta') {
            let row = utils.toRow(cols,tableData);
            row['productId'] = _.parseInt(k); // include back the productId
            row.pk = row.productId
            // getting the insurer code is a pain
            let dockey = Object.keys(productPkgProduct).find(key => key.split(':')[1] === k )
            let doc, insurerId, packageId;
            let docProductLife = utils.toRow(table._meta._cols, table[row.productId])
            row.isWaiver = docProductLife.waiver
            row.pointToPh = docProductLife.waiver === 'Y' || docProductLife.isPayerWop === 'Y' ? "Y" : "N"
            row.isAnnuityProduct = docProductLife.benefitType === '41' ? "Y" : "N"
            row.pointToSpouse = docProductLife.spouseProdIndi
            wantedRows = Object.keys(salesPackageLiability).filter(k => k !== '_meta').
                         filter(pk => pk.split(':')[0] === row.productId + '').
                         map(key => Object.assign({pk:key}, utils.toRow(salesPackageLiability._meta._cols, salesPackageLiability[key] )));
            row["liabilityList"] = wantedRows

            if (dockey) {
                row.isPackageProduct = "Y"
                packageId = dockey.split(':')[0]

                doc = Object.keys(salesPackageExtend).filter(key => key !== '_meta').map(key => Object.assign({pk:key},utils.toRow(salesPackageExtend._meta._cols, salesPackageExtend[key]))).find(item => item.packageId + '' === packageId )
                if (doc) {
                  insurerId = doc.companyId + '';
                  row.insurer = insurerId in insurers ? Object.assign({insurerId:insurerId},utils.toRow(insurers._meta._cols, insurers[insurerId])) : {}
                  row.packageCode = doc.pk
                  let doc2 = utils.toRow(productPackage._meta._cols, productPackage[row.packageCode])
                  row.ageRange = {minAge: doc2.minAge, minAgeUnit: doc2.minAgeUnit, maxAge: doc2.maxAge, maxAgeUnit: doc2.maxAgeUnit }
                  let docSpe = utils.toRow(productPackage._meta._cols, salesProductExtend[row.productId])
                  row.pointToSecInsured = docSpe.relatedSecInsured
                  row.smokingIndi = docSpe.smokingIndi
                  row.jobIndi = docSpe.docIndi
                  row.socialInsureIndi = docSpe.socialInsureIndi
                  row.displayPremiumIndi = doc.salesPremIndi

                }
                // get the saleCategory
                doc = Object.keys(salesPackageType).filter(key => key !== '_meta').map(key => Object.assign({pk:key},utils.toRow(salesPackageType._meta._cols, salesPackageType[key]))).find(item => item.pk.split(':')[0] === packageId )
                if (doc) { row.salesCategory = doc.pk.split(':')[1]; row.salesCategoryName = doc.typeName}
            }





            products.push(row)
       }
    });
    return products;
}

exp.coiRate =  function coiRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let la = ppl[pdt.val("lifeAssuredNumber")], gender = la.val("gender").toLowerCase();
    let opts = _.extend({
      gender : gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
      age : pdt.val("ageAtT",t)
    },factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'insuranceChargeRate');
}

exp.fundLowRate =  function fundLowRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    return fundPerformanceRate( ctx, pol, ppl, pdt, fund, t, _.extend(factors,{'type':'LOW'}) );
}
exp.fundMidRate = function fundMidRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    return fundPerformanceRate( ctx, pol, ppl, pdt, fund, t, _.extend(factors,{'type':'MID'}) );
}
exp.fundHighRate = function fundHighRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    return fundPerformanceRate( ctx, pol, ppl, pdt, fund, t, _.extend(factors,{'type':'HIGH'}) );
}
function fundPerformanceRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
  let opts = _.extend({},factors);
  // hack, if no fundCode provided , we use the fund code of the 1st fund
  if (! opts.fundCode) {
      if (fund) {
          opts.fundCode = fund.val("fundCode");
      } else if (pol.val("products")[0].val("funds").length > 0 ) {
          opts.fundCode = pol.val("products")[0].val("funds")[0].fundCode;
      } else {
          return {}
      }
  }
  return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'investmentPerformance');
}
exp.ilpPolFeeRate =  function ilpPolFeeRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let options = {
      policyYear : pdt.val("yr",t) ,
      chargeType : pol.val("premiumFrequency") || pdt.val("paymentMode"),
      discountType : 0,
      moneyId : pdt.input("moneyId") || null
    }
    let opts = _.extend(options, factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'policyFeeIlpDefault' );
}

exp.atuExpenseFee = function atuExpenseFee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    return expenseFee(ctx,pol,ppl,pdt,fund,t,_.extend({premType:4},factors))
}
exp.tpExpenseFee =  function tpExpenseFee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    return expenseFee(ctx,pol,ppl,pdt,fund,t,_.extend({premType:2},factors))
}
exp.rtuExpenseFee = function rtuExpenseFee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    return expenseFee(ctx,pol,ppl,pdt,fund,t,_.extend({premType:3},factors))
}
exp.spExpenseFee =  function spExpenseFee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    return expenseFee(ctx,pol,ppl,pdt,fund,t,_.extend({premType:1},factors))
}
function expenseFee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = _.extend({
      policyYear : pdt.val('yr',t),
    },factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'expenseFeeDefault' );
}
exp.premiumRateaccident =  function premiumRateaccident( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let la = ppl[pdt.val("lifeAssuredNumber")], gender = la.val("gender").toLowerCase();
    let opts = _.extend({
      period : t,
    //   jobClass : la.val('jobClass'),
      jobClass : pdt.val('jobClass'),
      gender : gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
      age : pdt.val("ageAtT",t)
    },factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'premiumRateaccident' );
}
exp.premiumRatereimbursement = function premiumRatereimbursement( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let la = ppl[pdt.val("lifeAssuredNumber")], gender = la.val("gender").toLowerCase();
    let opts = _.extend({
    //   jobClass : la.val("jobClass"),
      jobClass : pdt.val("jobClass"),
      gender : gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
      age : pdt.val("ageAtT",t),
      benefitLevel : pdt.val("benefitLevel") || pdt.val("benefitPlanLevel",t,factors).level,
      effectiveDate : moment(pol.val("proposalStartDate"),['D-M-YYYY','YYYY-M-D','D-M-YYYY HH:mm:ss','YYYY-M-D HH:mm:ss']).format('YYYY-MM-DD')
    },factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'premiumRatereimbursement' );
}
exp.premiumRatecashBenefit =  function premiumRatecashBenefit( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let la = ppl[pdt.val("lifeAssuredNumber")], gender = la.val("gender").toLowerCase(), effDate = pol.val("proposalStartDate"),
        opts = _.extend({
          gender : gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
          age : pdt.val("ageAtT",t),
          effectiveDate : moment(effDate,['D-M-YYYY','YYYY-M-D','D-M-YYYY HH:mm:ss','YYYY-M-D HH:mm:ss']).format('YYYY-MM-DD'),
          benefitLevel : pdt.val("benefitLevel") || pdt.val("benefitPlanLevel",t,factors).level,
        },factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'premiumRatecashBenefit');
}
exp.premiumRateCash =  function( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let la = ppl[pdt.val("lifeAssuredNumber")], gender = la.val("gender").toLowerCase(), effDate = pol.input("startDate"),
        opts = _.extend({
          gender : gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
          age : pdt.val("ageAtT",t),
          effectiveDate : moment(effDate,['D-M-YYYY','YYYY-M-D','D-M-YYYY HH:mm:ss','YYYY-M-D HH:mm:ss']).format('YYYY-MM-DD'),
          benefitLevel : pdt.val("benefitLevel") || pdt.val("benefitPlanLevel",t,factors).level,
        },factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'premiumRateCash');
}

exp.benefitPlanLevel =  function benefitPlanLevel( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = _.extend({
      sa : pdt.val("saCalculated")
    },factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'benefitPlanLevel');
}

exp.inflationRate = function inflationRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = _.extend({year:t},factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'inflationRate');
}

exp.minMaxSaMultiple = function minMaxSaMultiple( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let la = ppl[pdt.val("lifeAssuredNumber")], gender = la.val("gender").toLowerCase(),
        opts = _.extend({
          gender : gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
          age : pdt.val("entryAge"),
          paymentFrequency : pol.val("paymentFrequency") || pdt.val("paymentMode")
        },factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'allowedMultipleTimesOfTargetPremiumUnitLink');
}
exp.ilpSurrenderChargeRate = function ilpSurrenderChargeRate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = _.extend({
      policyYear : pdt.val('yr',t),
    },factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'surrenderChargeRate');
}
exp.productFund = function productFund( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let opts = _.extend({},factors);
    return _getRow(ctx, pol, ppl, pdt, fund,t,opts,'productFund');
}


/* *************************************************************************************************************************************
* returns multiple rows , to support allowables / availables
* THE CODE BELOW IS TO SUPPORT THE ALLOWABLES SET OF APIs
*************************************************************************************************************************************** */

exp.availableMainPlans =  function availableMainPlans( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let data = pdt.val("productData");
    let table = data["productLife"];
    let cols = table._meta._cols;
    let products = [];
    _.forOwn(table,(data,k)=> {
       if (k !== '_meta') {
            let row = utils.toRow(cols,data);
            row['productId'] = _.parseInt(k); // include back the productId
            if (row.insType === '1') { products.push( row ); } // only main plans
       }
    });
    return products;
}
exp.productCodeMap =  function ( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
  // let tname = 'productLife';
  // let commonData = ctx.get("commonData");
  // let data = commonData.getValue({productId:0});
  // if (tname in data) {
  //   let table = data[tname];
  //   let productMap = {}
  //   Object.keys(table).forEach( key => {
  //       let row = utils.toRow(table._meta._cols, table[key])
  //       productMap[row.internalId] = row.productId
  //   })
  //  }

    let data = pdt.val("productData");
    let table = data["productLife"];
    let cols = table._meta._cols;
    let productMap = {};
    _.forOwn(table,(data,k)=> {
       if (k !== '_meta') {
            let row = utils.toRow(cols,data);
            productMap[row.internalId] = _.parseInt(k)
       }
    });
    return productMap;
}

exp.coverageTerms = function coverageTerms( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let pid = _.has(factors,'productId') ? factors.productId : pdt.val("productId");
    let data = pdt.val("productData", t, { pid : pid } );
    let terms = data["productAllowables"]["coverageTerms"][0]; // index 0 holds the data returns a list of lists e.g. [ ['3',100], ['2',50] ]
    let termList = [];
    _.forEach(terms, (value) => {
        termList.push( {period:value[0], year: value[1]} );
    });
    return termList;
}

exp.premiumTerms =  function premiumTerms( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let pid = _.has(factors,'productId') ? factors.productId : pdt.val("productId");
    let data = pdt.val("productData", t, { pid : pid } );
    let terms = data["productAllowables"]["premiumTerms"][0]; // returns a list of lists e.g. [ ['2',5], ['2',10], ['2',15] ]
    let termList = [];
    _.forEach(terms, (value) => {
        termList.push( {period:value[0], year: value[1]} );
    });
    return termList;
}

exp.paymentFrequencies =  function paymentFrequencies( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let pid = _.has(factors,'productId') ? factors.productId : pdt.val("productId");
    let data = pdt.val("productData", t, { pid : pid } );
    let rows = data["productAllowables"]["paymentFreq"][0]; // returns a list of list. each list has only 1 attribute
    let freqs = [];
    _.forEach(rows, (value) => {
        freqs.push( value[0] );
    });
    return freqs;
}
exp.payMethods  = function payMethods( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let pid = _.has(factors,'productId') ? factors.productId : pdt.val("productId");
    let data = pdt.val("productData", t, { pid : pid } );
    let terms = data["productAllowables"]["payMethods"][0]; // returns a list of lists e.g. [ ['2',5], ['2',10], ['2',15] ]
    let rows = [];
    _.forEach(terms, (value) => {
        rows.push( { chargeType : value[0], premSequen : value[1], payMode : value[2] } );
    });
    return rows;
}
exp.attachableRiders =  function attachableRiders( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
    let pid = _.has(factors,'productId') ? factors.productId : pdt.val("productId");
    let data = pdt.val("productData", t, { pid : pid } );
    let table = data["productAllowables"]["attachableRiders"];
    let rows = table[0];
    let names = table[2];
    let record;
    let riders = _.map(rows, (fields) => {
        record = {};
        _.forEach(fields,(col,index) => {
            record[  names[index] ] = col;
        });
        return record;
    });
    return riders;
}
exp.availableFunds  =  function availableFunds( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let data = pdt.val("productData");
    let table = data["productFund"];
    if (Object.keys(table).length === 0) return []

    let cols = table._meta._cols;
    let funds = [];
    _.forOwn(table,(data,k)=> {
       if (k !== '_meta') {
            let row = utils.toRow(cols,data);
            row['fundCode'] = k.split(':')[1] ; //_.parseInt(k); // include back the productId
            funds.push(row)
       }
    });
    return funds;
}
// export function product_currency( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
exp.availableCurrencies = function availableCurrencies( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {

    let commonData = ctx.get("commonData");
    let data = commonData.getValue({productId:0});
    let table, currencies = {};
    let rows = [];
    const currencyTable = 'money'
    if (currencyTable in data) {
        table = data[currencyTable];
        Object.keys(table).forEach( key => {
            let row = utils.toRow(table._meta._cols, table[key])
            currencies[row.moneyId] = [key, row.moneyName]
        })
        // let key = utils.toKey(tname, table._meta, opts);
        // if ( key in table) {
        //     let row = utils.toRow(table._meta._cols, table[key]);
        //     return row ;
        // }

        data = pdt.val('productData');
        table = data["productCurrency"];
        if (!table) return [];
        let cols = table._meta._cols;
        _.forOwn(table,(doc,k)=> {
           if (k !== '_meta') {
                let id = k.split(':')[2]
                let curr = currencies[id] || {};
                let row = {code: curr[0], name: curr[1], currencyId: id}
                rows.push(row)
           }
        });


    }

    // let data = pdt.val("productData");
    // let table = data["productCurrency"];
    // if (!table) { return [] }
    // let cols = table._meta._cols;
    // let rows = [];
    // _.forOwn(table,(data,k)=> {
    //    if (k !== '_meta') {
    //         let row = utils.toRow(cols,data);
    //         row['moneyId'] = parseInt( k.split(':')[2] ) ; //_.parseInt(k); // include back the productId
    //         rows.push(row)
    //    }
    // });
    return rows;
}

exp.funds = function funds( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
  let data = pdt.val("productData");
  let table = data["fund"],
      funds = [];
  if (table) {
      let cols = table._meta._cols;
      _.forOwn(table,(data,k)=> {
         if (k !== '_meta') {
              let row = utils.toRow(cols,data);
              row['fundCode'] = k;
              funds.push(row);
         }
      });
  }
  return funds;
}

exp.currencies =  function currencies( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
  let data = pdt.val("productData");
  let table = data["money"],  rows = [];
  if (table) {
      let cols = table._meta._cols;
      _.forOwn(table,(data,k)=> {
         if (k !== '_meta') {
              let row = utils.toRow(cols,data);
              row['moneyCode'] = k;
              rows.push(row);
         }
      });
  }
  return rows;
}

exp.benefitPlans = function benefitPlans( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let data = pdt.val("productData");
    // let table = data["benefitLevel"];
    let table = data["benefitPlanLevel"];
    if (!table) { return []}

    let cols = table._meta._cols;
    let rows = [];
    _.forOwn(table,(data,k)=> {
       if (k !== '_meta') {
            let row = utils.toRow(cols,data);
            // row['level'] = k.split(':')[1]
            row['sa'] = k.split(':')[1]
            rows.push(row)
       }
    });
    return rows;
}
exp.benefitLevels = function( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let data = pdt.val("productData");
    // let table = data["benefitLevel"];
    let table = data["benefitLevel"];
    if (!table) { return []}

    let cols = table._meta._cols;
    let rows = [];
    _.forOwn(table,(data,k)=> {
       if (k !== '_meta') {
            let row = utils.toRow(cols,data);
            row['level'] = k.split(':')[1]
            rows.push(row)
       }
    });
    return rows;
}
// exp.coverageTerms = function( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
//     let data = pdt.val("productData");
//     let table = data["lifeBasic"];
//     if (!table) { return []}
//
//     let cols = table._meta._cols;
//     let rows = [];
//     _.forOwn(table,(data,k)=> {
//        if (k !== '_meta') {
//             let row = utils.toRow(cols,data);
//             row['level'] = k.split(':')[1]
//             rows.push(row)
//        }
//     });
//     return rows;
// }



exp.availableRiders =  function availableRiders( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let data = pdt.val("productData");
    let table = data["productLife"];
    let cols = table._meta._cols;
    let products = [];
    _.forOwn(table,(data,k)=> {
       if (k !== '_meta') {
            let row = utils.toRow(cols,data);
            row['productId'] = _.parseInt(k); // include back the productId
            if (row.insType === '2') { products.push( row ); }
       }
    });
    return products;
}

exp.mutuallyExclusiveRiders =  function mutuallyExclusiveRiders( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let pid = _.has(factors,'riderId') ? factors.riderId : pdt.val("productId");
    let data = pdt.val("productData");
    let table = data["riderGroups"][pid];
    if ( table ) {
        return table.mex;
    }
    return [];
}

exp.dependentRiders = function dependentRiders( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let pid = _.has(factors,'riderId') ? factors.riderId : pdt.val("productId");
    let data = pdt.val("productData");
    let table = data["riderGroups"][pid];
    if ( table ) {
        return table.deps;
    }
    return [];
}

exp.saLimitGroups = function saLimitGroups( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let pid = _.has(factors,'riderId') ? factors.riderId : pdt.val("productId");
    let data = pdt.val("productData");
    let table = data["riderGroups"][pid];
    if ( table ) {
        return table.saLimit;
    }
    return [];
}
exp.getInsurers = function ( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
    let data = pdt.val("productData");
    let table = data["salesCompany"];
    let cols = table._meta._cols;
    let insurers = [];
    _.forOwn(table,(data,k)=> {
       if (k !== '_meta') {
            let row = utils.toRow(cols,data);
            row['insurerId'] = _.parseInt(k); // include back the productId
            insurers.push( row);
       }
    });
    return insurers;
}
exp.insurer =  function ( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    let tname = 'salesCompany';
    let opts = { productId : 0 }
    opts = _.extend(opts,factors);
    let row =  _getRow(ctx, pol, ppl, pdt, fund, t,opts,tname, false); // stopOnError = false
    if (Object.keys(row).length > 0) row['insurerId'] = opts.organId
    return row
}

exp.getPackages = function ( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {
  let data = pdt.val("productData");
  let sp = data["productPackage"];
  let cols = sp._meta._cols;
  let packages = [], pkgid;
  _.forOwn(sp,(doc,k)=> {
     if (k !== '_meta') {
          let pkg = utils.toRow(cols,doc);
          pkgData(data, pkg, k);
          packages.push( pkg);
     }
  });
  return packages;

}
exp.getPackage = function ( ctx, pol, ppl, pdt, fund, t='*', factors={} ) {

  let data = pdt.val("productData");
  let sp = data["productPackage"];
  let packageCode = factors.packageCode;
  let row = {};
  if (packageCode in data["productPackage"]) {
      doc = data["productPackage"][packageCode];
      row = utils.toRow(sp._meta._cols,doc);
      pkgData(data, row, packageCode);
  }
  return row;

}

function pkgData(data, pkg,packageCode) {
  let spe = data["salesPackageExtend"];
  let spLabels = data["salesPackageLabel"]
  let spRights = data["salesPackageRight"]
  let spLiabs = data["salesPackageLiability"]
  let insurers = data["salesCompany"]
  let spFeatures = data["salesPackageFeature"]
  let packageProducts = data["productPkgProduct"]
  let productLifeAll = data["productLife"]

  pkg['packageCode'] = packageCode; // include back the packageCode
  pkgid = pkg['packageId']
  // find the sales package extend row
  let doc = {}
  if (packageCode in spe) {
    doc = utils.toRow(spe._meta._cols, spe[packageCode] )
  }
  pkg = Object.assign(pkg, doc);
  let insurerId = pkg['companyId'] + '' ; // make sure it is a string

  let wantedRows = Object.keys(spLabels).filter(key => key !== '_meta').
                   map(key => Object.assign({pk:key}, utils.toRow(spLabels._meta._cols, spLabels[key] ))).
                   filter( row => row.pk.split(':')[0] === (pkgid+'') );
  pkg["tagList"] = wantedRows;
  // next sales package rights
  wantedRows = Object.keys(spRights).filter(k => k !== '_meta').
               map(key => Object.assign({pk:key}, utils.toRow(spRights._meta._cols, spRights[key] ))).
               filter(row => row.pk.split(':')[0] === pkgid + '');
  pkg["highlights"] = wantedRows;

  wantedRows = Object.keys(spLiabs).filter(k => k !== '_meta').
               map(key => Object.assign({pk:key}, utils.toRow(spLiabs._meta._cols, spLiabs[key] ))).
               filter(row => row.pk.split(':')[0] === pkgid + '');
  pkg["liabilities"] = wantedRows;

  // features
  wantedRows = Object.keys(spFeatures).filter(k => k !== '_meta').
               map(key => Object.assign({pk:key}, utils.toRow(spFeatures._meta._cols, spFeatures[key] ))).
               filter(row => row.pk.split(':')[0] === pkgid + '');
  pkg["features"] = wantedRows;

  // get all the products in the package
  wantedRows = Object.keys(packageProducts).filter(k => k !== '_meta').
               map(key => {
                  let [pkg,prd] = key.split(':')
                  return Object.assign({packageId:parseInt(pkg),productId: parseInt(prd)}, utils.toRow(packageProducts._meta._cols, packageProducts[key] ))
               }).
               filter(row => row.packageId === pkgid );
  pkg["productList"] = wantedRows;

  // different handling for the insurer
  pkg["insurer"] = insurerId in insurers ? Object.assign({pk:insurerId},utils.toRow(insurers._meta._cols, insurers[insurerId])) : {}

}

exp.saLimitList = function ( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
  let data = pdt.val("productData")
  let saLimit = data["saLimit"]
  let datarows = Object.keys(saLimit).filter(key => key !== '_meta').
                 map(key => Object.assign({pk:key},utils.toRow(saLimit._meta._cols, saLimit[key]))).
                 map(doc => {
                   let lowAgeMonth = doc.pk.split(':')[3]
                   let range = saLimit._meta._key_ageMonth.find(tup => tup[0] === lowAgeMonth)
                   if (range) { doc.minAge = parseInt(range[0]/12); doc.maxAge = parseInt(range[1]/12) }
                   return doc
                 })
   return datarows
}
exp.premiumLimitList = function ( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
  let data = pdt.val("productData")
  let premiumLimit = data["premLimit"]
  let datarows = Object.keys(premiumLimit).filter(key => key !== '_meta').
                 map(key => Object.assign({pk:key},utils.toRow(premiumLimit._meta._cols, premiumLimit[key]))).
                 map(doc => {
                   let lowAgeMonth = doc.pk.split(':')[2]
                   let range = premiumLimit._meta._key_age.find(tup => tup[0] === lowAgeMonth)
                   if (range) { doc.minAge = parseInt(range[0]); doc.maxAge = parseInt(range[1]) }
                   return doc
                 })
   return datarows
}
exp.ageLimitList = function ( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {
  let data = pdt.val("productData")
  let ageLimit = data["ageLimit"]
  let datarows = Object.keys(ageLimit).filter(key => key !== '_meta').
                 map(key => Object.assign({pk:key},utils.toRow(ageLimit._meta._cols, ageLimit[key]))).
                 map(doc => {
                   let keyparts = doc.pk.split(':')
                   doc.premiumTermType = keyparts[1]
                   doc.premiumTermValue = keyparts[2]
                   doc.coverageTermType = keyparts[4]
                   doc.coverageTermValue = keyparts[5]
                   doc.paymentTermType = keyparts[7]
                   doc.paymentTermValue = keyparts[8]
                   doc.gender = keyparts[16]
                   return doc
                 })
   return datarows
}



exp.salesPackageProductCategories = function ( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
  let data = pdt.val("productData");
  let table = data["salesPackageType"];
  let cols = table._meta._cols;
  let categories = [], catkeys=[];
  _.forOwn(table,(data,k)=> {
     if (k !== '_meta') {
          let row = utils.toRow(cols,data);
          let keylist = k.split(':')
          row['packageId'] = _.parseInt(keylist[0]);
          row['productCategory'] = keylist[1]
          row['displayOrder']= keylist[2] ? parseInt(keylist[2]) : 0;
          if (catkeys.indexOf(row.productCategory) < 0) {
            categories.push(row)
            catkeys.push(row.productCategory)
          }
     }
  });
  return categories;

}
exp.salesPackageLiabilities = function ( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
  let data = pdt.val("productData");
  let table = data["salesPackageLiability"];
  let cols = table._meta._cols;
  let rows = [], keys = [];
  _.forOwn(table,(data,k)=> {
     if (k !== '_meta') {
          let row = utils.toRow(cols,data);
          let keylist = k.split(':')
          let liabId = parseInt(keylist[2]); // liabId -- 2nd part of key
          if (keys.indexOf(liabId) < 0 ) {
            rows.push({liabId, liabDesc: row.liabDesc})
            keys.push(liabId);
          }
     }
  });
  return rows;
}
exp.getPackageProduct = function ( ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
  let data = pdt.val("productData");
  let packageCode = factors.packageCode || ''
  let productId = factors.prdId;
  let packageData = packageCode in data["productPackage"] ? data["productPackage"][packageCode] : null
  if (!packageData) return {}
  let pkg = utils.toRow(data["productPackage"]._meta._cols, packageData )
  let packageId = pkg.packageId
  if (! packageId) return {}
  let productLife = productId in data["productLife"] ? data["productLife"][productId] : null
  if (!productLife) return {}

  let packageProduct = data["productPkgProduct"];
  let spLiab = data["salesPackageLiability"]
  let spItems = data["salesProductDetailItem"]
  // # find the packageProducts that we want

  let key = packageId + ':' + productId
  if (!key in packageProduct) return {}
  let row = utils.toRow(packageProduct._meta._cols, packageProduct[key])


  let wantedRows = Object.keys(spLiab).filter(k => k !== '_meta').
               map(key => Object.assign({pk:key}, utils.toRow(spLiab._meta._cols, spLiab[key] ))).
               filter(row => row.pk.split(':')[0] === packageId + '' && row.pk.split(':')[1] === productId + '').
               map(row => { return {liabId: row.pk.split(':')[2], needDiseaseIndi : row.needDiseaseIndi, diseaseDesc: row.diseaseDesc}})
  row.liabilityDiseaseInfo = wantedRows
  row.liabilityList = []
  row.exclusionList = []
  row.underwritingRuleList = []
  row.caseInfoList = []
  row.diseaseList = []
  row.clauseList = []
  row.fundAndChargesList = []
  Object.keys(spItems).filter(k => k !== '_meta').
    map(key => Object.assign({pk:key}, utils.toRow(spItems._meta._cols, spItems[key] ))).
    filter(row => row.pk.split(':')[0] === productId + '' ).
    forEach(item => {
        let itemId = item.pk.split(':')[1];
        let displayOrder = item.pk.split(':')[2] ? parseInt(item.pk.split(':')[2]) : 0
        let doc = {itemDescription: item.itemDesc, displayOrder: displayOrder}
        if (itemId === '1') row.liabilityList.push(doc)
        if (itemId === '2') row.exclusionList.push(doc)
        if (itemId === '3') row.underwritingRuleList.push(doc)
        if (itemId === '4') row.diseaseList.push(doc)
        if (itemId === '5') row.caseInfoList.push(doc)
        if (itemId === '6') row.clauseList.push(doc)
        if (itemId === '7') row.fundAndChargesList.push(doc)
    })


  row.packageCode = packageCode;
  row.packageId = packageId
  row.productId = productId

  return row
}


module.exports = exp;
