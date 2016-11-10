var express = require('express'); //加载node_modules下的express模块
var path = require('path');//处理路径的 path.join path.resolve
var favicon = require('serve-favicon');//处理收藏夹图标
var logger = require('morgan');//写日志
var cookieParser = require('cookie-parser');//解析cookie  req.cookies属性存放着客户端提交过来的cookie；req.cookie(key,value)向客户端写入cookie
var bodyParser = require('body-parser');//处理请求体 req.body属性，用来存放请求体
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);


var routes = require('./routes/index');//主页路由
var users = require('./routes/users');//用户路由
var articles=require('./routes/articles');



var app = express(); //生成一个express实例app（函数）
app.use('/articles',articles);
// view engine setup
app.set('views', path.join(__dirname, 'views'));//设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('view engine', 'html'); //设置视图模板引擎为 html。
//指定html模板的渲染方法
app.engine('html',require('ejs').__express)
var config=require('./config');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));设置/public/favicon.ico为favicon图标。
app.use(logger('dev'));//加载日志中间件。
app.use(bodyParser.json());//加载解析json的中间件。
app.use(bodyParser.urlencoded({ extended: false }));//加载解析urlencoded请求体的中间件。
app.use(cookieParser());//加载解析cookie的中间件。
app.use(session({
  secret:'zl',
  resave:true,//每次响应结束后都保存一下session数据
  saveUninitialized:true,//保存新创建但未初始化的session
  store:new MongoStore({
    url:config.dbUrl
  })

}));
app.use(function(req,res,next){
  res.locals.user=req.session.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));//设置public文件夹为存放静态文件的目录。

app.use('/', routes);//根目录的路由
app.use('/users', users);//用户路由
app.use('/articles',articles);//文章路由

// catch 404 and forward to error handler  捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers 错误处理器

// development error handler 开发环境下的错误处理
// will print stacktrace 将打印出堆栈信息
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler  生产环境下的错误处理
// no stacktraces leaked to user  不向用户暴露堆栈信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app; //导出app供 bin/www 使用
