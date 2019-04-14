var express = require('express');
var router = express.Router();
var process = require('process');
var envConf = require('dotenv').config();
var { getUserInfo } = require('../data/data');

var githubOAuth = require('github-oauth')({
  githubClient: process.env.GITHUB_KEY,
  githubSecret: process.env.GITHUB_SECRET,
  baseURL: process.env.adress,
  loginURI: '/auth/github',
  callbackURI: '/auth/github/callback'
});

function checkAuth(req,res,next) {
  if (typeof req.cookies.token !== 'undefined') {
    next();
  } else {
    res.redirect("/auth/github");
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let view = {
    username: "",
    email: ""
  };
  return getUserInfo(req.cookies.token).then((response) => {
    view.username = response.data.viewer.login;
    view.email = response.data.viewer.email;
    res.render('index', { title: 'Express', elem: view });
    return;
  }).catch(() => {
    res.render('index', { title: 'Express', elem: view });
    return;
  });
});

router.get('/auth/github', function(req,res) {
  return githubOAuth.login(req,res);
});

router.get('/auth/github/callback', function(req,res) {
  return githubOAuth.callback(req,res);
});

githubOAuth.on('error', function(err) {
  console.error('there was a login error', err);
});

githubOAuth.on('token', function(token, serverResponse) {
  console.log(token.access_token);
  serverResponse.cookie('token', token.access_token);
  serverResponse.redirect(`/`);
});

module.exports = router;
