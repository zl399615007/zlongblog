var express = require('express');
var auth=require('../middleware/auth');
var router = express.Router();

router.get('/add',auth.checkLogin,function(req,res){
    res.render('article/add',{title:'发表文章'});
});
router.post('/add',function(req,res){

});
module.exports = router;