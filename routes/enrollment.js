var express = require('express');
var router = express.Router();
var Enrollment =  require('../controllers/enrollment')


/* GET users listing. */
router.get('/:all', Enrollment.fetch);
router.post('/', Enrollment.save);
router.put('/:enroll', Enrollment.update);
router.get('/enroll_in/:enroll', Enrollment.enroll_in);
router.delete('/:enroll', function(req,res,next){
	req.isDeleted = 1;
	next();
},Enrollment.update);

module.exports = router;
