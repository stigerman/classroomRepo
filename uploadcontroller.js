'use strict';
 
 
var mongoose = require('mongoose'),
    _ = require('lodash');
 
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);
 
exports.create = function(req, res) {
 
	     	   	
	    	var part = req.files.file;
 
                var writeStream = gfs.createWriteStream({
                    filename: part.file,
    				mode: 'w',
                    content_type:part.mimetype
                });
 
 
                writeStream.on('close', function() {
                     return res.status(200).send({
						message: 'Success'
					});
                });
                
                writeStream.write(part.data);
 
                writeStream.end();
 
};

exports.readAll = function(req, res){
	gfs.files.find().toArray(function(err, file){
		var readstream = gfs.createReadStream(file);


	    return readstream;
	})
}
 
 
exports.read = function(req, res) {
 
	gfs.files.find().toArray(function (err, files) {
 
 	    if(files.length===0){
			return res.status(400).send({
				message: 'File not found'
			});
 	    }
	
		res.writeHead(200, {'Content-Type': files[0].contentType});
		
		var readstream = gfs.createReadStream({
			  filename: files[0].filename
		});
 
	    readstream.on('data', function(data) {
	        res.write(data);
	    });
	    
	    readstream.on('end', function() {
	        res.end();        
	    });
 
		readstream.on('error', function (err) {
		  console.log('An error occurred!', err);
		  throw err;
		});
	});
 
};