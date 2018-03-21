var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Plan Schema
 */

var EnrollmentSchema = new Schema({
	plan:{ type: Schema.Types.ObjectId, ref: 'Plan'},
	trainee:{type: Schema.Types.ObjectId, ref: 'Employee'},
	isDeleted:{type:Number} //0 is active, 1 is deleted
	// trainingCompleted: { type:Number }, // 0 is ongoing, 1 is completed, 2 is upcoming, 3 is left-in-between
    // starRating: { type: Number},
    // feedback: {type:String}
})


module.exports = mongoose.model('Enrollment', EnrollmentSchema);