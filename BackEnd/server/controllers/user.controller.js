const JWT = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET } = require('../config/keys');

const signToken = (user) => {
  return JWT.sign({
    iss: 'gathoni-k',
    sub: user.id,
    iat: new Date().getTime(),
  }, JWT_SECRET);
};

module.exports = {

  signup: async (req, res, next) => {
    // user info is in req.value.body(:routeHelpers.js)
    const { name, email, password } = req.value.body;
    // check if user exists
    const userExists = await User.findOne({ 'local.email': email });
    if (userExists) {
      res.status(403).json({
        success: 'false',
        message: 'Email already registered',
        user: userExists,
      });
    }
    // if email entered matches any other email in db
    const foundUser = await User.findOne({
      $or: [
        { 'google.email': email },
        { 'facebook.email': email },
      ]
    });
    console.log(foundUser);
    // if that email exists in the google part of the model
    if (foundUser) {
      // add the new local info to the user db
      foundUser.method.push('local');
      await foundUser.save();
      foundUser.local = { name, email, password };
      await foundUser.save();
      const token = signToken(foundUser);
      return res.json({
        success: 'false',
        message: 'Email added to account',
        user: foundUser,
        token
      });
    }
    // create and save user
    const newUser = new User({
      method: 'local',
      'local.name': name,
      'local.email': email,
      'local.password': password
    });
    await newUser.save();
    const token = signToken(newUser);
    console.log(token);
    res.json({
      success: 'true',
      message: 'signed up',
      user: req.user,
      token: `${token}`
    });
  },
  signin: async (req, res, next) => {
    const token = signToken(req.user);
    console.log(req.user)
    res.json({
      success: 'true',
      message: 'signed in',
      user: req.user,
      token: `${token}`
    });
  },
  googleOAuth: async (req, res, next) => {
    const token = signToken(req.user);
    res.json({
      success: 'true',
      message: 'signed in with google',
      user: req.user,
      token: `${token}`
    });
  },
  facebookOAuth: async (req, res, next) => {
    const token = signToken(req.user);
    res.json({
      success: 'true',
      message: 'signed in with facebook',
      user: req.user,
      token: `${token}`
    });
  },
  profile: async (req, res, next) => {
    console.log('user profile');
    res.json({ user : req.user });
  },
};
