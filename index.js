var fs = require('fs'),
	db = require('./db'),
	server = require('./server'),
	router = require('./router');

// Load config json file
var config = JSON.parse(fs.readFileSync("./config.json"));

db.setUp(config.db_host, config.db_port, config.db_name, startServer);

function startServer(db){
	server.start(config.server_host, config.server_port);
	router.route(server.express_app, db);
};

// Watch for changes on config.json, reload server if file is modiffied
fs.watchFile("./config.json", function(){
	var config = JSON.parse(fs.readFileSync("./config.json"));
	server.restart(config.server_host, config.server_port)
});