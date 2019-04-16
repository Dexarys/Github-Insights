var express = require('express');
var router = express.Router();
var process = require('process');
var envConf = require('dotenv').config();
var { getUserInfo, traitement } = require('../data/data');

// API Auth Github
var githubOAuth = require('github-oauth')({
  githubClient: process.env.GITHUB_KEY,
  githubSecret: process.env.GITHUB_SECRET,
  baseURL: process.env.adress,
  loginURI: '/auth/github',
  callbackURI: '/auth/github/callback',
  scope: 'repo read:org read:user'
});

var scopes = "";

function checkAuth(req,res,next) {
  if (typeof req.cookies.token !== 'undefined' && scopes === "read:org,read:user,repo") {
    next();
  } else {
    res.redirect("/auth/github");
  }
}

/* GET home page. */
router.get('/', checkAuth, function(req, res, next) {
  let view = {
    username: "",
    avatarUrl: ""
  };
  getUserInfo(req.cookies.token).then((response) => {
    view.username = response.data.viewer.login;
    view.avatarUrl = response.data.viewer.avatarUrl;
    res.render('index', { title: 'Express', username: view.username, avatarUrl: view.avatarUrl });
  }).catch(() => {
    res.render('index', { title: 'Express', username: "", avatarUrl: "" });
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
  console.log(token);
  scopes = token.scope;
  serverResponse.cookie('token', token.access_token);
  // ajouter le token en base et créer un ID associé
  serverResponse.redirect(`/`);
});


router.get('/traitementOrga', checkAuth, function(req,res) {
  organization = req.query.organization;
  username = req.query.username;
  if (!organization) {
    res.status(400).end('{"error" : orga parameter required!}')
  }
  traitement(req.cookies.token,organization,username).then((response) => {
    res.render('index', { title: 'Express', username: "reussi", avatarUrl: "" });
    console.log(JSON.stringify(response));
  }).catch(() => {
    res.render('index', { title: 'Express', username: "erreur", avatarUrl: "" });
  });
});

module.exports = router;
