import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../helpers/UserContext';

const useStyles = createUseStyles({
  buttonAsLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '12px',
    fontFamily: "'Trebuchet MS', sans-serif",
    letterSpacing: '0.5px',
  },
});

export default function Nav() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const history = useHistory();
  const classes = useStyles();

  function handleLogout() {
    setCurrentUser(null);
    history.push('/public');
  }

  return (
    <div className="navigation">
      { currentUser
        ? (
          <>
            <Link to="/">my timeline</Link>
            {' | '}
            <Link to="/public">public timeline</Link>
            {' | '}
            <button onClick={handleLogout} className={classes.buttonAsLink} type="button">
              {`sign out [ ${currentUser.username} ]`}
            </button>
          </>
        )
        : (
          <>
            <Link to="/public">public timeline</Link>
            {' | '}
            <Link to="/register">sign up</Link>
            {' | '}
            <Link to="/login">sign in</Link>
          </>
        )}
    </div>
  );
}
