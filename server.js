'use strict';

const
  express = require('express'),
  app = express(),
  session = require('express-session'),
  sessionFileStore = require('session-file-store'),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  busboyBodyParser = require('busboy-body-parser'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  grid = require('gridfs-stream'),
  client = require('twilio')('AC1bd4f9ffc2dd9ac23c4168fe41dcb3c9', '7fd3b399cace10a7db4c8d56b0c866c0');


let
  server,
  FileStore = sessionFileStore(session);


mongoose.connect('mongodb://localhost:27017/thesis');
 var User = require('./model/user');  
 var Post = require('./model/post');
 var upload = require('./uploadcontroller');  

require('./public/config/passport');  

app
  .use(morgan('dev'))
  .use(cookieParser())
  .use(session({
    genid: function(req) {
      return uuid.v4();
    },
    name: 'weather-route',
    secret: uuid.v4(),
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
  }))
    .use(function printSession(req,res,next){
    console.log('req.session', req.session);
    return next();
  })
  .use(passport.initialize())
  .use(passport.session())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(busboyBodyParser())
  .use(express.static(__dirname + '/public'))
  .use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
})

app.get('/', function(req,res){
})

app.post('/testtwilio', function(req,res){
  client.sendMessage({
    to: req.body.to,
    from: '+15044750462',
    body: req.body.content
  }, function(err, data){
    if(err){
      console.log(err);
    }
    console.log(data)
  });
});

app.post('/register', function(req, res){
  var user = new User();

  user.username = req.body.username;
  user.email = req.body.email;
  user.name = req.body.name;
  user.password = req.body.password;

  user.save(function(err){
    if(err)
        res.send(err);

      res.json({ message: 'User added ', data: user})
  })

})

app.post('/feed', function(req, res) {
  var post = new Post();

  post.title = req.body.title;
  post.content = req.body.content;

  post.save(function(err){
    if(err)
      res.send(err);
    res.json({ message: 'Post added ', data: post})
  })
})

app.get('/feed', function(req, res){
   Post.find(function(err, posts){
    if(err)
      res.send(err);

    res.json(posts);
  });
})


app.post('/login', function(req,res){
  User.find({ 
    username: req.body.username,
    email: req.body.email
  })
  res.json()
})


app.get('/users', function(req,res){
  User.find(function(err, users){
    if(err)
      res.send(err);

    res.json(users);
  });
});

app.get('/users/:id', function(req,res){
  User.findById(req.params.id, function(err, user){
    if(err)
      res.send(err);

    res.json(user);
  });
});

app.put('/users/:id', function(req, res) {
  User.findById(req.params.id, function(err, user){
    if(err)
      res.send(err);

  user.username = req.body.username;
  user.email = req.body.email;
  user.name = req.body.name;
  user.password = req.body.password;

  user.save(function(err){
    if (err)
        res.send(err);

      res.json(user);
    });
  });
});


app.delete('/users/:id', function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  User.findByIdAndRemove(req.params.id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'User removed by ids' });
  });
});

app.route('/upload/:filename')
  .get(upload.read)

app.route('/upload')
  .post(upload.create)
  .get(upload.read)


module.exports.close = function() {
  console.log('shutting down the server...');
  server.close();
};

server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
