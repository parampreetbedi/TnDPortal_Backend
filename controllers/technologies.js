var Technology = require('../models/technology');

exports.save = function(req, res){
	console.log("rassdfasdf",req.body);
	if(req.body.name && (req.body.targetAudience == 0 || req.body.targetAudience ==1) && req.body.topics){
		var tech = {
			name:req.body.name,
			refurl : req.body.refurl,
			desc : req.body.desc,
			targetAudience:req.body.targetAudience,
			topics:req.body.topics,
			isDeleted:0
		}
		Technology(tech).save(function(err){
			if(!err){
				res.status(200).jsonp({"msg":"Records saved successfully"});
			}
		})
	}else{
		res.status(404).jsonp({msg:"name, targetAudience and topics are all required inputs"})
	}
}

exports.update = function(req, res){
	if(req.body.name || req.body.desc || req.body.refurl || (req.body.targetAudience == 0 || req.body.targetAudience ==1) || req.body.topics || req.isDeleted){	
		Technology.findOne({_id:req.params.tech}).exec(function(err,tech){
			if(err){
				res.status(404).jsonp(err);
			}else if(!tech.name){
				res.status(404).jsonp({"msg":"Technology not found"});
			}else{
				if(req.body.name){
					tech.name = req.body.name;
				} 
				if(req.body.refurl){
					tech.refurl = req.body.refurl;
				} 
				if(req.body.desc){
					tech.desc = req.body.desc	;
				} 
				if(req.body.targetAudience){
					tech.targetAudience = req.body.targetAudience;
				}
				if(req.body.topics){
					tech.topics = req.body.topics
				}
				if(req.isDeleted){
					tech.isDeleted =  req.isDeleted;
				}
				tech.save(function(err){
					if(!err){
						if(req.isDeleted){
							res.status(200).jsonp({"msg":"Technology deleted"});
						}else{
							res.status(200).jsonp({"msg":"Technology updated"});	
						}						
					}else{
						res.status(404).jsonp(err);
					}
				})
			}
		})
	}else{
		res.status(404).jsonp({msg:"name, targetAudience or topics, either is required input"})
	}
}

exports.fetch = function(req, res){
	if(req.params.all=='all'){
		Technology.find({isDeleted:{$ne:1}}).exec(function(err, tech){
			if(err){
				res.status(404).jsonp(err)
			}else{
				res.status(200).jsonp(tech)
			}
		})
	}else if(req.params.all){
		Technology.findOne({_id:req.params.all, isDeleted:{$ne:1}}).exec(function(err, tech){
			if(err){
				res.status(404).jsonp(err)
			}else{
				res.status(200).jsonp(tech)
			}
		})
	}else{
		res.status(404).jsonp({msg:"a parameter is required"})
	}
}