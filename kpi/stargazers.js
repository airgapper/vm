var GitHubApi = require('github');

var async = require('async');
var extend = require('extend');

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    timeout: 5000
});



if(process.env.GITHUB_USERNAME) {
  github.authenticate({
      type: "basic",
      username: process.env.GITHUB_USERNAME,
      password: process.env.GITHUB_PASSWORD
  });
      
  github.authorization.create({
      scopes: ["user", "user:email", "public_repo", "repo", "repo:status", "gist", "write:repo_hook", "admin:repo_hook"],
      note: "github<->asana for VirtKick, Inc.",
      note_url: "virtkick",
  }, function(err, res) {
      if (res.token) {
          //save and use res.token as in the Oauth process above from now on
          console.log(res.token);
          console.log("Use this as GITHUB_APIKEY");
      }
  });
  return;
}
if(!process.env.GITHUB_APIKEY) {
    console.log("You need to set GITHUB_USERNAME and GITHUB_PASSWORD to generate a token");
    return;
}

github.authenticate({
  type: "oauth",
  token: process.env.GITHUB_APIKEY
});

if(!process.env.GITHUB_REPO_USER) {
  console.log("You need to set GITHUB_REPO_USER environment variable");
  console.log("For example: GITHUB_REPO_USER=virtkick");
  return;
}

function wrapApiCall(apiCall) {
  return function(data, cb) {
    function doApiCallPage(page, cb) {
      apiCall(extend(true, {}, data, {
        per_page: 100,
        page: page,
        timeout: 10000
      }), function(err, data) {
        if(data && data.length == 100) {
          return doApiCallPage(page + 1, function(err, data2) {
            cb(err, data.concat(data2));
          });
        }
        cb(err, data);
      });
    }
    doApiCallPage(0, function(err, data) {
      if(err && err.code == 504) {
        console.log("Got timeout, retrying");
        return doApiCallPage(0, cb);
      }
      cb(err, data);
    });
  };
}



wrapApiCall(github.repos.getFromUser)({
    user:process.env.GITHUB_REPO_USER
  }, function(err, data) {

  var repoList = data.map(function(repo) {
    return repo.name;
  });

  processRepos(repoList);

});

function processRepos(repoList) {

  async.mapLimit(repoList, 5, function(repo, cb) {
    console.log("Doing", repo);

    wrapApiCall(github.repos.getStargazers)({
      user: process.env.GITHUB_REPO_USER,
      repo: repo
    }, cb);

  }, function(err, repos) {
    var users = {};
    if(err) {
      console.log(err);
      return;
    }

    repos.forEach(function(repo) {
      repo.forEach(function(user) {
        users[user.login] = 1;
      })
    });

    console.log(Object.keys(users).length);
  });



}



