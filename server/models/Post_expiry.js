var mongoose = require('mongoose');
var PostexpirySchema = mongoose.Schema({
user_name:{
  type:String
},
language:{
  type:String
},
category:{
  type:String
},
title:{
type:String
},
location:{
type:[Number],
index:"2d"
},
description:{
  type:String
},
post_type:{
  type:String
},
country:{
  type:String,
},
images:{
  type:Array
},
followers:{
  type:Array
},
active_users:{
  type:Array
},
createdDate:{
  type:Date
},
expiryDate:{
type:Date, expires:"1s"
}
});

module.exports = mongoose.model('Post_expiry', PostexpirySchema, 'Post_expiry');
