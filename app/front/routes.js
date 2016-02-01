var object = require('../models/objects');
var console = require('console-prefix');
var fs = require('fs.extra');
var multer  = require('multer');
var paginate = require('express-paginate');
var upload = multer({ dest: 'uploads/' })
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.use(paginate.middleware(2, 2));
  	app.get('/car', function(req, res, next) {



  		object.paginate({}, { page: req.query.page, limit: req.query.limit }, function(err, object, pageCount, itemCount) {

  			if (err) return next(err);

			res.render('pages/cardObjects.ejs', {
				object: object,
				pageCount: pageCount,
				itemCount: itemCount,
				actualPage: req.query.page,
				pages: paginate.getArrayPages(req)(2, pageCount, req.query.page)
			});
  		});

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
