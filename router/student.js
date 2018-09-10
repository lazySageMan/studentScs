var express=require("express");
var User=require("../database/user.js");
var Class=require("../database/class.js");
var Score=require("../database/score.js");
var back;
var router=express.Router();
router.use(function (req,res,next){
    back={
        userData:{},
        classData:{},
        scoreData:{
            score:[],
            score1:[]
        }
    };
    /*Score.remove({}).then(function (data) {
        console.log(data);
    })*/
    next();
});
//登录
router.get('/',function(req,res,next){
   if(req.cookies.userInfo){
      var userInfo=JSON.parse(req.cookies.userInfo);
      var arr=[];
      if(userInfo.userType=="0"){
          User.findOne({userNum:userInfo.userNum},function (err,data){
              //查询用户信息
              !err && data ? back.userData=data : back.userData=null;

          });
         /* Score.remove({}).then(function (data){
              console.log(data);
          });*/

          Score.find({studentNum:userInfo.userNum}).then(function(data){
              data.forEach(function (a,b,c) {
                  arr.push(a.classId);
                  if(a.score==null){
                      back.scoreData.score.push(a);//将有成绩的和没有成绩分开
                  }else{
                      back.scoreData.score1.push(a);
                  }
              });
              /*console.log(arr);*/
              Class.find({}).then(function(data){
                  /*console.log(data);*/
                  for(var i=0;i<data.length;i++){//如果该学生选了某门课就在选课中,剔除该课
                      for(var j=0;j<arr.length;j++){
                          if(data[i].classId==arr[j]){
                              data.splice(i,1);
                          }
                      }
                  }
                  /*console.log(back.scoreData);*/
                  data ? back.classData=data : back.classData=null;
                  console.log(`学生学号：${userInfo.userNum}登陆了`);
                  res.render("content/student",{userData:back});

              });
          });
      }else{
          res.render("content/error",{data:"404 Not-Found",warn:"想越权，干死你呀！信不信",url:"/"});
      }
   }else{
       res.render("content/error",{data:"404 Not-Found",warn:"登录都不登录，想上我，跟你说你完了,而且完的很彻底，你的ip我已经纪录了",url:"/"});
   }
});
//退出
router.get("/out",function(req,res,next){
    res.clearCookie("userInfo",{path:"/"});
    res.redirect("/");
});
//选课
router.get("/add",function (req,res,next){
    /*console.log(req.query);*/
    Class.findOne({classId:req.query.classId}).then(function(data){
        User.findOne({userNum:req.query.userNum}).then(function (data){
            var userNAME="";
            return userNAME=data.userName;
        }).then(function (value) {
            var score=new Score({
                classId:req.query.classId,
                className:data.className,
                teacherName:data.teacherName,
                studentName:value,
                studentNum:req.query.userNum,
                score:null
            });
            score.save().then(function (data){
                console.log(data);
                res.render("content/success",{data:"选课成功",url:"/student"});
            })
        });

    });
});
//退课
router.get("/close",function (req,res,next){
   Score.remove({classId:req.query.classId,studentNum:req.query.studentNum}).then(function (data){
       res.render("content/success",{data:"选课成功",url:"/student"});
   })
});
//修改个人信息
router.post("/revise",function (req,res,next){
   if(req.body.revisePhone.length==11){
       User.update({userNum:req.body.userNum},{userPhone:req.body.revisePhone}).then(function (value) {
           console.log(value);
           res.json({
               code:"0",
               message:"跟换成功"
           })
       })
   }else{
       res.json({
           code:"1",
           message:"跟换失败，请正确填写号码"
       })
   }
});
module.exports=router;