// lib/session.ts

import { createCookieSessionStorage } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: process.env.SESSION_SECRET || "dadroutes-session-2024-!~us",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
