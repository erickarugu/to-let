require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const googleAuth = {
  clientID: '158974883118-s2rum5t6c18bu3esjeiujuju4d6rkj2f.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
};
const facebookAuth = {
  clientID: '2543868832545716',
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET
};
module.exports = { JWT_SECRET, googleAuth, facebookAuth };
