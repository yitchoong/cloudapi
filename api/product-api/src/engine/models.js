// import _ from "lodash";
// import moment from "moment";
// import * as formulas from "./calculations/formulas.js";
// import * as commondata from "./data/commondata.js";
// import * as validators from "./validators";

'use strict'
let _ = require('lodash')
let moment = require('moment')
let formulas = require('./calculations')
let commondata = require('./data/commondata')
let validators = require('./validators')
let exp = {};

/*

    each product publishes itself as product_nnnn in the global namespace e.g. _product5712, this is CONVENTION, must follow.....
    assume each of the products set a global product_nnnn, if using webpack, it use LibraryTarget as var, and Library to define name

    var globals = typeof window === 'undefined' ? root : window;
    var globals = window || global || root;

*/
var products = _.keys(global)
               .filter(function(item){ return item.indexOf("_product") >= 0; })
               .filter(function(item){ return _.isPlainObject(global[item]) && _.has(global[item],'productId');  });

let DB = {};
let CONFIGS = {};
let jsons = {};
let mod, productId, code, config, req, pid;

_.forEach(products, (key) => {
    // pid = parseInt( key.split('_')[1] );
    pid = parseInt( key.split('_product')[1] );
    mod = global[key];
    CONFIGS[pid] = mod.config;
    DB[pid] = {};

    // if code exists at the product level use those, else use the ones from commondata
    let fnames = _.keys(mod.code);
    let cnames = _.keys(commondata);
    let allnames = fnames.concat(cnames);
    allnames = _.uniq(allnames); // make it uniq -- what happens if there is a clash....source of bugs ?? ::TODO::

    _.forEach( allnames, (fname) => {
        // simulate a form of inheritance, load from product (i.e. override) else load from commondata (parent)
        if ( _.has(mod.code, fname) ) {
            DB[pid][fname] = mod.code[fname];
        } else {
            DB[pid][fname] = commondata[fname];
        }
    });
});

class Field {
    constructor(ctx, fname, kw) {
        let parentType = _.isUndefined(kw.parentType) ? '' : kw.parentType;
        let parent = _.isUndefined(kw.parent) ? null : kw.parent;
        let inputField = _.isUndefined(kw.inputField) ? false : kw.inputField,
            dbField = _.isUndefined(kw.dbField) ? false : kw.dbField,
            fmlaField = _.isUndefined(kw.fmlaField) ? false : kw.fmlaField,
            value = _.isUndefined(kw.value) ? undefined : kw.value;
        this.ctx = ctx;
        this.fname = fname;
        this.parentType = parentType;
        this.parent = parent;
        this.inputField = inputField ;
        this.dbField = dbField;
        this.fmlaField = fmlaField;
        this.format1 = _.isUndefined(kw.format1) ? null : kw.format1; // only available for formula fields
        this.format2 = _.isUndefined(kw.format1) ? null : kw.format2;
        let values;
        if (value === null) {
            values = {'*':null};
        } else if ( _.isArray( value) ) {
            values = {};
            _.forEach(value, (v,index)=> {
                values[index+1] = v;
            });
        } else {
            values = {'*' : value};
        }
        this.values = values;
        this.resolved = {};
        _.forOwn(values, (v,k) => {
            this.resolved[k] = _.isUndefined(v) ? false : true;
        });

    }
    setValue(v,t='*') {
        this.values[t] = v;
        this.resolved[t] = _.isUndefined(v) ? false : true;
        if (this.resolved[t]) {
            if ( t !== '*' && '*' in this.values ) {
                this.resolved['*'] = false;
            }
        }
    }
    reset() {
        let t = '*';
        this.values[t] = undefined;
        this.resolved[t] = false;
    }
    getValue(k,options={}) {
        let t = 0;
        if ( k !== 0 ) {
            t = k ? k : '*';
        }
        let opts = _.extend({}, options);
        let result = null;
        // note : input fields are always resolved by now, since the field should be created with the values provided

        if (this.resolved[t]) {
            if (this.dbField) {  // we should not reuse saved value if dbField
                result = this.resolve(t, opts);
            } else {
                result = this.values[t];
            }
        } else if (this.inputField && this.resolved['*']) {
            result = this.values['*'];
        } else {
            result = this.resolve(t, opts);
        }
        return result;
    }
    resolve(t,opts) {
        /*
        order of preference
        if pass in via opts, we should always use that
        next is based on the parentType when the field was created, if the parent is not null, basically provides context to where the field belong to
        */
        let policy = this.ctx.get("policy");
        let people = this.ctx.get("people");
        let main = this.ctx.get("main");
        let product = this.ctx.get("product");
        let fund = this.ctx.get("fund");
        // if (this.parentType === "fund") {
        //     fund = this.ctx.get("fund");
        // }

        if (this.parentType === 'fund') {
            product = this.ctx.get("main"); // fund is always for the main
            fund = this.parent;
        } else if (this.parentType === 'product' && this.parent) {
            product = this.parent;
        } else if (this.parentType === 'people' && this.parent) {
            people = this.parent;
        } else if (this.parentType === 'policy' && this.parent) {
            policy = this.parent;
        }
        if (!product) { product = main; } // by right should not happen, but if not set by now, then use main as product

        // default in the productId && policy_year if it is not already passed in
        if (! ('productId' in opts)  && ! _.isUndefined(product) ) { opts.productId = product.val("productId"); }
        // if (! ('policyYear' in opts) && _.isNumber(t) ){ opts.policyYear = t; } // cannot assume t is in years, can be in months as well

        let pid = 0; // start as product 0 i.e. common db
        if ( opts.productId ) {
            pid = opts.productId;
        } else if ( product && product.val("productId") ) {
            pid = product.val("productId");
        } else if (this.parentType === "product" && this.parent && this.parent._productId) {
            pid = this.parent._productId;
        }

        let dbFields = _.keys(DB[pid]);
        let result;
        if ( _.includes(dbFields,this.fname) ) {
            let fn = DB[pid][this.fname];
            result = fn(this.ctx, policy, people, product, fund, t, opts);
        } else {
            result = this.resolveFormula(policy, people, product, fund, t, opts);
        }
        let k = t === 0 ? 0 : t ? t : '*';

        // let k = 0;
        // if ( t === 0 ) {
        //     k = 0;
        // } else {
        //     k = t ? t : '*'; // * in cases where t is undefined or null
        // }

        this.setValue( result, k); // set the value which also sets it to be resolved
        return result;
    }

    resolveFormula(policy, people, product, fund, t, opts) {
        let pdt ;
        if (this.parentType === 'policy') {
            pdt = this.ctx.get("main");
        } else {
            pdt = product;
        }
        let pid = opts.productId ? opts.productId : product.val("productId") ? product.val("productId") : pdt._productId ; // last try get from pdt
        if (!pid) { throw Exception(__("Unable to get the product id to resolve the formula")) }
        let config = CONFIGS[pid]['formulas'];
        let fn = null;
        if ( this.fname in config ) {
            let fname = config[this.fname];
            if ( _.isArray(fname) ) {
                // an array means it has the formatters configured as well, we just take the 1st value of the list
                fname = fname[0];
            }
            fn = formulas[fname];
            if (_.isNull(fn)) {
                throw Error("Exception in class Field, unable to load formula " + this.fname + " product " + pid );
            } else {
                try {
                  return fn( this.ctx, policy, people, product, fund, t, opts);
                } catch (err) {
                  console.log("ERROR:",err, fname)
                  throw(err); // rethrow the error
                }
            }
        } else {
            return
        }
    }
}

class Entity {
    constructor( ctx, entityType, productId, iterable={}) {
        this.fieldMap = iterable; // holds a map with field-name : and the instance of the field
        this.ctx = ctx;
        this.entityType = entityType;
        this._productId = productId;
        this.validatorList = {};
        // pre-create all the possible fields ? -- experimental at the moment
        // let fmlaFields = _.keys( CONFIGS[productId]['formulas'] );
        // let dbFields = _.keys(DB[productId]);
        // fmlaFields.forEach(f => {
        //     if ( f !== 'proposalStartDate') {
        //         this[f] = function(tval) { return this.val(f,tval)}
        //     }
        // })
        // dbFields.forEach(f => {
        //         this[f] = function(tval) { return this.val(f,tval)}
        // })

    }
    getFields() {
        return this.fieldMap;
    }
    getField(k,options) {
        if ( k in this.fieldMap  ) {
            return this.fieldMap[k];
        } else {
            // field has not been created, lazily create it if the field exists as a db field or calculation field
            let productId = options && options.productId ? options.productId : this._productId;
            let config = CONFIGS[productId]['formulas'];
            let fmlaFields = _.keys(config);
            let dbFields = _.keys( DB[productId] );
            // check if dbField
            if ( _.includes(dbFields, k) ) {
                let f = new Field(this.ctx, k, { parentType:this.entityType, parent:this,dbField:true } );
                this.fieldMap[k] = f;
                this[k] = function(t){ return this.val(k,t)} // provide alternative syntax e.g. main.premiumRate(t)
                return f;
            } else if ( _.includes(fmlaFields, k) ) { // formulafield
                let formatter1, formatter2, field;
                if ( _.has(config,k) ) {
                    field = config[k];
                    if ( _.isArray(field) ) {
                        formatter1 = field[1]; // item 0 is the formula_id, which we do not use here
                        formatter2 = field[2];
                    }
                }
                let f = new Field(this.ctx, k, { parentType:this.entityType, parent:this, fmlaField:true,format1:formatter1, format2:formatter2 } );
                this.fieldMap[k] = f;
                this[k] = function(t){ return this.val(k,t)} // provide alternative syntax e.g. main.annualPremium(t)
                return f;
            } else {
                // create a field that will return null since it is not a db field and also not a calculation field
                // btw, input fields do not need to be lazily created, should be already in fieldMap
                // console.log("Creating default field which only returns null ", k )
                let f = new Field(this.ctx, k, {parentType:this.entityType, parent:this,inputField:true, value: null } );
                this.fieldMap[k] = f;
                this[k] = function(t){ return this.val(k,t)} // provide alternative syntax e.g. main.premiumRate(t)
                return f;
            }
        }
    }
    val(k,t='*',options={}) {
        let field = this.getField(k,options);
        let res;
        if (field) {
            if ( field instanceof Field ) {
                // commented out code to auto set the value of t
                /*
               if ( t === '*' && this.ctx.get("current_t") ) {
                   t = this.ctx.get("current_t");
               } */
                res = field.getValue(t,options);
            } else {
                return field;
            }
        }
        return res;
    }
    // add in methods to access only the input field , can ?
    input(fname,t='*',opts={}) {
      let field = this.getField(fname,opts), result;

      if (field) {
        if (field.inputField) {
          result = field.getValue(t,opts)
        } else {
          console.log("Not an inputField", fname, field, field.getValue(t,opts))
          throw Error("Not an inputfield : " + fname );
        }
      } else { result = field }
      return result;
    }
    fmval(fname,t='*',opts={}) {
      let field = this.getField(fname,opts), result;

      if (field) {
        if (field.fmlaField) {
          result = field.getValue(t,opts)
        } else {
          throw Error("Not an calculator field : " + fname );
        }
      } else { result = field }
      return result;
    }
    dbval(fname,t='*',opts={}) {
      let field = this.getField(fname,opts), result;
      if (field) {
        if (field.dbField) {
          result = field.getValue(t,opts)
        } else {
          throw Error("Not an db field : " + fname );
        }
      } else { result = field }
      return result;
    }
    db0(fname,t,opts={}){
      return this.dbval(fname,t,opts)['col0'];
    }
    db1(fname,t,opts={}){
      return this.dbval(fname,t,opts)['col1'];
    }
    db2(fname,t,opts={}){
      return this.dbval(fname,t,opts)['col2'];
    }
    /* only provide shortcut for db0 - db2 , rest can be accessed by the field names still i.e. row.assignRate */
    // db3(fname,t,opts={}){
    //   return this.dbval(fname,t,opts)[3];
    // }
    // db4(fname,t,opts={}){
    //   return this.dbval(fname,t,opts)[4];
    // }
    // db5(fname,t,opts={}){
    //   return this.dbval(fname,t,opts)[5];
    // }
    // db6(fname,t,opts={}){
    //   return this.dbval(fname,t,opts)[6];
    // }
    // db7(fname,t,opts={}){
    //   return this.dbval(fname,t,opts)[7];
    // }
    // db8(fname,t,opts={}){
    //   return this.dbval(fname,t,opts)[8];
    // }
    // db9(fname,t,opts={}){
    //   return this.dbval(fname,t,opts)[9];
    // }

    setField(k, f ) {
        this.fieldMap[k] = f;
        return;
    }

    validate(name,opts){
      let start = Date.now()
      // note : no caching of the validators and results
      let result = getValidator(this._productId, name, this, this.ctx, Object.assign({}, opts)).validate();
      if (!(_.isArray(result) )) { result = [result]; }
      result = _.filter(result,(err) => !_.isUndefined(err));
      result = _.flatten(result);
      // console.log("DEBUGG ---> called validate for ", name, Date.now() - start )
      return _.uniq(result);



    //   let validator;
    //   if (name in this.validatorList) {
    //     validator = this.validatorList[name];
    //   } else {
    //     validator = new Validator(this._productId,  name, this, this.ctx, _.extend({},opts));
    //     this.validatorList[name] = validator;
    //   }
      //
    //   let result = validator.validate();
    //   if (!(_.isArray(result) )) { result = [result]; }
    //   result = _.filter(result,(err) => !_.isUndefined(err));
    //   result = _.flatten(result);
    //   return _.uniq(result);
    }

    check(validatorName, opts) {
      return this.validate(validatorName, opts);
    }
}

class Context {
    constructor (dict={}) {
        this.data = dict;
        // define some common propertys to improve usability of the api
        ['people','main','product','fund'].forEach((prop) => {
            Object.defineProperty(this, prop, { get: function () { return this.data[prop] } });
        })

        return;
    }
    exists(k) {
        return k in this.data;
    }
    get(k) {
        return this.data[k];
    }
    set(k,v) {
        this.data[k] = v;
        return;
    }
}

function getValidator(productId, validatorName, parent, ctx, opts) {
    return {
        validate : function() {
            let fullName = validatorName in CONFIGS[productId]['validators'] ? CONFIGS[productId]['validators'][validatorName] : null ;
            let validator = validators[fullName];
            if (!validator) { return "Unable to locate validator : " + validatorName }
            return validator(ctx, parent, opts)
        }
    }
}
// export class Validator {
class Validator {
  constructor(productId, validatorName, parent, ctx, opts) {
      this.productId = productId;
      this.validatorName = validatorName;
      this.parent = parent;
      this.ctx = ctx;
      this.opts = opts;
      this.config = CONFIGS[productId]['validators'];
  }
  validate(opts={}){
    // load the validator based on the name
    let fullname = this.validatorName in this.config ? this.config[this.validatorName] : null ;
    let validator = fullname ? validators[fullname] : null;
    if (!validator) return 'Unable to locate validator : ' + this.validatorName ; // if the validator does not exists --> assume it will return false, assume not ok
    return validator(this.ctx, this.parent, opts);
  }
}

exp = {Field, Entity, Context, DB, CONFIGS, Validator}
//export { Field, Entity, Context, DB, CONFIGS }
module.exports = exp;
