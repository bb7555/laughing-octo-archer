//module dependencies
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , Cookies = require('cookies')
  , path = require('path')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

//heroku mongo connection string
  var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/getthatjob-info';

var app = express();
var Poet = require('poet');

// connect to Mongo when the app initializes
mongoose.connect(uristring);

// all environments
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('arjuna'));
//app.use(express.session());
app.use(app.router);
//app.use(require('stylus').middleware(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));

// parses json, x-www-form-urlencoded, and multipart/form-data
app.use(express.bodyParser());


passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
 
 
 
var TWITTER_CONSUMER_KEY = "8YMlh7hUKQHd7qjMc6VURA";
var TWITTER_CONSUMER_SECRET = "YThSFH8PJVytUF2A0gEhFUvRcAPpXLsq03fsXL6bT4";
 
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://football-parley.herokuapp.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    // NOTE: You'll probably want to associate the Twitter profile with a
    //       user record in your application's DB.
    var user = profile;
    return done(null, user);
  }
));
 


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app controllers
var signup = require('./controllers/signup.js');


//app routes
//app.get('/', routes.index);

var poet = Poet(app, {
  postsPerPage: 3,
  posts: './_posts',
  metaFormat: 'json',
  routes: {
    '/myposts/:post': 'post',
    '/pagination/:page': 'page',
    '/mytags/:tag': 'tag',
    '/mycategories/:category': 'category'
  }
});

poet.init().then(function () {
  // initialized
});

app.get('/', function (req, res) { res.render('index');});

app.get('/cookie', function(req, res){
  if (req.cookies.remember) {
    res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
  } else {
    res.send('<form action="/set" method="post"><p>Check to <label>'
      + '<input type="checkbox" name="remember"/> remember me</label> '
      + '<input type="submit" value="Submit"/>.</p></form>');
  }
});

app.get('/forget', function(req, res){
  res.clearCookie('remember');
  res.redirect('back');
});

app.post('/set', function(req, res){
  var minute = 60 * 1000;
  if (req.body.remember) res.cookie('remember', 1, { maxAge: minute });
  res.redirect('back');
});


///////SIGNUPS
app.get('/signups/haha', signup.list);
app.get('/signups/create', signup.create);
app.get('/signups/save', signup.save);
app.get('/signups/saveAsync', signup.saveAsync);
///////SIGNUPS


//////authentication routes
app.get('/account',
  ensureLoggedIn('/login'),
  function(req, res) {
    userprofile.check(req, res)
  });
 
app.get('/login',
  function(req, res) {
    res.send('<html><body><a href="/auth/twitter">Sign in with Twitter</a></body></html>');
  });
  
app.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  });
 
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successReturnToOrRedirect: '/account', failureRedirect: '/login' }));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});