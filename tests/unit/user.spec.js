let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;

let mongoose = require('mongoose');
require('sinon-mongoose');


const User = require('../../src/models/User');
const userObject = {
  "first_name": "testing",
  "last_name": "testing",
  "email": "testing@example.com",
  "password": "testing"
};

describe("Get all users", function(){
  // Test will pass if we get all users
 it("should return all users", function(done){
     let UserMock = sinon.mock(User);
     let expectedResult = {status: true, user: []};
     UserMock.expects('find').yields(null, expectedResult);
     User.find(function (err, result) {
         UserMock.verify();
         UserMock.restore();
         expect(result.status).to.be.true;
         done();
     });
 });

 // Test will pass if we fail to get a user
 it("should return error", function(done){
     let UserMock = sinon.mock(User);
     let expectedResult = {status: false, error: "Something went wrong"};
     UserMock.expects('find').yields(expectedResult, null);
     User.find(function (err, result) {
         UserMock.verify();
         UserMock.restore();
         expect(err.status).to.not.be.true;
         done();
     });
 });
});


// Test will pass if the user is saved
describe("Post a new user", function(){
 it("should create new post", function(done){
     let UserMock = sinon.mock(new User(userObject));
     let user = UserMock.object;
     let expectedResult = { status: true };
     UserMock.expects('save').yields(null, expectedResult);
     user.save(function (err, result) {
         UserMock.verify();
         UserMock.restore();
         expect(result.status).to.be.true;
         done();
     });
 });
 // Test will pass if the user is not saved
 it("should return error, if post not saved", function(done){
     let UserMock = sinon.mock(new User({ user: 'Save new user from mock'}));
     let user = UserMock.object;
     let expectedResult = { status: false };
     UserMock.expects('save').yields(expectedResult, null);
     user.save(function (err, result) {
         UserMock.verify();
         UserMock.restore();
         expect(err.status).to.not.be.true;
         done();
     });
 });
});


// Test will pass if the user is deleted based on an ID
describe("Delete a user by id", function(){
  it("should delete a user by id", function(done){
      let UserMock = sinon.mock(User);
      let expectedResult = { status: true };
      UserMock.expects('remove').withArgs({_id: 12345}).yields(null, expectedResult);
      User.remove({_id: 12345}, function (err, result) {
          UserMock.verify();
          UserMock.restore();
          expect(result.status).to.be.true;
          done();
      });
  });
  // Test will pass if the user is not deleted based on an ID
  it("should return error if delete action is failed", function(done){
      let UserMock = sinon.mock(User);
      let expectedResult = { status: false };
      UserMock.expects('remove').withArgs({_id: 12345}).yields(expectedResult, null);
      User.remove({_id: 12345}, function (err, result) {
          UserMock.verify();
          UserMock.restore();
          expect(err.status).to.not.be.true;
          done();
      });
  });
});