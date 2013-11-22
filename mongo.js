var mongo = require('mongodb');

var collection;
var start = function(address, port, callback){
	//if callback is not provided, use the one below
	var callback = callback || function(err, db){
			if (err)
				throw err;
	};

	mongo.connect('mongodb://' + address + ':' + port + '/isi', callback);
}

exports.start = start;