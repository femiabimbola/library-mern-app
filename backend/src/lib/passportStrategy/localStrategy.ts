import passport from 'passport'
import { Strategy } from 'passport-local'
import bcrypt from "bcryptjs"
import { findAUserByEmail, findAUserByID } from '../../database/model'


// The serialize function create the user object and stores it in the session.it get called during user sign in
passport.serializeUser((user:any, done) => {
  done(null, user.id)
})

// The deserialize function take the id from session, and find who the user is.it get called afteruser sign in and call other routes
passport.deserializeUser(async (id: string, done) => {
  try {
    const findUser = await findAUserByID(id) as User
    if (!findUser) throw new Error("user not found");
    done(null, findUser);
  } catch (error) {
    done(error, false);
  }
});


export default passport.use(
  new Strategy({usernameField:"email"}, async (username, password, done) =>{
    try{
    
      const findUser = await findAUserByEmail(username)
      if(!findUser) return done(null, false, { message: 'User is not found'})

      const passwordsMatch = await bcrypt.compare(password, findUser.password); 
      if(!passwordsMatch) return done(null, false, { message: 'Password does not match'})

      // The done has 3 arg! Check the docs
      done(null, findUser)
    }catch(error){
      done(error, false)
    }
  })
)