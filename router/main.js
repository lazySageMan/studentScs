var express=require("express");
var User=require("../database/user.js");
var Sms=require("./alicloud");
var router=express.Router();
var resData;
var oldId;
var oldId1;
/**/
router.use(function(req,res,next){
    resData={
        code:0,
        message:''
    };
    next();
});
//学号和工号递增
router.use(function(req,res,next) {
    User.find({userType:"0"}).sort({userNum:-1}).limit(1).exec(function(err,data){
        /*console.log(data[0]);*/
        if(data[0]){
            /*console.log("存在");*/
            /*console.log(data[0].userNum);*/
            oldId=(parseInt(data[0].userNum)+1).toString();
        }else{
            /*console.log("不存在");*/
            oldId="20180000";
        }
    });
    next()
});
router.use(function(req,res,next) {
    User.find({userType:"1"}).sort({userNum:-1}).limit(1).exec(function(err,data){
        /*console.log(data[0]);*/
        if(data[0]){
            /*console.log("存在");*/
            /*console.log(data[0].userNum);*/
            oldId1=(parseInt(data[0].userNum)+1).toString();
        }else{
           /* console.log("不存在");*/
            oldId1="20186000";
        }
    });
    next()
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//登录
router.get("/",function(req,res,next){
    /*console.log(req.cookies.userInfo);*/
    res.render("main/index1");

});
router.post("/",function(req,res,next){
    /*console.log(req.body);*/
    User.findOne({userNum:req.body.userNum},function (err,data){
        if(!err && data){
            if( data.passWd == req.body.userPass ){
                res.cookie("userInfo",JSON.stringify({userType:data.userType,userNum:data.userNum}));
                //将userType,userNum写在cookie中
                if(data.userType=="0"){
                    //var user=JSON.stringify(userInfo);
                    /*res.clearCookie("userInfo",{path:"/"});*/
                    res.redirect("/student");
                }else if(data.userType=="1"){

                    res.redirect("/teacher");

                }else if(data.userType=="2"){
                    res.redirect("/admin");
                }
                //判断userType,并跳转到对应的路由
            }
        }else{
            resData.code=1;
            resData.message="账号不存在";
            res.json(resData);
            return;
        }
    })

});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//注册
router.get("/sign",function(req,res,next){
    res.render("main/sign");
});
router.post("/sign",function(req,res,next){
    /*console.log(req.body);*/
    if(req.body.userType=="0"){
        User.findOne({userPhone:req.body.userPhone},{userType:req.body.userType},function(err,userInfo){
            if(err){
                resData.code=1;
                resData.message="超时，请重试";
                res.json(resData);
                return;
            }else{
                if(userInfo){
                    resData.code=2;
                    resData.message="该电话已经注册了";
                    res.json(resData);
                    return;
                }else{
                    var newUser=new User({
                        userNum:oldId,
                        passWd:req.body.password,
                        userName:req.body.username,
                        userPhone:req.body.userPhone,
                        userType:req.body.userType,
                        userCode:null
                    });
                    /*User.remove({},function (err,data) {
                        !err ? console.log(data) : console.log(err);
                    });*/
                    newUser.save(function (err,data){
                        if(!err){
                            resData.code=0;
                            resData.message="注册成功";
                            resData.userNum=data.userNum;
                            resData.userType="0";
                            //便于做注册成功后的跳转
                            res.cookie("userInfo",JSON.stringify({userType:data.userType,userNum:data.userNum}));
                            res.json(resData);
                            /*console.log(data);*/
                        }else{
                            console.log(err);
                        }
                    });

                }
            }
        })
    }else{
        User.findOne({userName:req.body.username},{userType:req.body.userType},function(err,userInfo){
            if(err){
                resData.code=1;
                resData.message="超时，请重试";
                res.json(resData);
                return;
            }else{
                if(userInfo){
                    resData.code=2;
                    resData.message="存在姓名相同，请联系管理员";
                    res.json(resData);
                    return;
                }else{
                    var newUser=new User({
                        userNum:oldId1,
                        passWd:req.body.password,
                        userName:req.body.username,
                        userPhone:req.body.userPhone,
                        userType:req.body.userType
                    });
                    /*User.remove({},function (err,data) {
                        !err ? console.log(data) : console.log(err);
                    });*/
                    newUser.save(function (err,data){
                        if(!err){
                            resData.code=0;
                            resData.message="注册成功";
                            resData.userType="1";
                            resData.userNum=data.userNum;
                            res.cookie("userInfo",JSON.stringify({userType:data.userType,userNum:data.userNum}));
                            res.json(resData);
                            /*console.log(data);*/
                        }else{
                            console.log(err);
                        }
                    });

                }
            }
        })
    }

});
//发送验证码
router.post("/phone",function (req,res,next) {
    User.findOne({userPhone:req.body.userPhone}).then(function (data) {
        if(data){
            var Number=Math.ceil(Math.random()*1000000).toString();
            var signName="彭一高9595";
            Sms(req.body.userPhone,Number,signName);
            User.update({userPhone:req.body.userPhone},{userCode:Number}).then(function (value) {
                if(value){
                    res.json({
                        code:"0",
                        message:"发送成功"
                    });
                    var i=60;
                    var time=setInterval(function () {
                        i--;
                        if(i==0){
                            clearInterval(time);
                            User.update({userPhone:req.body.userPhone},{userCode:null}).then(function (value2) {
                                console.log(value2);
                            });
                        }
                    },1000)
                }
            });
        }
    })
});
//利用验证码登录
router.post("/identify",function (req,res,next){
   User.findOne({userPhone:req.body.userPhone}).then(function (data) {
       /*console.log(data);*/
       if(data.userCode==req.body.code){
           res.cookie("userInfo",JSON.stringify({userType:data.userType,userNum:data.userNum}));
           res.json({
               code:"0",
               message:"登录成功",
               userType:data.userType
           })
       }else{
           res.json({
               code:"1",
               message:"验证失败"
           })
       }
   })
});
//忘记密码
router.get('/forget',function(req,res,next){
   res.render("main/forget");
});
//利用验证码修改密码
router.post('/forget',function(req,res,next){
    console.log(req.body);
    User.findOne({userPhone:req.body.userPhone}).then(function (data){
        if(data.userCode==req.body.code){
            res.cookie("userInfo",JSON.stringify({userType:data.userType,userNum:data.userNum}));
            User.update({userPhone:req.body.userPhone},{passWd:req.body.passwd}).then(function (value) {
                if(value){
                    res.json({
                        code:"0",
                        message:"修改成功",
                        userType:data.userType,
                        passWd:req.body.passwd
                    })
                }
            })
        }else{
            res.json({
                code:"1",
                message:"验证失败"
            })
        }
    })
});
module.exports=router;