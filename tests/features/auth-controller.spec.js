const expect = require('chai').expect;
const request = require('supertest');
let mongoose = require('mongoose');
const User = require('../../src/models/User');
let mongoDb = 'mongodb://localhost:27017/talentQl';
mongoose.connect(mongoDb, {
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology:true
});

const server = require('../../src/app');
const asyncHandler =  require('../../src/middleware/async');

const payload = {
  "first_name": "Arinze",
  "last_name": "Umunnah",
  "email": "example1@example.com",
  "password": "password",
  "phone": "07035693103"
};

const defaultUser = {
  "first_name": "Default",
  "last_name": "Umunnah",
  "email": "default@example.com",
  "password": "password",
  "phone": "07035693103"
};


// let server;
let token = "";
let headers = {"Authorization": "Bearer iihruhfuhiohuhui"};


describe('Auth Route test', () => {
  beforeEach(() => {
    server.listen(3001);
    let g = asyncHandler(async () => {
      let u = await User.create(defaultUser);
      return u.username;
    });
    console.log(g());
    // User.create(defaultUser).then((res) => console.log("user",res));
    // let mm = ;
  
    // let getUser = request(server).post('/api/v1/auth/register')
    //   .send(defaultPayload)
    //   .then((res) =>{
    //       console.log("token",res);
    //     });
    // getUser;
    // console.log('mmm',getUser);
  });
  afterEach(() => {
    mongoose.connection.close();
    // server.close();
  });


  describe('Register a user Test', () => {
    it('OK, creating a user', async () => {
      await request(server).post('/api/v1/auth/register')
      .send(payload);
    });
  
    // it('Validation Error, creating a user', (done) => {
    //   request(server).post('/api/v1/auth/register')
    //     .send({ name: 'NOTE' })
    //     .expect(422)
    //     .then((res) => {})
    //     .catch(done());
    // });
  });

  describe('get a user Test', () => {
    // it('OK, get a user', (done) => {
    //   request(server).get('/api/v1/auth/profile')
    //     .set(headers).expect(200)
    //     .then((res) => {}).catch(done());
    // });
  
    // it('Validation Error, creating a user', (done) => {
    //   request(server).post('/api/v1/auth/register')
    //     .send({ name: 'NOTE' })
    //     .then((res) => {
    //       const body = res.body;
    //       expect(res.status).to.eq(422);
    //       // done();
    //     })
    //     .catch(done());
    // });
  });
  
})