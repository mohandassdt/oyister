var express = require('express');
var router = express.Router();
var Profile = require('../models/Profile.js');

router.get('/getfriendslist/:id', function (req,res) {
  var Friends=[];
  var Requested=[];
  var Pending=[];
  var Blocked=[];
  var Blocked2=[];
    Profile.find({user_name:req.params.id},{_id:false,friends_list:true},function(err,docs){
    var friendslist=docs[0].friends_list;
  var result = friendslist.map(a => a.friend);
    Profile.find({user_name:{$in:result}},{user_name:true,name:true,profile_image:true,city:true,country_of_stay:true},function(err,docs){
if(!err){
  for(var j=0;j<friendslist.length;j++){
  for(var i=0;i<docs.length;i++){
    if(docs[i].name === undefined){
      docs[i].name="";
    }
    if(docs[i].city === undefined){
      docs[i].city="";
    }
    if(docs[i].country_of_stay === undefined){
      docs[i].country_of_stay="";
    }
if(friendslist[j].friend===docs[i].user_name && friendslist[j].status==="Friends"){
Friends.push(docs[i]);
}
if(friendslist[j].friend===docs[i].user_name && friendslist[j].status==="requested"){
Requested.push(docs[j]);
}
if(friendslist[j].friend===docs[i].user_name && friendslist[j].status==="pending"){
Pending.push(docs[j]);
}
if(friendslist[j].friend===docs[i].user_name && friendslist[j].status==="blocked"){
Blocked.push(docs[j]);
}
if(friendslist[j].friend===docs[i].user_name && friendslist[j].status==="blocked2"){
Blocked2.push(docs[j]);
}
var total=Friends.length+Requested.length+Pending.length+Blocked.length+Blocked2.length;
console.log(total,friendslist.length);
if(total === friendslist.length){
res.send({Friends,Requested,Pending,Blocked,Blocked2});
 Friends=[];
 Requested=[];
 Pending=[];
 Blocked=[];
Blocked2=[];
}

}}}
  })
  })
});

module.exports = router;
