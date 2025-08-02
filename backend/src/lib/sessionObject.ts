export const sessionObject = {
  secret: "some tough secret", // to sign the cookies
  saveUninitialized: false, // Not saving unmodified session storage. No need to save random user
  resave: false,  //if session data is not modified, why store?
  cookie: { maxAge: 6000 * 60,     }
}