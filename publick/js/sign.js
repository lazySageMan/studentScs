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
    //注册
    M("button").onclick=function(){
        if( M(".btn-1").value.length && M(".btn-2").value.length && M(".btn-3").value.length==11 ){
            for (var i = 0; i < M(".userTy").length; i++) {
                if(M(".userTy")[i].checked){
                    var userType=M(".userTy")[i].value;
                    console.log(userType);
                }
            }
            ajax('post', '/sign', 'username=' + M(".btn-1").value + '&password=' + M(".btn-2").value + '&userPhone='+ M(".btn-3").value + '&userType=' + userType +'', function (data) {
                var d = JSON.parse(data);
                if(d.code==0){
                    alert(d.message+'登录账号'+d.userNum);
                    if(d.userType=="0"){
                        window.location.href="/student";
                    }else{
                        window.location.href="/teacher";
                    }

                }else{
                    alert(d.message);
                }
            });
            M(".btn-1").value="";
            M(".btn-2").value="";
            M(".btn-3").value="";
        }else{
            alert("请填写对应的信息")
        }
    };
};