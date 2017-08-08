window.onload = function () {
    var showTitle = document.getElementById("showTitle");
    var showLi = showTitle.getElementsByTagName("li");
    var showSpan = showTitle.getElementsByTagName("span");
    for(var i = 0, length1 = showSpan.length; i < length1; i++){
    	showLi[i].index=i;//触摸的是哪个所以index索引那个
    	showLi[i].onmouseover=function () {
    		for(var j = 0, length1 = showSpan.length; j < length1; j++){
    			showSpan[j].className="";
    		}
    		showSpan[this.index].className="spanShow";
    	}
    }
// 添加触摸事件
    var showTitle = document.getElementById("showTitle");
    var showT = document.getElementById("showT");
    var showbtn = document.getElementById("showbtn");
    var closebtn = document.getElementById("close");
    var login = document.getElementById("login");
    var showC = document.getElementById("showC");
    var loginInput = login.getElementsByTagName("input");
    var isFirst = true;
    //当鼠标输入时值为空
     for(var i = 0, length1 = loginInput.length-1; i < length1; i++){
    	loginInput[i].index=i;//触摸的是哪个所以index索引那个
    	loginInput[i].onfocus=function () {
    		oLogin = loginInput[this.index].value;//储存的是input原始的值
    		if (isFirst) {
    			loginInput[this.index].value="";
    		     isFirst = false;//判断这个布尔值，如果是假的则不执行。
    		}
    	}
    	// 获得焦点
    	loginInput[i].onblur = function () {
    		 /* 失去焦点 */
    		 if (loginInput[this.index].value=='') {
    		 	loginInput[this.index].value = oLogin;
    		 }
    	}
    }
    //获取ID的函数
    function $(id) {
    	return document.getElementById(id); 
    }
    //点击事件的函数
    function demo (showDiv) {
    	showDiv.className=="hide"?showDiv.className="":showDiv.className="hide";
    }
    //绑定点击事件
    function doSomething(e)
    {
　　　　  if (!e) var e = window.event;
         e.cancelBubble = true;
         if (e.stopPropagation) e.stopPropagation();
    }
    var showNav = $('showNav')
  showNav.addEventListener('click', function (ev) { demo(showTitle);var a =ev||event;a.cancelBubble = true;});
    //阻止事件冒泡
  document.addEventListener('click', function(){showTitle.className="hide";});
  showbtn.addEventListener('click', function () { demo(showT)});
  closebtn.addEventListener('click', function () { demo(login)});
  showC.addEventListener('click', function () { demo(login)});
 //给所有需要的添加点击事件
}