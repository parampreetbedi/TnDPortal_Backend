var Plan = require('../models/plan');
var TrainedEmployee = require('../models/trainedEmployee');

exports.save = function (req, res) {

	if(req.body.tech && req.body.startDate && req.body.trainer){
		var startDate = new Date(req.body.startDate);
		var plan = {
			tech: req.body.tech,
			startDate: startDate.getTime(),
			trainer: req.body.trainer,
			isDeleted: 0,
			isCompleted: req.body.isCompleted? req.body.isCompleted:2,
			endDate: req.body.endDate? new Date(req.body.endDate).getTime():0,
			type: req.body.type? req.body.type:0,						//i.e. need
			generatedBy: 'current user',         // add current user here receive from request its objectid
			generatedDate: new Date()
		}
		Plan(plan).save(function (err, plan) {
			if (!err) {
				res.status(200).jsonp(plan);
			}
			else{
				res.status(404).jsonp({"err":JSON.stringify(err)});
			}
		})
	}
	else {
		res.status(404).jsonp({ msg: "tech trainer and startDate are all required inputs" })
	}
}

exports.update = function (req, res) {
	if (req.body.tech || req.body.startDate || req.body.endDate || req.body.trainer || req.body.type || req.body.isDeleted || (req.body.isCompleted == 0 || req.body.isCompleted == 1 || req.body.isCompleted == 2)) {
		Plan.findOne({ _id: req.params.plan }).exec(function (err, plan) {
			if (err) {
				res.status(404).jsonp(err);
			} else if (!plan.tech) {
				res.status(404).jsonp({ "msg": "Plan not found" });
			} else {
				if (req.body.tech) {
					plan.tech = req.body.tech;
				}
				if (req.body.startDate) {
					var startDate = new Date(req.body.startDate);
					plan.startDate = startDate.getTime();
				}
				if (req.body.endDate) {
					var endDate = new Date(req.body.endDate);
					plan.endDate = endDate.getTime();
				}
				if (req.body.trainer) {
					plan.trainer = req.body.trainer;
				}
				if (req.body.type) {
					plan.type = req.body.type;
				}
				// if(req.body.trainee){                    //trainee data must be separately updated
				// 	plan.trainee = req.body.trainee
				// }
				if (req.body.isDeleted) {
					plan.isDeleted = req.body.isDeleted;
				}
				if (req.body.isCompleted == 0 || req.body.isCompleted == 1 || req.body.isCompleted == 2) {
					plan.isCompleted = req.body.isCompleted;
				}
				plan.save(function (err) {
					if (!err) {
						if (req.isDeleted) {
							res.status(200).jsonp({ "msg": "Plan deleted" });
						} else {
							res.status(200).jsonp({ "msg": "Plan updated" });
						}
					} else {
						res.status(404).jsonp(err);
					}
				})
			}
		})
	} else {
		res.status(404).jsonp({ msg: "tech, startDate or trainer, either is required input" })
	}
}

exports.fetch = function (req, res) {
	if (req.params.all == 'all') {
		Plan.find({ isDeleted: { $ne: 1 }/*, type:1*/ }).populate('trainer tech', 'name').exec(function (err, plan) {
			if (err) {
				res.status(404).jsonp(err)	//trainer trainee tech
			} else {
				res.status(200).jsonp(plan)
			}
		})
	}
	else if (req.params.all == 'need') {
		Plan.find({ isDeleted: { $ne: 1 }, type: 0 /*, startDate:{$lte:Date.now()}*/ }).populate('trainer tech', 'name').exec(function (err, plan) {
			if (err) {
				res.status(404).jsonp(err)
			} else {
				res.status(200).jsonp(plan)
			}
		})
	}
	else if (req.params.all == 'ongoing') {
		Plan.find({ isDeleted: { $ne: 1 }, type: 1, isCompleted: 0 /*, startDate:{$lte:Date.now()}*/ }).populate('trainer tech', 'name').exec(function (err, plan) {
			if (err) {
				res.status(404).jsonp(err)
			} else {
				res.status(200).jsonp(plan)
			}
		})
	} else if (req.params.all == 'completed') {
		Plan.find({ isDeleted: { $ne: 1 }, type: 1, isCompleted: 1 /*, startDate:{$lte:Date.now()}*/ }).populate('trainer tech', 'name').exec(function (err, plan) {
			if (err) {
				res.status(404).jsonp(err)
			} else {
				res.status(200).jsonp(plan)
			}
		})
	} else if (req.params.all == 'upcoming') {
		Plan.find({ isDeleted: { $ne: 1 }, type: 1, isCompleted: 2 /*, startDate:{$gt:Date.now()}*/ }).populate('trainer tech', 'name').exec(function (err, plan) {
			if (err) {
				res.status(404).jsonp(err)
			} else {
				res.status(200).jsonp(plan)
			}
		})
	} else if (req.params.all) {
		Plan.findOne({ _id: req.params.all, isDeleted: { $ne: 1 } }).populate('trainer tech').exec(function (err, plan) {
			if (err) {
				res.status(404).jsonp(err)
			} else {
				res.status(200).jsonp(plan)
			}
		})
	} else {
		res.status(404).jsonp({ msg: "a parameter is required" })
	}
}

exports.enrollStartComplete = function (req, res) {
	if (req.query.action == 'enroll') {
		Plan.findOne({ _id: req.query.id }).exec(function (err, plan) {
			plan.type = 1;
			plan.save(function (err) {
				if (!err) {
					res.status(200).jsonp({ "msg": "Plan updated" });
				} else {
					res.status(404).jsonp(err);
				}
			})
		})
	}
	else if (req.body.action == 'start') {
		TrainedEmployee.find({ plan: req.params.id }).exec((err, trainedEmps) => {
			trainedEmps.forEach((te) => {
				te.trainingCompleted = 0;
			})
			Promise.all(trainedEmps.map(te => te.save()))	//save array of objects
				.then((results) => {
					res.status(200).jsonp({ "msg": "Trained Employees updated" });
				})
		})
	}
	else if (req.body.action == 'complete') {
		TrainedEmployee.find({ plan: req.params.id }).exec((err, trainedEmps) => {
			trainedEmps.forEach((te) => {
				te.trainingCompleted = 1;
			})
			Promise.all(trainedEmps.map(te => te.save()))
				.then((results) => {
					res.status(200).jsonp({ "msg": "Trained Employees updated" });
				})
		})
	}
	else if (req.body.action == 'upcoming') {
		TrainedEmployee.find({ plan: req.params.id }).exec((err, trainedEmps) => {
			trainedEmps.forEach((te) => {
				te.trainingCompleted = 2;
			})
			Promise.all(trainedEmps.map(te => te.save()))
				.then((results) => {
					res.status(200).jsonp({ "msg": "Trained Employees updated" });
				})
		})
	}
}