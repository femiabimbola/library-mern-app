
export const sessionObject = {
  secret: "some tough secret", // to sign the cookies
  saveUninitialized: false, // Not saving unmodified session storage. No need to save random user
  resave: false,  //if session data is not modified, why store?
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',   // true on prod
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: 5000 * 60 * 60 , // 1 week
    // Do NOT set domain unless both are subdomains of same parent (e.g. app.example.com & api.example.com)
    // domain: '.example.com' // only if you control both on same domain
  }
}