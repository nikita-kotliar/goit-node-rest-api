import passport from "passport";
import passportJWT from "passport-jwt";
import User from "../models/User.js"; 
import "dotenv/config"; 

const secret = process.env.SECRET; //import SECRET from .env
const ExtractJWT = passportJWT.ExtractJwt; //import ExtractJWT from "passport-jwt"
const Strategy = passportJWT.Strategy; //import Strategy from "passport-jwt"

const options = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
export default passport;
