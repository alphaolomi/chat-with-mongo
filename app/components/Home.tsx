'use client'
// pages/index.tsx

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSmile } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (username && room) {
      // Navigate to the chat page with username and room as query params
      router.push(`/chat?username=${username}&room=${room}`);
    }
  };

  return (
    <div className="join-container">
      <header className="join-header">
        <h1>
          <FaSmile /> HyperChat
        </h1>
        <Link href="/about">About</Link>
      </header>
      <main className="join-main">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="room">Room</label>
            <input
              type="text"
              name="room"
              id="room"
              placeholder="Room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Join Room
          </button>
        </form>
      </main>
    </div>
  );
}
