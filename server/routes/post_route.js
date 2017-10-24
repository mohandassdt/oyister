var express = require('express');
var router = express.Router();
var path = require('path');
const fileUpload = require('express-fileupload');
var Post = require('../models/Post.js');
var Post_expiry = require('../models/Post_expiry.js');
var Profile = require('../models/Profile.js');
var paginate=require("mongoose-pagination");

router.post('/addpost', function(req, res) {
  var newpost=new Post();
  var newexpiry=new Post_expiry();
newpost.user_name=req.body.user_name;
  newpost.title=req.body.title;
  newpost.category=req.body.category;
  newpost.description=req.body.description;
  newpost.post_type=req.body.post_type;
  newpost.country=req.body.country;
  newpost.user_name=req.body.user_name;
  newexpiry.user_name=req.body.user_name;
  newexpiry.title=req.body.title;
  newexpiry.category=req.body.category;
  newexpiry.description=req.body.description;
  newexpiry.post_type=req.body.post_type;
  newexpiry.country=req.body.country;
  newexpiry.user_name=req.body.user_name;
  newpost.location=[req.body.lattitude,req.body.longitude];
newexpiry.location=[req.body.lattitude,req.body.longitude];
newexpiry.createdDate=new Date();
newpost.createdDate=newexpiry.createdDate;
  if (!req.files){
    newpost.images=[imagename1,imagename2,imagename3];
    newexpiry.images=[imagename1,imagename2,imagename3];
    var expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + req.body.expiry);
    newexpiry.expiryDate=expiry;

    newpost.save(function(err){
      if(!err){
        newexpiry.save(function(err){
          if(!err){
            res.send({status:1,message:"Your query has been posted"})
          }})
        }});
  }else{
var d=Date.now();
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let image1 = req.files.image1;
      let image2 = req.files.image2;
      let image3 = req.files.image3;

    var imagename1=d+req.body.user_name+image1.name;

    var imagename2=d+req.body.user_name+image2.name;
    var imagename3=d+req.body.user_name+image3.name;
      // Use the mv() method to place the file somewhere on your server
      image1.mv(__dirname +"/post-images/"+imagename1);
      image2.mv(__dirname +"/post-images/"+imagename2);
      image3.mv(__dirname +"/post-images/"+imagename3);

            newpost.images=[imagename1,imagename2,imagename3];
            newexpiry.images=[imagename1,imagename2,imagename3];

            var expiry = new Date();
          expiry.setMinutes(expiry.getMinutes() + req.body.expiry);
            newexpiry.expiryDate=expiry;

            newpost.save(function(err){
              if(err) res.send(err);
              if(!err){
                newexpiry.save(function(err){
                  if(err) res.send(err);
                  if(!err){
                    res.send({status:1,message:"Your query has been posted"})
                  }})
              }});



  }});

  router.post('/proximity-new',function(req,res){
    var distance = 500 / 6371;
    var latestdate = new Date();
  latestdate.setMinutes(latestdate.getMinutes() - req.body.latesttime);


  Profile.findOne({user_name:req.body.user_name},{following:true,friends_list:true,_id:false},function(err,value){

    var filterednames = value.friends_list.filter(function(obj) {
        return (obj.status === "He Blocked" || obj.status === "You Blocked");
    });
    var query = Post_expiry.find({
      // "user_name": { "$nin": filterednames },
      // "createdDate": {"$gte": new Date(latestdate), "$lt": new Date()},
      'location': {
      $near: [
        req.body.lattitude,
        req.body.longitude
      ],
      $maxDistance: distance

    }
    });

    query.paginate(req.body.page,30).exec(function (err, city) {

        	if (err) {
         	console.log(err);
        	throw err;
        	}

        	if (!city) {
        	res.json({});
        	} else {
       	 console.log('Cant save: Found city:' + city);
        	res.json(city);
       		 }
    	});
  })

  });



// router.post('/proximity-new',function(req,res){
//   var distance = 500 / 6371;
//   var latestdate = new Date();
// latestdate.setMinutes(latestdate.getMinutes() - req.body.latesttime);
//
//
// Profile.findOne({user_name:req.body.user_name},{following:true,friends_list:true,_id:false},function(err,value){
//
//   var filterednames = value.friends_list.filter(function(obj) {
//       return (obj.status === "He Blocked" || obj.status === "You Blocked");
//   });
//
//
//   var query = Post_expiry.find({
//     "user_name": { "$nin": filterednames },
//     "createdDate": {"$gte": new Date(latestdate), "$lt": new Date()},
//     'Position': {
//     $near: [
//       req.body.lattitude,
//       req.body.longitude
//     ],
//     $maxDistance: distance
//
//   }
//   });
//
//   query.paginate(req.body.page,30).exec(function (err, city) {
//
//       	if (err) {
//        	console.log(err);
//       	throw err;
//       	}
//
//       	if (!city) {
//       	res.json({});
//       	} else {
//      	 console.log('Cant save: Found city:' + city);
//       	res.json(city);
//      		 }
//   	});
// })
//
// });


module.exports = router;
