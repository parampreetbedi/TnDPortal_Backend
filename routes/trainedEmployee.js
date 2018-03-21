var express = require('express');
var router = express.Router();
var TrainedEmployee =  require('../controllers/trainedEmployee')


/* GET trainedemployee listing. */
router.get('/:all', TrainedEmployee.fetch);
//router.put('/:all',Attendance.update)
router.post('/', TrainedEmployee.save);

module.exports = router;