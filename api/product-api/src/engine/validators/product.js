// import _ from "lodash";
// import moment from "moment";
// import * as utils from "../utils.js";
// import __ from "../i18n";

let _ = require('lodash');
let moment = require('moment')
let utils = require('../utils')
let __ = require('../i18n')
let exp = {};

exp.validateMain__01 =  function validateMain__01(ctx, parent, opts) {
    // more for traditional products
    let errs = [];
    try {
        let res = parent.validate("validateInput",opts)
        if (res && res.length > 0) {
          errs.push(res)
        } else {
          errs.push( parent.validate("validateSaLimit",opts) );
          errs.push( parent.validate("validateAgeLimit",opts));
          errs.push( parent.validate("validatePremiumLimit",opts));
        }
    } catch (exc) {
      errs.push(exc.message)
    }
    return errs;
}
exp.validateMain__02 =  function validateMain__02(ctx, parent, opts) {
    let errs = [];
    try {
        let res = parent.validate("validateInput",opts)
        if (res && res.length > 0) {
          errs.push(res)
        } else {
          errs.push( parent.validate("validateSaLimit",opts) );
          errs.push( parent.validate("validateSaMultiple",opts) ); // extra check for ILP products
          errs.push( parent.validate("validateAgeLimit",opts));
          errs.push( parent.validate("validateTargetPremiumLimit",opts));
          errs.push( parent.validate("validateRegularTopupLimit",opts));
          errs.push( parent.validate("validateMinRegularTopup",opts));
        }
    } catch (exc) {
        errs.push(exc.message)
    }
    return errs;
}
function validateMainInput(main, ctx, parent, opts) {

}
exp.validateAllRiders__01 =  function validateAllRiders__01(ctx, parent, opts) {
    // should be attached to the main plan to call validation on all the riders
    let pol = ctx.get("policy"),
        prds = pol.val("products"),
        riders = prds.length > 1 ? prds.slice(1) : [],
        res,
        errs = [];
    try {
        _.forEach( riders, (rider, index) => {
            res = rider.validate("validateInput")
            if (res && res.length > 0) {
              errs.push(res)
            } else {
              errs.push( rider.validate("validateRider",{index}) );
            }
        });

    } catch (exc) {
        errs.push(exc.message)
    }
    return errs;
}
// versions of validateRider

exp.validateRider__01 =  function validateRider__01(ctx, parent, opts) {
    let errs = [];
    // console.log("validateRider__01", parent, opts);
    try {
        errs.push( parent.validate("validateSaLimit",opts) );
        errs.push( parent.validate("validateAgeLimit",opts));
        errs.push( parent.validate("validateSaMultiple",opts));
    } catch (exc) {
        errs.push(exc.message)
    }
    return errs;
}
exp.validateRider__02 =  function validateRider__02(ctx, parent, opts) {
    let errs = [];
    try {
        errs.push( parent.validate("validateSaLimit",opts) );
        errs.push( parent.validate("validateAgeLimit",opts));
        errs.push( parent.validate("validateMinMaxSaUnits",opts));
    } catch (exc) {
        errs.push(exc.message)
    }
    return errs;
}
exp.validateRider__03 = function validateRider__03(ctx, parent, opts) {
    let errs = [];
    try {
        errs.push( parent.validate("validateAgeLimit",opts));
    } catch (exc) {
        errs.push(exc.message)
    }
    return errs;
}

// atomic (?) validators

exp.validateSaLimit__01 = function validateSaLimit__01(ctx, parent, opts) {
    let product = parent;
    let limitRow = product.dbval("saLimit"),
        sa = product.val("saCalculated");
    // console.log("validateSaLimit__01", limitRow);
    if ( sa < limitRow.insdMinAmount ) {
        return __(`The sum assured is less than the minimum required for this product (${product.dbval("productLife").productName})`) ;
    }  else if (sa > limitRow.insdMaxAmount ) {
        return __(`The sum assured is more than the maximum allowed for this product (${product.dbval("productLife").productName}) `);
    }
    return // mean return undefined
}
exp.validateSaLimit__02 = function validateSaLimit__02(ctx, parent, opts) {
    /* min-sa ==> if rph --> MAX ( 125% of SP, 15,000,000)
                  if usd --> MAX ( 125% of SP , 1500 )
    */
    let product = parent;
    let limitRow = product.val("saLimit"),
        sa = product.val("saCalculated"),
        sp = product.input("targetPremium");
    let min = _.max( [ limitRow.insdMinAmount, sp*1.25])
    if ( sa < min) {
        return __('The sum assured is less than the minimum required for this product ({0})', min)  ;
    }  else if (sa > limitRow.insdMaxAmount ) {
        return __('The sum assured is more than the maximum allowed for this product ({{0}})', limitRow.insdMaxAmount);
    }
    return // mean return undefined
}
exp.validateSaLimit__99 = function validateSaLimit__99(ctx, parent, opts) { return } // this is a placeholder version, basically no errors use when we do not need this check

exp.validatePremiumLimit__01 = function validatePremiumLimit__01(ctx, parent, opts) {
    let product = parent;
    let limitRow = product.dbval("premiumLimit"), // i wonder if this takes into account the modal factor, assume it does
        premium = product.val("premium") ;

    if ( premium < limitRow.minInitialPrem ) {
        return __("The premium is less than the minimum required for this product ({{0}})", limitRow.minInitialPrem ) ;
    }  else if (premium > limitRow.maxInitialPrem ) {
        return __("The premium is more than the maximum allowed for this product ({{0}})",limitRow.maxInitialPrem);
    }
    return // mean return undefined
}
exp.validatePremiumLimit__99 =  function validatePremiumLimit__99(ctx, parent, opts) { return }


exp.validateSaMultiple__01 = function validateSaMultiple__01(ctx, product, opts) {
  let entryAge = product.val("entryAge"),
      tp = product.input("targetPremium"),
      min = product.db0("minMaxSaMultiple"),
      max = product.db1("minMaxSaMultiple"),
      modalFactor = product.db0("modalFactor"),
      sa = product.fmval("saCalculated"),
      maxSa, minSa,err;

  if (entryAge >= 6 && entryAge <= 17) {
    maxSa = Math.min(300000000, (max * tp * modalFactor));
  } else {
    maxSa = max * tp * modalFactor;
  }
  minSa = min * tp * modalFactor;
  err = sa > maxSa ? __(`Sum Assured is larger than the allowed maxiumum for the target premium amount (${product.val("productCode")})`) :
        sa < minSa ? __(`Sum Assured is smaller than the allowed minimum for the target premium amount (${product.val("productCode")})`) : undefined;
  return err;
}
exp.validateSaMultiple__02 = function validateSaMultiple__02(ctx, product, opts) {
  let main = ctx.get("main"),
      sa = product.val("saCalculated"),
      multiple = 5, // hard code, since we do not have this as a parameter
      mainSa = main.val("saSalculated"),
      maxSa = mainSa * multiple;

  if (sa > maxSa) {
    return __("Sum assured is more than the allowed maximum : {{0}}", maxSa) ;
  }
  return
}
exp.validateSaMultiple__99 = function validateSaMultiple__99(ctx, product, opts) { return }

exp.valiateMinMaxSaUnits__01 = function valiateMinMaxSaUnits__01(ctx, product, opts) {
  let age = product.val("entryAge"),
      pol = ctx.get("policy"),
      people = pol.val("people"),
      la = people[ product.val("la") ] ,
      dob = moment(la.val("dob"), ['D-M-YYYY','YYYY-M-D']),
      startDate = utils.toMoment(pol.input("proposalStartDate")); //     moment( pol.val("proposalStartDate"), ['D-M-YYYY','YYYY-M-D'] ),
      diff = moment.duration( startDate.diff(dob)).asMonths(),
      saUnit = product.val("initialSa"),
      maxUnits=0;
  // some hard coding here as we do not have param values
  maxUnits = diff < 0 || age > 61 ? 0 :
              age < 5 ? 5 :
              age <= 61 ? 10 : 0;

  return saUnit > maxUnits ? "The number of units is more than the allowed maximum " : undefined;
}
exp.valiateMinMaxSaUnits__99 = function valiateMinMaxSaUnits__99(ctx, product, opts) { return }

exp.validateAgeLimit__01 = function validateAgeLimit__01(ctx, parent, opts) {
    let product = parent,
        laNo = product.input("lifeAssuredNumber"),
        people = ctx.get("people"),
        la = people[laNo];
    if (!la) {
      return __(`The lifeAssuredNumber (${laNo}) is incorrect`)
    }

    let entryAge = product.val("entryAge"),
        ageRow = product.val("ageLimit"),
        dob = la.val("dob") || la.birthDate();

    if ( ageRow.minInsdNbAgeUnit === '5' ) {
        // means min is in days e.g. 30 days -- so really no minimum
        let cutoff = utils.toMoment(dob).add(ageRow.minInsdNbAge,'days'),
            today = moment();
        if ( today.isBefore(cutoff) ) {
            return __("The insured must be more than {{0}} days old", ageRow.minInsdNbAge );
        }
    }

    if ( ageRow.minInsdNbAgeUnit === '1' && entryAge < ageRow.minInsdNbAge) {
        return __("The insured age is less than the required minimum age for this product") ;
    } else if (ageRow.maxInsdNbAgeUnit === '1' && entryAge > ageRow.maxInsdNbAge) {
        return __("The insured is older than the allowed maximum age for this product");
    }
}
exp.validateAgeLimit__02 = function(ctx, parent, opts) {
    let product = parent,
        laNo = product.input("lifeAssuredNumber"),
        people = ctx.get("people"),
        la = people[laNo];
    if (!la) {
      return __(`The lifeAssuredNumber (${laNo}) is incorrect`)
    }

    let productCode = product.val("productCode");
        entryAge = product.val("entryAge"),
        ageRow = product.val("ageLimit"),
        dob = la.val("birthDate");

    if ( ageRow.minInsdNbAgeUnit === '5' ) {
        // means min is in days e.g. 30 days -- so really no minimum
        let cutoff = utils.toMoment(dob).add(ageRow.minInsdNbAge,'days'),
            today = moment();
        if ( today.isBefore(cutoff) ) {
            return __("The insured must be more than {{0}} days old", ageRow.minInsdNbAge );
        }
    }

    if ( ageRow.minInsdNbAgeUnit === '1' && entryAge < ageRow.minInsdNbAge) {
        return __(`The insured age is less than the required minimum age for this product ${productCode}` ) ;
    } else if (ageRow.maxInsdNbAgeUnit === '1' && entryAge > ageRow.maxInsdNbAge) {
        return __(`The insured is older than the allowed maximum age for this product (${productCode})`);
    }
}


exp.validateAgeLimit__99 = function validateAgeLimit__99(ctx, parent, opts) { return }

exp.validateIlpTargetPremiumLimit__01 = function validateIlpTargetPremiumLimit__01(ctx, parent, opts) {
    let product = parent,
        limitRow = product.dbval("premiumLimit"),
        tp = product.val("targetPremium");

    // note that the premium limit already has the payment frequency as  a factor
    if ( tp < limitRow.minInitialPrem ) {
        return __("The target premium is less than the minimum required for this product") ;
    }  else if (tp > limitRow.maxInitialPrem) {
        return __("The target premium is more than the maximum allowed for this product");
    }
    return // means return undefined
}
exp.validateIlpTargetPremiumLimit__99 = function validateIlpTargetPremiumLimit__99(ctx, parent, opts) { return }

exp.validateIlpRegularTopupLimit__01 = function validateIlpRegularTopupLimit__01(ctx, parent, opts) {
    let product = parent,
        limitRow = product.dbval("premiumLimit"),
        rtu = product.val("regularTopup") ;

    if ( rtu < 500000 ) { // hard coded as not in parameters
        return __("The regular topup is less than the minimum required for this product") ;
    }
    return // means return undefined
}
exp.validateIlpRegularTopupLimit__99 = function validateIlpRegularTopupLimit__99(ctx, parent, opts) { return }

exp.validateIlpMinRegularTopup__01 = function validateIlpMinRegularTopup__01(ctx, parent, opts) {
    let tp = parent.val("targetPremium"),
        modalFactor = parent.val("modalFactor").chargeRate,
        rtu = parent.val("regularTopup"),
        totalPremium = rtu + (tp * modalFactor),
        ratio = ( rtu / totalPremium ) * 100,
        limits = [50,100,200,350,500,99999999999], // hard coded as we do not have table params yet
        percentages = [0,10,20,30,40,50],
        amts, minRatio;

    amts = _.filter(limits, (limit) => totalPremium < limit * 1000000 );
    minRatio = amts.length === 0 ? 50 :
                percentages[ limits.indexOf(amts[0])]; // we take the 1st one that qualifies
    if (ratio < minRatio) {
      return __("Regular topup amount is less than the required min ratio to the annual premium")
    }
    return // mean return undefined
}
exp.validateIlpMinRegularTopup__99 = function validateIlpMinRegularTopup__99(ctx, parent, opts) { return }

exp.validateCoverageEndAge__01 = function validateCoverageEndAge__01(ctx, parent, opts) {
    let prd = parent,
        entryAge = prd.val("entryAge"),
        coverTerm = prd.val("coverageTerm"),
        cutoff = entryAge + coverageTerm,
        coverEndAge = prd.input("coverEndAge") || 999;

    if (coverEndAge > cutoff) {
        return __("For this product, the maximum cover is until age {{0}}", cutoff )
    }
    return
}
exp.validateCoverageEndAge__99 = function validateCoverageEndAge__99(ctx, parent, opts) { return }

exp.validatePersonProduct__01 = function(ctx, parent, opts) {
    /* Check the the person and product are compatible, mainly checking if age is ok
       Check also that the person has all the required fields for the given product
    */
    let errs = []
    let product = parent;
    let personNo = product.input("lifeAssuredNumber")
    let person = ctx.get("people")[personNo]
    if (!person) {
        errs.push(__("The life assured number specified is incorrect"))
        return errs
    }
    let config = ctx.get("_getConfig")(product.val("productId"))
    let res = product.validate("validateAgeLimit",opts)
    if (res.length > 0 ) {
      errs.push( __("The life assured age is not compatible with this product. ") + res )
    }
    Object.keys(config.personFields).forEach((key) => {
      if ( person.input(key) === undefined || person.input(key) === null  ) {
        errs.push(__(`Missing input field for person (${key})`) )
      }
    })
    return errs;
}


module.exports = exp;
