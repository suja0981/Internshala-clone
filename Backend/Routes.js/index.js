const express = require('express');
const router = express.Router();
const admin = require('./admin');
const intern=require('./internship');
const job=require('./job');
const application=require('./application');

router.use('/internship', intern);
router.use('/job', job);
router.use('/admin', admin);
router.use('/application', application);



module.exports = router;