// import _ from "lodash";
// import moment from "moment";
// import * as utils from "./utils.js";
// import * as commondb from "../data/commondb.js";
let exp = {};
let commondb = require('../data/commondb');

exp.productData = function productData(ctx, pol, ppl, pdt, fund, t='0',factors={} ) {
    return commondb; // default implementation returns nothing -- code for each product needs to implement this
}

module.exports = exp;
