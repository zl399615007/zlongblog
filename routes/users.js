var express = require('express');
var modules=require('../moudels');
var util=require('../util');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



/*
* 用户注册
* */
router.get('/reg',function (req,res) {
  res.render('user/reg',{title:'注册'});
});
/**
 * 当填写用户注册信息提交时处理
 */
router.post('/reg',function (req,res,next) {
 //保存对象
    var user=req.body;
    if(user.password !=user.repassword){
        res.redirect('back');
    }else {
        req.body.password =util.md5(req.body.password)
        modules.User.create(req.body,function(err,doc){

            res.redirect('/users/login')
        })
    }


})



/**
 * 显示用户登录表单
 */
router.get('/login',function (req,res) {
    res.render('user/login',{title:'登录'});
});
router.post('/login',function (req,res) {
    req.body.password =util.md5(req.body.password)
    modules.User.findOne({username:req.body.username,password:req.body.password},function (err,doc) {
        if(err){
            res.redirect('back');
        }else {
            if(doc){//如果有值表示找到用户
                //如果登录成功后吧查询到的user用户赋给session的user属性
                req.session.user=doc;
                res.redirect('/');
           
            }else {//找不到，登录失败
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
router.get('/logout',function (req,res) {
    req.session.user=null;
    res.redirect('/');
});

module.exports = router;