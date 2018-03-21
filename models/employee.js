var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Employee Schema
 */ //ADDED

var EmployeeSchema = new Schema({
	empCode:{type:Number},
	name:{type:String},
	dept:{type:String},
	designation:{type:String},
	email:{type:String},
	isDeleted:{type:Number} //0 is active, 1 is deleted
})

module.exports = mongoose.model('Employee', EmployeeSchema);