// app/routes.js
var console = require('console-prefix')
var users = require('./models/user');
var fs = require('fs.extra');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

module.exports = function(app, passport) {




	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('pages/login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/dashboard', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/dashboard', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/dashboard',isLoggedIn, function(req, res) {
		res.render('pages/dashboard.ejs', {
			user : req.user // get the user out of session and pass to template
			
			
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// =====================================
    // USERS EXIST ========================
    // =====================================
    app.get('/users/:document',function(req,res){
    	// user exist
        var document = req.param("document");
        console.dir(document);
    	users.find({"local.document" : document},function(users,err) {
    		console.dir(err);
    		if (err == '') {
    			res.end("{'found': false}");
    		}else{
    			res.end("{'found': true}")
    		}
    		
    		
    	});

    });
	// =====================================
    // USERS  ID ROUTES ====================
    // =====================================
    app.get('/users',function(req,res){
    	// r

    	users.find({},function(err, users) {
    		if (err) {
    			return res.send(err);
    		}
    		
    		res.render('pages/users.ejs',{users: users})
    	});

    });
	// =====================================
    // SAVE FILE FINGER ====================
    // =====================================    
    app.post('/file',function(req,res){
      var main_dir='./public/huellas/';
      if(!fs.exists(main_dir)){
          fs.mkdir(main_dir);
      };
	    fs.createReadStream('./uploads/'+req.file.filename).pipe(fs.createWriteStream(final_path+req.file.originalname)); 
	    fs.renameSync(final_path+req.file.originalname,main_dir+name);
	    fs.unlink('./uploads/'+req.file.filename);

    });
    

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
