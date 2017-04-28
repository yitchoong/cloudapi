'use strict'
var exp = {};


let send400 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 400;
  res.end(msg);
}
exp.send400 = send400;

let send401 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 401;
  res.end(msg);
}
exp.send401 = send401;

let send404 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 404;
  res.end(msg);
}
exp.send404 = send404;

let send409 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 409;
  res.end(msg);
}
exp.send409 = send409;

let send500 = function (res, next, msg) {
  res.setHeader('Content-Type', "application/json");
  res.statusCode = 500;
  res.end(msg);
}
exp.send500 = send500;



module.exports = exp;
