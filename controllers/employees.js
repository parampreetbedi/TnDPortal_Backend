var Employee = require('../models/employee');

exports.save = function(req, res){
	//console.log("====>>",req.body);
	if(req.body.name && req.body.dept && req.body.email && req.body.designation){
		var emp = {
			name:req.body.name,
			email:req.body.email,
			dept:req.body.dept,
			designation:req.body.designation,
			isDeleted:0
		}
		Employee(emp).save(function(err){
			if(!err){
				res.status(200).jsonp({"msg":"Records saved successfully"});
			}
		})
	}else{
		res.status(404).jsonp({msg:"name, dept, designation and email are all required inputs"})
	}
}

exports.update = function(req, res){
	if(req.body.name || req.body.email || req.body.dept || req.body.designation || req.isDeleted){	
		Employee.findOne({_id:req.params.emp}).exec(function(err,emp){
			if(err){
				res.status(404).jsonp(err);
			}else if(!emp.name){
				res.status(404).jsonp({"msg":"Employee not found"});
			}else{
				if(req.body.name){
					emp.name = req.body.name;
				} 
				if(req.body.email){
					emp.email = req.body.email;
				}
				if(req.body.designation){
					emp.designation = req.body.designation
				}
				if(req.body.dept){
					emp.dept = req.body.dept
				}
				if(req.isDeleted){
					emp.isDeleted =  req.isDeleted;
				}
				emp.save(function(err){
					if(!err){
						if(req.isDeleted){
							res.status(200).jsonp({"msg":"Employee deleted"});
						}else{
							res.status(200).jsonp({"msg":"Employee updated"});	
						}						
					}else{
						res.status(404).jsonp(err);
					}
				})
			}
		})
	}else{
		res.status(404).jsonp({msg:"name, email, dept or designation, either is required input"})
	}
}

exports.fetch = function(req, res){
	if(req.params.all){
		if(req.params.all=='all'){
			Employee.find({isDeleted:{$ne:1}}).exec(function(err, emp){
				if(err){
					res.status(404).jsonp(err)
				}else{
					res.status(200).jsonp(emp)
				}
			})
		}else if(req.params.all){
			Employee.findOne({_id:req.params.all, isDeleted:{$ne:1}}).exec(function(err, emp){
				if(err){
					res.status(404).jsonp(err)
				}else{
					res.status(200).jsonp(emp)
				}
			})
		}else{
			res.status(404).jsonp({msg:"a parameter is required"})
		}	
	}else{
		if(req.body.name && req.body.email){
			Employee.findOne({email:req.body.email}).exec(function(err, emp){
				if(err){
					res.status(404).jsonp(err)
				}else{
					res.status(200).jsonp(emp)
				}
			})
		}else{
			res.status(404).jsonp({msg:"name and email are required fields"})
		}
	}
	
}