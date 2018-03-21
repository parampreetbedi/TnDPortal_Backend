var TrainedEmployee = require('../models/trainedEmployee');

exports.save = function(req, res){

	if(req.body.trainee && req.body.plan && req.body.trainingCompleted){		
		var trainingData = {
			plan:req.body.plan,
			trainee:req.body.trainee,
			trainingCompleted:req.body.trainingCompleted
		}
		TrainedEmployee(trainingData).save(function(err){
			if(!err){
				res.status(200).jsonp({"msg":"Records saved successfully"});
			}
		})
	}else{
		res.status(404).jsonp({msg:"trainee and plan are all required inputs"})
	}
}

exports.addRatingFeedback = function(req, res){

	if(req.body._id && (req.body.starRating || req.body.feedback)){
        TrainedEmployee.findOne({_id : req.body._id}, function(err, tData){
            if(err){
				res.status(404).jsonp(err);
			}else{
                if(req.body.starRating)
                    tData.starRating = req.body.starRating;
                if(req.body.feedback)
                    tData.feedback = req.body.feedback;
                TrainedEmployee(trainingData).save(function(err){
                    if(!err){
                        res.status(200).jsonp({"msg":"Records saved successfully"});
                    }
                })
            }
        })
	}else{
		res.status(404).jsonp({msg:"trainee and plan are all required inputs"})
	}
}

exports.fetch = function(req, res){
	if(req.params.all=='all'){
		TrainedEmployee.find().populate('trainee')/*.populate('plan','tech')*/.exec(function(err, trainedEmp){
			console.log(trainedEmp);
			if(err){
				res.status(404).jsonp(err)
			}else{
				res.status(200).jsonp(trainedEmp)
			}
		})
	}else if(req.params.all){
		Technology.findOne({_id:req.params.all}).populate('trainee','name').populate('plan','tech').exec(function(err, trainedEmp){
			if(err){
				res.status(404).jsonp(err)
			}else{
				res.status(200).jsonp(trainedEmp)
			}
		})
	}else{
		res.status(404).jsonp({msg:"a parameter is required"})
	}
}