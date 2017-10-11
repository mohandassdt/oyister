var express = require('express');
var router = express.Router();
var Counrtes = require('../assestes/countries.json');
var Languages = require('../assestes/languages.json');
var data={Counrtes,Languages};
router.get('/getdatalist', function (req,res) {
res.send(data);
});

module.exports = router;
