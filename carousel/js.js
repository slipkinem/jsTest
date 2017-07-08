function getStyle(obj,attr){
			if (obj.currentStyle) {
				// statement
				return obj.currentStyle[attr];
			}else{
				return window.getComputedStyle(obj,false)[attr];
			}
		}
function bufferMove(obj,json,fn){
	
	var timer=null;
	clearInterval(obj.timer);//obj.timer是为了给多个物体用
	//开始时清空定时器,不然速度会越来越快
	obj.timer=setInterval(function(){
		var bTrue=true;
		for (var attr in json) {//josn循环获取要改变对象属性
			var alpha=0;
			if (attr=="opacity") {
				alpha=parseInt(parseFloat(getStyle(obj,attr))*100); //封装获取CSS内样式的函数
				//小数所以用parseF
			}else{
				alpha=parseInt(getStyle(obj,attr));
			}
			//attr=="opacity"?alpha=parseFloat(getStyle(obj,attr))*100:alpha=parseInt(getStyle(obj,attr));
			//速度
			var iSpeed=0;
			iSpeed=(json[attr]-alpha)/8;
			if (iSpeed>0) {
				iSpeed=Math.ceil(iSpeed);//防止结束时不是整数的差距
				//0.5→1;
				//-0.5→0;
			}else{
				iSpeed=Math.floor(iSpeed);
				//-0.5→-1
			}
			//iSpeed>0?iSpeed=Math.ceil(iSpeed):iSpeed=Math.floor(iSpeed);
			//终止
			if (alpha!=json[attr]) {
				bTrue=false;
			}

		    if (attr=="opacity") {
					obj.style[attr]=alpha/100+iSpeed/100;
					obj.style.fliter="alpha("+attr+"="+alpha+iSpeed+")";
				}
			else{
					obj.style[attr]=alpha+iSpeed+"px";
				}
		}

		if (bTrue) {
			clearInterval(obj.timer);
				if (fn) {
					fn();
			}
		}
	}, 30)
}


window.onload=function(){
	var list = document.getElementById("list");
	var oUl = list.getElementsByTagName("ul")[0];
	var oLi = list.getElementsByTagName("li");
	var oLast = document.getElementById("last");
	var oNext = document.getElementById("next");
	var aBtn = document.getElementById('spa').getElementsByTagName('span');
	var timer = null;
    var i=0;
    for(var j=0;j<aBtn.length;j++) {
        aBtn[j].index = j;
        aBtn[j].onclick = function () {
            for (var k=0;k<aBtn.length;k++){
                aBtn[k].className='';
            }
            clearInterval(timer);
            bufferMove(oUl, {left: -(oLi[0].offsetWidth * this.index)});
            i=this.index;
            this.className='hover';
            timer = setInterval(autoSlip, 2000);
        };
        oNext.onclick = function () {
            clearInterval(timer);
            autoSlip();
        };
        oLast.onclick = function () {
            clearInterval(timer);
            lAutoSlip();
        };

        function autoSlip() {
            i++;
            if (i > oLi.length - 1) {
                i = 0;
                // oUl.style.left = 0;
            }
            for (var n=0;n<aBtn.length;n++){
                aBtn[n].className='';
            }
            bufferMove(oUl, {left: -(oLi[0].offsetWidth * i)});

            aBtn[i].className='hover';
        }

        function lAutoSlip() {
            i--;
            if (i < 0) {
                i = oLi.length - 1;
                // oUl.style.left = 0;
            }
            for (var n=0;n<aBtn.length;n++){
                aBtn[n].className='';
            }
            bufferMove(oUl, {left: -(oLi[0].offsetWidth * i)});

            aBtn[i].className='hover';
        }

        function slip() {
            clearInterval(timer);
            timer = setInterval(autoSlip, 2000);
        }slip();

        oUl.onmouseover = function () {
            clearInterval(timer);
        };
        oNext.onmouseout = oLast.onmouseout = oUl.onmouseout = slip;
    }
};
