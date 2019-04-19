const BaseController = require('./BaseController');
const { getUserInfo } = require('../data/Data');


const githubOAuth = require('github-oauth')({
    githubClient: process.env.GITHUB_KEY,
    githubSecret: process.env.GITHUB_SECRET,
    baseURL: process.env.adress,
    loginURI: '/auth/github',
    callbackURI: '/auth/github/callback',
    scope: 'repo read:org read:user'
});

// Evenement Github

githubOAuth.on('error', (err) => {
    this.logger.error(`There was a login error : ${err}`);
});
githubOAuth.on('token', (req, res) => {
    res.cookie('token', req.access_token);
});

class ViewController extends BaseController {

    registerRoutes() {
        this.router.route('/').get(this.checkAuth, this.index.bind(this));
        this.router.route('/test').get(this.checkAuth, this.test.bind(this));
        this.router.route('/auth/github').get(this.githubOAuth.bind(this));
        this.router.route('/auth/github/callback').get(this.githubOAuthCallback.bind(this));
    }

    checkAuth(req,res,next) {
        if (typeof req.cookies.token !== 'undefined') {
            next();
        } else {
            res.redirect('/auth/github');
        }
    }

    index(req, res) {
        let view = {
          username: "",
          avatarUrl: "",
          name: ""
        };
        getUserInfo(req.cookies.token).then((response) => {
            view.username = response.data.viewer.login;
            view.name = response.data.viewer.name;
            view.avatarUrl = response.data.viewer.avatarUrl;
            res.render('index', { title: "Home", username: view.username, name: view.name, avatarUrl: view.avatarUrl });
        }).catch(() => {
            res.render('index', { title: "Home", username: view.username, name: view.name, avatarUrl: view.avatarUrl });
        });
    }

    test(req,res) {
        const test = ViewUtil.getViews().TEST;
        res.render(test.name, test.properties);
    }

    githubOAuth(req,res) {
        return githubOAuth.login(req,res);
    }

    githubOAuthCallback(req,res) {
        return githubOAuth.callback(req,res);
    }


}

module.exports = ViewController;
