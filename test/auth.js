let chai = require('chai');
let chaiHttp = require('chai-http');

let mongoose = require('mongoose');
const User = require('../src/models/User');


const server = require('../src/app');

// assertion style for
chai.should();

chai.use(chaiHttp);
const MongoMemoryServer = require('mongodb-memory-server').default;
const { prototype } = require('../src/utils/errorResponse');

let mongoServer;
let port;
let token;

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


describe("Auth route", () => {
  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser:true,
      useCreateIndex:true,
      useFindAndModify:false,
      useUnifiedTopology:true
    });
    port = conn.connection.port;
    host = conn.connection.host;
    server.listen(port);
    
  });
  
  afterEach(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("Post /api/v1/auth/register", () => {
    it("It should register a new user", async () => {
      const response = await chai.request(server)
      .post('/api/v1/auth/register').send(payload);
      response.should.have.status(201);
    });

    it("Validation error", async () => {
      const response = await chai.request(server)
      .post('/api/v1/auth/register').send({});
      response.should.have.status(422);
    });
  });

  describe("Post /api/v1/auth/login", () => {
    
    it("It should login a user", async () => {
      await User.create(payload);
      let credentials = {
        email : payload.email,
        password: payload.password
      };
      const response = await chai.request(server)
      .post('/api/v1/auth/login').send(credentials);
      response.should.have.status(200);
    });

    it("Wrong crendetials", async () => {
      let credentials = {
        email : "testing@email.com",
        password: payload.password
      };
      const response = await chai.request(server)
      .post('/api/v1/auth/login').send(credentials);
      response.should.have.status(401)
    });
  });

  describe("GET /api/v1/auth/logout", () => {
    
    it("It should logout a signed in user", async () => {
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const response = await chai.request(server)
      .get('/api/v1/auth/logout').set('Authorization', `Bearer ${token}`);
      response.should.have.status(200);
    });

    it("Cant logout an unathenticated user", async () => {

      const response = await chai.request(server)
      .get('/api/v1/auth/logout');
      response.should.have.status(401)
    });
  });

  describe("GET /api/v1/auth/profile", () => {
    
    it("Get User profile", async () => {
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const response = await chai.request(server)
      .get('/api/v1/auth/profile').set('Authorization', `Bearer ${token}`);
      response.should.have.status(200);
    });

    it("Cant return user profile", async () => {
      const response = await chai.request(server)
      .get('/api/v1/auth/profile');
      response.should.have.status(401)
    });
  });

  describe("PUT /api/v1/auth/forgot-password", () => {
    
    it("generates a token for resetting of forgotten password", async () => {
      const user = await User.create(payload);
      const response = await chai.request(server)
      .put('/api/v1/auth/forgot-password').send({email : user.email});
      response.should.have.status(200);
    });

    it("using wrong email to genereate token for forgot password", async () => {
      const response = await chai.request(server)
      .put('/api/v1/auth/forgot-password').send({email: payload.email});
      response.should.have.status(422)
    });
  });

  describe("PUT /api/v1/auth/resetpassword/:resetpasswordtoken", () => {

    it("using wrong token to reset password", async () => {
      const response = await chai.request(server)
      .put(`/api/v1/auth/resetpassword/uffnfkjfkjbk`);
      response.should.have.status(400)
    });
  });
});