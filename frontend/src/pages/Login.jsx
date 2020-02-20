import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { UserContext } from '../helpers/UserContext';
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

export default function Login() {
  const { setCurrentUser } = useContext(UserContext);
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const classes = useStyles();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const user = await post('/login', {
        username,
        password,
      });
      setCurrentUser(user);
      history.push('/');
    } catch (err) {
      setError(err);
    }
  }

  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  return (
    <>
      <h2>Sign In</h2>
      { error ? (
        <div className="error">
          <strong>Error:</strong>
          {' '}
          {error}
        </div>
      ) : null }
      <form onSubmit={handleSubmit} className={classes.form}>
        <label>
          Username:
          <input type="text" name="username" size="30" onChange={handleUsername} />
        </label>
        <label>
          Password:
          <input type="password" name="password" size="30" onChange={handlePassword} />
        </label>
        <div className="actions">
          <input type="submit" value="Sign In" />
        </div>
      </form>
    </>
  );
}
