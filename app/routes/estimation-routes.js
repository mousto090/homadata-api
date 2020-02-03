var express = require('express');
var router = express.Router();
const {estimationController} = require('../controllers');

router.post('/estimate', estimationController.estimateProperty);

module.exports = router;