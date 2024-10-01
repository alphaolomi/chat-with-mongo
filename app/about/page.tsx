import React from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <main className="join-main">
      <div className="form-control">
        <Link href="/">Back</Link>
        <h1>About</h1>
        <br />
        <p>Version: 1.0.0</p>
      </div>
    </main>
  );
}
