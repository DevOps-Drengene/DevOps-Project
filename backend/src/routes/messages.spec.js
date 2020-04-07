/* eslint-disable global-require,jest/expect-expect */
const td = require('testdouble');
require('testdouble-jest')(td, jest);
const request = require('supertest');

let UserRepository;
let MessageRepository;
let app;

jest.setTimeout(6000);

describe('/msgs', () => {
  beforeEach(() => {
    UserRepository = td.replace('../repositories/UserRepository');
    MessageRepository = td.replace('../repositories/MessageRepository');
    app = require('../simulator-server');
  });

  afterEach(() => {
    td.reset();
  });

  it('GET / returns list of messages if OK', (done) => {
    const d1 = new Date();
    const d2 = new Date();

    const messages = [
      {
        content: 'Hey!',
        pub_date: d1.toISOString(),
        user: 'caspar',
      },
      {
        content: 'Am I alone in this universe?',
        pub_date: d2.toISOString(),
        user: 'lasse',
      },
    ];

    td.when(MessageRepository.getAll(100)).thenResolve(messages);

    request(app)
      .get('/msgs')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .expect(200, messages)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('GET / returns 500 if unspecified error occurs', (done) => {
    td.when(MessageRepository.getAll(100)).thenReject(new Error('ERROR!'));

    request(app)
      .get('/msgs')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('GET /:username returns list of messages for user if OK', (done) => {
    const d1 = new Date();
    const d2 = new Date();

    const user = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);

    const messages = [
      {
        content: 'Hey!',
        pub_date: d1.toISOString(),
        user: 'caspar',
      },
      {
        content: 'Am I alone in this universe?',
        pub_date: d2.toISOString(),
        user: 'caspar',
      },
    ];

    td.when(MessageRepository.getMessagesByUser(user, 100)).thenResolve(messages);

    request(app)
      .get('/msgs/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .expect(200, messages)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('GET /:username returns 404 if user not found', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve(null);
    request(app)
      .get('/msgs/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('GET /:username returns 500 if unspecified error occurs', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .get('/msgs/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username returns 204 if OK', (done) => {
    const user = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);

    request(app)
      .post('/msgs/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send('Tweet')
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username returns 404 if user not found', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve(null);

    request(app)
      .post('/msgs/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send('Tweet')
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username returns 500 if unspecified error occurs', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .post('/msgs/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send('Tweet')
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
