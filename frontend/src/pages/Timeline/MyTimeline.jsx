import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Redirect } from 'react-router-dom';
import MessageList from './MessageList';
import { UserContext } from '../../helpers/UserContext';
import { get, post } from '../../helpers/http';

export default function MyTimeline() {
  const { currentUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // componentDidMount
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    if (currentUser) {
      get(`/timeline/${currentUser.userId}`).then((res) => setMessages(res));
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    post('/add_message', { currentUserId: currentUser.userId, newMessage })
      .then((res) => {
        setNewMessage('');
        setMessages(res);
      });
  }

  function handleMessage(e) {
    setNewMessage(e.target.value);
  }

  function renderOrRedirect() {
    if (currentUser) {
      return (
        <>
          <div className="twitbox">
            <h3>
              {`What's on your mind ${currentUser.username} ?`}
            </h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="text" size="60" value={newMessage} onChange={handleMessage} />
              <input type="submit" value="Share" />
            </form>
          </div>
          <MessageList messages={messages} />
        </>
      );
    }

    return <Redirect to="/public" />;
  }

  return renderOrRedirect();
}
