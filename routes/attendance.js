var express = require('express');
var router = express.Router();
var Attendance =  require('../controllers/attendance')


/* GET attendance listing. */
router.get('/:all', Attendance.fetch);
//router.put('/:all',Attendance.update)
router.post('/', Attendance.save);

module.exports = router;