let exp = {};
exp.noop =  function noop(ctx, parent, opts){ return }
exp.pass =  function pass(ctx, parent, opts){ return }

Object.assign(exp, require('./common'),require('./product'), require('./funds'), require('./topups'), require('./withdrawals'), require('./loadings'))
module.exports = exp;
//
// export * from "./product";
// export * from "./funds";
// export * from "./topups";
// export * from "./withdrawals";
// export * from "./loadings";
// export const FIXME = 'FIXME'
