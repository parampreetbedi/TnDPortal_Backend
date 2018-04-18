var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Attendance Schema
 */

var AttendanceSchema = new Schema({
    //trainee:{ type: Schema.Types.ObjectId, ref: 'Employee'},
    plan:{ type: Schema.Types.ObjectId, ref: 'Plan'},
    date:{ type: Date },
    classConducted: { type:Number },      // 0 for yes and 1 for no
    traineesPresent:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
    traineesAbsent:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
})

module.exports = mongoose.model('Attendance', AttendanceSchema);