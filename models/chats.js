var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Plan Schema
 */

var ChatSchema = new Schema({
	message:{ type: String },
	employee:{type: Schema.Types.ObjectId, ref: 'Employee'},
	messageType:{type: Number}, //0 from user, 1 from bot
	isCreated:{type:Number, default:Date.now()}
})


module.exports = mongoose.model('Chat', ChatSchema);