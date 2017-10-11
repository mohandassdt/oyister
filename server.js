var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var UserRoute = require('./server/routes/user_route.js');
var Assests = require('./server/routes/assests_route.js');
var Personalchat=require('./server/models/Personalchat.js');
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

io.sockets.on('connection', function(socket){

    socket.on('chkUser',function(data) {
      console.log("hii");
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
  if(clientSocket == null){
  }else{
  clientSocket.emit('getprivatemsg',username, key, msg);
  var newPersonalchat=new Personalchat;
  newPersonalchat.from_user=username;
  newPersonalchat.to_user=key;
  var message={content:msg};
  newPersonalchat.message=message;
  newPersonalchat.save(function(err){
    if(!err){
      console.log("saved private msg");
    }
  });

  }
  });

  });



app.use('/user', UserRoute);
app.use('/data', Assests);

server.listen(9000, function(req, res) {
    console.log('Server is running on port 9000...');
});
