

var mongoose = require('mongoose');
var User = require("./user");

var PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  author: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'User'
    }]

});

module.exports = mongoose.model('PostSchema',PostSchema);
