var Enrollment = require('../models/enrollment');
var Employee = require('../models/employee');
var Plan = require('../models/plan');
const nodemailer = require('nodemailer');

exports.save = function(req, res){

	if(req.body.trainee && req.body.plan){		
		var enroll = {
			plan:req.body.plan,
			trainee:req.body.trainee,
			isDeleted:0
		}
		Enrollment(enroll).save(function(err){
			if(!err){
				res.status(200).jsonp({"msg":"Records saved successfully"});
			}
		})
	}else{
		res.status(404).jsonp({msg:"trainee and plan are all required inputs"})
	}
}

exports.update = function(req, res){
	if(req.body.plan || req.body.trainee || req.isDeleted){	
		Enrollment.findOne({_id:req.params.enroll}).exec(function(err,enroll){
			console.log("enroll",enroll,req.isDeleted);
			if(err){
				res.status(404).jsonp(err);
			}else{
				if(req.body.plan){
					enroll.tech = req.body.tech;
				}
				if(req.isDeleted){
					enroll.isDeleted = req.isDeleted;
				} 
				if(req.body.trainee){					
					plan.trainee = req.body.trainee;
				}
				enroll.save(function(err){
					if(!err){
						if(req.isDeleted){
							res.status(200).jsonp({"msg":"Enrollment deleted"});
						}else{
							res.status(200).jsonp({"msg":"Enrollment updated"});	
						}						
					}else{
						res.status(404).jsonp(err);
					}
				})
			}
		})
	}else{
		res.status(404).jsonp({msg:"trainee or plan, either is required input"})
	}
}

exports.enroll_in = function(req,res){
		// console.log("here",req.params);
	Enrollment.findOne({_id : req.params.enroll}).populate('trainee').exec(function(err,enrollment){
		// console.log("enrollment",enrollment);
		if(!err) {
			Plan.findOne({_id:enrollment.plan}).populate('tech').exec(function(err1,plan){
				// console.log("plan==>",plan)
				if(!err1){
					plan.trainee.push(enrollment.trainee._id);
					enrollment.isDeleted = 2;
					//enrollment.save(function(err3,saveData){
						//if(!err3){
							//plan.save(function(err4,savePlan){
								//if(!err4){
									Employee.findOne({_id:enrollment.trainee._id}).exec(function(err,emp){
										console.log("emp",emp)
										if(!err){
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
											        to: "chhangani.amit@gmail.com",//enrollment.trainee.email, // list of receivers
											        subject: 'Enrolled for the '+plan.tech.name+' training', // Subject line
											        text: 'You have been successfully enrolled for '+plan.tech.name+' training.', // plain text body
											        html: '<b>You have been successfully enrolled for '+plan.tech.name+' training.</b>' // html body
											    };
											    console.log(mailOptions)
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
										}
									})
									res.send({msg:"successfully Enrolled"});
								//}
							//})
						//}
					//})
				}
			})
		}
	})
}

exports.fetch = function(req, res){
	if(req.params.all=='all'){
		Enrollment.find({isDeleted:0}).populate('plan trainee').exec(function(err, data){
			if(err){
				res.status(404).jsonp(err)
			}else{
				Enrollment.populate(data, [{
	                path: 'plan.trainer',
	                model: 'Employee',
	                select: 'name'
	            },{
	                path: 'plan.tech',
	                model: 'Technology',
	                select: 'name'
	            }], function(err, plan) {
	            	res.status(200).jsonp(plan)
	            })
			}
		})
	}else if(req.params.all){
		Enrollment.findOne({_id:req.params.all, isDeleted:{$ne:1}}).populate('plan trainee').exec(function(err, plan){
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