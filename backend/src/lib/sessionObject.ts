
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
    secure: process.env.NODE_ENV === 'production', 
    // sameSite: process.env.NODE_ENV === "production" ? ('none' as const) : ('lax' as const),
    sameSite: 'lax',
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" as 'none' | 'lax', 
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}

console.log(sessionObject2.secret)
console.log(sessionObject2.cookie.sameSite)