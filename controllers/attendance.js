var Attendance = require('../models/attendance');

exports.save = function(req, res){
    if(req.body.plan && req.body.date && req.body.classConducted && req.body.traineesPresent){
		var atnd = {
			plan:req.body.plan,
			date:req.body.date,
			classConducted:req.body.classConducted,
			traineesPresent:req.body.traineesPresent
		}
		Attendance(atnd).save(function(err){
			if(!err){
				res.status(200).jsonp({"msg":"Records saved successfully"});
			}
		})
	}else{
		res.status(404).jsonp({msg:"plan, date, classConducted and traineesPresent are all required inputs"})
	}
}

exports.fetch = function(req, res){
    if(req.params.all=='all'){
        Attendance.find().exec(function(err, atnd){
            console.log(atnd);
            if(err){
                res.status(404).jsonp(err)
            }else{
                res.status(200).jsonp(atnd)
            }
        }) 
    }else if(req.params.all){
        Attendance.findOne({_id:req.params.all}).exec(function(err, atnd){
            console.log(atnd);
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

