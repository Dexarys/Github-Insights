var Chart = require('chart.js');

const BaseController = require('./BaseController');
const { getUserInfo, traitementOrga, traitementUser } = require('../data/Data');


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
    console.log(`There was a login error : ${err}`);
});
githubOAuth.on('token', (req, res) => {
    res.cookie('token', req.access_token);
    res.redirect('/');
});

class ViewController extends BaseController {

    registerRoutes() {
        this.router.route('/').get(this.checkAuth, this.userInfos.bind(this));
        this.router.route('/traitementOrga').get(this.checkAuth, this.orgaInfos.bind(this));
        this.router.route('/auth/github').get(this.githubOAuth.bind(this));
        this.router.route('/auth/github/callback').get(this.githubOAuthCallback.bind(this));
    }

    checkAuth(req, res, next) {
        if (typeof req.cookies.token !== 'undefined') {
            next();
        } else {
            res.redirect('/auth/github');
        }
    }

    githubOAuth(req, res) {
        return githubOAuth.login(req, res);
    }

    githubOAuthCallback(req, res) {
        return githubOAuth.callback(req, res);
    }

    userInfos(req, res) {
        let user = {
            username: "",
            avatarUrl: "",
            name: "",
            bio: "",
            location: "",
            followerNumber: "",
            followingNumber: "",
            projectsNumber: "",
            repositoriesNumber: ""
        };

        var statsLanguageLabels = [];
        var statsLanguages = [];
        var statsOwnerLabels = [];
        var statsOwners = [];
        var nombreStars = 0;

        getUserInfo(req.cookies.token).then((response) => {
            user.username = response.data.viewer.login;
            user.name = response.data.viewer.name;
            user.avatarUrl = response.data.viewer.avatarUrl;
            user.bio = response.data.viewer.bio;
            user.location = response.data.viewer.location;
            user.followerNumber = response.data.viewer.followers.totalCount;
            user.followingNumber = response.data.viewer.following.totalCount;
            user.projectsNumber = response.data.viewer.projects.totalCount;
            user.repositoriesNumber = response.data.viewer.repositories.totalCount;

            var j = 0;
            var k = 0;

            traitementUser(req.cookies.token).then((response) => {
                for (var i = 0; i < response.length; i++) {
                    nombreStars = nombreStars + response[i].stargazers.totalCount;
                    if (response[i].primaryLanguage) {

                        var name = response[i].primaryLanguage.name;
                        var owner = response[i].owner.login;

                        console.log(name);
                        console.log(owner);

                        if (statsLanguageLabels.indexOf(name) == -1) {
                            statsLanguages[j] = 1;
                            statsLanguageLabels[j] = name;
                            j++;
                        }
                        else {
                            statsLanguages[statsLanguageLabels.indexOf(name)] = statsLanguages[statsLanguageLabels.indexOf(name)] + 1;
                        }

                        if (statsOwnerLabels.indexOf(owner) == -1) {
                            statsOwners[k] = 1;
                            statsOwnerLabels[k] = owner;
                            k++;
                        }
                        else {
                            statsOwners[statsOwnerLabels.indexOf(owner)] = statsOwners[statsOwnerLabels.indexOf(owner)] + 1;
                        }
                    }
                }

                console.log(response);

                res.render('userInfos', {
                    title: "Home",
                    username: user.username,
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                    bio: user.bio,
                    location: user.location,
                    followerNumber: user.followerNumber,
                    followingNumber: user.followingNumber,
                    projectsNumber: user.projectsNumber,
                    repositoriesNumber: user.repositoriesNumber,
                    statsLanguages: statsLanguages,
                    statsLanguageLabels: statsLanguageLabels,
                    statsOwners: statsOwners,
                    statsOwnerLabels: statsOwnerLabels,
                    stars: nombreStars,
                });
            }).catch(() => {
                console.log('Error while fetching user repositories');
            });

        }).catch(() => {
            res.render('userInfos', {
                title: "Home",
                username: user.username,
                name: user.name,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                location: user.location,
                followerNumber: user.followerNumber,
                followingNumber: user.followingNumber,
                projectsNumber: user.projectsNumber,
                repositoriesNumber: user.repositoriesNumber,
                statsLanguages: statsLanguages,
                statsLanguageLabels: statsLanguageLabels,
                statsOwners: statsOwners,
                statsOwnerLabels: statsOwnerLabels,
            });
        });
    }

    orgaInfos(req, res) {
        let organization = req.query.organization;
        let orga = {
            name: "",
            description: "",
            location: "",
            avatarUrl: "",
            repositoriesNumber: "",
            projectsNumber: "",
        }
        let user = {
            name: "",
            username: "",
            avatarUrl: ""
        }
        if (!organization) {
            res.status(400).end('{"error" : orga parameter required !}');
        }
        traitementOrga(req.cookies.token, organization).then((response) => {
            console.log(response);

            res.render('orgaInfos', {
                title: 'Home'
            });
        }).catch(() => {
            console.log('Error fetching elements');
            res.redirect('/');
        });
    }


}

module.exports = ViewController;
