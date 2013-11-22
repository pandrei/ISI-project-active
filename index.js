var server = require("./server"),
	router = require("./router"),
	requestHandlers = require("./requestHandler"),
	mongo = require("./mongo");

var mongoAddress = "127.0.0.1",
	mongoPort = "27017";

var handle = [];
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;

server.start(router.route, handle);
mongo.start(mongoAddress, mongoPort, function(err, db){
	if (err)
		throw err;
});