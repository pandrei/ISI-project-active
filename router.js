function route(express_app, db){
	var users = db.collection('users'),
		tweets = db.collection('tweets');

	// List all the users
	express_app.get('/user', function(request, response){
		users.find({}, function(err, cursor){
			if (err)
				throw err;

			cursor.toArray(function(error, users){
				if (users.length == 0)
					response.send("No users found");
				else
					response.send(users);
			});
		});
	});

	express_app.get('/', function(request, response){
		if (request.session.user){
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.end("All good, you're logged in! <a href='/logout'>Logout</a>");
		}
		else{
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.end(['<form action="/login" method="POST"',
					'<fieldset>',
						'<legend>Please log in</legend>',
						'<p>User: <input type="text" name="user"></p>',
						'<p>Password: <input type="password" name="password"></p>',
						'<button>Submit</button>',
					'</fieldset>',
				'</form>',
				'<br><a href="/register">Register</a>'].join(''));
		}
	});

	express_app.post('/login', function(request, response){
		response.writeHead(200, {'Content-Type': 'text/html'});
		users.find({}, function(err, cursor){cursor.toArray(function(error, userArray){
			console.log('ok');
			var found = false;
			for (var i in userArray){
				if (userArray[i]['user'] == request.body.user && userArray[i]['password'] == request.body.password){
					found = true;
					request.session.user = request.body.user;
					response.end("All good! Authenticated <br><a href='/logout'>Logout</a>");
				}

			}
			if (!found)
				response.end('Username/password not found. <br><a href="/register">Register</a>');
		})})

	});

	express_app.get('/logout', function(request, response){
		request.session.user = false;
		response.redirect('/');
	});

	// Show user with that name
	express_app.get('/user/:name', function(request, response){
		users.find({"user": request.body.name}, function(err, cursor){
			cursor.toArray(function(error, user){
				if (user.length == 0)
					response.send("No user named " + request.body.name + " found.");
				else
					response.send(user);
			});});
	});


	express_app.post('/registerAccount', function(request, response){
		users.find({"user": request.body.name}, function(err, cursor){
			cursor.toArray(function(error, user){
				if (user.length == 0 && request.body.password){
					console.log(request.body);
					db.collection('users').insert({"user": request.body.user,
						   "password": request.body.password,
						   "group": "admin"}, function(){});
					console.log("redirecting to /");
					response.redirect('/');
				}
				else{
					console.log("redirecting to /register");
					response.redirect('/register');}
			});})});

	express_app.get('/register', function(request, response){
		if (request.session.user)
			response.redirect('/');
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(['<form action="/registerAccount" method="POST"',
					'<fieldset>',
						'<legend>Please register</legend>',
						'<p>User: <input type="text" name="user"></p>',
						'<p>Password: <input type="password" name="password"></p>',
						'<button>Submit</button>',
					'</fieldset>',
				'</form>'].join(''));
		}
	);

	express_app.get('/twitter', function(request, response){
		var html = ['<h1>Twitter search</h1>',
		'<p>Please enter your search term:</p>',
		'<form action="/search" method="GET">',
		'<input type="text" name="q">',
		'<button>Search</button>',
		'</form>'
		].join('');

		response.writeHead(200, {"Content-Type": "text/html"});
		response.end(html);
	});

	express_app.get('*', function(request, response){
		response.send('Page not found', 404);
	});

};
exports.route = route;