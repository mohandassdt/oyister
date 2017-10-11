var mongoose = require('mongoose');
var SessionSchema = mongoose.Schema({
email:{
  type:String, unique:true
},
otp:{
  type:String
},
createDate:  {type: Date, expireAfter3Minutes:'200', default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema, 'Session');
