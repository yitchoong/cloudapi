var api = require('./index')
var _ = require('lodash')
var json = require('./src/product6500/inputjson')
//var json = require('./src/product1010893/inputjson')
//json = {insuredList:[{"name":"demo","birthDate":"1918-02-20","gender":"MALE","smoking":"NON-SMOKER"}],"productList":[{"productId":6500,"lifeAssuredNumber":0,"paymentMode":"1"}]}
var res = api.validate(json, ['validateAllFundAllocations']);
//var res = api.validate(json, ['validateMain','validateAllRiders'])
//var xx = api.validate(json,['validateMain','validateAllRiders']);
//var errcount = _.sum( Object.keys(xx).map(x => xx[x].length))
//if (errcount > 0) console.log('errors',xx)
//var res = api.getLifePackageProduct(1010893)
//var res = api.planInfo4Product(6500);

//var res = api.calc(json,['monthlyCostOfInsurance','r1.monthlyCostOfInsurance'],[]);
//var res = api.getConfig(123);
console.log("res -->", JSON.stringify(res,null,2));
//var res = api.getPackageInitialData("AP88");
//var res = api.getLifeProduct(1010893)
//console.log(JSON.stringify(res,null,2));

//console.log(JSON.stringify(api.calc(json,[],['polLowFundValueAtT','polHighFundValueAtT']),null,2));
//console.log(JSON.stringify(api.calc(json,[],['pol.polHighFundValueAtT']),null,2));
//console.log(api.validate(json,['validateMain']));





//var rows = api.getPackageProduct("AIP",1010636)
//var rows = api.getPackageProduct("AP88",1010893)
//var json = require('./src/product1010893/inputjson')
//console.log("**json",json)
//var rows = api.getAvailableRiders(json)
//console.log("rows",JSON.stringify(rows,null,2) );
//rows = api.availableCurrencies(6202)
//    console.log(rows);
//var json = {insuredList:[{name:'example', gender: 'MALE', age: 20}],  
//            productList: [{productId: 1010893, lifeAssuredNumber:0}]}
//var res = api.availableRiders(json)
 //   console.log(res)
    
//var plans = api.getPackageFilters();
//console.log("Plans", JSON.stringify(plans,null,2));
    
//return


//var json = require('./src/product7001/inputjson')
//var res = api.validate(json, ['validateInput','validateMain', 'r1.validateInput','r1.validateRider'])
//var errcount = _.sum( Object.keys(res).map(key => res[key].length) )
//if (errcount === 0)
//    res = api.calc(json,['premiumAmount','firstYearPremium', 'r1.premiumAmount', 'r1.firstYearPremium']);
//console.log("output", res);
//console.log(api.getProductCodeMap());
//

//var res = api.calc(json, ['premiumAmount','r1.premiumAmount'])
////var count = _.sum( Object.keys(res).map(k => res[k].length ))
////if (count === 0) res = api.calc(json,['premiumAmount','firstYearPremium','r1.premiumAmount','r1.firstYearPremium'])
//console.log(res)
