var mongoose = require('mongoose');
var PostSchema = mongoose.Schema({
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
createdDate:{
  type:Date
}


});

module.exports = mongoose.model('Post', PostSchema, 'Post');
