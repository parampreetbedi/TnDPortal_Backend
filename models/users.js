var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Technology Schema
 */

var UserSchema = new Schema({
		name: String,
		email: String,
		password: String 
	})

var Technology = module.exports = mongoose.model('User', UserSchema);