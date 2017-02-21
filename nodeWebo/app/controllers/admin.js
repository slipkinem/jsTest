/**
 * Created by slipkinem on 2016/8/31.
 */
var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post');

module.exports = function (app) {
  app.use('/admin', router);
};
router.get('/', function (req, res, next) {
  Post.find(function (err, Posts) {
    if (err) return next(err);
    res.render('admin/index', {
      title: '后台管理系统',
      articles:Posts
    });
  });
});
