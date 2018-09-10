//2018/05/07 --by lazySage

//引用模块
var express=require("express");
var mongoose=require("mongoose");
var cookieParser=require("cookie-parser");
var bodyParser=require("body-parser");
var swig=require("swig");
var main=require("./router/main");
var admin=require("./router/admin");
var student=require("./router/student");
var teacher=require("./router/teacher");
//创建服务app
var app=express();
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
swig.setDefaults({cache:false});
app.use(cookieParser("cookies"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//静态资源开发
app.use('/publick',express.static(__dirname+'/publick'));
//分路由开发
app.use('/',main);
app.use('/admin',admin);
app.use("/student",student);
app.use("/teacher",teacher);

//数据库连接
mongoose.connect('mongodb://localhost:27017/student',function(err){
   if(err){
      console.log("警告！数据库连接失败");
   }else{
      console.log("数据库已经连接成功");
      app.listen(8888);
   }
});
