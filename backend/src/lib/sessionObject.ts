
export const sessionObject = {
  secret: "some tough secret", // to sign the cookies
  saveUninitialized: false, // Not saving unmodified session storage. No need to save random user
  resave: false,  //if session data is not modified, why store?
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',   // true on prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" as 'none' | 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}


export const sessionObject2 = {
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  proxy: true, // Required for Heroku/Render/Vercel (behind a proxy)
  cookie: {
    secure: true, // Required for HTTPS on Vercel
    sameSite: 'none' as const, // Required if backend and frontend domains are different
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}

console.log(sessionObject.cookie.sameSite)