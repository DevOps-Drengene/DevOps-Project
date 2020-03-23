/* eslint-disable global-require,jest/expect-expect */
const td = require('testdouble');
require('testdouble-jest')(td, jest);
const request = require('supertest');

let UserRepository;
let app;

describe('/register', () => {
  beforeEach(() => {
    UserRepository = td.replace('../repositories/UserRepository');
    app = require('../simulator-server');
  });

  afterEach(() => {
    td.reset();
  });

  it('returns 204 if OK', (done) => {
    const newUser = {
      username: 'caspar',
      email: 'cole@itu.dk',
      pwd: '1234',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(null);
    td.when(UserRepository.create(newUser)).thenResolve(null);

    request(app)
      .post('/register')
      .send(newUser)
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('returns 400 if user exists', (done) => {
    const newUser = {
      username: 'caspar',
      email: 'cole@itu.dk',
      pwd: '1234',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve({ username: 'caspar' });

    request(app)
      .post('/register')
      .send(newUser)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('returns 500 if unspecified error occurs', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .post('/register')
      .send({ username: 'caspar', pwd: 'caspar', email: 'cole@itu.dk' })
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('returns 400 if no email is given', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .post('/register')
      .send({ username: 'caspar', pwd: 'caspar' })
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
