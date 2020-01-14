
const router = require('express-promise-router')();

const passport = require('passport');
require('../config/passportConfig')(passport);
const user = require('../controllers/user.controller');
const { validateBody, schemas } = require('../helpers/routeHelpers');

// sigup
router.post('/signup', validateBody(schemas.authSchema), user.signup);
// signin
router.post('/signin', validateBody(schemas.authSchema), passport.authenticate('local', { session: false }), user.signin);

router.post('/auth/google/token', passport.authenticate('google-token', { scope: ['profile', 'https://www.googleapis.com/auth/userinfo.profile'], session: false }), user.googleOAuth);

router.post('/auth/facebook/token', passport.authenticate('facebookToken', { session: false }), user.facebookOAuth);

// profile
router.get('/profile', passport.authenticate('jwt', { session: false }), user.profile);

module.exports = router;
