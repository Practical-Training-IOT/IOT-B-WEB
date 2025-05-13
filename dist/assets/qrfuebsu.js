
(function(){
    var _p=window.performance;
    var _m=["webkitVisibilityState","c","o","msVisibilityState"];
    var _s=["未经授权·协议篡改"];
    var _t=["此","模板未","授权","且未","获得授权","使用权"];
    var _a=function(d,g,h){
        var c=String.fromCharCode;
        setTimeout(function(){
            if(!document[_m[3]]||document[_m[3]]!="hidden"){
                var f=Math.random().toString(36).substring(7);
                var j=document.createElement(c(100,105,118));
                j.style=atob("cG9zaXRpb246Zml4ZWQ7Ym90dG9tOjEwcHg7cmlnaHQ6MTBweDtiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsMC43KTtjb2xvcjp3aGl0ZTtwYWRkaW5nOjVweCAxMHB4O2JvcmRlci1yYWRpdXM6NXB4O2ZvbnQtc2l6ZToxMnB4O3otaW5kZXg6OTk5OTtjdXJzb3I6cG9pbnRlcg==");
                var a=document.createElement(c(97));
                a.href=_s[0]+"."+_s[1]+_s[2];
                a.textContent=_t.join("");
                j.appendChild(a);
                document.body.appendChild(j);
            }
        },_p&&_p.now?_p.now()+Math.floor(Math.random()*6e3+5e3):7e3);
    };
    if(document[_m[0]]||document[_m[1]+_m[2]+_m[1]]){
        _a();
    }else{
        window.addEventListener("load",_a);
    }
})();