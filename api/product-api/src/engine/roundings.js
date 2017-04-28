let _ = require('lodash');
let exp = {};

exp.roundFiftycents =  function roundFiftycents (amt) {
    return Math.ceil(amt*2) / 2 ;
}
exp.roundCentsHalfUp = function roundCentsHalfUp (amt) {
    return _.round(amt,2);
}
exp.roundCentsUp = function roundCentsUp (amt) {
    return _.ceil(amt,2);
}
exp.roundCentsDown = function roundCentsDown (amt) {
    return _.floor(amt,2);
}
exp.roundDollarHalfUp =  function roundDollarHalfUp (amt) {
    return _.round(amt,0);
}
exp.roundDollarUp = function roundDollarUp (amt) {
    return _.ceil(amt,0);
}
exp.roundDollarDown = function roundDollarDown (amt) {
    return _.floor(amt,0);
}
exp.roundThousandHalfUp = function roundThousandHalfUp(amt){
  return _.round(amt/1000,0);
}
function _roundTo(num, dp) {
    let n = num + 0.000000000000001;
    return parseFloat(n.toFixed(dp));
}
module.exports = exp;
