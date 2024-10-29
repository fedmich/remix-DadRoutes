// lib/session.ts
import session from 'express-session';

const sessionStore = new session.MemoryStore();

export const sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'your-secret', // Use a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 60 * 60 * 24 * 1000, // 1 day in milliseconds
  },
});

// Function to create a session
export const createSession = (user: { google_sub: string }, req: any) => {
  req.session.userId = user.google_sub; // Store user info in the session
};
