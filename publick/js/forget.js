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

    var i=60;
    function cTime(){
        var time=null;
        if(M(".btn-1").value.length==11){
            ajax("post","/phone",`userPhone=${M(".btn-1").value}`,function (data) {
                var d=JSON.parse(data);
                if(d.code=="0"){
                    console.log("ok");
                    M(".btn-4").onclick=null;
                    time=setInterval(function(){
                        i--;
                        console.log(i);
                        if(i<1){
                            M(".btn-4").onclick=cTime;
                            i=60;
                            M(".btn-1").value="";
                            M(".btn-2").value="";
                            M(".btn-3").value="";
                            M(".btn-4").value="获取验证码";
                            M(".btn-4").style.background="#71c0ff";
                            clearInterval(time);
                        }else{
                            M(".btn-4").value=i;
                            M(".btn-4").style.background="#ff6b68"
                        }
                    },1000);
                }
            });
        }else{
            alert("请输入正确信息!");

        }
    }
    M(".btn-4").onclick=cTime;

    M("button").onclick=function (){
        if(i<60 && i>1 && M(".btn-5").value.length==6 && M(".btn-2").value.length && M(".btn-3").value.length && M(".btn-2").value==M(".btn-3").value){
            ajax("post","forget",`userPhone=${M(".btn-1").value}&passwd=${M(".btn-2").value}&code=${M(".btn-5").value}`,function(data){
                var d=JSON.parse(data);
                if(d.code=="0"){
                    if(d.userType=="0"){
                        alert(`${d.message}你的新密码：${d.passWd}`);
                        window.location.href="/student";
                    }else{
                        alert(`${d.message}你的新密码：${d.passWd}`);
                        window.location.href="/teacher";
                    }
                }else{
                    alert(d.message);
                }
            })
        }else {
            alert("输入正确的验证码");
            M(".btn-5").value="";
        }
    }

};