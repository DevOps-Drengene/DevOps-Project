/* eslint-disable global-require,jest/expect-expect */
const td = require('testdouble');
const bcrypt = require('bcrypt');
require('testdouble-jest')(td, jest);
const request = require('supertest');

let UserRepository;
let MessageRepository;
let app;

describe('custom api tests', () => {
  beforeEach(() => {
    UserRepository = td.replace('./repositories/UserRepository');
    MessageRepository = td.replace('./repositories/MessageRepository');
    app = require('./custom-server');
  });

  afterEach(() => {
    td.reset();
  });

  it('/register returns 204 if OK', (done) => {
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

  it('/register returns 400 if user exists', (done) => {
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

  it('/register returns 500 if unspecified error occurs', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .post('/register')
      .send({ username: 'caspar' })
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/login returns the correct user', (done) => {
    const hashedPassword = bcrypt.hashSync('1234', 10);
    const user = {
      id: 1,
      username: 'caspar',
      password: hashedPassword,
      email: 'cole@itu.dk',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);

    request(app)
      .post('/login')
      .send({ username: 'caspar', password: '1234' })
      .expect(200, { userId: 1, username: 'caspar', email: 'cole@itu.dk' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/login returns 400 if wrong password is used', (done) => {
    const hashedPassword = bcrypt.hashSync('1234', 10);
    const user = {
      id: 1,
      username: 'caspar',
      password: hashedPassword,
      email: 'cole@itu.dk',
    };

    td.when(UserRepository.getByUsername('caspar')).thenResolve(user);

    request(app)
      .post('/login')
      .send({ username: 'caspar', password: '5678' })
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/login returns 400 if user does not exist', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve(null);

    request(app)
      .post('/login')
      .send({ username: 'caspar', password: '1234' })
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/login returns 500 if error is thrown', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .post('/login')
      .send({ username: 'caspar', password: '1234' })
      .expect(500, 'ERROR!')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/public returns messages', (done) => {
    td.when(MessageRepository.getAll(50, true)).thenResolve('all messages');

    request(app)
      .get('/public')
      .expect(200, 'all messages')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/public returns 500 when error is thrown', (done) => {
    td.when(MessageRepository.getAll(50, true)).thenReject(new Error('ERROR!'));

    request(app)
      .get('/public')
      .expect(500, 'ERROR!')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/timeline/:id returns timeline', (done) => {
    td.when(UserRepository.getById('1')).thenResolve('user');
    td.when(MessageRepository.getTimeline('user', 50)).thenResolve('timeline');

    request(app)
      .get('/timeline/1')
      .expect(200, 'timeline')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/timeline/:id returns 500 when an error is thrown', (done) => {
    td.when(UserRepository.getById('1')).thenReject(new Error('ERROR!'));

    request(app)
      .get('/timeline/1')
      .expect(500, 'ERROR!')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/user/:username/:currentUserId? returns profile correct info when called with following currentUserId', (done) => {
    const profileUser = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };
    const messages = [{
      text: 'text',
      createdAt: 'createdAt',
    }];

    td.when(UserRepository.getByUsername('caspar')).thenResolve(profileUser);
    td.when(UserRepository.getById('2')).thenResolve('currentUser');
    td.when(UserRepository.isFollowing('currentUser', profileUser)).thenResolve(true);
    td.when(MessageRepository.getMessagesByUser(profileUser, 50)).thenResolve(messages);

    const returnObj = {
      profileUser: {
        userId: 1,
        username: 'caspar',
        email: 'cole@itu.dk',
      },
      following: true,
      messages: [{
        author_id: 1,
        userId: 1,
        text: 'text',
        pubDate: 'createdAt',
        username: 'caspar',
        email: 'cole@itu.dk',
      }],
    };

    request(app)
      .get('/user/caspar/2')
      .expect(200, returnObj)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/user/:username/:currentUserId? returns profile correct info when called with nonfollowing currentUserId', (done) => {
    const profileUser = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };
    const messages = [{
      text: 'text',
      createdAt: 'createdAt',
    }];

    td.when(UserRepository.getByUsername('caspar')).thenResolve(profileUser);
    td.when(UserRepository.getById('2')).thenResolve('currentUser');
    td.when(UserRepository.isFollowing('currentUser', profileUser)).thenResolve(false);
    td.when(MessageRepository.getMessagesByUser(profileUser, 50)).thenResolve(messages);

    const returnObj = {
      profileUser: {
        userId: 1,
        username: 'caspar',
        email: 'cole@itu.dk',
      },
      following: false,
      messages: [{
        author_id: 1,
        userId: 1,
        text: 'text',
        pubDate: 'createdAt',
        username: 'caspar',
        email: 'cole@itu.dk',
      }],
    };

    request(app)
      .get('/user/caspar/2')
      .expect(200, returnObj)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/user/:username/:currentUserId? returns profile correct info when called without currentUserId', (done) => {
    const profileUser = {
      id: 1,
      username: 'caspar',
      email: 'cole@itu.dk',
    };
    const messages = [{
      text: 'text',
      createdAt: 'createdAt',
    }];

    td.when(UserRepository.getByUsername('caspar')).thenResolve(profileUser);
    td.when(MessageRepository.getMessagesByUser(profileUser, 50)).thenResolve(messages);

    const returnObj = {
      profileUser: {
        userId: 1,
        username: 'caspar',
        email: 'cole@itu.dk',
      },
      following: false,
      messages: [{
        author_id: 1,
        userId: 1,
        text: 'text',
        pubDate: 'createdAt',
        username: 'caspar',
        email: 'cole@itu.dk',
      }],
    };

    request(app)
      .get('/user/caspar')
      .expect(200, returnObj)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/user/:username/:currentUserId? returns 404 when user not found', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve(null);

    request(app)
      .get('/user/caspar/2')
      .expect(404, { error: 'User not found' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/user/:username/:currentUserId? returns 500 when error is thrown', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .get('/user/caspar/2')
      .expect(500, 'ERROR!')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/follow returns 204', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve('followed');
    td.when(UserRepository.getById('1')).thenResolve('follower');
    td.when(UserRepository.addFollow('follower', 'followed'));

    request(app)
      .post('/caspar/follow')
      .send({ currentUserId: '1' })
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/follow returns 401 when currentUserId is missing', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve('followed');
    td.when(UserRepository.getById('1')).thenResolve('follower');
    td.when(UserRepository.addFollow('follower', 'followed'));

    request(app)
      .post('/caspar/follow')
      .expect(401, { error: 'currentUserId is missing' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/follow returns 404 when currentUser does not exist', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve('followed');
    td.when(UserRepository.getById('1')).thenResolve(null);
    td.when(UserRepository.addFollow('follower', 'followed'));

    request(app)
      .post('/caspar/follow')
      .send({ currentUserId: '1' })
      .expect(404, { error: 'User not found' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/follow returns 404 when user does not exist', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve(null);
    td.when(UserRepository.getById('1')).thenResolve('follower');
    td.when(UserRepository.addFollow('follower', 'followed'));

    request(app)
      .post('/caspar/follow')
      .send({ currentUserId: '1' })
      .expect(404, { error: 'User not found' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/follow returns 500 when error is thrown', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .post('/caspar/follow')
      .send({ currentUserId: '1' })
      .expect(500, 'ERROR!')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/unfollow returns 204', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve('followed');
    td.when(UserRepository.getById('1')).thenResolve('follower');
    td.when(UserRepository.removeFollow('follower', 'followed')).thenResolve();

    request(app)
      .post('/caspar/unfollow')
      .send({ currentUserId: '1' })
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/unfollow returns 401 when currentUserId is missing', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve('followed');
    td.when(UserRepository.getById('1')).thenResolve('follower');
    td.when(UserRepository.removeFollow('follower', 'followed'));

    request(app)
      .post('/caspar/unfollow')
      .expect(401, { error: 'currentUserId is missing' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/unfollow returns 404 when currentUser does not exist', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve('followed');
    td.when(UserRepository.getById('1')).thenResolve(null);
    td.when(UserRepository.removeFollow('follower', 'followed')).thenResolve();

    request(app)
      .post('/caspar/unfollow')
      .send({ currentUserId: '1' })
      .expect(404, { error: 'User not found' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/unfollow returns 404 when user does not exist', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenResolve(null);
    td.when(UserRepository.getById('1')).thenResolve('follower');
    td.when(UserRepository.removeFollow('follower', 'followed')).thenResolve();

    request(app)
      .post('/caspar/unfollow')
      .send({ currentUserId: '1' })
      .expect(404, { error: 'User not found' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/:username/unfollow returns 500 when error is thrown', (done) => {
    td.when(UserRepository.getByUsername('caspar')).thenReject(new Error('ERROR!'));

    request(app)
      .post('/caspar/unfollow')
      .send({ currentUserId: '1' })
      .expect(500, 'ERROR!')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/add_message returns 201 and messages', (done) => {
    td.when(UserRepository.getById('1')).thenResolve('user');
    td.when(MessageRepository.create('user', 'message')).thenResolve();
    td.when(MessageRepository.getTimeline('user', 50)).thenResolve('messages');

    request(app)
      .post('/add_message')
      .send({ currentUserId: '1', newMessage: 'message' })
      .expect(201, 'messages')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/add_message returns 401 when no currentUserId is given', (done) => {
    request(app)
      .post('/add_message')
      .send({ newMessage: 'message' })
      .expect(401, { error: 'currentUserId is missing' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/add_message returns 404 when currentUserId is invalid', (done) => {
    td.when(UserRepository.getById('1')).thenResolve(null);

    request(app)
      .post('/add_message')
      .send({ currentUserId: '1', newMessage: 'message' })
      .expect(404, { error: 'User not found' })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('/add_message returns 500 when error is thrown', (done) => {
    td.when(UserRepository.getById('1')).thenReject(new Error('ERROR!'));

    request(app)
      .post('/add_message')
      .send({ currentUserId: '1', newMessage: 'message' })
      .expect(500, 'ERROR!')
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
