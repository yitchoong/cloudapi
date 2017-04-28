// import _ from "lodash";
// import moment from "moment";
// import * as utils from "../utils.js";
// import __ from "../i18n";
//
let _ = require('lodash')
let moment = require('moment')
let utils = require('../utils')
let __ = require('../i18n')
let exp = {};


exp.zero = function zero( ctx, policy, people, product, fund, t, factors) { return 0; }

exp.proposalStartDate__01 = function proposalStartDate__01( ctx, policy, people, product, fund, t, factors) {
  let proposalDate = policy.input("proposalDate");
  if (proposalDate) {
      return utils.toMoment(proposalDate).subtract(1,'month').endOf('month').add(1,'day').format('YYYY-MM-DD');
  }  else {
      return utils.toMoment(new Date())
  }
}
/* get job class based on occupation code */
exp.jobClass__01 = function jobClass__01( ctx, policy, people, product, fund, t, factors) {
  let row = product.dbval('jobUnderwrite');
  return row.jobClass;
}

/* yr@t is required when we iterate using months */
exp.yr__01 = function yr__01( ctx, policy, people, product, fund, t, factors) {
  return t;
}
exp.yr__02 = function yr__02( ctx, policy, people, product, fund, t, factors) {
  return t % 12 === 0 ? t/12 : Math.floor(t/12) + 1
}

/* premiumHoliday handling for TMLI -- Oct 3 2016 */

exp.premiumHolidayAtT__01 = function premiumHolidayAtT__01( ctx, policy, people, product, fund, t, factors) {
    if (policy.input("premiumHolidayStartYear")) {
        let startYear = parseInt(policy.input("premiumHolidayStartYear"));
        return  product.val("yr",t) > startYear ? true : false;
    } else { return false ; }
}


/* age_method */

exp.ageMethod__01 = function ageMethod__01( ctx, policy, people, product, fund, t, factors) {
    let method = product.dbval("productLife").ageMethod;
    return method === '1' ? "ANB" : method === '2' ? "ALAB" : method === '3' ? "ANMB" : method === '4' ? "ANRB" : "ANRBM"
}

/* special cases for products, where we iterate by months */

exp.maxT__01 = function maxT__01 (ctx, policy, people, product, fund, t, factors) {
    let premiumTerms = product.val("premiumTerms",t, {}),
        rows=[];

    rows = premiumTerms.filter( term => term.period === '2' )
    if (rows.length === 1){
        return rows[0].year * 12
    } else {
        throw Error("common.js -> max_t__01, incorrectly configured formula, there should only be 1 record in allowable premium terms")
    }
}
exp.maxT__02 = function maxT__02 (ctx, policy, people, product, fund, t, factors) {
    let maxCoverage = product.dbval("ageLimit").maxInsdNbExAge - product.val("entryAge")
    return maxCoverage * 12 ; // multiply by 12 to convert to months
}

exp.maxT__03 = function(ctx, policy, people, product, fund, t, factors) {
    let termType = product.input("coverageTermType"),
        termValue = product.input("coverageTermValue");
    return termType === '2' ? termValue : termValue - product.val("entryAge");
}


/* age_at_t */

exp.ageAtT__01 = function ageAtT__01(ctx, policy, people, product, fund, t, factors) {
    let pdt = ctx.exists("product") ? ctx.get("product") : ctx.get("main"),
        personNo = pdt.input("la"),
        main = policy.val("products")[0],
        ageMethod = main.val("ageMethod"),
        la = people[ main.input("la") ],
        dob = la.input("dob"),
        entryAge = utils.calcAge( ageMethod, dob );
    return entryAge + t - 1; // -1 is to offset t since it starts from 1 instead of zero
}

exp.ageAtT__02 = function ageAtT__02(ctx, policy, people, product, fund, t, factors) {
    return t !== '*' ? product.val("entryAge") + t - 1 : product.val("entryAge") ;
}

exp.ageAtT__03 = function ageAtT__03(ctx, policy, people, product, fund, t, factors) {
    // based on t where it is the policy month
    let ageMethod = product.val("ageMethod"),
        la = people[product.val("la")],
        workdate = utils.toDate( policy.val("proposalStartDate")),
        birthdate = la.val("dob");

    workdate.add(t,'months'); // add the policy month to the proposal start date

    let dob = moment.isMoment(birthdate) ? birthdate : utils.toDate(birthdate);
    if ( !_.has(dob,'isValid') ) { dob = moment(dob); }
    let anniversary = dob.month() === workdate.month() && dob.day() === workdate.day() ? true : false;
    let age = workdate.diff(dob,'years');
    if (ageMethod === 'ANB') {
        age = anniversary ? age : age + 1;
    }
    else if (ageMethod === 'ALAB') {
        age = anniversary ? age - 1 : age;
    }
    else {
        age1 = workdate.diff(dob,'years',true);
        age = age1 - age > 0.5 ? age : age + 1;
    }
    return age;
}
exp.ageAtT__04 = function ageAtT__04(ctx, policy, people, product, fund, t, factors) {
    // for use when t is based in months
    return product.val("entryAge") + product.val("yr",t ) - 1;
}

/* coverage terms & cover_duration */

exp.coverageTerm__01 = function coverageTerm__01(ctx, policy, people, product, fund, t, factors) {
    return product.dbval("ageLimit").maxInsdNbExAge - product.val("entryAge");
}
exp.coverageTerm__02 = function coverageTerm__02(ctx, policy, people, product, fund, t, factors) {
    // typically used for riders, as it compares against the main cover term
    let main = ctx.get("main");
    let maxEndAge = product.dbval("ageLimit").maxInsdNbExAge;
    let entryAge = product.val("entryAge");
    let mainMaxEndAge = main.dbval("ageLimit").maxInsdNbExAge;
    let mainEntryAge = main.val("entryAge");
    let res =  Math.min( (mainMaxEndAge - mainEntryAge), (maxEndAge - entryAge) );
    return res;
}
exp.coverageTerm__03 = function coverageTerm__03(ctx, policy, people, product, fund, t, factors) {
    return 60 - product.val("entryAge"); // 60 is specific to IADR01 and not configured in age_limit
}
exp.coverageTerm__04 = function coverageTerm__04(ctx, policy, people, product, fund, t, factors) {
    return 65 - product.val("entryAge"); // 65 is hard coded as it is not in age_limit
}
// export function coverageTerm__05(ctx, policy, people, product, fund, t, factors) {
//     return product.dbval("ageLimit").maxInsdNbExAge - product.val("entryAge");
// }
exp.coverageTerm__06 = function coverageTerm__06(ctx, policy, people, product, fund, t, factors) {
    // maximum of x years or reaches y age, so get the max from term limit
    let terms = product.dbval("policyTerms");
    let t1 = terms.filter( item => item.period === '2' ).map( item => item.year )
    let maxYears = t1.length > 0 ? _.max(t1) : 999 ;
    let t2 = terms.filter( item => item.period === '3').map( item => item.year) ;
    let maxAge = t2.length > 0 ? _.max(t2 ) : 999 ;
    let entryAge = product.val("entryAge");
    let duration1 = (maxAge && entryAge) ? maxAge - entryAge : 999
    let duration2 = maxYears ? maxYears : 999;
    let duration3 = product.input("policyEndAge") ? product.input("policyAge") - entryAge : 999;

    return _.min( [duration1, duration2, duration3] ) ;
}
exp.coverageTerm__07 = function coverageTerm__07(ctx, policy, people, product, fund, t, factors) {
    return product.input("policyTerm") || product.dbval("ageLimit").maxInsdNbExAge - product.val("entryAge") ; // should be entered
}
exp.coverageTerm__08 = function (ctx, policy, people, product, fund, t, factors) {
    return product.input("coverageTermType") === '2' ? product.input("coverageTermValue") : product.input("coverageTermValue") - product.val("entryAge");
}


/* maturity_age aka coverageEndAge */

exp.maturityAge__01 = function maturityAge__01(ctx, policy, people, product, fund, t, factors) {
    return product.dbval("ageLimit").maxInsdNbExAge;
}
exp.maturityAge__02 = function maturityAge__02(ctx, policy, people, product, fund, t, factors) {
    return product.val("entryAge") + product.val("coverageTerm");
}
exp.maturityAge__03 = function maturityAge__03(ctx, policy, people, product, fund, t, factors) {
    return product.input("policyEndAge"); // this is a case where it is entered, for some products
}

/* premium_term */
exp.premiumTerm__01 = function premiumTerm__01(ctx, policy, people, product, fund, t, factors) {
    return product.val("coverageTerm"); // simply follow the coverage term
}

/* entry age */

exp.entryAge__01 = function entryAge__01(ctx, policy, people, product, fund, t, factors) {
    let ageMethod = product.val("ageMethod"),
        la = people[product.val("lifeAssuredNumber")],
        dob = la.val("birthDate");
    return utils.calcAge(ageMethod, dob);
}

exp.phEntryAge__01 = function phEntryAge__01(ctx, policy, people, product, fund, t, factors) {
    let ageMethod = product.val("ageMethod");
    let ph = people.find(person => person.input("isPolicyholder") );
    if (!ph) {
        ph = people[0] ; // default to first person in people
    }
    return utils.calcAge( ageMethod, ph.val("dob") );
}

/* sa_calculated */

exp.saCalculated__01 = function saCalculated__01(ctx, policy, people, product, fund, t, factors) {
    return product.val("basicSa");
}
exp.saCalculated__02 = function saCalculated__02(ctx, policy, people, product, fund, t, factors) {
    return product.val("initialSa");
}
exp.saCalculated__03 = function saCalculated__03(ctx, policy, people, product, fund, t, factors) {
    return product.val("initialSa") * 50000;
}
exp.saCalculated__04 = function saCalculated__04(ctx, policy, people, product, fund, t, factors) {
    return product.input("initialSa") || product.input("basicSa") || product.input("sumAssured");
}
exp.saCalculated__05 = function saCalculated__05(ctx, policy, people, product, fund, t, factors) {
    let main = ctx.get("main");
    return main.val("annualPremium"); // in products like waiver, the annual premium of the main plan is the sum assured
}
exp.saCalculated__06 = function saCalculated__06(ctx, policy, people, product, fund, t, factors) {
    let plans = product.dbval("benefitPlans");
    let benLevel = parseInt(product.input("benefitLevel"));
    let level = plans.find(p => p.level === benLevel )
    if (level) {
        return parseFloat(level.sa);
    }
    return 0;
}
module.exports = exp;
