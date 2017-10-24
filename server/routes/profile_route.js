var express = require('express');
var router = express.Router();
var Profile = require('../models/Profile.js');
var paginate=require("mongoose-pagination");
var Languages = require('../assestes/languages.json');

router.put('/updateprofile/:id',function(req,res){
Profile.findOneAndUpdate({user_name:req.params.id},{
    name:req.body.name,
    dob:req.body.dob,
    Nationality:req.body.Nationality,
    selected_languages:req.body.languages,
    country_of_stay:req.body.country_of_stay,
    city:req.body.city,
    languages_known:req.body.languages_known,
    profile_description:req.body.profile_description,
    gps_location:req.body.gps_location,
  },function(err,docs){
    if(!err){
      res.send({
        status:1,
        message:"Profile updated!!"
      })
    }
  });
});
router.get('/getprofilemanagement/:id',function(req,res){
  Profile.find({user_name:req.params.id},{
      name:true,
      user_name:true,
      email:true,
      dob:true,
      Nationality:true,
      profile_description:true,
      languages_known:true,
      country_of_stay:true,
      city:true,
      gps_location:true
    },function(err,docs){
      if(!err){

        var result=docs[0];
        // result.Languageslist=[];
        // ;
        if(result.name === undefined){
      result.name="";
        }

        if(result.country_of_stay === undefined){
      result.country_of_stay="";
        }
        if(result.city === undefined){
      result.city="";
        }
        if(result.Nationality === undefined){
      result.Nationality="";
        }
        if(result.dob === undefined){
      result.dob="";
        }

        res.send({Languagesresult});
      }})
});

router.get('/getprofile/:id',function(req,res){
  var details={};
  console.log("profile",req.params.id);
  if(req.params.id){
    Profile.find({user_name:req.params.id},{profile_image:true,name:true,city:true,country_of_stay:true,user_name:true},function(err,docs){
    details=docs[0];
    console.log(details);
if(details){
  if(details.name === undefined){
details.name="";
  }
  if(details.country_of_stay === undefined){
details.country_of_stay="";
  }
  if(details.city === undefined){
details.city="";
  }
  res.json(details);
}else{
res.json(details);
}
})
  }

});

router.post('/visitFriendsProfile',function(req,res){
  var user1=req.body.user1;
  var user2=req.body.user2;
Profile.find({user_name:user1},{_id:true,friends_list:true},function(err,docs){
var friedslist=docs[0].friends_list;
Profile.find({user_name:user2},{name:true,user_name:true,profile_image:true,city:true,country_of_stay:true},function(err,docs){
  var profiledetails=docs[0];
  console.log(profiledetails);
  if(profiledetails.name === undefined){
profiledetails.name="";
  }
  if(profiledetails.country_of_stay === undefined){
profiledetails.country_of_stay="";
  }
  if(profiledetails.city === undefined){
profiledetails.city="";
  }
  if(friedslist.length===0){
    var friend_status="NEW";
res.send({friend_status,profiledetails});
  }else{
    for(var i=0;i<friedslist.length;i++){
      if(friedslist[i].friend === profiledetails.user_name){
  var friend_status=friedslist[i].status;
}else{
  if(friend_status === undefined){
    friend_status="NEW";
  }}
    }
    res.send({friend_status,profiledetails});
  }
})})
});

router.post('/getuserslist',function(req,res){
  var userlist=[];
  var page=req.body.page+1;
  Profile.find({user_name:req.body.user_name},{_id:true,friends_list:true},function(err,docs){
  var friendlist=docs[0].friends_list;
Profile.find({},{_id:true,profile_image:true,user_name:true,name:true,city:true,country_of_stay:true}).paginate(page,30).exec(function(err, docs) {
      var profiledetails=docs;
      if(friendlist.length === 0){
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
  if(profiledetails[i].user_name != req.body.user_name){
    var details=profiledetails[i];
    userlist.push(details);
  }
}
res.send(userlist);
}else{
  var result = profiledetails.filter(function(o1){
      // filter out (!) items in result2
      return !friendlist.some(function(o2){
  return o1.user_name === o2.friend && o2.status === "He Blocked" || o1.user_name === req.body.user_name;
                    // assumes unique id
      });
  })
  var l=result.length
  for(var i=0;i<result.length;i++){
    if(result[i].name === undefined){
  result[i].name="";
    }
    if(result[i].country_of_stay === undefined){
  result[i].country_of_stay="";
    }
    if(result[i].city === undefined){
  result[i].city="";
    }
  }
        res.send(result);
      }

  });
})
});

router.post('/getUsersByText',function(req,res){
  var userlist=[];
  Profile.find({user_name:req.body.user_name},{_id:true,friends_list:true},function(err,docs){
  var friendlist=docs[0].friends_list;
  Profile.find({user_name:{$regex:req.body.text, $options: 'i'}},{user_name:true,profile_image:true,name:true,city:true,country_of_stay:true},function(err,docs){
    // console.log(docs);
    var profiledetails=docs;
    if(friendlist.length>0){
      var result = profiledetails.filter(function(o1){
          // filter out (!) items in result2
          return !friendlist.some(function(o2){
      return o1.user_name === o2.friend && o2.status === "He Blocked" || o1.user_name === req.body.user_name;
                        // assumes unique id
          });
      })
      var l=result.length
      for(var i=0;i<result.length;i++){
        if(result[i].name === undefined){
      result[i].name="";
        }
        if(result[i].country_of_stay === undefined){
      result[i].country_of_stay="";
        }
        if(result[i].city === undefined){
      result[i].city="";
        }
      }
            res.send(result);

    }else{
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
        if(profiledetails[i].user_name != req.body.user_name){
          var friend_status="NEW";
          var details=profiledetails[i];

          userlist.push(details);
        }
      }
      res.send(userlist);
    }
})
})
});

router.post('/addfriend',function(req,res){
  var user1=req.body.user1;
  var user2=req.body.user2;
Profile.find({ 'user_name':user1,'friends_list.friend': user2 },function(err,docs){
  if(docs.length===0){
    Profile.findOne({user_name:user1}).exec(function(err,value) {
      var senderdata={friend:user2,status:"requested"};
       value.friends_list.push(senderdata);
       value.save(function(err){
  if(!err){
  Profile.findOne({user_name:user2}).exec(function(err,valuedata) {
    if(valuedata){
      var receiverdata={friend:user1,status:"pending"};
       valuedata.friends_list.push(receiverdata);
       valuedata.save(function(err){
         if(!err){
           res.send({status:1,message:"You succesfully send friendrequest"})
         }
    });
  };
  });
    };
  })});
}else{
  res.send({"message":"something went wrong..try again"});
}
});

});

router.post('/acceptrequest',function(req,res){
  user1=req.body.user1;
  user2=req.body.user2;
  Profile.findOneAndUpdate(
  { 'user_name':user1,'friends_list.friend': user2 },
  { $set:  { 'friends_list.$.friend': user2,'friends_list.$.status': "Friends", }},
  (err, result) => {
    if (!err) {
      Profile.findOneAndUpdate(
      { 'user_name':user2,'friends_list.friend': user1 },
      { $set:  { 'friends_list.$.friend': user1,'friends_list.$.status': "Friends", }},
      (err, result) => {
        res.send({message:"You became friends"});
      });
    }});
});

router.post('/cancelrequest',function(req,res){
  user1=req.body.user1;
  user2=req.body.user2;
  Profile.findOneAndUpdate(
  { 'user_name':user1},
  { $pull: { "friends_list" : { friend: user2 } } },
  (err, result) => {
    if (!err) {
      Profile.findOneAndUpdate(
      { 'user_name':user2},
      { $pull: { "friends_list" : { friend: user1 } } },
      (err, result) => {
        res.send({message:"You cancelled friend request"});
      });
    }});
});
router.post('/unblock',function(req,res){
  user1=req.body.user1;
  user2=req.body.user2;
  Profile.findOneAndUpdate(
  { 'user_name':user1},
  { $pull: { "friends_list" : { friend: user2 } } },
  (err, result) => {
    if (!err) {
      Profile.findOneAndUpdate(
      { 'user_name':user2},
      { $pull: { "friends_list" : { friend: user1 } } },
      (err, result) => {
        res.send({message:"You unblocked"});
      });
    }});
});


router.post('/blockuser',function(req,res){
  user1=req.body.user1;
  user2=req.body.user2;
  Profile.find({ 'user_name':user1,'friends_list.friend': user2 },function(err,docs){
    if(docs.length===0){
      Profile.findOne({user_name:user1}).exec(function(err,value) {
        var senderdata={friend:user2,status:"You Blocked"};
         value.friends_list.push(senderdata);
         value.save(function(err){
    if(!err){
    Profile.findOne({user_name:user2}).exec(function(err,valuedata) {
      if(valuedata){
        var receiverdata={friend:user1,status:"He Blocked"};
         valuedata.friends_list.push(receiverdata);
         valuedata.save(function(err){
           if(!err){
             res.send({status:1,message:"You Blocked successfully"})
           }
      });
    };
    });
      };
    })});
  }else{
    Profile.findOneAndUpdate(
    { 'user_name':user1,'friends_list.friend': user2 },
    { $set:  { 'friends_list.$.friend': user2,'friends_list.$.status': "You Blocked", }},
    (err, result) => {
      if (!err) {
        Profile.findOneAndUpdate(
        { 'user_name':user2,'friends_list.friend': user1 },
        { $set:  { 'friends_list.$.friend': user1,'friends_list.$.status': "He Blocked", }},
        (err, result) => {
          res.send({status:1,message:"You Blocked successfully"});
        });
      }});
  }
  });


});


module.exports = router;
