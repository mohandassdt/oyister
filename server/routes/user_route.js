var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Profile = require('../models/Profile.js');
var Session = require('../models/OTP-session.js');
var Conversation=require('../models/Conversation.js');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

router.post('/signup', function(req, res) {
    var newUser = new User();
    var newprofile=new Profile();
    var newConversation=new Conversation();
    newConversation.user_name=req.body.email;
    newUser.email = req.body.email;
    newUser.Password = newUser.generateHash(req.body.password);
newUser.user_type=req.body.user_type;
newprofile.email=req.body.email;
newprofile.email=req.body.email;
newprofile.language=req.body.language;
newprofile.languages_known=req.body.languages_known;
newprofile.Nationality=req.body.Nationality;
newprofile.country_of_stay=req.body.country_of_stay;
newprofile.profile_image="defaultimage.png"
newUser.authenticated=false;
if(req.body.user_type === 1){
  newprofile.user_name=req.body.email;
  newUser.user_name=req.body.email;
newUser.user_type="EMAIL-USER";
newUser.authenticated=false;
}else{
  newprofile.user_name=req.body.email;
  newUser.user_name=req.body.email;
newUser.user_type="FACEBOOK-USER";
newUser.authenticated=true;
}
    User.find({user_name: req.body.email}, function (err, docs) {
      console.log(docs.length);
if(docs.length===0){
    newUser.save(function(err) {
        if (err) {
            res.json(err);
        } else {
          newprofile.save(function(err){
            if(!err){
              newConversation.save();
          if(req.body.user_type != 1){
res.send({"status":"1","message":"Singup successfull. Your account is now ready to use"});
          }else{
            // console.log("email",req.body.email);
              var tosend=req.body.email;
              var mailresult;
              var otp=Math.floor((Math.random() * 1000000) + 1);
              User.find({email: req.body.email}, function (err, docs) {
                if(docs.length >0){
                if(docs[0].email===tosend){
            addsession(tosend,otp);
                  var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: "oyisterdevelope@gmail.com",
                      pass: 'oyister123'
                    }
                  });

                  var mailOptions = {
                    from: 'oyisterdevelope@gmail.com',
                    to: tosend,
                    subject: 'VERIFY YOUR EMAIL FOR OYISTER APP',
                    text: "Your OTP is"+"-"+otp
                  };

                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      mailresult=error;
                      res.send({status:0,message:"Your email ID is not valid"});
                    } else {
                    // mailresult='Email sent: ' + info.response;
            res.send({
              "status":1,
              "message":"OTP has been sent to your email ID"
            });
                    }
                  });

                }

                else{
                  res.send({status:0,message:"Your email Id is not registred"});
                }}
                else{
                  res.send({status:0,message:"Your email Id is not registred"});
                }

              })
            } }})
        }});
      }
else{
  res.json({
      status:0,
      success: false,
      message:"Email Id has already registered with the application"
  });
}});
});

// router.post('/sendotp',function(req,res){
//
// });

function addsession(tosend,otp){
  Session.find({email:tosend}, function (err, docs) {
if(docs.length === 0){
  var newSession=new Session();
  newSession.email=tosend;
  newSession.otp=otp;
  var twentyMinutesLater = new Date();
twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 55);
  newSession.createDate=twentyMinutesLater;
  newSession.save(function(err){
    console.log("success");
   })
}else{
  var body={
    email:tosend,
    otp:otp
  };
  Session.findOneAndUpdate({email:tosend},body, function (err, data) {
    console.log("updated");
  });
}
  });

}

router.post('/validateotp',function(req,res){
  Session.find({email:req.body.user_name}, function (err, docs) {
if(docs.length > 0){
if(docs[0].otp===req.body.otp){
    User.find({email:req.body.user_name}, function (err, docs) {
      var body=docs[0];
      body.authenticated=true;
  User.findOneAndUpdate({email:body.user_name},body, function (err, data) {
    res.send({status:1,message:"Your Oyister account is now ready to use"});
  });
});
}else{
res.send({status:0,message:"Not Valid OTP"});
}
}
else{
  res.send({status:0,message:"Your OTP has been expired"});
}
  });
});

router.post('/login', function(req, res) {
  var Password= req.body.password;
    User.findOne({
        user_name: req.body.email
    }, function(err, user) {
      console.log(user);
        if (err) {
            res.json(err);
        } else if (!user) {
            res.json({
                status:0,
                message: 'Sorry wrong email id'
            });
        } else if (!user.validPassword(Password)) {

            res.json({
                status: 0,
                message: 'Sorry wrong password'
            });
            console.log('Wrong Password');
        } else if (user) {
            // var token = jwt.sign(user, 'thisismysecret', {
            //     expiresIn: 1400
            // });
            res.json({
                status: 1,
                message:"login success",
                isLoggedIn: true,
                userDetail: user
            });
            // console.log(token);
            console.log('Toke Created');
        }
    });
});

router.post('/changepassword',function(req,res){
  var Password= req.body.password;
    User.findOne({
        user_name: req.body.user_name
    }, function(err, user) {
        if (err) {
            res.json(err);
        } else if (!user) {
            res.json({
                status:0,
                message: 'Sorry wrong email id'
            });
        } else if (!user.validPassword(Password)) {

            res.json({
                status: 0,
                message: 'Sorry wrong password'
            });
            console.log('Wrong Password');
        } else if (user) {
          var newpassword=user.generateHash(req.body.newpassword);
User.findOneAndUpdate({user_name:req.body.user_name},{Password:newpassword},function(err,docs){
res.send({status:1,message:"password changed"})
})
}});
});

router.post('/resend-otp',function(req,res){
  console.log(req.body.user_name);
var tosend=req.body.user_name;
var mailresult;
var otp=Math.floor((Math.random() * 1000000) + 1);
addsession(tosend,otp);
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "oyisterdevelope@gmail.com",
        pass: 'oyister123'
      }
    });

    var mailOptions = {
      from: 'oyisterdevelope@gmail.com',
      to: tosend,
      subject: 'VERIFY YOUR EMAIL FOR OYISTER APP',
      text: "Your OTP is"+"-"+otp
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        mailresult=error;
        res.send({status:0,message:"Your email ID is not valid"});
      } else {
res.send({
"status":1,
"message":"OTP has been sent to your email ID"
});
      }
    });

});

router.post('/forgetpassword',function(req,res){

  // newuser.user_name=req.body.user_name;
  var tosend=req.body.user_name;
  console.log(tosend);
  var mailresult;
  var password=Math.floor((Math.random() * 1000000) + 1);
User.find({user_name:tosend},function(err,docs){
  console.log(docs.length);
  var newuser=docs[0];
if(docs.length>0){

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "oyisterdevelope@gmail.com",
          pass: 'oyister123'
        }
      });

      var mailOptions = {
        from: 'oyisterdevelope@gmail.com',
        to: tosend,
        subject: 'NEW PASSWORD',
        text: "Your New password is"+"-"+password
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          mailresult=error;
          res.send({status:0,message:"Your email ID is not valid"});
        } else {
          console.log(password);
          var newpassword=newuser.generateHash(password);
        User.findOneAndUpdate({user_name:req.body.user_name},{Password:newpassword},function(err,docs){
          if(err) res.send(err);
          if(!err){
            res.send({
            "status":1,
            "message":"Your new has been sent to your email ID"
            });
          }});


        }
      });
}else{
  res.send({status:0,message:"wrong user name"});
}
})



});

module.exports = router;
