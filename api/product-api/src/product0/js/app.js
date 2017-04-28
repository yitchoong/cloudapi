import * as code from "./data.js";
import * as inputjson from "../data/inputjson.js";
import * as config from "../data/product_config.js";

var pid = 0;
console.log("Product " + pid + " (commondb) is ready...");
let exps = { productId : pid , code : code, inputjson: inputjson, config: config }
module.exports = exps;
