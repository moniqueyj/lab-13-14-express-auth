'use strict';

//npm modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const debug = require('debug')('authdemo:server');
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);

//app modules
const handleError = require('./lib/handle-error');
const parserBearerAuth = require('./lib/parser-bearer-auth');
const authRouter = require('./route/auth-router');
// const snackRouter = require('./route/snack-router');

//constant module variables
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.mongoURI || 'mongodb://localhost/authdemodev';

//setup mongo
mongoose.connect(mongoURI);

//setup middleware
app.use(morgan('dev'));
app.use(handleError);

app.use('/api',authRouter);
// app.use('/api', snackRouter);

app.all('./', parserBearerAuth, function(req, res){
  console.log('req.userId', req.userId);
  res.send('hooray');
});


app.all('*', function(req, res, next){
  debug('404 * route');
  next(httpErrors(404, 'no such route'));
});


//start server
const server = app.listen(port, function(){
  debug('server up #%booya%###', port);
});

server.isRunning = true;
module.exports = server;
