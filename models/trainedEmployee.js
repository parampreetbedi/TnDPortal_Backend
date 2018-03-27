var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * TrainedEmployee Schema
 */

var TrainedEmployeeSchema = new Schema({
    trainee:{ type: Schema.Types.ObjectId, ref: 'Employee'},
    plan:{ type: Schema.Types.ObjectId, ref: 'Plan'},
    trainingCompleted: { type:Number }, // 0 is ongoing, 1 is completed, 2 is upcoming, 3 is left-in-between
    starRating: { type: Number},
    feedback: {type:String},
    isDeleted: { type: Number }
})

module.exports = mongoose.model('TrainedEmployee', TrainedEmployeeSchema);