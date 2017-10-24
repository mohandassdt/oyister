var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const fileUpload = require('express-fileupload');
var UserRoute = require('./server/routes/user_route.js');
var Assests = require('./server/routes/assests_route.js');
var Personalchat=require('./server/models/Personalchat.js');
var Profile=require('./server/models/Profile.js');
var Conversation=require('./server/models/Conversation.js');
var Profile_route=require('./server/routes/profile_route.js');
var chat_route=require('./server/routes/chat_route.js');
var Friends=require('./server/routes/friendslist_route.js');
var post_route=require('./server/routes/post_route.js');
var server=require('http').Server(app);
var users = [];
var messages = [];
var usersActivity = [];
var onlineClient = {};
var io=require('socket.io').listen(server);
mongoose.Promise = require('bluebird');
app.use(bodyParser.json());
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/test.html'));
})

mongoose.connect('mongodb://localhost:27017/oyister_app');
var db = mongoose.connection;

db.on('open', function() {
    console.log('App is connected to database');
});

db.on('error', function(err) {
    console.log(err);
});

app.use(fileUpload());




app.post('/upload', function(req, res) {

  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

// var imagename=sampleFile.name;
var imagename=Date.now()+req.body.user_name+sampleFile.name;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname +"/uploads/"+imagename, function(err) {
    if (!err){
Profile.findOneAndUpdate({user_name:req.body.user_name},{profile_image:imagename},function(err,docs){
  if(!err){

    res.send({message:"Profile Image uploaded"});
  }
})
    }});
});

app.get("/getprofileimage/:id",function(req,res){
res.sendFile(path.join(__dirname +"/uploads/"+req.params.id));
});

io.sockets.on('connection', function(socket){

    socket.on('chkUser',function(data) {
        var chk = users.indexOf(data.name);
         if(chk==(-1)) {
         users.push(data.name);
         onlineClient[data.name] = socket;
         }
        socket.emit("chkUser", chk);
    });
    socket.on('disconnect', function(data){
      if(socket.username != undefined) {
        var ax= users.indexOf(socket.username);
        users.splice(ax, 1);
        }
      });


  socket.on('sendprivatechat', function(username,key, msg){
  var clientSocket = onlineClient[key];
savemessages(username,key, msg);
  if(clientSocket == null){
}else{
  clientSocket.emit('getprivatemsg',username, key, msg);
  };
});

function savemessages(user1,user2, msg) {
  var datetime=new Date();
Conversation.find({user_name:user1,"messages_list.user_name":user2},{'messages_list.$': 1},function(err,user){
if(user.length != 0){
  Conversation.update(
           { user_name:user1,
             'messages_list.user_name': user2},
           {$push: { "messages_list.$.messages":
                              {
                                  "content":msg,
                                  "date":datetime,
                                  "type":"sent"
                              }
                   },
                   $set:{"messages_list.$.status":"sent","last_updated":datetime}
   },function(err,docs){
     if(!err){
       console.log(user2);
       Conversation.update(

                { user_name:user2,
                  'messages_list.user_name': user1},
                {$push: { "messages_list.$.messages":
                                   {
                                       "content":msg,
                                       "date":datetime,
                                       "type":"receive"
                                   }
                        },
                $set:{"messages_list.$.status":"unread","last_updated":datetime}

        },function(err,docs){
          if(!err){
              console.log("success");
          }
        });
     }


   });

// Conversation.update(
//          { user_name:user1,
//            'messages_list.user_name': student_id,
//          {$push: { "messages_list.$.messages":{content:msg,date:datetime}}}, function(err,result){
//    console.log("updated");
//  }});
  // Conversation.findOneAndUpdate(
  // { 'user_name':user1,'messages_list.user_name': user2 },
  // // { $set:  { 'messages_list.$.user_name': user2,'messages_list.$.status': "sent",'messages_list.$.messages':{"$push":{{content:msg,date:datetime}}}}},
  // (err, result) => {
  //   console.log(result);
  //   // res.send({message:"You became friends"});
  // });
// Conversation.findOne({user_name:user1,"messages_list.user_name":user2},{'messages_list.$': 1}).exec(function(err,datavalue) {
//   console.log(datavalue);
// datavalue.messages_list[0].messages.push({content:msg,date:datetime});
// console.log(datavalue.messages_list[0].messages);
// datavalue.save(function(err){
//   if(err) console.log(err);
//   if(!err) console.log("success");
// });
// });
}else{
  Conversation.findOne({user_name:user1}).exec(function(err,value) {
    var senderdata={user_name:user2,status:"sent",last_updated:datetime,messages:[{content:msg,date:datetime,"type":"sent"}]};
     value.messages_list.push(senderdata);
     value.save(function(err){
if(!err){
Conversation.findOne({user_name:user2}).exec(function(err,valuedata) {
  if(valuedata){
    var receiverdata={user_name:user1,status:"unread",last_updated:datetime,messages:[{content:msg,date:datetime,"type":"receive"}]};
     valuedata.messages_list.push(receiverdata);
     valuedata.save(function(err){
       if(!err){
console.log("message saved successfully");
                }
  });
};
});
  };
})});
}
})
};

  });

app.use('/user', UserRoute);
app.use('/data', Assests);
app.use('/profile', Profile_route);
app.use('/friendslist',Friends);
app.use('/chat',chat_route);
app.use('/post',post_route);
server.listen(8000, function(req, res) {
    console.log('Server is running on port 8000...');
});
