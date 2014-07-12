var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var winston = require('winston');

var global = {};
var url = 'http://localhost';
var prefix = '/folder';


describe('REGISTER:', function() {

	before(function(done) {
		// Initial setup 
		done();
	});

	describe('Register', function() {

		it('should just work', function(done) {
			var args = {
				q: "signup",
				username: 'user',
				password: 'pwd'
			};
			request(url).post(prefix + '/lib/api.php').send(args)
			.end(function(err, res) {
				if (err) throw err;
				res.should.have.status(200);
				res.body.should.have.property('code');
				res.body.should.have.property('message');
				res.body.should.not.have.property('data');
				res.body.code.should.equal(0);
				res.body.message.should.equal('OK');
				done();
			});
		});

		it('should complain if it already exists', function(done) {
			var args = {
				q: "signup",
				username: 'user',
				password: 'pwd'
			};
			request(url).post(prefix + '/lib/api.php').send(args)
			.end(function(err, res) {
				if (err) throw err;
				res.should.have.status(200);
				res.body.should.have.property('code');
				res.body.should.have.property('message');
				res.body.should.not.have.property('data');
				res.body.code.should.not.equal(0);
				res.body.message.should.not.equal('OK');
				done();
			});
		});

	});
});


describe('LOGIN:', function() {

	before(function(done) {
		// Initial setup 
		done();
	});

	describe('Login', function() {

		it('should just work', function(done) {
			var args = {
				q: "login",
				username: 'user',
				password: 'pwd'
			};
			request(url).post(prefix + '/lib/api.php').send(args)
			.end(function(err, res) {
				if (err) throw err;
				res.should.have.status(200);
				res.body.should.have.property('code');
				res.body.should.have.property('message');
				res.body.should.have.property('data');
				res.body.code.should.equal(0);
				res.body.message.should.equal('OK');
				done();
			});
		});

		it('should complain if credentials are not valid', function(done) {
			var args = {
				q: "login",
				username: 'user',
				password: 'pwd'
			};
			request(url).post(prefix + '/lib/api.php').send(args)
			.end(function(err, res) {
				if (err) throw err;
				res.should.have.status(200);
				res.body.should.have.property('code');
				res.body.should.have.property('message');
				res.body.should.not.have.property('data');
				res.body.code.should.not.equal(0);
				res.body.message.should.not.equal('OK');
				done();
			});
		});

	});
});
