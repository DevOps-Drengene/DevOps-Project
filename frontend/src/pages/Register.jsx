import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useHistory } from 'react-router-dom';
import { post } from '../helpers/http';

const useStyles = createUseStyles({
  form: {
    '& label': {
      display: 'block',
      marginBottom: '10px',
      '& input': {
        marginLeft: '5px',
      },
    },
  },
});

export default function Register() {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function handlePassword2(e) {
    setPassword2(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!username || !email || !password || !password2) {
      setError('You must fill out all fields.');
      return;
    }
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }

    post('/register', { username, email, password })
      .then(() => history.push('/login'))
      .catch((err) => setError(err));
  }

  return (
    <>
      <h2>Sign Up</h2>
      {error ? (
        <div className="error">
          <strong>Error:</strong>
          {' '}
          { error }
        </div>
      ) : null }
      <form onSubmit={handleSubmit} className={classes.form}>
        <label>
          Username:
          <input type="text" name="username" size="30" onChange={handleUsername} />
        </label>
        <label>
          E-Mail:
          <input type="text" name="email" size="30" onChange={handleEmail} />
        </label>
        <label>
          Password:
          <input type="password" name="password" size="30" onChange={handlePassword} />
        </label>
        <label>
          Password
          <small>(repeat)</small>
          :
          <input type="password" name="password2" size="30" onChange={handlePassword2} />
        </label>

        <div className="actions">
          <input type="submit" value="Sign Up" />
        </div>
      </form>
    </>
  );
}
