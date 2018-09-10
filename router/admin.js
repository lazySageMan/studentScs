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
        scoreData:{}
    };
    next();
});
//登录
router.get("/",function (req,res,next){
    if(req.cookies.userInfo){
        var userInfo=JSON.parse(req.cookies.userInfo);
        if(userInfo.userType=="2"){
            console.log(`管理员登陆了`);
            User.find({userType:"0"},function(err,data){
                !err ? back.userData.student=data : back.userData.student=null;
                User.find({userType:"1"},function (err,data) {
                    !err ? back.userData.teacher=data : back.userData.teacher=null;
                    Class.find({},function(err,data){
                        !err ? back.classData=data : back.classData=null;
                        res.render("content/admin",{userData:back});
                    })
                });
            });
        }else{
            res.render("content/error",{data:"404 Not-Found",warn:"想越权，干死你呀！信不信",url:"/"});
        }
    }else{
        res.render("content/error",{data:"404 Not-Found",warn:"登录都不登录，想上我，跟你说你完了而且完的很彻底，你的ip我已经纪录了",url:"/"});
    }
});
//退出
router.get("/out",function(req,res,next){
    res.clearCookie("userInfo",{path:"/"});
    res.redirect("/");
});
//开设选课
router.post("/add",function(req,res,next){
    /*console.log(req.body);*/
    User.findOne({userType:"1",userNum:req.body.teacherNum,userName:req.body.teacherName},function (err,data){
        /*console.log(data);*/
        var newClass= new Class({
            classId:req.body.classNum,
            teacherNum:req.body.teacherNum,
            teacherName:req.body.teacherName,
            className:req.body.className
        });
        newClass.save(function (err,data) {
            console.log(data)
            res.render("content/success",{data:"选课成功",url:"/admin"});
        })
    })
});
//查看对应的课程的学生
router.get("/check",function (req,res,next){
    Score.find({classId:req.query.classId}).then(function (data){
        /*console.log(typeof data);*/
        if(data.length==0){
            res.render("content/success",{data:"该课程没有学生选课,请通知学生选课",url:"/admin"});
        }else{
            res.render("content/admin1",{scoreData:data});
        }

    })
    /*res.render("/content/admin1",{})*/
});
//给学生修改成绩
router.post("/score",function(req,res,next){
    Score.update({classId:req.body.classId,studentNum:req.body.studentNum},{score:req.body.resizeScore}).then(function (data) {
        res.json({
            code:"0",
            message:"修改成功"
        })
    })
});
//给学生选课
router.post("/give",function (req,res,next){
    Score.findOne({studentNum:req.body.studentNum},function (err,data) {
        if(!err && data){
            res.json({
                code:"1",
                message:"学生已经选了该课程"
            })
        }else{
            User.findOne({userNum:req.body.studentNum,userType:"0"}).then(function (data) {
                if(data.userName==req.body.studentName){
                    Class.findOne({classId:req.body.classId}).then(function (data) {
                        var score= new Score({
                            classId:data.classId,
                            className:data.className,
                            teacherName:data.teacherName,
                            studentName:req.body.studentName,
                            studentNum:req.body.studentNum,
                            score:null

                        });
                        score.save(function (err,data) {
                            if(!err){
                                res.json({
                                    code:"0",
                                    message:"选课成功"
                                })
                            }
                        })
                    })
                }
            })
        }
    });
});
//为学生退课
router.post("/goOut",function (req,res,next){
    Score.remove({classId:req.body.classId,studentNum:req.body.studentNum}).then(function (data) {
        res.json({
            code:"0",
            message:"退课成功"
        })
    })
});
//删除学生
router.post("/stu/delete",function (req,res,next){
    //查询学生对应的成绩删除
    Score.remove({studentNum:req.body.userNum},function (err,data) {
        if(!err){
            User.remove({userNum:req.body.userNum}).then(function (data){
                res.json({
                    code:"0",
                    message:"删除成功"
                })
            });
        }else{
            console.log(err);
        }

    });
});
//删除老师
router.post("tea/delete",function (req,res,next){
    //查询老师对应的课程删除
    Class.remove({teacherNum:req.body.userNum},function (err,data) {
        if(!err){
            User.remove({userNum:req.body.userNum}).then(function (data){
                res.json({
                    code:"0",
                    message:"删除成功"
                })
            });
        }else{
            console.log(err);
        }
    });
});
//解除课程
router.post("/cls/delete",function (req,res,next) {
   Score.remove({classId:req.body.classId},function (err,data) {
       if(!err){
           Class.remove({classId:req.body.classId}).then(function (data){
               res.json({
                   code:"0",
                   message:"解除成功"
               })
           })
       }
   })
});
module.exports=router;