var express = require('express');
var markdown = require('markdown').markdown;
var models = require('../models');
//调用Router方法生成一个路由的实例
var router = express.Router();

/**
 * path 指定路径
 * listener 指定回调监听函数
 */
/**
 * 分页 传参 当前页码 每页的条数
 * 结果 当页的数据 一共多少页 当前页码 每页的条数
 */
router.get('/', function(req, res, next) {
  //user 字符串 对象 user.avatar
  //先查找 然后把user字符串转成user对象
  var keyword = req.query.keyword;//取出查询关键字
  var search = req.query.search;//取出查询按钮
  var pageNum = parseInt(req.query.pageNum)||1;//当前页码
  var pageSize = parseInt(req.query.pageSize)||2;//一页有多少条数据

  var queryObj = {};
  if(search){// 如果search有值，提交过来的
    req.session.keyword = keyword;
  }
  keyword = req.session.keyword;//我们keyword就从session就可以了
  var reg = new RegExp(keyword,'i');
  queryObj = {$or:[{title:reg},{content:reg}]};
  models.Article.find(queryObj).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
    articles.forEach(function(article){
      article.content = markdown.toHTML(article.content);
    });
    //取得这个条件有多少条符合的数据
    models.Article.count(queryObj,function(err,count){
      res.render('index', {
        articles: articles,
        totalPage:Math.ceil(count/pageSize),
        keyword:keyword,
        pageNum:pageNum,
        pageSize:pageSize
      });
    })
  });
});

module.exports = router;
