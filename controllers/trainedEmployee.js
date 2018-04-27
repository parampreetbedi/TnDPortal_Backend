var TrainedEmployee = require('../models/trainedEmployee');
var Employee = require('../models/employee');
var Plan = require('../models/plan');
const nodemailer = require('nodemailer');

exports.save = function (req, res) {

	if (req.body.trainee && req.body.plan && (req.body.trainingCompleted == 0 ||
		req.body.trainingCompleted == 1 || req.body.trainingCompleted == 2 || req.body.trainingCompleted == 3)) {
		var trainingData = {
			plan: req.body.plan,
			trainee: req.body.trainee,
			trainingCompleted: req.body.trainingCompleted,
			isDeleted:0
		}
		TrainedEmployee(trainingData).save(function (err) {
			if (!err) {

				Employee.findOne({_id:req.body.trainee}).exec(function(err,emp){
					if(!err){

						Plan.findOne({_id:req.body.plan}).populate('tech','name').exec((err, plan) => {
							if(emp){

								let transporter = nodemailer.createTransport({
									host: 'mail.smartdatainc.net',
									port: 587,
									secure: false, // true for 465, false for other ports
									auth: {
										user: "amitchh@smartdatainc.net", // generated ethereal user
										pass: "amitchh1#" // generated ethereal password
									}
								});

								// setup email data with unicode symbols
								let mailOptions = {
									from: '"Amit" <chhangani.amit@gmail.com>', // sender address
									to: emp.email,//"chhangani.amit@gmail.com",//enrollment.trainee.email, // list of receivers
									subject: 'Enrolled for the '+plan.tech.name+' training', // Subject line
									text: 'You have been successfully enrolled for '+plan.tech.name+' training.', // plain text body
									html: '<b>You have been successfully enrolled for '+plan.tech.name+' training.</b>' // html body
								};
								// console.log(mailOptions)
								// send mail with defined transport object
								transporter.sendMail(mailOptions, (error, info) => {
									if (error) {
										return console.log(error);
									}
									console.log('Message sent: %s', info.messageId);
									// Preview only available when sending through an Ethereal account
									console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

									// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
									// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
								});
							}
						})							
					}
				})
				res.send({msg:"successfully Enrolled"});
			}
			else {
				res.status(404).jsonp({ msg: "trainee and plan are all required inputs" })
			}	
		})
	}
}

exports.addRatingFeedback = function (req, res) {

	if (req.body.trainee && (req.body.starRating || req.body.feedback)) {
		TrainedEmployee.findOne({ plan: req.body.trainee }, function (err, tData) {
			if (err) {
				res.status(404).jsonp(err);
			} else {
				if (req.body.starRating)
					tData.starRating = req.body.starRating;
				if (req.body.feedback)
					tData.feedback = req.body.feedback;
				TrainedEmployee(trainingData).save(function (err) {
					if (!err) {
						res.status(200).jsonp({ "msg": "Records saved successfully" });
					}
				})
			}
		})
	} else {
		res.status(404).jsonp({ msg: "trainee and plan are all required inputs" })
	}
}

exports.fetch = function (req, res) {
	if(req.query.plan){
		TrainedEmployee.find({isDeleted:0, trainingCompleted:{ $ne:3 }, plan:req.query.plan})/*.populate('trainee', 'name')*/.exec((err, trainedEmp) => {
			if(!req.query.data){
				var list = [];
				trainedEmp.forEach((te) => {
					list.push(te.trainee);
				});
				trainedEmp = list;
			}
			if (err) {
				res.status(404).jsonp(err)
			} else {
				res.status(200).jsonp(trainedEmp)
			}
		})
	}
	else if (req.params.all == 'all') {
		TrainedEmployee.find({isDeleted:0}).populate('trainee', 'name').populate({
			path: 'plan',
			select: 'tech',
			populate: {					//multilevel populate
				path: 'tech',
				select: 'name'
			}
		}).exec(function (err, trainedEmp) {
			if (err) {
				res.status(404).jsonp(err)
			} else {
				res.status(200).jsonp(trainedEmp)
			}
		})
	} else if (req.params.all) {
		TrainedEmployee.findOne({ _id: req.params.all }).populate('trainee', 'name').populate('plan', 'tech').exec(function (err, trainedEmp) {
			if (err) {
				res.status(404).jsonp(err)
			} else {
				res.status(200).jsonp(trainedEmp)				
			}
		})
	} else {
		res.status(404).jsonp({ msg: "a parameter is required" })
	}
}

exports.update = function (req, res) {
	TrainedEmployee.findOne({ _id: req.params.all }).exec((err, trainedEmp) => {
		//console.log(req.body);
		if((req.body.trainingCompleted==0 || req.body.trainingCompleted==1 || req.body.trainingCompleted==2) && req.body.plan && req.body.trainee){
			trainedEmp.trainingCompleted = req.body.trainingCompleted;
			trainedEmp.plan = req.body.plan;
			trainedEmp.trainee = req.body.trainee;
			if(req.body.starRating){
			  trainedEmp.starRating = req.body.starRating;	
			}
			if(req.body.feedback){
				trainedEmp.feedback = req.body.feedback;	
			}
			if (req.body.isDeleted) {
				trainedEmp.isDeleted = req.body.isDeleted;
			}
			trainedEmp.save((err) => {
				if(!err){
					if(req.body.isDeleted){
						res.status(200).jsonp({"msg":"Plan deleted"});
					}else{
						res.status(200).jsonp({"msg":"Plan updated"});	
					}
				}else{
					res.status(404).jsonp(err);
				}
			})
		}
		else if(req.body.isDeleted == 1){
			trainedEmp.isDeleted = req.body.isDeleted;
			trainedEmp.save((err) => {
				if(!err){					
					res.status(200).jsonp({"msg":"Plan deleted"});					
				}else{
					res.status(404).jsonp(err);
				}
			})
		}
		else{
			res.status(404).jsonp({msg:"trainingCompleted, plan or trainee, either is required input "+JSON.stringify(req.body)})
		}
	})
}

exports.delete = function (req, res) {
	TrainedEmployee.findOne({isDeleted:0, plan:req.query.plan, trainee:req.query.trainee}, (err, trainedEmp) => {
		trainedEmp.isDeleted = 1;
		trainedEmp.save((err) => {
			if(!err){
				res.status(200).jsonp({"msg":"TrainedEmployee deleted"});
			}else{
				res.status(404).jsonp(err);
			}
		})
	})
}