const controller = require('./controller');
const {authMiddleware} = require('./auth')

const express = require('express');
const router = express.Router();


router.route('/1').post(controller.first);

router.route('/2').post(authMiddleware, controller.second);


module.exports = router;