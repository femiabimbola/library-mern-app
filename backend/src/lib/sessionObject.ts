
import dotenv from "dotenv"

dotenv.config()

export const sessionObject2 = {
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET!,
  saveUninitialized: false,
  resave: false,
  proxy: true, // Required for Heroku/Render/Vercel (behind a proxy)
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" as 'none' | 'lax',
    secure: process.env.NODE_ENV === 'production', 
    domain: process.env.NODE_ENV === 'production' ? '.vercel.com' : 'localhost',
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}

console.log(sessionObject2.secret)
console.log(sessionObject2.cookie.sameSite)