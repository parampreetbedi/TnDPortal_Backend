var Attendance = require('../models/attendance');
var _ = require('underscore');

exports.save = function(req, res){
    if(req.body.plan && req.body.classDate && (req.body.classConducted==0 || req.body.classConducted==1) && req.body.traineesPresent && req.body.traineesAbsent){
		var atnd = {
			plan:req.body.plan,
			date:new Date(req.body.classDate).getTime(),
			classConducted:req.body.classConducted,
            traineesPresent:req.body.traineesPresent,
            traineesAbsent:req.body.traineesAbsent
		}
		Attendance(atnd).save(function(err){
			if(!err){
				res.status(200).jsonp({"msg":"Records saved successfully"});
			}
			else{
				res.status(404).jsonp(err);
			}
		})
	}else{
		res.status(404).jsonp({msg:"plan, date, classConducted, traineesPresent and traineesAbsent are all required inputs"})
	}
}

exports.update = function(req, res){
    Attendance.findOne({ _id:req.params.all }).exec((err, atnd) => {
        if(req.body.plan && req.body.classDate && (req.body.classConducted==0 || req.body.classConducted==1) && req.body.traineesPresent && req.body.traineesAbsent){
            atnd.date = new Date(req.body.classDate).getTime();
            atnd.classConducted = req.body.classConducted;
            atnd.traineesPresent = req.body.traineesPresent;
            atnd.traineesAbsent = req.body.traineesAbsent;

            atnd.save((err) => {
                if(!err){
                    res.status(200).jsonp({"msg":"Records saved successfully"});
                }
                else{
                    res.status(404).jsonp(err);
                }
            })
        }else{
            res.status(404).jsonp({msg:"plan, date, classConducted, traineesPresent and traineesAbsent are all required inputs"})
        }
    })
}

exports.fetch = function(req, res){
    if(req.query.plan && !req.query.trainee && !req.query.classConducted){
        Attendance.find({plan:req.query.plan})./*populate('traineesPresent','name').populate('traineesAbsent','name').*/exec(function(err,atnd){
            if(err){
                res.status(404).jsonp(err)
            }else{
                res.status(200).jsonp(atnd)
            }
        })
    }else if(req.query.plan && !req.query.trainee && req.query.classConducted){
        Attendance.find({plan:req.query.plan, classConducted:0}).populate('traineesPresent','name').exec(function(err,atnd){
            if(err){
                res.status(404).jsonp(err)
            }else{
                res.status(200).jsonp(atnd)
            }
        })
    }else if(req.query.plan && req.query.trainee){
        Attendance.find({plan:req.query.plan}).sort({date:1})/*.populate('traineesPresent','name').populate('traineesAbsent','name')*/.exec(function(err,atnd){
            var attRec = [];
            atnd.forEach(record => {
                var presentTrainees = [];
                record.traineesPresent.forEach(obj =>{
                    presentTrainees.push(obj.toString())
                })
                var absentTrainees = [];
                record.traineesAbsent.forEach(obj =>{
                    absentTrainees.push(obj.toString())
                })
                var present = _.contains(presentTrainees,req.query.trainee);
                if(present){
                    attRec.push({
                        date:record.date,
                        status:'Present'
                    });
                }else{
                    var absent = _.contains(absentTrainees,req.query.trainee);
                    if(absent){
                        attRec.push({
                            date:record.date,
                            status:'Absent'
                        }); 
                    }else{
                        attRec.push({
                            date:record.date,
                            status:'Not Enrolled'
                        });
                    }
                }
            })
            _.sortBy(attRec, 'date');
            if(err){
                res.status(404).jsonp(err)
            }else{
                res.status(200).jsonp(attRec)
            }
        })
    }else if(req.params.all){
        Attendance.findOne({_id:req.params.all}).exec(function(err, atnd){
            if(err){
                res.status(404).jsonp(err)
            }else{
                res.status(200).jsonp(atnd)
            }
        })
    }else{
        res.status(404).jsonp({msg:"a parameter is required"})
    }
}