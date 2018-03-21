var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Technology Schema
 */
var topics =  new Schema({
	name:{type:String},
	duration:{type:Number}
})

var TechnologySchema = new Schema({
	name:{type:String},
	refurl:{type:String},
	desc:{type:String},
	topics:[topics],
	targetAudience:{type:Number}, //0 for Experienced, 1 for sDirect
	isDeleted:{type:Number} //0 is active, 1 is deleted
})


var Technology = module.exports = mongoose.model('Technology', TechnologySchema);