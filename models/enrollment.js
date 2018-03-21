var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Plan Schema
 */

var EnrollmentSchema = new Schema({
	plan:{ type: Schema.Types.ObjectId, ref: 'Plan'},
	trainee:{type: Schema.Types.ObjectId, ref: 'Employee'},
	isDeleted:{type:Number} //0 is active, 1 is deleted
})


module.exports = mongoose.model('Enrollment', EnrollmentSchema);