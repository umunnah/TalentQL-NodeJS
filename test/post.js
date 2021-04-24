let chai = require('chai');
let chaiHttp = require('chai-http');

let mongoose = require('mongoose');
const User = require('../src/models/User');
const Post = require('../src/models/Post');


const server = require('../src/app');

// assertion style for
chai.should();

chai.use(chaiHttp);
const MongoMemoryServer = require('mongodb-memory-server').default;
const { prototype } = require('../src/utils/errorResponse');

let mongoServer;
let port;
let token;

const defaultUser = {
  "first_name": "Default",
  "last_name": "Umunnah",
  "email": `${Math.random().toString(36).substring(7)}@example.com`,
  "password": "password",
  "phone": "07035693103"
};

const newUser = {
  "first_name": "Default",
  "last_name": "Umunnah",
  "email": "different@example.com",
  "password": "password",
  "phone": "07035693103"
};


describe("Post Model route", () => {
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

  describe("GET /api/v1/posts", () => {
    it("get all posts in database with pagination", async () => {
      const response = await chai.request(server)
      .get('/api/v1/posts');
      response.should.have.status(200);
    });
  });

  describe("Get /api/v1/posts/:id", () => {
    
    it("It should return a single post with its valid id", async () => {
      const user = await User.create(defaultUser);
      const payload =  {
        "title": "test title",
        "content": "test content",
        "user": user.id
      }
      const post =  await Post.create(payload);
      const response = await chai.request(server)
      .get(`/api/v1/post/${post.id}`);
      response.should.have.status(200);
    });

    it("Wrong Post Id", async () => {
      const response = await chai.request(server)
      .get('/api/v1/post/rjerjrjrejreo');
      response.should.have.status(404)
    });
  });

  describe("POST /api/v1/post", () => {
    
    it("create  new post", async () => {
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const payload =  {
        "title": "test title",
        "content": "test content",
      }
      const response = await chai.request(server)
      .post('/api/v1/post').set('Authorization', `Bearer ${token}`)
      .send(payload);
      response.should.have.status(201);
    });

    it("User without correct token cant create post", async () => {
      const payload =  {"title": "test title","content": "test content"};
      const response = await chai.request(server)
      .post('/api/v1/post').set('Authorization', `Bearer uruuhiuhi`)
      .send(payload);
      response.should.have.status(401);
    });

    it("Unauthenticated user cannot create post", async () => {
      const payload =  {"title": "test title","content": "test content"};
      const response = await chai.request(server)
      .post('/api/v1/post')
      .send(payload);
      response.should.have.status(401);
    });

    it("Create post validation error", async () => {
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const payload =  {}
      const response = await chai.request(server)
      .post('/api/v1/post').set('Authorization', `Bearer ${token}`)
      .send(payload);
      response.should.have.status(422);
    });
  });

  describe("DELETE /api/v1/post/:id", () => {

    it("delete a post with valid id", async () => {
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const post = await Post.create({
        "title": "test title","content": "test content","user":user.id
      });  
      const response = await chai.request(server)
      .delete(`/api/v1/post/${post.id}`).set('Authorization', `Bearer ${token}`);
      response.should.have.status(200);
    });

    it("unauthenticated user can delete a post", async () => {
      const response = await chai.request(server)
      .delete(`/api/v1/post/kmmomo`).set('Authorization', `Bearer knntnntnr`);
      response.should.have.status(401);
    });

    it("delete with wrong id", async () => {
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const response = await chai.request(server)
      .delete(`/api/v1/post/kmmomo`).set('Authorization', `Bearer ${token}`);
      response.should.have.status(404);
    });

    it("only owner can delete their post", async () => {
    
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const user2 = await User.create(newUser);
      const post = await Post.create({
        "title": "test title","content": "test content","user":user2.id
      });
      const response = await chai.request(server)
      .delete(`/api/v1/post/${post.id}`).set('Authorization', `Bearer ${token}`);
      response.should.have.status(403);
    });
    
    
  });

  describe("PUT /api/v1/post/:id", () => {
    
    it("Update a post without authentication", async () => {
      const user = await User.create(defaultUser);
      const post = await Post.create({
        "title": "test title","content": "test content","user":user.id
      });
      const postUpdate = {"title": "updated title","content": "updated content"};  
      const response = await chai.request(server)
      .post(`/api/v1/post/${post.id}`).send(postUpdate);
      response.should.have.status(401);
    });

    it("Update a post with wrong id", async () => {
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const post = await Post.create({
        "title": "test title","content": "test content","user":user.id
      });
      const postUpdate = {"title": "updated title","content": "updated content"};  
      const response = await chai.request(server)
      .post(`/api/v1/post/hello`).set('Authorization', `Bearer ${token}`).send(postUpdate);
      response.should.have.status(404);
    });

    it("unauthorized user cant update a post", async () => {
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const user2 = await User.create(newUser);
      const post = await Post.create({
        "title": "test title","content": "test content","user":user2.id
      });
      const postUpdate = {"title": "updated title","content": "updated content"};  
      const response = await chai.request(server)
      .post(`/api/v1/post/${post.id}`).set('Authorization', `Bearer ${token}`).send(postUpdate);
      response.should.have.status(403);
    });

    it("authorized user can update a post", async () => {
      const user = await User.create(defaultUser);
      token = user.getSignedJwtToken();
      const post = await Post.create({
        "title": "test title","content": "test content","user":user.id
      });
      const postUpdate = {"title": "updated title","content": "updated content"};  
      const response = await chai.request(server)
      .post(`/api/v1/post/${post.id}`).set('Authorization', `Bearer ${token}`).send(postUpdate);
      response.should.have.status(200);
    });
    
  });

});