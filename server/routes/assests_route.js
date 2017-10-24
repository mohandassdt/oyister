var express = require('express');
var router = express.Router();
var Countries = require('../assestes/countries.json');
var Languages = require('../assestes/languages.json');
var Nationalities=[{nationality:"Indian"},{nationality:"American"}];
var data={Countries,Languages,Nationalities};
router.get('/getdatalist', function (req,res) {
res.send(data);
});
// router.get('/getlanguagelist', function (req,res) {
// res.send(Languages);
// });
module.exports = router;
