var mongoose = require('mongoose');
var ConversastionSchema = mongoose.Schema({
user_name:{
  type:String, unique:true
},
messages_list:{
  type:Array
},
});

module.exports = mongoose.model('Conversation', ConversastionSchema, 'Conversation');
