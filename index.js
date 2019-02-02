const express = require('express');
const app = express();
const passport = require('passport');

require('dotenv').config();

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.sendFile('auth.html', {
    root: __dirname
  });
});

app.get('/success', (req, res) => {
  res.send('You have successfully logged in');
});

app.get('/error', (req, res) => {
  res.send('error loggin in');
});

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, obj);
});

// FACEBOOK auth
const FacebookStrategy = require('passport-facebook').Strategy;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback'
}, function (accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/error'
}), function(req, res) {
  res.redirect('/success');
});

// GITHUB auth
const GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
}, function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}));

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/error'
}), function(req, res) {
  res.redirect('/success');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('App listening on port ' + port));
