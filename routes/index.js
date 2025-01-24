const express = require('express');
const router = express.Router();
const indexCtrl = require('../controller/controller') //사용할 컨트롤러 선언



router.get('/', indexCtrl.gethome); //기본주소에있는 값 받기


module.exports = router;