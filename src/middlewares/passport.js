import passport from "passport";
import { Strategy } from "passport-local";
import GhStrategy from "passport-github2";
import jwt from "passport-jwt";
import User from "../dao/models/user.model.js";

export default function () {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    return done(null, user);
  });
  passport.use(
    "register", //nombre de la estrategia
    new Strategy( // la estrategia
      { passReqToCallback: true, usernameField: "mail" },
      async (req, username, password, done) => {
        try {
          let one = await User.findOne({ mail: username }); //en la linea 18 se configura como campo principal el mail por eso es lo mismo que la linea 22
          if (!one) {
            let user = await User.create(req.body);
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  passport.use(
    "login",
    new Strategy(
      { usernameField: "mail" },
      async (username, password, done) => {
        try {
          let one = await User.findOne({ mail: username });
          if (!one) {
            return done(null);
          } else {
            return done(null, one); // le ponga el nobre que le ponga SIEMPREinyecta al objeto de requerimineto una propiedad 'user'de forma que en req.user tengo los datos del usuario encontrado.
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "github",
    new GhStrategy(
      {
        clientID: process.env.GH_CLIENT_ID,
        clientSecret: process.env.GH_CLIENT_SECRET,
        callbackURL: process.env.GH_CB,
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          //console.log(profile);
          let user = await User.findOne({ mail: profile._json.login });
          if (user) {
            console.log("user:", user);
            done(null, user);
          } else {
            let one = await User.create({
              name: profile.username,
              photo: profile._json.avatar_url,
              mail: profile._json.login,
              password: profile.profileUrl,
            });
            console.log("one:", one);
            return done(null, one);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([
          (req) => req?.cookies["token"],
        ]),
        secretOrKey: process.env.SECRET_KEY,
      },
      async (payload, done) => {
        try {
          console.log(payload);
          let one = await User.findOne({ mail: payload.mail });
          if (one) {
            done(null, one); // done(null,one) INYECTA la propiedad req.user con los datos encontrados en one
          } else {
            done(null);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
}
