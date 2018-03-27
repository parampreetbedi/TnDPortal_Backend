var express = require('express');
var router = express.Router();
var TrainedEmployee =  require('../controllers/trainedEmployee')


/* GET trainedemployee listing. */
router.get('/:all', TrainedEmployee.fetch);
router.put('/:all',TrainedEmployee.update)
router.post('/', TrainedEmployee.save);
router.delete('/:all', function(req,res,next){
	req.body.isDeleted = 1;
	next();
},TrainedEmployee.update);

module.exports = router;