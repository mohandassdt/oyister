var express = require('express');
var router = express.Router();
var Conversation = require('../models/Conversation.js');
var Profile = require('../models/Profile.js');
router.get('/getchatlist/:id',function(req,res){
  Conversation.find({user_name:req.params.id},{user_name:true,messages_list:true},function(err,docs){
    console.log(docs);
    var conversastions=docs[0].messages_list;
    var result = conversastions.map(a => a.user_name);
      Profile.find({user_name:{$in:result}},{user_name:true,name:true,profile_image:true},function(err,docs){
  if(!err){
var userslist=docs;
    for(var i=0;i<conversastions.length;i++){
      conversastions[i].messages=conversastions[i].messages[conversastions[i].messages.length-1];
      for(var j=0;j<userslist.length;j++){
if(conversastions[i].user_name === userslist[j].user_name){
  conversastions[i].name=userslist[j].name;
  if(conversastions[i].name === undefined){
    conversastions[i].name="";
  }
    conversastions[i].profile_image=userslist[j].profile_image;
}}}
    res.send(conversastions);
  }});
  })
});

router.post('/chatmessages',function(req,res){
  var user1=req.body.user1;
  var user2=req.body.user2;
var user_details,status,messageslist;

  Profile.findOne({user_name:user2},{name:true,profile_image:true,friends_list:true},function(err,docs){
    user_details=docs;
if(user_details != null){
    for(var i=0;i<user_details.friends_list.length;i++){
      if(user_details.friends_list[i].friend===user1){
        status=user_details.friends_list[i].status;
      }
    }
    Conversation.findOne({user_name:req.body.user1, 'messages_list.user_name': user2}, {'messages_list.$': 1},function(err,docs){

      if(!status){
status="NEW"
      }
      if(status === "He Blocked"){
status="Blocked_1"
      }
      if(status === "You Blocked"){
status="Blocked_1"
      }
      if(!user_details.name){
user_details.name="";
      }
      if(docs === null){
messageslist=[];
      }else{
    messageslist= docs.messages_list[0].messages;
      }


  res.json({
    name:user_details.name,
    profile_image:user_details.profile_image,
    user_name:user_details.user_name,
    user_status:status,
    messages_list:messageslist
  });
    });
  }else{
    res.send({message:"try again.."})
  }
  })
});


module.exports = router;
