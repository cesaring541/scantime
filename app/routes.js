// app/routes.js
var console = require('console-prefix')
var users = require('./models/user');
var fs = require('fs.extra');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var Event = require('./models/event');

module.exports = function(app, passport) {

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/', function(req, res) {

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
        var documentFinger = req.param("document");

    	users.findOne({"local.document":documentFinger},function(err, users) {
            if (err){
                return done(err);
            }
            // if no user is found, return the message
            if (!users){
                return res.end('{"found": false}')
            }

    		var usr = JSON.parse(JSON.stringify(users));
            var name = usr.local.name;


    		return res.end('{"found": true,"name":"'+name+'"}');
    	});
    		
    		
    	

    }); 
    // =====================================
    // DOCUMENT USER POST ==================
    // =====================================
	app.get('/file/get/:document',function (req, res, next) {
        var documentFinger = req.param("document");
        var options = {
			    root: './public/huella/',
			    dotfiles: 'deny',
			    headers: {
			        'x-timestamp': Date.now(),
			        'x-sent': true
			    }
			  };

        users.find({"local.document" : documentFinger},function(err, users) {
            if (err == '') {
    			res.end("{'found': false}");
    		}else{        

			  var fileName = documentFinger + '.tml';
			  res.sendFile(fileName, options, function (err) {
			    if (err) {

			      res.status(err.status).end();
			    }
			    else {
			      console.log('Sent:', fileName);
			    }
			  });
    		}
    		
    	});
	});
    // =====================================
    // lOGIN REMOTE ========================
    // =====================================


	app.post('/loginFinger', upload.array('template',1),function(req,res){
          
        var documentUser = req.body.documentUser;

        var password = req.body.password;


        users.findOne({ 'local.document' :  documentUser }, function(err, users) {
            if (err){
                return done(err);
            }
            // if no user is found, return the message
            if (!users){
                return res.end('{"login": false}')
            }

            // if the user is found but the password is wrong
            if (!users.validPassword(password)){
                return res.end('{"login": false}')
            }
            // all is well, return successful user
            return res.end('{"login": true}')
        });
        
    });
    // =====================================
    // ALL USER GET=========================
    // ===================================== 

    app.get('/users',function(req,res){
    	// r
        date = new Date ();
    	users.find({'local.date':'{gte:}'},function(err, users) {
    		if (err) {
    			return res.send(err);
    		}
            Event.find({},function(err, events) {
                if (err) {
                    return res.send(err);
                }
               console.dir(events);   
            });

    		
    		res.render('pages/users.ejs',{users: users})
    	});

    });
	// =====================================
    // SAVE FILE FINGER ====================
    // =====================================    
    app.post('/file', upload.array('template',1),function(req,res){
          var main_dir='./public/huella/';
          
          var username = req.body.username;
          var name = [username + '.tml'];
          var final_path = main_dir;
          
          if (!fs.exists(main_dir)) {
            fs.mkdir(main_dir);
          }

          if(!fs.exists(final_path)){
            fs.mkdir(final_path);
          }
          for(var x=0;x<req.files.length;x++) {
            fs.createReadStream('./uploads/'+req.files[x].filename).pipe(fs.createWriteStream(final_path+req.files[x].originalname)); 
            fs.renameSync(final_path+req.files[x].originalname,final_path+name[x]);
            //borramos el archivo temporal creado
            fs.unlink('./uploads/'+req.files[x].filename); 

          }
        res.end("{'success': true}")
        
    });
    // =====================================
    // REGISTER EVENT ======================
    // ===================================== 

    app.post('/registerEvent/:document',upload.array('template',1),function(req,res){
            var documentUser = req.param("document");
            var typeEvent = req.body.typeEvent;

            users.findOne({ 'local.document' :  documentUser }, function(err, users) {
            if (err){
                return done(err);
            }
            // if no user is found, return the message
            if (!users){
                return res.end('{"login": false}')
            }
            if (typeEvent === 'E' || typeEvent === 'S' ) {
                // all is well, return successful user
                var datetime = new Date();
                var events = new Event();
                events.dateRegister = datetime;
                events.document = documentUser;
                events.typeEvent = typeEvent;
                var hour = datetime.getHours();
                var min = datetime.getMinutes()
                var ss = datetime.getSeconds()
                var usr = JSON.parse(JSON.stringify(users));
                var name = usr.local.name;
                events.save();
                return res.end('{"login": true,"name":"'+name+'","date":"'+hour+":"+min+":"+ss+'"}')
            }else{
                return res.end('{"event": false}')
            }

        })
            
            
    });
    

};
// =====================================
// TOKEN REQ ===========================
// ===================================== 

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
