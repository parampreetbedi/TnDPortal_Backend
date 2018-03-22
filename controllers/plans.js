var Plan = require('../models/plan');

exports.save = function(req, res){

	if(req.body.tech && req.body.startDate && req.body.trainer){
		var startDate = new Date(req.body.startDate);		
		var plan = {
			tech:req.body.tech,
			startDate:startDate.getTime(),      //?
			trainer:req.body.trainer,
			isDeleted:0,
			isCompleted:2,
			endDate:0,							//?
			type:1,
			generatedBy:'current user',         // add current user here receive from request its objectid
			generatedDate:new Date()
		}
		Plan(plan).save(function(err){
			if(!err){
				res.status(200).jsonp({"msg":"Records saved successfully"});
			}
		})
	}
	else if(req.body.tech && req.body.startDate && !req.body.trainer){
		var startDate = new Date(req.body.startDate);		
		var plan = {
			tech:req.body.tech,
			startDate:startDate.getTime(),      //?
			isDeleted:0,
			isCompleted:2,
			endDate:0,							//?
			type:0,
			generatedBy:'current user',         // add current user here receive from request its objectid
			generatedDate:new Date()
		}
		Plan(plan).save(function(err){
			if(!err){
				res.status(200).jsonp({"msg":"Records saved successfully"});
			}
		})
	}
	else{
		res.status(404).jsonp({msg:"tech, trainer and startDate are all required inputs"})
	}
}

exports.update = function(req, res){
	if(req.body.tech || req.body.startDate || (req.body.isCompleted==0 || req.body.isCompleted==1 || req.body.isCompleted==2) || req.body.trainer || req.isDeleted ){	
		Plan.findOne({_id:req.params.plan}).exec(function(err,plan){
			if(err){
				res.status(404).jsonp(err);
			}else if(!plan.tech){
				res.status(404).jsonp({"msg":"Plan not found"});
			}else{
				if(req.body.tech){
					plan.tech = req.body.tech;
				} 
				if(req.body.startDate){
					var startDate = new Date(req.body.startDate);
					plan.startDate = startDate.getTime();
				}
				if(req.body.trainer){
					plan.trainer = req.body.trainer
				}
				// if(req.body.trainee){                    //trainee data must be separately updated
				// 	plan.trainee = req.body.trainee
				// }
				if(req.isDeleted){
					plan.isDeleted =  req.isDeleted;
				}
				if(req.body.isCompleted==0 || req.body.isCompleted==1 || req.body.isCompleted==2){
					plan.isCompleted =  req.body.isCompleted;
					plan.endDate =  Date.now();
				}
				plan.save(function(err){
					if(!err){
						if(req.isDeleted){
							res.status(200).jsonp({"msg":"Plan deleted"});
						}else{
							res.status(200).jsonp({"msg":"Plan updated"});	
						}						
					}else{
						res.status(404).jsonp(err);
					}
				})
			}
		})
	}else{
		res.status(404).jsonp({msg:"tech, startDate or trainer, either is required input"})
	}
}

exports.fetch = function(req, res){
	if(req.params.all=='all'){
		Plan.find({isDeleted:{$ne:1}}).populate('trainer tech','name').exec(function(err, plan){
			if(err){
				res.status(404).jsonp(err)	//trainer trainee tech
			}else{
				res.status(200).jsonp(plan)
			}
		})
	}else if(req.params.all=='ongoing'){
		Plan.find({isDeleted:{$ne:1}, isCompleted:0 /*, startDate:{$lte:Date.now()}*/ }).populate('trainer tech','name').exec(function(err, plan){
			if(err){
				res.status(404).jsonp(err)
			}else{
				res.status(200).jsonp(plan)
			}
		})
	}else if(req.params.all=='completed'){
		Plan.find({isDeleted:{$ne:1}, isCompleted:1 /*, startDate:{$lte:Date.now()}*/ }).populate('trainer tech','name').exec(function(err, plan){
			if(err){
				res.status(404).jsonp(err)
			}else{
				res.status(200).jsonp(plan)
			}
		})
	}else if(req.params.all=='upcoming'){
		Plan.find({isDeleted:{$ne:1}, isCompleted:2 /*, startDate:{$gt:Date.now()}*/ }).populate('trainer tech','name').exec(function(err, plan){
			if(err){
				res.status(404).jsonp(err)
			}else{
				res.status(200).jsonp(plan)
			}
		})
	}else if(req.params.all){
		Plan.findOne({_id:req.params.all, isDeleted:{$ne:1}}).populate('trainer tech').exec(function(err, plan){
			if(err){
				res.status(404).jsonp(err)
			}else{
				res.status(200).jsonp(plan)
			}
		})
	}else{
		res.status(404).jsonp({msg:"a parameter is required"})
	}
}