var express=require("express");
var User=require("../database/user.js");
var Class=require("../database/class.js");
var Score=require("../database/score.js");
var back;
var router=express.Router();
router.use(function (req,res,next){
    back={
        userData:{},
        classData:{}
    };
    next();
});
router.get("/",function (req,res,next){
    /*Score.remove({}).then(function (data) {
        console.log(data);
    })*/
   if(req.cookies.userInfo){
       var userInfo=JSON.parse(req.cookies.userInfo);
       if(userInfo.userType=="1"){
           User.findOne({userNum:userInfo.userNum,userType:userInfo.userType}).then(function (data){
               back.userData={
                   userNum:data.userNum,
                   userName:data.userName,
                   userPhone:data.userPhone
               };
               Class.find({teacherNum:userInfo.userNum}).then(function (data){
                   back.classData=data;
                   /*console.log(back);*/
                   console.log(`老师工号：${userInfo.userNum}登陆了`);
                   res.render("content/teacher",{userData:back});
               });


           })
           /*console.log(`老师工号：${userInfo.userNum}登陆了`);
           res.render("content/teacher");*/
       }else{
           res.render("content/error",{data:"404 Not-Found",warn:"想越权，干死你呀！信不信",url:"/"});
       }
   }else{
       res.render("content/error",{data:"404 Not-Found",warn:"登录都不登录，想上我，跟你说你完了，而且完的很彻底，你的ip我已经纪录了",url:"/"});
   }
});
//退出
router.get("/out",function(req,res,next){
    res.clearCookie("userInfo",{path:"/"});
    res.redirect("/");
});
//查看所有对应老师的课程的学生
router.get("/check",function (req,res,next){
    Score.find({classId:req.query.classId}).then(function (data){
        /*console.log(data);*/
        res.render("content/teacher1",{data:data});
    })
});
//修改对应的学生的信息
router.post("/mark",function (req,res,next){
    if(parseInt(req.body.reviseScore)<=100 && parseInt(req.body.reviseScore)>=0){
        Score.update({classId:req.body.scoreId,studentNum:req.body.studentNum},{score:req.body.reviseScore}).then(function (data) {
            /*console.log(data);*/
            res.json({
                code:"0",
                message:"修改成功"
            });
        })
    }else{
        res.json({
            code:"1",
            message:"请正确修改成绩"
        })
    }

});
//修改信息
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
