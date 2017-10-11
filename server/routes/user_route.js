var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Profile = require('../models/Profile.js');
var Session = require('../models/OTP-session.js');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

router.post('/signup', function(req, res) {
    var newUser = new User();
    var newprofile=new Profile();
    newUser.user_name = req.body.user_name;
    newUser.email = req.body.email;
    newUser.Password = newUser.generateHash(req.body.password);
newprofile.user_name=req.body.user_name;
newprofile.email=req.body.email;
newprofile.languages=req.body.languages;
newprofile.Nationality=req.body.Nationality;
newprofile.country_of_stay=req.body.country_of_stay;
newUser.authenticated=false;
// if(req.body.user_name != undefined){
// newUser.user_type="EMAIL-USER";
// newUser.authenticated=false;
// }
// if(req.body.email != undefined){
// newUser.user_type="FACEBOOK-USER";
// newUser.authenticated=true;
// }
    User.find({email: req.body.email,user_name: req.body.user_name}, function (err, docs) {
if(docs.length===0){

    newUser.save(function(err) {
        if (err) {
            res.json(err);
        } else {
          newprofile.save(function(err){
            if(!err){
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
                      user: tosend,
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
                    mailresult='Email sent: ' + info.response;
            res.send({status:1,message:"OTP has been sent to your email ID"});
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
              // res.json({
              //     success: true,
              //     message:"Succesfully Registred !!!",
              //     status:1
              // });
            } })
        }});
      }
else{
  res.json({
      status:0,
      success: false,
      message:"Already exists"
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
  Session.find({email:req.body.email}, function (err, docs) {
if(docs.length > 0){
if(docs[0].otp===req.body.otp){
    User.find({email:req.body.email}, function (err, docs) {
      var body=docs[0];
      body.authenticated=true;
  User.findOneAndUpdate({email:body.email},body, function (err, data) {
    res.send("Your Oyister account is now ready to use");
  });
});
}else{
res.send("Not Valid OTP");
}
}
else{
  res.send("not valid access");
}
  });
});

router.post('/login', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
      console.log(user);
        if (err) {
            res.json(err);
        } else if (!user) {
            res.json({
                status:0,
                message: 'Sorry wrong email id'
            });
        } else if (!user.validPassword(req.body.Password)) {

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
                // token: token,
                isLoggedIn: true,
                userDetail: user
            });
            // console.log(token);
            console.log('Toke Created');
        }
    });
});
router.put('/update/:id', function(req, res){
   console.log("REACHED updation ");
  //  console.log(req.body);
   User.findOneAndUpdate({_id:req.params.id}, req.body, function (err, data) {
     res.json(data);
    //  console.log(data);
   });
})


router.get('/getuser', function (req, res,next) {
    console.log("REACHED GET FUNCTION ON SERVER");

  User.find({}, function (err, docs) {
         res.json(docs);
        //  console.log(docs);

    });
});

module.exports = router;
