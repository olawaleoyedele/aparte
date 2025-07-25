// src/lib/withAuth.js
import jwt from 'jsonwebtoken';

export function withAuth(gssp) {
  return async (context) => {
    const { req } = context;
    
    // Get the token from cookies
    const token = req.cookies.token || null;
    
    if (!token) {
      return {
        redirect: {
          destination: '/login/agent',
          permanent: false,
        },
      };
    }

    try {
      // Verify the token using your JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      context.user = decoded;  // Store the decoded user info in context

      return await gssp(context);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return {
        redirect: {
          destination: '/login/agent',
          permanent: false,
        },
      };
    }
  };
}
