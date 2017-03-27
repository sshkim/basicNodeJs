module.exports = function(app, fs)
{
	app.get('/', function(req,res){
		var sess = req.session;
		res.render('index', {
			title: "MY HOMEPAGE",
			length: 5,
			name: sess.name,
			username: sess.username
		})
	});

	app.get('/login/:username/:password', function(req, res){
		var sess;
		sess = req.session;

		fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
			console.log(req.params);
			var users = JSON.parse(data);
			var username = req.params.username;
			var password = req.params.password;
			var result = {};

			if(!users[username]){
				result["success"] = 0;
				result["error"] = "not found";
				res.json(result);
				return ;
			}

			if(users[username]["password"] == password){
				result["success"] = 1;
				sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);
			}else{
				result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
			}
		});
	});

	app.get('/logout', function(req, res){
		sess = req.session;
		if(sess.username){
			req.session.destroy(function(err){
				if(err){
					console.log(err);
				}else{
					res.redirect('/');
				}
			})
		}else{
			res.redirect('/');
		}
	});
}                     