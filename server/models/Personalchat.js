var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Privatechat = mongoose.Schema({
from_user:{
type:String
},
to_user:{
type:String
},
message:{
  content:String,
  Image:String
},
createtime:{
  type:Date,
  default:Date.now()
}
});


module.exports = mongoose.model('Privatechat', Privatechat, 'Privatechat');
