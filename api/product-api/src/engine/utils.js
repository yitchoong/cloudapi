// import _ from "lodash";
// import moment from "moment";
let _ = require('lodash')
let moment = require("moment")
let exp = {}

function now(){ return moment(); }
exp.now = now;

function calcAge(ageMethod, birthdate) {

    let today = now();
    let dob = moment.isMoment(birthdate) ? birthdate : toDate(birthdate);
    if ( !_.has(dob,'isValid') ) { dob = moment(dob); }
    let anniversary = dob.month() === today.month() && dob.day() === today.day() ? true : false;
    let age = today.diff(dob,'years');
    if (ageMethod === 'ANB') {
        age = anniversary ? age : age + 1;
    }
    else if (ageMethod === 'ALAB') {
        age = anniversary ? age - 1 : age;
    }
    else if (ageMethod === 'ANRB') {
        let lastBirthday = moment(dob).add(age,'years'),
            excess = today.diff(lastBirthday,'days');
        age = anniversary ? age : excess < 180 ? age : age + 1 ;
    } else {

        let age1 = today.diff(dob,'years',true);
        age = age1 - age > 0.5 ? age : age + 1;
    }
    return age;
}
exp.calcAge = calcAge
exp.calc_age = exp.calcAge;

function toDate(s) {
    let dd = moment(s,['D-M-YYYY','YYYY-M-D', 'YYYY-M-D HH:mm', 'YYYY-M-D HH:mm:ss',
                       'D-M-YY HH:mm:ss','D-M-YY HH:mm', 'YYYY-MM-DDTHH:mm:ss.SSSSZ'],true)
    return dd.isValid() ? dd : _.isDate(s) ? moment(s) : null;
}
exp.toDate = toDate;
exp.to_date = exp.toDate;

function toMoment(s) { return exp.toDate(s); }
exp.toMoment =  toMoment;
exp.to_moment = exp.toMoment;


function toRow(cols, values) {
    let row = {};
    _.zip(cols,values).forEach( (item, index)=> {
        let [k,v] = item;
        row[k] = v;
        if (index < 3) {
            row['col'+index] = v; // to allow access by db0, db1,....
        }
    });
    return row;
}
exp.toRow =  toRow;
exp.to_row = exp.toRow;

function roundTo(num, dp) {
    let n = num + 0.000000000000001;
    return parseFloat(n.toFixed(dp));
}
exp.roundTo =  roundTo;
exp.round_to = exp.roundTo;

function toKey( tableName, meta, factors, stopOnError=true) {
    let tableKeys = meta._keys;
    let keyList = [];
    tableKeys.forEach((itm) => {
        let [key, dataType] = itm;
        let factor = factors[key];
        let k = '_key_' + key;
        let valueList = meta[k]; // get list of possible values for this key
        let gotIt = false;

        if ( valueList.length === 1 && ( _.isUndefined(factor) || _.isNull(factor) )) {
            keyList.push( valueList[0][0] );
        } else {
            for (let i=0; i < valueList.length ; i++ ) {
                let item = valueList[i];
                let [lowstr,highstr] = item;
                let low = lowstr;
                let high = highstr;
                if (dataType === 'int' ) {
                    low = parseInt(low);
                    high = high === '*' ? high : parseInt(high);
                    factor = parseInt(factor);
                } else if (dataType === 'number') {
                    low = parseFloat(low);
                    high = high === '*' ? high : parseFloat(high);
                    factor = parseFloat(factor);
                } else if (dataType === 'str') {
                    if ( typeof(factor) !== 'string') {
                        factor = '' + factor; // convert to string
                    }
                }
                if (high === '*') {
                    if (factor === low) {
                        keyList.push( lowstr );
                        gotIt = true;
                        break;
                    }
                } else {
                     if (factor >= low && factor <= high) {
                        keyList.push(lowstr);
                         gotIt = true;
                         break;
                     }
                }
            }
            if ( !gotIt ) {
                if (valueList.length === 1) {
                    keyList.push( valueList[0][0]);
                 } else {
                     // try and use a default value
                     let deflt;
                     if (key == 'gender') {
                        deflt = _.find(valueList,(item) => { return item === 'N'; });
                        if (deflt) { keyList.push('N'); }
                     } else if ( key === 'smoking' ) {
                        deflt = _.find(valueList,(item) => { return item === 'W'; });
                        if (deflt) { keyList.push('W'); }
                    } else {

                        deflt = _.find(valueList, (item, idx) => { return item === '*'; });
                        if (deflt)  { keyList.push( '*' ); }
                    }
                    if ( _.isUndefined(deflt) ) {
                         if (stopOnError) {
                            console.log("*** utils.js toKey--> unable to set the key value for ", tableName, "key=", key, "factors" , factors);
                            // throw Error("utils.js toKey -->Unable to set key value " + tableName, key , factors);
                            throw Error("utils.js toKey -->Unable to set key value, table : " + tableName + " :" + key + ", factors=" + JSON.stringify(factors) );

                         }
                    }
                 }
            }
        }
    });
    return keyList.join(':');
}
exp.toKey = toKey;
exp.to_key = exp.toKey;

function buildKeys( tableName, meta, factors, stopOnError=true) {
    let tableKeys = meta._keys;
    let keyList = [],
        allKeys = [];

    tableKeys.forEach((itm) => {
        let [key, dataType] = itm;
        let factor = factors[key];
        let k = '_key_' + key;
        let valueList = meta[k]; // get list of possible values for this key
        let gotIt = false;

        if ( valueList.length === 1 && ( _.isUndefined(factor) || _.isNull(factor) )) {
            keyList.push( valueList[0][0] );
        } else {

            for (let i=0; i < valueList.length ; i++ ) {
                let item = valueList[i];
                let [lowstr,highstr] = item;
                let low = lowstr;
                let high = highstr;
                if (dataType === 'int' ) {
                    low = parseInt(low);
                    high = high === '*' ? high : parseInt(high);
                    factor = parseInt(factor);
                } else if (dataType === 'number') {
                    low = parseFloat(low);
                    high = high === '*' ? high : parseFloat(high);
                    factor = parseFloat(factor);
                } else if (dataType === 'str') {
                    if ( typeof(factor) !== 'string') {
                        factor = '' + factor; // convert to string
                    }
                }
                if (high === '*') {
                    if (factor === low) {
                        keyList.push( lowstr );
                        gotIt = true;
                        break;
                    }
                } else {
                     if (factor >= low && factor <= high) {
                        keyList.push(lowstr);
                         gotIt = true;
                         break;
                     }
                }
            }
            if ( !gotIt ) {
                if (valueList.length === 1) {
                    keyList.push( valueList[0][0]);
                 } else {
                     // try and use a default value
                     let deflt;
                     if (key == 'gender') {
                        deflt = _.find(valueList,(item) => { return item === 'N'; });
                        if (deflt) { keyList.push('N'); }
                     } else if ( key === 'smoking' ) {
                        deflt = _.find(valueList,(item) => { return item === 'W'; });
                        if (deflt) { keyList.push('W'); }
                    } else {

                        deflt = _.find(valueList, (item, idx) => { return item === '*'; });
                        if (deflt)  { keyList.push( '*' ); }
                    }
                    if ( _.isUndefined(deflt) ) {
                         if (stopOnError) {
                            console.log("*** utils.js toKey--> unable to set the key value for ", tableName, key, factors);
                            debugger;
                            throw Error("utils.js toKey -->Unable to set key value " + tableName, key );
                         }
                    }
                 }
            }
        }
    });
    return keyList.join(':');
}
exp.buildKeys =  buildKeys;
exp.build_keys = exp.buildKeys;
module.exports = exp;
