// let productId = 5712;
let productId = parseInt(__filename.split('/src/product')[1].split('/')[0]);
let data = require('./productData')
let code = {
  productData : () => data
}
let inputjson = require('./inputjson')
let config = require('./productConfig')
global['_product' + productId] = {productId, config, inputjson, code}
