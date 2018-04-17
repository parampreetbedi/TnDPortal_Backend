var Attendance = require('../models/attendance');

exports.save = function(req, res){
    if(req.body.plan && req.body.classDate && (req.body.classConducted==0 || req.body.classConducted==1) && req.body.traineesPresent){
		var atnd = {
			plan:req.body.plan,
			date:req.body.classDate,
			classConducted:req.body.classConducted,
			traineesPresent:req.body.traineesPresent
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
		res.status(404).jsonp({msg:"plan, date, classConducted and traineesPresent are all required inputs"})
	}
}

exports.update = function(req, res){
    Attendance.findOne({ _id:req.params.all }).exec((err, atnd) => {
        if(req.body.plan && req.body.classDate && (req.body.classConducted==0 || req.body.classConducted==1) && req.body.traineesPresent){
            atnd.date = req.body.classDate;
            atnd.classConducted = req.body.classConducted;
            atnd.traineesPresent = req.body.traineesPresent;

            atnd.save((err) => {
                if(!err){
                    res.status(200).jsonp({"msg":"Records saved successfully"});
                }
                else{
                    res.status(404).jsonp(err);
                }
            })
        }else{
            res.status(404).jsonp({msg:"plan, date, classConducted and traineesPresent are all required inputs"})
        }
    })
}

exports.fetch = function(req, res){
    if(req.query.plan && !req.query.trainee && !req.query.classConducted){
        Attendance.find({plan:req.query.plan}).populate('traineesPresent','name').exec(function(err,atnd){
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
        Attendance.find({plan:req.query.plan, traineesPresent:req.query.trainee}).populate('traineesPresent','name').exec(function(err,atnd){
            if(err){
                res.status(404).jsonp(err)
            }else{
                res.status(200).jsonp(atnd)
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