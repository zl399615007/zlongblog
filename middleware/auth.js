//必须登录之后才能访问
exports.checkLogin=function(req,res,next){
    if(req.session.user){
        next();
    }else {
        req.flash('error','必须登陆后才能访问');
        res.redirect('/users/login')
    }

};
//必须登录前访问
exports.checkNotLogin=function(req,res,next){
    if(req.session.user){
        req.flash('error','已登录，无法访问');
        res.redirect('/')
    }else {
        next();

    }
};