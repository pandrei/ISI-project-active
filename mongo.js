var mongo = require('mongodb');

var start = function(address, port, callback){
	mongo.connect('mongodb://' + address + ':' + port + '/isi', callback);
}

exports.start = start;