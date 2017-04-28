let exp = {}
Object.assign(exp, require('./common'), require('./premium'), require('./death'), require('./survival'), require('./surrender'), require('./ilp'))
module.exports = exp;

//
// export * from "./common.js";
// export * from "./premium.js";
// export * from "./death.js";
// export * from "./survival.js";
// export * from "./surrender.js";
// export * from "./ilp.js";
// export const FIXME = 'FIXME'
