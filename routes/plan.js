var express = require('express');
var router = express.Router();
var Plan =  require('../controllers/plans')


/* GET users listing. */
router.get('/:all', Plan.fetch);
router.post('/', Plan.save);
router.put('/:plan', Plan.update);
router.delete('/:plan', function(req,res,next){
	req.isDeleted = 1;
	next();
},Plan.update);

module.exports = router;
