

var mongoose = require('mongoose');
var post = require("./post.js");
var User = require("./user.js");

var ClassroomSchema = new mongoose.Schema({
  name: String,
  classroom: Number,
  description: String,
  post: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'Post'
    }],
  pics:[]  ,
  user:[{
        type: mongoose.Schema.Types.Mixed,
        ref: 'User'
  }]
});

module.exports = mongoose.model('ClassroomSchema',ClassroomSchema);