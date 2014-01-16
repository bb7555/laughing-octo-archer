//signup controller

//get data models
var Signup = require('../models/signup.js');

exports.list = function(req, res){
  var minute = 60 * 1000;
  res.cookie('remember', 1, { maxAge: minute });
  res.redirect('/signups/create');
        /*Signup.find(function(err, signups){
                res.render('signups_index', {
                        title: 'List of all signups',
                        signups: signups
                });
        });*/
}


exports.create = function(req, res){
	if (req.cookies.remember) {

    res.render('signups_coreg1', {
                               
    });
  }else{
    res.render('signups_create', {
                             
    });
  }
}

exports.saveAsync = function(req, res){
  var sendgrid  = require('sendgrid')('initialresponder', 'passw0rd');
var Email     = sendgrid.Email;
var email     = new Email({
  to:       req.query.email,
  from:     'donotreply@target.com',
  subject:  'Please Apply Now at Target.com',
  text:     'Thank you for applying with our partners Get That Job Staffing. We have reviewed your info and feel you are a great candidate. Thanks again! We invite you to apply right here: https://corporate.target.com/careers '
}); 
sendgrid.send(email, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
});

new Signup({first_name: req.query.first_name
    , middle_initial: req.query.middle_initial
    , last_name: req.query.last_name
    , username: req.query.username
    , email: req.query.email
    , phone: req.query.phone
    , address: req.query.address
    , city: req.query.city
    , state: req.query.state
    , zip: req.query.zip
    , gender: req.query.gender
    , month: req.query.month
    , year: req.query.year

  }).save(function(error, docs){
    res.send('Record Saved');
  });

}
exports.save = function(req, res){

	
	
	new Signup({first_name: req.query.first_name
		, last_name: req.query.last_name
		, username: req.query.username
    , email: req.query.email
		, address: req.query.address
		, city: req.query.city
		, state: req.query.state
		, zip: req.query.zip
		, gender: req.query.gender
		, month: req.query.month
		, day: req.query.day
		, year: req.query.year

	}).save(function(error, docs){
 
                res.redirect('/');
        });
}
