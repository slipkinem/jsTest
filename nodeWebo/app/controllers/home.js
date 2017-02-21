var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Post.find().populate('author').populate('category').exec(function (err, Posts) {
    return res.jsonp(Posts);
    if (err) return next(err);
    res.render('blog/index', {
      title: '吕森的博客',
      articles: Posts,
      pretty:true
    });
  });
});
router.get('/about', function (req, res, next) {
  Post.find(function (err, Posts) {
    if (err) return next(err);
    res.render('blog/index', {
      title: '关于我们',
      pretty:true
    });
  });
});
router.get('/contact', function (req, res, next) {
  Post.find(function (err, Posts) {
    if (err) return next(err);
    res.render('blog/index', {
      title: '联系我们',
      pretty:true
    });
  });
});

