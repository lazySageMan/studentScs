//time 2018/05/09
window.onload=function(){

    function M(n){
        var first=n.substr(0,1),
            isArr=n.split(' ');
        if(first=="#" && isArr.length==1){
            return document.querySelector(n);
        }else{
            var arr=Array.from(document.querySelectorAll(n));
            return arr.length==1?arr[0]:arr;
        }
    }

    function hasClass(ele,cls){
        var re=new RegExp(`\\b${cls}\\b`);
        if(re.test(ele.className)){
            return true;
        }else{
            return false;
        }
    }
    function addClass(ele,cls){
        if(!hasClass(ele,cls)) {
            ele.className+=` ${cls}`;
        }
        ele.className=ele.className.trim();
    }
    function rmClass(ele,cls){
        var re=new RegExp(`\\b${cls}\\b`);
        if(hasClass(ele,cls)) {
            ele.className=ele.className.replace(re,'').replace(/\s{2}/,' ').trim();

        }
    }

    function ajax(menth,url,date,success){
        var xhr=new XMLHttpRequest();

        if(menth=="get"&&date){
            url+="?"+date;
        }

        xhr.open(menth,url,true);
        if(menth=="get"){
            xhr.send();
        }else{
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            xhr.send(date);
        }


        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){

                success&&success(xhr.responseText);
            }
        }
    }

    M(".login-phone1").onclick=function(){
        this.style.background="rgba(0, 0,255, 0.6)";
        M(".login-phone2").style.background="rgba(0, 0,0, 0) ";

        addClass(M(".login-phone-pass"),"hide");
        rmClass(M(".login-pass"),"hide")

    };

    M(".login-phone2").onclick=function(){
        this.style.background="rgba(0, 0,255, 0.6)";
        M(".login-phone1").style.background="rgba(0, 0,0, 0) ";

        addClass(M(".login-pass"),"hide");
        rmClass(M(".login-phone-pass"),"hide");
    };
    /*获取验证码*/
    var i=60;
    function cTime(){
        var time=null;
        if(M(".set-phone").value.length==11){
            ajax("post","/phone",`userPhone=${M(".set-phone").value}`,function (data) {
                var d=JSON.parse(data);
                if(d.code=="0"){
                    console.log("ok");
                    console.log(d.message);
                    M(".login-phone-pass-ma1").onclick=null;
                    time=setInterval(function(){
                        i--;
                        console.log(i);
                        if(i<1){
                            M(".login-phone-pass-ma1").onclick=cTime;
                            i=60;
                            M(".set-phone").value="";
                            M(".login-phone-pass-ma1").value="获取验证码";
                            M(".login-phone-pass-ma1").style.background="#71c0ff";
                            clearInterval(time);
                        }else{
                            M(".login-phone-pass-ma1").value=i;
                            M(".login-phone-pass-ma1").style.background="#ff6b68"
                        }
                    },1000);
                }else{
                }
            });

        }else{
            alert("请输入正确的手机号!");

        }
    }
    M(".login-phone-pass-ma1").onclick=cTime;

    /*验证码登录*/
    M(".oBtn").onclick=function(){
        if(i<60 && i>1 && M(".login-phone-pass-ma").value.length==6){
            /*alert("尝试成功");*/
            ajax("post","/identify",`userPhone=${M(".set-phone").value}&code=${M(".login-phone-pass-ma").value}`,function (data) {
                var d=JSON.parse(data);
                if(d.code=="0"){

                    if(d.userType=="0"){
                        alert(d.message);
                        window.location.href="/student";
                    }else{
                        alert(d.message);
                        window.location.href="/teacher";
                    }

                }else{
                    M(".login-phone-pass-ma").value="";
                    alert(d.message);
                }
            })
        }else{
            alert("填写正确的验证码");
        }
    };
    //账号密码登录
    /*M(".login-1").onclick=function(){
        if( M(".login-num-btn").value.length && M(".login-passWd-btn").value.length ){
            ajax("post","/",'userNum=' + M(".login-num-btn").value + '&password=' + M(".login-passWd-btn").value+'');
            M(".login-num-btn").value="";
            M(".login-passWd-btn").value="";
        }else{
            alert("请填写账号和密码");
        }
    }*/

};