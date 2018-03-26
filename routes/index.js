var express = require('express');
var router = express.Router();
var Utils = require('util')
var path = require('path');
var Technology = require('../models/technology');
var Chat = require('../models/chats');
var Plan = require('../models/plan');
var Employee = require('../models/employee');
var Enrollment = require('../models/enrollment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

var apiai = require('apiai');

var apia = apiai("9a1e004df2094029b4cc45e548a9489f");

var context = [];

router.post('/', function(req,res,next){

	if(req.body.intent=="TndAssistant - Plan"){
		
		var query={isDeleted:0};
		if(req.body.msg.substr(0,6).toLowerCase()=="upcomi"){
			query.startDate={'$gt':Date.now()};
		}
		else if(req.body.msg.substr(0,6).toLowerCase()=="previo"){
			query.startDate={'$lte':Date.now()};
			query.isCompleted=1;
		}
		else if(req.body.msg.substr(0,6).toLowerCase()=="ongoin"){
			query.startDate={'$lte':Date.now()};
			query.isCompleted=0;
		}
		Plan.find(query).populate('tech trainer').exec(function(err,pln){
			if(!err){
				var plans='';
				if(pln){
					for(var i=0; i<pln.length; i++){					
						plans+="Trainer: "+pln[i].trainer.name+", Technology: "+pln[i].tech.name+" <br />"
					}
					context=[{
			            "name":"tndassistant-plan-followup",
			            "parameters":{ "plan": plans},
			            "lifespan":4
			        }];
			        callapiai(req.body.msg, {sessionId:req.body.user,contexts:context},req,res)
				}
				else{
					callapiai(req.body.msg, {sessionId:req.body.user},req,res)
				}
			}
		})
	}else if(req.body.intent=="TndAssistant - Technology"){
		Technology.findOne({isDeleted:0, name:req.body.msg.trim()}).exec(function(err,tech){
			if(!err){
				if(tech){
					if(tech.desc || tech.refurl){
			        	var technology=(tech.desc?tech.desc:'')+'<br /><br /><br /><br /><br />'+(tech.refurl?tech.refurl:'');
			        	var event={
				            "name":"technologyTech",
				            "data":{ "technology": technology}
				        };
				        callapiai(req.body.msg, {sessionId:req.body.user,event:event},req,res)
			        }else{
			        	callapiai(req.body.msg, {sessionId:req.body.user},req,res)
			        }
				}else{
		        	callapiai(req.body.msg, {sessionId:req.body.user},req,res)
		        }
			}
		})
	}else if(req.body.intent=="TndAssistant - Enrollment"){
		Technology.findOne({isDeleted:0, name:req.body.msg.trim()}).exec(function(err,tech){
			if(!err){
				if(tech){
					Plan.findOne({isDeleted:0, tech:tech._id}).exec(function(err,plan){
						if(!err){
							if(plan){
								Enrollment({plan:plan._id, trainee:req.body.user, isDeleted:0}).save(function(err){									
									callapiai("", {sessionId:req.body.user,event: {
		"name": "enrollTech"}},req,res);
								})	
							}else{
								callapiai(req.body.msg, {sessionId:req.body.user},req,res);
							}							
						}
					});
				}else{
					callapiai(req.body.msg, {sessionId:req.body.user},req,res);
				}														
			}
		})
	}else{
		if(req.body.msg.substr(0,9).toLowerCase()=="technolog"){
			Technology.find({isDeleted:0}).exec(function(err,tech){
				if(!err){
					var technologies='';
					var techs='';
					for(var i=0; i<tech.length; i++){
						technologies+=tech[i].name;
						techs+=tech[i].name;
						if(i!=tech.length-1){
							technologies+=", <br /> ";
							techs+=', ';
						}
					}
					context=[{
			            "name":"tndassistant-followup",
			            "parameters":{ "technologies": technologies, "techs":techs },
			            "lifespan":4
			        }];
					callapiai(req.body.msg, {sessionId:req.body.user,contexts:context},req,res)
				}
			})
		}else if(req.body.msg.substr(0,9).toLowerCase()=="my traini"){
			Plan.find({trainee:req.body.user}).populate('tech trainer').exec(function(err,plans){
				if(!err){
					var mytrainings='';
					if(plans.length){
						var ongoing='';
						var upcoming='';
						var previous='';
						for(var i=0; i<plans.length; i++){
							var sd=new Date(plans[i].startDate);
							var startd=sd.getDate()+'/'+(sd.getMonth()+1)+'/'+sd.getFullYear();
							if(plans[i].startDate>Date.now()){
								if(upcoming==''){
									upcoming='<strong>Upcoming Trainings:</strong> <br />';
								}
								upcoming+='<strong>'+plans[i].tech.name+'</strong> training, will be given by '+plans[i].trainer.name+', starting from: '+startd+'<br />'
							}
							if(plans[i].startDate<=Date.now() && plans[i].isCompleted==0){
								if(ongoing==''){
									ongoing='<strong>Ongoing Trainings:</strong> <br />';
								}
								ongoing+='<strong>'+plans[i].tech.name+'</strong> training, given by '+plans[i].trainer.name+', started on: '+startd+'<br />'
							}
							if(plans[i].startDate<=Date.now() && plans[i].isCompleted==1){
								if(previous==''){
									previous='<strong>Previous Trainings:</strong> <br />';
								}
								previous+='<strong>'+plans[i].tech.name+'</strong> training, given by: '+plans[i].trainer.name+', started on: '+startd+'<br />'
							}						
						}
						mytrainings=previous+ongoing+upcoming;
						context=[{
				            "name":"tndassistant-followup",
				            "parameters":{ "mytrainings": mytrainings },
				            "lifespan":4
				        }];
				        callapiai(req.body.msg, {sessionId:req.body.user,contexts:context},req,res)
					}else{
						callapiai(req.body.msg, {sessionId:req.body.user},req,res)
					}
					
					
				}
			})
		}else if(req.body.msg.substr(0,9).toLowerCase()=="enrollmen"){
			Plan.find({trainee:{$ne:req.body.user},isCompleted:0}).populate('tech trainer').sort({'tech.name':1}).exec(function(err,plans){
				if(!err){
					if(plans){
						var upcomingtrainings='<br />';
						var uct='';
						for(var i=0; i<plans.length; i++){
							if(i==0 || (i>0 && plans[i].tech.name!=plans[i-1].tech.name)){
								var sd=new Date(plans[i].startDate);
								var startd=sd.getDate()+'/'+(sd.getMonth()+1)+'/'+sd.getFullYear();
								upcomingtrainings+='<strong>'+plans[i].tech.name+'</strong><br />';
								if(i!=0)
									uct+=', '+plans[i].tech.name;
								else
									uct+=plans[i].tech.name
							}						
						}
						context=[{
				            "name":"tndassistant-followup",
				            "parameters":{ "upcomingtrainings": upcomingtrainings, "uct": uct},
				            "lifespan":4
				        }];
				        //console.log("context",context);
				        callapiai(req.body.msg, {sessionId:req.body.user,contexts:context},req,res)
					}else{
						callapiai(req.body.msg, {sessionId:req.body.user},req,res)
					}	
			        
					
				}
			})
		}else{
			callapiai(req.body.msg, {sessionId:req.body.user},req,res)	
		}	
	}
	
	
	Chat({message:req.body.msg, employee:req.body.user, messageType:0, isCreated:Date.now()}).save()
	
})

function callapiai(msg, body, req, res){
	if(body.event){
		var request = apia.eventRequest(body.event, body);
	}else{
		var request = apia.textRequest(msg, body);
	}
	
	request.on('response', function(response) {
		//console.log("response.result.contexts",response.result.fulfillment.messages)
		if(response.result.fulfillment.messages.length){
			if(response.result.fulfillment.messages[0].payload){
				//console.log("response.result.fulfillment.messages[0].payload",response.result.fulfillment.messages[0].payload)
				Chat({message:response.result.fulfillment.messages[0].payload.speech, employee:req.body.user, messageType:1, isCreated:Date.now()}).save()
				if(response.result.fulfillment.messages[0].payload.quickreplies){
					if(typeof(response.result.fulfillment.messages[0].payload.quickreplies) == 'object'){
						qr = response.result.fulfillment.messages[0].payload.quickreplies;
					}else{
						qr = response.result.fulfillment.messages[0].payload.quickreplies.split(',');
					}
					res.jsonp({
						msg:response.result.fulfillment.messages[0].payload.speech,
						quickreplies:qr, 
						//context:response.result.contexts[0].name,
						intent: response.result.metadata.intentName
					});
				}else{
					res.jsonp({
						msg:response.result.fulfillment.messages[0].payload.speech, 
						//context:response.result.contexts[0].name,
						intent: response.result.metadata.intentName
					});
					Chat({message:response.result.fulfillment.messages[0].speech, employee:req.body.user, messageType:1, isCreated:Date.now()}).save()
				}
			}else if(response.result.fulfillment.messages[0].speech){
				res.jsonp({msg:response.result.fulfillment.messages[0].speech, /*context:response.result.contexts[0].name,*/ intent: response.result.metadata.intentName});
				Chat({message:response.result.fulfillment.messages[0].speech, employee:req.body.user, messageType:1, isCreated:Date.now()}).save()
			}else if(response.result.fulfillment.messages[1].speech){
				res.jsonp({msg:response.result.fulfillment.messages[1].speech, /*context:response.result.contexts[0].name,*/ intent: response.result.metadata.intentName});
				Chat({message:response.result.fulfillment.messages[1].speech, employee:req.body.user, messageType:1, isCreated:Date.now()}).save()
			}
		}else{
			//console.log("m herererere")
			res.jsonp({msg:response.result.fulfillment.speech, /*context:response.result.contexts[0].name,*/ intent: response.result.metadata.intentName});
			Chat({message:response.result.fulfillment.speech, employee:req.body.user, messageType:1, isCreated:Date.now()}).save()
		}	    
	});

	request.on('error', function(error) {
	    //console.log(error);
	});

	request.end();
}

function abc(req,res,next){
	var technologies = '';
	Technology.find({isDeleted:0}).exec(function(err,tech){
		if(!err){
			for(var i=0; i<tech.length; i++){
				technologies+=tech[i].name;
				if(i!=tech.length-1){
					technologies+=", ";
				}
			}
			req.technologies=technologies;			
		}
	})	
	next();
}


router.post('/abc', function(req,res,next){	
	var query={isDeleted:0};
	//console.log("req.body.result.parameters",req.body.result.parameters)
	if(req.body.result.parameters.upcoming){
		query.startDate={'$gt':Date.now()};
	}
	else if(req.body.result.parameters.previous){
		query.startDate={'$lte':Date.now()};
		query.isCompleted=1;
	}
	else if(req.body.result.parameters.ongoing){
		query.startDate={'$lte':Date.now()};
		query.isCompleted=0;
	}
	
	Plan.find(query).populate('tech trainer').exec(function(err,pln){
		if(!err){
			var plans='';
			if(pln){
				for(var i=0; i<pln.length; i++){
					if(req.body.result.parameters.technologies){
						if(pln[i].tech.name.toLowerCase()==req.body.result.parameters.technologies.toLowerCase()){
							plans+="Trainer: "+pln[i].trainer.name+", Technology: "+pln[i].tech.name+" <br />"
						}
					}else{
						plans+="Trainer: "+pln[i].trainer.name+", Technology: "+pln[i].tech.name+" <br />"
					}

					
				}
			}			
			if(!plans){
				plans='No trainings found'
			}
			var retu = {
		        "speech": plans,
		        "displayText": plans
			}
			res.jsonp(retu)
		}
	})

	
})


module.exports = router;
