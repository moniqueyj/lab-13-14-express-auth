'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const debug = require('debug')('authdemo:user');

const userSchema = mongoose.Schema({
  username: {type: String, requried: true, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true}
});

userSchema.methods.generateHash = function(password){
  debug('generateHash');
  return new Promise((resolve) =>{
    bcrypt.has(password, 8, (err,hash) => {
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.compareHash = function(password){
  debug('compareHash');
  return new Promise((resolve, reject) =>{
    bcrypt.compare(password, this.password, (err, result)=>{
      //if bcrypt brakes 500 Error
      if(err) return reject(err);
      //result is false wrong password
      if(!result) return reject(httpErrors(401, 'wrong password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function(){
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    var tries = 0;
    _generateFindHash.call(this);

    function _generateFindHash(){
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(()=> resolve(this.findHash))
      .catch((err) => {
        if(tries > 5) reject(err);
        tries++;
        _generateFindHash.call(this);
      });
    }
  });
};

module.exports = mongoose.model('user', userSchema);
