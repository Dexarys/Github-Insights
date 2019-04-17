var express = require('express');
var router = express.Router();
var envConf = require('dotenv').config();
var { getUserInfo, traitement } = require('../data/data');
var { initConnection } = require('../data/bdd');


var connectionBdd = initConnection();

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
var username = "";
var avatarUrl = "";

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
    avatarUrl: "",
    name: ""
  };
  getUserInfo(req.cookies.token).then((response) => {
    view.name = response.data.viewer.name;
    view.username = response.data.viewer.login;
    view.avatarUrl = response.data.viewer.avatarUrl;
    res.render('index', { title: 'Express',name: view.name, username: view.username, avatarUrl: view.avatarUrl });
  }).catch(() => {
    res.render('index', { title: 'Express', name: "", username: "", avatarUrl: "" });
  });
});

/* test */

router.get('/test', checkAuth, function(req, res, next) {
  let view = {
    username: "",
    avatarUrl: "",
    name: ""
  };
  getUserInfo(req.cookies.token).then((response) => {
    view.name = response.data.viewer.name;
    view.username = response.data.viewer.login;
    view.avatarUrl = response.data.viewer.avatarUrl;
    res.render('home/home', { title: 'Express',name: view.name, username: view.username, avatarUrl: view.avatarUrl });
  }).catch(() => {
    res.render('home/home', { title: 'Express', name: "", username: "", avatarUrl: "" });
  });
});

/* test */


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
  }).catch(() => {
    res.render('index', { title: 'Express', username: "erreur", avatarUrl: "" });
  });
});

module.exports = router;
