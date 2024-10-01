'use client'
// pages/chat.tsx

import {
  useRef,
  useEffect,
  useState,
  FormEvent,
  useCallback,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pusher from 'pusher-js';
import { FaUsers, FaCommentAlt, FaPaperPlane, FaComment } from 'react-icons/fa';

interface IUser {
  id: string;
  username: string;
  room: string;
}

interface IMessage {
  id: string;
  username: string;
  text: string;
  time: string;
}

const Users = ({ users }: { users: Array<IUser> }) => {
  return (
    <>
      <h3>
        <FaUsers size={18} /> Users
      </h3>
      <ul id="users">
        {users.map((user) => (
          <li key={user.username}>{user.username}</li>
        ))}
      </ul>
    </>
  );
};

const Message = ({
  username,
  text,
  time,
}: {
  username: string;
  text: string;
  time: string;
}) => {
  return (
    <>
      <p className="meta">
        {username} <span>{time}</span>
      </p>
      <p className="text">{text}</p>
    </>
  );
};

const Messages = ({ messages, refer }: { messages: Array<IMessage>; refer: any }) => {
  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <Message
          key={message.id}
          username={message.username}
          text={message.text}
          time={message.time}
        />
      ))}
      <div ref={refer} />
    </div>
  );
};

const Chat = () => {
  const router = useRouter();
  const inputMessageRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channel, setChannel] = useState<any>(null);

  const [message, setMessage] = useState('');


  const searchParams = useSearchParams()

  // const [room, setRoom] = useState(router.query.room || '');
  const room  = searchParams.get('room') || '';
  // const [username, setUserName] = useState(router.query.username || '');
  const username = searchParams.get('username') || '';

  const [users, setUsers] = useState<Array<IUser>>([]);
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDisconnect = useCallback(() => {
    if (channel) {
      channel.unsubscribe();
      pusher?.disconnect();
    }
    router.push('/');
  }, [channel, pusher]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (channel) {
      channel.trigger('client-chat-message', {
        username,
        text: message,
        time: new Date().toLocaleTimeString(),
      });
    }
    setMessage('');
    inputMessageRef.current?.focus();
  };

  useEffect(() => {
    if (!room || !username) return;

    const pusherInstance = new Pusher('2196236487965feaf7ea', {
      cluster: 'ap1',
    });
    const chatChannel = pusherInstance.subscribe(room as string);

    setPusher(pusherInstance);
    setChannel(chatChannel);

    // Listen for new users and messages
    chatChannel.bind('pusher:subscription_succeeded', (members: any) => {
      const updatedUsers = members.map((member: any) => ({
        id: member.id,
        username: member.info.username,
        room,
      }));
      setUsers(updatedUsers);
    });

    chatChannel.bind('client-chat-message', (newMessage: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    });

    return () => {
      handleDisconnect();
    };
  }, [room, username, handleDisconnect]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>
          <FaCommentAlt size={24} />
          HyperChat
        </h1>
        <button className="btn" onClick={handleDisconnect}>
          Leave Room
        </button>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <FaComment size={16} /> Room Name:
          </h3>
          <h2 id="room-name"> {room}</h2>

          <Users users={users} />
        </div>

        <Messages messages={messages} refer={messagesEndRef} />
      </main>
      <div className="chat-form-container">
        <form id="chat-form" onSubmit={handleFormSubmit}>
          <input
            ref={inputMessageRef}
            id="msg"
            value={message}
            type="text"
            placeholder="Enter Message"
            required
            autoComplete="off"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn">
            <FaPaperPlane size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
