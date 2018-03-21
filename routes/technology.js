var express = require('express');
var router = express.Router();
var Technology =  require('../controllers/technologies')


/* GET users listing. */
router.get('/:all', Technology.fetch);
router.post('/', Technology.save);
router.put('/:tech', Technology.update);
router.delete('/:tech', function(req,res,next){
	req.isDeleted = 1;
	next();
},Technology.update);

module.exports = router;
