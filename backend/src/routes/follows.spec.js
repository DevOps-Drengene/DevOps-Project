/* eslint-disable global-require,jest/expect-expect */
const td = require('testdouble');
require('testdouble-jest')(td, jest);
const request = require('supertest');

let UserRepository;
let app;

describe('/fllws', () => {
  beforeEach(() => {
    UserRepository = td.replace('../repositories/UserRepository');
    app = require('../simulator-server');
  });

  afterEach(() => {
    td.reset();
  });

  it('GET /:username returns the people the user is following if OK', (done) => {
    const user = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };
    const following = [{ username: 'Lasse' }, { username: 'Gustav' }];

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);
    td.when(UserRepository.getFollowing(user, 100)).thenResolve(following);

    request(app)
      .get('/fllws/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .expect(200, { follows: ['Lasse', 'Gustav'] })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('GET /:username returns 404 if the user is not found', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve(null);

    request(app)
      .get('/fllws/caspar')
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
      .get('/fllws/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username with follow key returns 204 if OK', (done) => {
    const user = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };

    const followUser = {
      id: 2,
      username: 'lasse',
      email: 'lraa@itu.dk',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);
    td.when(UserRepository.getByUsername('lasse')).thenResolve(followUser);

    request(app)
      .post('/fllws/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({ follow: 'lasse' })
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username with unfollow key returns 204 if OK', (done) => {
    const user = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };

    const followUser = {
      id: 2,
      username: 'lasse',
      email: 'lraa@itu.dk',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);
    td.when(UserRepository.getByUsername('lasse')).thenResolve(followUser);

    request(app)
      .post('/fllws/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({ unfollow: 'lasse' })
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username returns 400 if neither follow or unfollow is in req body', (done) => {
    const user = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);

    request(app)
      .post('/fllws/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username returns 404 if user does not exist', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve(null);

    request(app)
      .post('/fllws/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({ follow: 'lasse' })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username returns 404 if followUser does not exist', (done) => {
    const user = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);
    td.when(UserRepository.getByUsername('lasse')).thenResolve(null);

    request(app)
      .post('/fllws/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({ follow: 'lasse' })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username returns 404 if unfollowUser does not exist', (done) => {
    const user = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);
    td.when(UserRepository.getByUsername('lasse')).thenResolve(null);

    request(app)
      .post('/fllws/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({ unfollow: 'lasse' })
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('POST /:username returns 500 if unspecified error occurs', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .post('/fllws/caspar')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
