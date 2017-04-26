/**
公用js
*/
var bs_util_pub=function (){};
(function(){
	bs_util_pub.prototype={
		"fnGetStrLen":function(str){//求字符串长度
			if(typeof(str)!="string" || str==null){
				return 0;
			}else{
				return str.length;
			}
		},
		"fnAnmColor":function(id,sets){//两种颜色交替显示文字
			var obj=document.getElementById(id);
			var oldcolor = obj.style.color;
			var timeout=0;
			var time,times,color,callback;
			if(typeof(sets)=="undefined"){
				color="red";
				time=200;
				times=8;
			}else{
				if(typeof(sets.color)=="undefined" || sets.color==null) 
					color="red";
				else{
					color=sets.color;
				}
				if(typeof(sets.time)=="undefined" || sets.time==null) time=200;
				else{
					time=sets.time;
				}
				if(typeof(sets.times)=="undefined" || sets.times==null ) 
					times=5;
				else{
					times=sets.times;
				}
				if(typeof(sets.callback)!="undefined"){
					window.setTimeout(sets.callback,times*2*time);
				}
			}
		
			if(oldcolor==color || oldcolor=="#F00"){
				color ="#000";
			}
			for(var i=0;i<times*2;i++){
				var tmpcolor=oldcolor;
				if(i%2==0){
					tmpcolor=color;
				}
				timeout =timeout+time;
				var func=new Function("document.getElementById('"+id+"').style.color='"+tmpcolor+"';");
				window.setTimeout(func,timeout);
			}
			document.getElementById(id).style.color=oldcolor;
		},
		"fnJsonObjToStr":function(o){
		    var r = [];
		    if(typeof o =="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
		    if(typeof o == "object"){
		        if(!o.sort){
		            for(var i in o)
		                r.push("\""+i+"\":"+obj2str(o[i]));
		            if(!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
		                r.push("toString:"+o.toString.toString());
		            }
		            r="{"+r.join()+"}"
		        }else{
		            for(var i =0;i<o.length;i++)
		                r.push(obj2str(o[i]))
		            r="["+r.join()+"]"
		        }
		        return r;
		    }
		    return o.toString();
		},// 数字转换成大写金额函数
		 "atoc":function(numberValue){
			var numberValue=new String(Math.round(numberValue*100)); // 数字金额
			var chineseValue=""; // 转换后的汉字金额
			var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
			var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
			var len=numberValue.length; // numberValue 的字符串长度
			var Ch1; // 数字的汉语读法
			var Ch2; // 数字位的汉字读法
			var nZero=0; // 用来计算连续的零值的个数
			var String3; // 指定位置的数值
			if(len>15){
				alert("超出计算范围");
				return "";
			}
			if (numberValue==0){
				chineseValue = "零元整";
				return chineseValue;
			}

			String2 = String2.substr(String2.length-len, len); // 取出对应位数的STRING2的值
			for(var i=0; i<len; i++){
				String3 = parseInt(numberValue.substr(i, 1),10); // 取出需转换的某一位的值
				if ( i != (len - 3) && i != (len - 7) && i != (len - 11) && i !=(len - 15) ){
					if ( String3 == 0 ){
						Ch1 = "";
						Ch2 = "";
						nZero = nZero + 1;
					}
					else if ( String3 != 0 && nZero != 0 ){
						Ch1 = "零" + String1.substr(String3, 1);
						Ch2 = String2.substr(i, 1);
						nZero = 0;
					}
					else{
						Ch1 = String1.substr(String3, 1);
						Ch2 = String2.substr(i, 1);
						nZero = 0;
					}
				}
				else{ // 该位是万亿，亿，万，元位等关键位
					if( String3 != 0 && nZero != 0 ){
						Ch1 = "零" + String1.substr(String3, 1);
						Ch2 = String2.substr(i, 1);
						nZero = 0;
					}
					else if ( String3 != 0 && nZero == 0 ){
						Ch1 = String1.substr(String3, 1);
						Ch2 = String2.substr(i, 1);
						nZero = 0;
					}
					else if( String3 == 0 && nZero >= 3 ){
						Ch1 = "";
						Ch2 = "";
						nZero = nZero + 1;
					}
					else{
						Ch1 = "";
						Ch2 = String2.substr(i, 1);
						nZero = nZero + 1;
					}
					if( i == (len - 11) || i == (len - 3)){ // 如果该位是亿位或元位，则必须写上
						Ch2 = String2.substr(i, 1);
					}
				}
				chineseValue = chineseValue + Ch1 + Ch2;
			}
			if ( String3 == 0 ){ // 最后一位（分）为0时，加上“整”
			chineseValue = chineseValue + "整";
			}
			return chineseValue;
		},"formSerialize":function(frmId){
			var traditional;
			var a = $("#"+frmId).serializeArray();
			var s = [],
			add = function( key, value ) {
				value = jQuery.isFunction(value) ? value() : value;
				var skey = encodeURIComponent(encodeURIComponent(key));//.replace(/\+/g,"%u002B");
				var svalue = encodeURIComponent(encodeURIComponent(value));//.replace(/\+/g,"%u002B");
				s[ s.length ] = skey + "=" + svalue;
			};
			if ( traditional === undefined ) {
				traditional = jQuery.ajaxSettings.traditional;
			}
			if ( jQuery.isArray(a) || a.jquery ) {
				jQuery.each( a, function() {
					add( this.name, this.value );
				});
			} else {
				for ( var prefix in a ) {
					buildParams( prefix, a[prefix], traditional, add );
				}
			}
			return s.join("&").replace(/%20/g, "+");
		},"toNextFocus":function(event,nextId){//回车焦点移到id为nextId的控件
			if(event.keyCode==13){
				$("#"+nextId).focus();
			}
		},"exeEnter":function(event,func){//回车执行
			if(event.keyCode==13){
				eval(func);
			}
		},nullToStr:function(obj){//空对象转成字符串
			if(!obj) return "";
			return $.trim(obj.toString());
		},outputMoney:function(number){ 
		  number = this.nullToStr(number);
		  number=number.replace(/\,/g,""); 
		  if (number=="") return "0.00"; 
		  if(number<0) 
			  return '-'+this.outputDollars(Math.floor(Math.abs(number)-0) + '') + this.outputCents(Math.abs(number) - 0); 
		  else 
			  return this.outputDollars(Math.floor(number-0) + '') + this.outputCents(number - 0); 
		},outputDollars:function(number){ 
		  if (number.length<= 3) 
			  return (number == '' ? '0' : number); 
		  else{ 
		    var mod = number.length%3; 
		    var output = (mod == 0 ? '' : (number.substring(0,mod))); 
		    for (i=0 ; i< Math.floor(number.length/3) ; i++) 
		    { 
		      if ((mod ==0) && (i ==0)) 
		      output+= number.substring(mod+3*i,mod+3*i+3); 
		      else 
		      output+= ',' + number.substring(mod+3*i,mod+3*i+3); 
		    } 
		    return (output); 
		   } 
		},outputCents:function(amount){ 
		  amount = Math.round( ( (amount) - Math.floor(amount) ) *100); 
		  return (amount<10 ? '.0' + amount : '.' + amount); 
		},formatDateYYMMDD:function(date){
			if(!date) date = new Date();
			var value="";
			var d = date.getDate();
			if(d<10) d="0"+d.toString();
			var m = date.getMonth()+1;
			if(m<10) m="0"+m.toString();
			value= date.getFullYear()+"-"+m+"-"+d;
			return value; 
		}
	};
})();
var oPub = new bs_util_pub();
//功能：根据用户输入的Email跳转到相应的电子邮箱首页
function gotoEmail($mail) {
    $t = $mail.split('@')[1];
    $t = $t.toLowerCase();
    if ($t == '163.com') {
        return 'mail.163.com';
    } else if ($t == 'vip.163.com') {
        return 'vip.163.com';
    } else if ($t == '126.com') {
        return 'mail.126.com';
    } else if ($t == 'qq.com' || $t == 'vip.qq.com' || $t == 'foxmail.com') {
        return 'mail.qq.com';
    } else if ($t == 'gmail.com') {
        return 'mail.google.com';
    } else if ($t == 'sohu.com') {
        return 'mail.sohu.com';
    } else if ($t == 'tom.com') {
        return 'mail.tom.com';
    } else if ($t == 'vip.sina.com') {
        return 'vip.sina.com';
    } else if ($t == 'sina.com.cn' || $t == 'sina.com') {
        return 'mail.sina.com.cn';
    } else if ($t == 'tom.com') {
        return 'mail.tom.com';
    } else if ($t == 'yahoo.com.cn' || $t == 'yahoo.cn') {
        return 'mail.cn.yahoo.com';
    } else if ($t == 'tom.com') {
        return 'mail.tom.com';
    } else if ($t == 'yeah.net') {
        return 'www.yeah.net';
    } else if ($t == '21cn.com') {
        return 'mail.21cn.com';
    } else if ($t == 'hotmail.com') {
        return 'www.hotmail.com';
    } else if ($t == 'sogou.com') {
        return 'mail.sogou.com';
    } else if ($t == '188.com') {
        return 'www.188.com';
    } else if ($t == '139.com') {
        return 'mail.10086.cn';
    } else if ($t == '189.cn') {
        return 'webmail15.189.cn/webmail';
    } else if ($t == 'wo.com.cn') {
        return 'mail.wo.com.cn/smsmail';
    } else if ($t == '139.com') {
        return 'mail.10086.cn';
    } else {
        return '';
    }
};
