
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
