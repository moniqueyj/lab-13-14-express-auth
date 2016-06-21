'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('authdemon:snack');

const snackSchema = mongoose.Schema({
  name: {type: String, required: true},
  ingredients:{type: Array, required: true},
  userId: {type: mongoose.Schema.ObjectId, require: true}
});

const Snack = module.exports = mongoose.model('snack', snackSchema);

Snack.schema.path('ingredients').validate(function(value){
  debug('Snack.schema.path.validate');
  if(value.length < 1) return false;
  if(value.length > 5) return false;
  return true;
});
