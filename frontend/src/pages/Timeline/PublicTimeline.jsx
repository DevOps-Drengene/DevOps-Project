import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import { get } from '../../helpers/http';

export default function PublicTimeline() {
  const [messages, setMessages] = useState([]);

  // componentDidMount
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    get('/public').then((res) => setMessages(res));
  });

  return (
    <>
      <h2>Public Timeline</h2>
      <MessageList messages={messages} />
    </>
  );
}
