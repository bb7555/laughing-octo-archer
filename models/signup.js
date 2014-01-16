// The Sign Up data model
 
var mongoose = require('mongoose')
   , Schema = mongoose.Schema;
 
var signupSchema = new mongoose.Schema({
    username: String,
	email: String,
	first_name: String,
	middle_initial: String,
	last_name: String,
	phone: String,
	address: String,
	city: String,
	state: String,
	zip: Number,
	gender: String,
	month: Number,
	day: Number,
	year: Number
					
});
 
module.exports = mongoose.model('signup', signupSchema);