var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Technology Schema
 */

var UserSchema = new Schema({
		name: String,
		email: String,
		password: String,
		type: String		// 0 as admin, 1 as trainee
	})

var Technology = module.exports = mongoose.model('User', UserSchema);