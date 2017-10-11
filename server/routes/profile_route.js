var express = require('express');
var router = express.Router();
var Profile = require('../assestes/Profile.js');

router.put('/updateprofile/:id',function(req,res){
Profile.find({user_name:req.params.id},{
    name:req.body.name,
    dob:req.body.dob,
    Nationality:req.body.Nationality,
    selected_languages:req.body.languages,
    country_of_stay:req.body.country_of_stay,
    city:req.body.city
  },function(err,docs){
    if(!err){
      res.send({
        status:1,
        message:"Profile updated!!"
      })
    }
  }
});
router.get('/getprofilemanagement/:id',function(req,res){
  Profile.find({user_name:req.params.id},{
      name:true,
      dob:true,
      Nationality:true,
      selected_languages:true,
      country_of_stay:true,
      city:true
    },function(err,docs){
      if(!err){
        var result=docs[0];
        res.send(result);
      }}})
});

router.get('/getprofile/:id',function(req,res){
Profile.find({user_name:req.params.id},{profile_image:true,name:true,city:true,country_of_stay:true},function(err,docs){
var details=docs[0];
for(var i=0;i<details.length;i++){
  if(details[i].name === undefined){
details[i].name="";
  }
  if(details[i].country_of_stay === undefined){
details[i].country_of_stay="";
  }
  if(details[i].city === undefined){
details[i].city="";
  }
}
res.send(details);
})
});

router.post('/visitFriendsProfile',function(req,res){
  var user1=req.body.user1;
  var user2=req.body.user2;
Profile.find({user_name:user1},{_id:treu,friends_list:true},function(err,docs){
var friedslist=docs[0];
Profile.find({user_name:user2},{name:true,user_name:true,profile_image:true,city:true,country_of_stay:true},function(err,docs){
  var profiledetails=docs[0];
  for(var i=0;i<friedslist.length;i++){
    if(friedslist[i].friend === profiledetails.user_name){
var friend_status=friendslist[i].status;
    }
  }
})
res.send({friend_status,profiledetails});
})
});

router.post('/getuserslist',function(req,res){
  var userlist=[];
  Profile.find({user_name:user1},{_id:treu,friends_list:true},function(err,docs){
  var friedslist=docs[0];
  Profile.find({},{user_name:true,name:true,city:true,country_of_stay:true},function(err,docs){
    var profiledetails=docs;
for(var j=0;j<friendlist.length;j++){
  for(var i=0;i<profiledetails.length;i++){
    if(profiledetails[i].name === undefined){
  profiledetails[i].name="";
    }
    if(profiledetails[i].country_of_stay === undefined){
  profiledetails[i].country_of_stay="";
    }
    if(profiledetails[i].city === undefined){
  profiledetails[i].city="";
    }
  if(friendslist[j].friend===profiledetails[i].user_name){
if(friendslist[j].status != "He Blocked"){
  var friend_status=friendslist[j].status;
  var value={friend_status,profiledetails[i]};
  userlist.push(value);
}}}}
res.send(value);
})

  })
});

router.post('/getUsersByText',function(req,res){
  var userlist=[];
  Profile.find({user_name:req.body.user_name},{_id:treu,friends_list:true},function(err,docs){
  var friedslist=docs[0];
  Profile.find({$regex:req.body.text, $options: 'i'},{user_name:true,name:true,city:true,country_of_stay:true},function(err,docs){
    var profiledetails=docs;
for(var j=0;j<friendlist.length;j++){
  for(var i=0;i<profiledetails.length;i++){
    if(profiledetails[i].name === undefined){
  profiledetails[i].name="";
    }
    if(profiledetails[i].country_of_stay === undefined){
  profiledetails[i].country_of_stay="";
    }
    if(profiledetails[i].city === undefined){
  profiledetails[i].city="";
    }
  if(friendslist[j].friend===profiledetails[i].user_name){
if(friendslist[j].status != "He Blocked"){
  var friend_status=friendslist[j].status;
  var value={friend_status,profiledetails[i]};
  userlist.push(value);
}}}}
res.send(value);
})

  })
});

router.post('/addfriend',function(req,res){
  var user1=req.body.user1;
  var user2=req.body.user2;

  Profile.findOne({user_name:user1}).exec(function(err,value) {
    var senderdata={friend:user2,status:"requested"};
     value.friends_list.push(senderdata);
     value.save(function(err){
if(!err){
Profile.findOne({user_name:user1}).exec(function(err,valuedata) {
  if(valuedata){
    var receiverdata={friend:user1,status:"pending"};
     valuedata.friends_list.push(receiverdata);
     valuedata.save(function(err){
       if(!err){
         res.send({status:1,message:"You succesfully send friendrequest"})
       }
  }
});
}});
  });
})});

router.post('/acceptrequest',function(req,res){
  Profile.find({user_name:req.body.user1},{friends_list:true},function(err,docs){
    var friendslist=docs[0].friendslist;
    for(var i=0;)
  })
});


module.exports = router;
