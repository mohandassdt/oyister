var mongoose = require('mongoose');
var ProfileSchema = mongoose.Schema({
user_name:{
  type:String
},
email:{
  type:String,
  unique:true
},
name:{
  type:String
}
profile_image:{
type:String,
},
languages:{
  type:Array
},
Nationality:{
  type:String
},
country_of_stay:{
  type:String
},
city:{
  type:String
},
dob:{
  type:String
},
prefered_categories:{
  type:Array
},
prefered_languages:{
  type:Array
},
createdtime:{
  type:String
},
modifiedtime:{
  type:String
}
});


module.exports = mongoose.model('Profile', ProfileSchema, 'Profile');
