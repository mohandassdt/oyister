var mongoose = require('mongoose');
var SessionSchema = mongoose.Schema({
email:{
  type:String, unique:true
},
otp:{
  type:String
},
createDate:  {type: Date, expires:'30s' }
});

module.exports = mongoose.model('Session', SessionSchema, 'Session');
