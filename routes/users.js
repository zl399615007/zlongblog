var express = require('express');
var modules=require('../moudels');
var util=require('../util');
var auth=require('../middleware/auth');

var router = express.Router();

/* GET users listing. */
//只用写
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



/*
* 用户注册
* */
router.get('/reg',auth.checkNotLogin,function (req,res) {
  res.render('user/reg',{title:'注册'});
});
/**
 * 当填写用户注册信息提交时处理
 */
router.post('/reg',auth.checkNotLogin,function (req,res,next) {
 //保存对象
    var user=req.body;
    if(user.password !=user.repassword){
        req.flash('error', '注册失败!');
        res.redirect('back');
    }
    else {
        req.body.password =util.md5(req.body.password);
        //增加一个用户头像 
        req.body.avatar ='https://secure.gravatar.com/avatar/'+util.md5(req.body.email)+'?s=48';
        modules.User.findOne({username:req.body.username,password:req.body.password},function (err,doc){//查找数据库，判断是否已经注册过
            if(err){
                req.flash('error', '注册失败!');
                res.redirect('back');
            }else {
                if(doc){
                    req.flash('error', '用户已经被注册!');
                    res.redirect('back');
                }else {
                    modules.User.create(req.body,function(err,doc){
                        req.flash('success', '注册成功!');
                        res.redirect('/users/login')
                    })
                }

            }

        });


    }


});



/**
 * 显示用户登录表单
 */
router.get('/login',auth.checkNotLogin,function (req,res) {
    res.render('user/login',{title:'登录'});
});
router.post('/login',auth.checkNotLogin,function (req,res) {
    req.body.password =util.md5(req.body.password)
    modules.User.findOne({username:req.body.username,password:req.body.password},function (err,doc) {
        if(err){
            req.flash('error', '登录失败!');
            res.redirect('back');
        }else {
            if(doc){//如果有值表示找到用户
                //如果登录成功后吧查询到的user用户赋给session的user属性
                req.session.user=doc;
                req.flash('success', '登录成功!');
                res.redirect('/');
           
            }else {//找不到，登录失败
                req.flash('error', '登录失败!');
                res.redirect('back');
            }
        }
    })
});

/**
 * 当填写用户登录信息提交时的处理
 */


/*
* 退出
* */
router.get('/logout',auth.checkLogin,function (req,res) {
    req.session.user=null;
    req.flash('success', '退出成功!');
    res.redirect('/');
});

module.exports = router;