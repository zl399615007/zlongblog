var express = require('express');
var auth=require('../middleware/auth');
var models = require('../models');
var router = express.Router();

router.get('/add',auth.checkLogin,function(req,res){
    res.render('article/add',{title:'发表文章'});
});
router.post('/add',auth.checkLogin,function(req,res){
    var article=req.body;
    //把当前登录用户的ID赋给user
    article.user=req.session.user._id;
    models.Article.create(article,function(err,doc){
        if(err){
            req.flash('error','文章发表失败')
        }else {
            req.flash('success','文章发表成功');
            res.redirect('/');
        }
    });

});
module.exports = router;