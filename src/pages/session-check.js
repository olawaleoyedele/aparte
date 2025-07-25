import React from 'react';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';

export default function SessionCheck({ email, role }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🔍 Session Check</h1>

      {email ? (
        <>
          <p>✅ Logged in</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> {role}</p>
        </>
      ) : (
        <p>❌ Not logged in</p>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  const token = cookies.token;

  if (!token) {
    return { props: { email: null, role: null } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      props: {
        email: decoded.email || null,
        role: decoded.role || null,
      },
    };
  } catch (err) {
    console.error('Session-check JWT verify failed:', err);
    return {
      props: { email: null, role: null },
    };
  }
}
