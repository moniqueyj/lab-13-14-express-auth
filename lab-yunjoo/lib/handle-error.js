'use strict';

const debug = require('debug')('authdemo:handle-errors');
const httpErrors = require('http-errors');

module.exports = function(err, req, res, next){
  console.error(err.message);
  if(err.status && err.name){
    debug('http-errors');
    res.status(err.status).send(err.name);
    next();
    return;
  }


  debug('server error');
  err = httpErrors(500, err.message);
  res.status(err.status).send(err.name);
};
