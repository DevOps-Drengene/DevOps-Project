import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import md5 from 'md5';

export default function MessageList({ messages }) {
  function getImage(email) {
    const cleanEmail = email.trim().toLowerCase();
    const hash = md5(cleanEmail);
    return `https://www.gravatar.com/avatar/${hash}?s=48`;
  }

  function formatDate(dateInMs) {
    const date = new Date(dateInMs);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`; // add leading zero if month < 10
    }
    const day = date.getDate();
    const hour = date.getHours();
    let minutes = date.getMinutes();
    if (minutes === 0) {
      minutes = '00';
    }

    // ex 2020-02-12 @ 10:39
    return `${year}-${month}-${day} @ ${hour}:${minutes}`;
  }

  return (
    <ul className="messages">
      { messages && messages.length > 0
        ? messages.map((msg) => (
          <li key={msg.username + msg.text + msg.pubDate}>
            <img src={getImage(msg.email)} alt={`Gravatar of ${msg.username}`} />
            <p>
              <strong><Link to={`/${msg.username}`}>{msg.username}</Link></strong>
              {` ${msg.text} `}
              <small>
                &mdash;
                {' '}
                {formatDate(msg.pubDate)}
              </small>
            </p>
          </li>
        ))
        : (
          <li>
            <em>There&apos;s no message so far.</em>
          </li>
        )}
    </ul>
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
};
