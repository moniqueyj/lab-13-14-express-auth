'use strict';

//set env vars
process.env.APP_SECRET = process.env.APP_SECRET || 'slugs are secret haha';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/text';

//require npm modules
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('authdemo:auth-router-test');

//require app modules
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

//setup module constants
const port = process.env.PORT || 3000;
const baseURL = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing module auth-router', function(){
  before((done) => {
    debug('before module auth-router');
    if(!server.isRunning){
      server.listen(port,()=>{
        server.isRunning = true;
        debug(`server up ::: ${port}`);
        done();
      });
      return;
    }
    done();
  });
  after((done) => {
    debug('after module auth-router');
    if (server.isRunning){
      server.close(()=> {
        server.isRunning = false;
        debug('server down');
        done();
      });
      return;
    }
    done();
  });
  describe('testing POST /api/signup', function(){
    after((done) => {
      debug('after POST /api/signup');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });
    it('should return a token', function(done){
      debug('test POST /api/signup');
      request.post(`${baseURL}/signup`)
      .send({
        username: 'yunjoo',
        password: 'yunjoo7777'
      })
      .then(res =>{
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      })
      .catch(done);
    });
  });
  describe('testing POST /api/signup', function(){

    after((done) => { // remove user created for POST test
      debug('after POST /api/signup');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });

    it('should return status 200 and a token', function(done){
      debug('test POST /api/signup');
      request.post(`${baseURL}/signup`)
      .send({
        username: 'cort',
        password: 'asdf1234'
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      })
      .catch(done);
    });

    it('should return status 400 for no body', function(done){
      debug('test POST status 400 no body /api/signup');
      request.post(`${baseURL}/signup`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

    it('should return status 400 for invalid body', function(done){
      debug('test POST status 400 invalid body /api/signup');
      request.post(`${baseURL}/signup`)
      .send({
        fudge: 'muffins'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  describe('testing GET /api/signin', function(){
    before((done) => {
      debug('before GET /api/signup');
      authController.signup({username: 'yunjoo', password: '1234'})
      .then(()=> done())
      .catch(done);
    });
    after((done) => {
      debug('after GET /api/signup');
      userController.removeAllUsers()
      .then(() => done())
      .catch(done);
    });
    it('should return a token', function(done){
      debug('test GET /api/signup');
      request.get(`${baseURL}/signin`)
      .auth('yunjoo','1234')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text.length).to.equal(205);
        done();
      })
      .catch(done);
    });
    it('should return status 401 wrong credentials', function(done){
      debug('test GET status 401');
      request.get(`${baseURL}/signin`)
      .auth('cort', 'wrongpassword')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
});
