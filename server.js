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
  uuid = require('uuid');

let
  server,
  FileStore = sessionFileStore(session);

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
  .use(passport.initialize())
  .use(passport.session())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.send('Hello World! -WeatherRoute');
});

module.exports.close = function() {
  console.log('shutting down the server...');
  server.close();
};

server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
