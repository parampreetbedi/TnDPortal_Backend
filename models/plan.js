var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Plan Schema
 */ //REMOVED TRAINEE from here

var PlanSchema = new Schema({
    tech:{ type: Schema.Types.ObjectId, ref: 'Technology'},
    type:{ type:Number}, // 0 is Need, 1 is Training-Plan
	startDate:{type:Number},
	endDate:{type:Number},
    trainer:{ type: Schema.Types.ObjectId, ref: 'Employee'},
    //trainee:[{ type: Schema.Types.ObjectId, ref: 'Employee'}],
    generatedBy:{ type: Schema.Types.ObjectId, ref: 'Employee'},
    generatedDate:{ type: Number },
    isCompleted:{type:Number}, //0 is ongoing, 1 is completed, 2 is upcoming
    isDeleted:{type:Number} //0 is active, 1 is deleted	
})


module.exports = mongoose.model('Plan', PlanSchema);