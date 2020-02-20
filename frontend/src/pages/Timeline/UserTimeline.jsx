import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { createUseStyles } from 'react-jss';
import { useParams } from 'react-router-dom';
import MessageList from './MessageList';
import { UserContext } from '../../helpers/UserContext';
import { get, post } from '../../helpers/http';

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

export default function UserTimeline() {
  const { username } = useParams();
  const classes = useStyles();
  const { currentUser } = useContext(UserContext);
  const [profileUser, setProfileUser] = useState(null);
  const [following, setFollowing] = useState(null);
  const [messages, setMessages] = useState([]);

  // componentDidMount
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    get(`/user/${username}${currentUser ? `/${currentUser.userId}` : ''}`)
      .then((res) => {
        setProfileUser(res.profileUser);
        setFollowing(res.following);
        setMessages(res.messages);
      });
  });

  function handleFollow() {
    post(`/${profileUser.username}/follow`, { currentUserId: currentUser.userId })
      .then(() => setFollowing(true))
      .catch((err) => console.log(err));
  }

  function handleUnFollow() {
    post(`/${profileUser.username}/unfollow`, { currentUserId: currentUser.userId })
      .then(() => setFollowing(false))
      .catch((err) => console.log(err));
  }


  function getFollowStatus() {
    if (currentUser.userId === profileUser.userId) {
      return <span>This is you!</span>;
    }

    if (following) {
      return (
        <>
          <span>You are currently following this user.</span>
          {' '}
          <button className={classes.buttonAsLink} onClick={handleUnFollow} type="button">Unfollow user</button>
          .
        </>
      );
    }

    return (
      <>
        <span>You are not yet following this user.</span>
        {' '}
        <button className={classes.buttonAsLink} onClick={handleFollow} type="button">Follow user</button>
        .
      </>
    );
  }

  return (
    <>
      <h2>{`${username}'s Timeline`}</h2>
      { profileUser && currentUser ? <div className="followstatus">{ getFollowStatus() }</div> : null }
      <MessageList messages={messages} />
    </>
  );
}
