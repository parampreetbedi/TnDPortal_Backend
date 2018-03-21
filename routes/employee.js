var express = require('express');
var router = express.Router();
var Employee =  require('../controllers/employees')


/* GET users listing. */
router.post('/login', Employee.fetch);
router.get('/:all', Employee.fetch);
router.post('/', Employee.save);
router.put('/:emp', Employee.update);
router.delete('/:emp', function(req,res,next){
	req.isDeleted = 1;
	next();
},Employee.update);

module.exports = router;
