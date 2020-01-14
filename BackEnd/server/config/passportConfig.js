const GoogleTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStraregy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET, googleAuth, facebookAuth } = require('./keys');
const User = require('../models/user.model');

module.exports = function (passport) {
  // JWT Strategy
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
  }, async (jwtPayload, done) => {
    try {
      // find user
      const user = await User.findById(jwtPayload.sub);

      // if no user is found
      if (!user) return done(null, false);
      done(null, user); // option to redirect to sign up page
    } catch (error) {
      done(error, false);
    }
  }));

  // Local Strategy
  passport.use(new LocalStraregy(
    {
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        const user = await User.findOne({ 'local.email': email });
        console.log(user)
        // if user is not found
        if (!user) return done(null, false);

        // get user password from db and perform comparison
        const isMatch = await user.matchPassword(password);
        // if passwords do not match return err
        if (!isMatch) return done(null, false, { error: 'passwords do not match' });
        // if passwords match return user
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  ));
  passport.use(new GoogleTokenStrategy(
    {
      clientID: googleAuth.clientID,
      clientSecret: googleAuth.clientSecret,
    }, (async (req, accessToken, profile, done) => {
      try {
        // check if user is already logged in
        if (req.user) {
          // merge google data to existin account
          req.user.method.push('google');
          req.user.google = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          };
          await req.user.save();
          return done(null, req.user);
        }

        // check if user already exists
        let existingUser = await User.findOne({ 'google.id': profile.id });
        // if user exists return the user
        if (existingUser) {
          console.log('user exists');
          return done(null, existingUser);
        }
        // check if the email exists
        existingUser = await User.findOne({
          $or: [
            { 'facebook.email': profile.emails[0].value },
            { 'local.email': profile.emails[0].value },
          ]
        });
        if (existingUser) {
          // merge google user data with existing user
          existingUser.method.push('google');
          existingUser.google = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          };
          existingUser.save();
          return done(null, existingUser);
        }
        // if user does not exist create a new user
        console.log('Creating new user...');
        const newUser = new User({
          method: 'google',
          google: {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          }
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    })
  ));
  passport.use('facebookToken', new FacebookTokenStrategy(
    {
      clientID: facebookAuth.clientID,
      clientSecret: facebookAuth.clientSecret
    }, async (req, accessToken, refreshToken, profile, done) => {
      try {
        // check if user already logged in
        if (req.user) {
          // merge google data to existin account
          req.user.method.push('facebook');
          req.user.facebook = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          };
          await req.user.save();
          return done(null, req.user);
        }
        // check if user already exists
        let existingUser = await User.findOne({ 'facebook.id': profile.id });
        // if user exists return the user
        if (existingUser) {
          console.log('user exists');
          return done(null, existingUser);
        }
        // check if the email exists
        existingUser = await User.findOne({
          $or: [
            { 'google.email': profile.emails[0].value },
            { 'local.email': profile.emails[0].value },
          ]
        });
        if (existingUser) {
          // merge facebook user data with existing user
          existingUser.method.push('facebook');
          existingUser.facebook = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          };
          existingUser.save();
          return done(null, existingUser);
        }
        // if user does not exist create a new user
        console.log('Creating new user...');
        const newUser = new User({
          method: 'facebook',
          facebook: {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          }
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  ));
};
