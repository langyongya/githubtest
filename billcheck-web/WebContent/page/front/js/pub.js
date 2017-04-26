/**
 * 返回首页
 * @return
 */
function toIndex(){
	  window.parent.location.href=baseUrl;
}

/**
 * 注册界面
 * @return
 */
function toReg(){
	window.parent.location.href=baseUrl+"page/front/register.jsp";
}

/**
 * 登录界面
 * @return
 */
function toLogin(){
	window.parent.location.href=baseUrl+"page/front/login.jsp";

}	

/**
 * 登录界面 打开新页面
 * @return
 */
function toLoginNewPage(){
	window.open(baseUrl+"page/front/login.jsp");
}	

/**
 * 通知公告
 * @return
 */
function toNotice(){
	window.parent.location.href=baseUrl+"page/front/notice.jsp";
}

/**
 * 政策法规
 * @return
 */
function toPolicy(){
	window.parent.location.href=baseUrl+"page/front/policy.jsp";
}

/**
 * 用户管理中心
 * @return
 */
function toUserCenter(){
	window.parent.location.href=baseUrl+"page/front/myInformation.jsp";
}

/**
 * 修改密码
 * @return
 */
function toChangePassword(){
	window.parent.location.href=baseUrl+"page/front/my_password.jsp";
}

/**
 * 帮助中心
 * @return
 */
function toHelpCenter(){
	window.parent.location.href=baseUrl+"page/front/helpcenter.jsp";
}

/**
 * 下载中心
 * @return
 */
function toDownLoadCenter(){
	window.parent.location.href=baseUrl+"page/front/downloadcenter.jsp";
}

/**
 * 发票查询
 * @return
 */
function toBillCheck(){
	window.parent.location.href=baseUrl+"page/front/bill_check.jsp";
}

function toUserInfo(){
	//session
	var uid = $("#uid").val();
	if(uid!=null&&uid!=""){
		window.parent.location.href=baseUrl+"page/front/myInformation.jsp";
	}else{
		toLogin();
	}
}

function toUserInfoChange(){
	//session
	var uid = $("#uid").val();
	if(uid!=null&&uid!=""){
		window.parent.location.href=baseUrl+"page/front/myInformation_change.jsp";
	}else{
		toLogin();
	}
}

function toMyBill(){
	//session
	var uid = $("#uid").val();
	if(uid!=null&&uid!=""){
		window.parent.location.href=baseUrl+"page/front/my_bill.jsp";
	}else{
		toLogin();
	}
}
/**
 * 验证当前用户是否存在
 */
function verifyUserSession()
{
	var returnMsg ="0";
	$.ajax({
		type : "POST",
		async:false,
		url : baseUrl+"user/verifyUserSession",
		success : function(data){
			//change('img');
			var obj = (new Function( "return " + data))();
			returnMsg = obj.msg.code;

		  }
	});
	
	return returnMsg;
}
/**
 * 用户中心退出
 * @return
 */
function userLogout(){ 
    var date=new Date();
    async:false,
    date.setTime(date.getTime()-10000);
	document.cookie="cUser=v; expire="+date.toGMTString()+"; path=/";
	$.ajax({
		type : "POST",
		url : baseUrl+"user/loginOut",
		dataType:"text",
		cache:false,
		success : function(data){
			/*data = eval("(" + data + ")");//解析返回的json数据
			if(data.msg.code==1){
				window.location.href=baseUrl;
			}*/
			if ("success" == data) {
				window.location.href=baseUrl;
			}
			
		}
	});			
}

function formatString(_value){
	if (_value) return _value;
	return "&nbsp;";
	
}

//格式化时间格式
function formdate(_datetime,_datetype)
{
	var formdatetime="";
	if (_datetime != "" && _datetime != null && _datetime != undefined)
	{
		
		var year =_datetime.substring(0,4);
		var month =_datetime.substring(4,6);
		var day =_datetime.substring(6,8);
		var hours =_datetime.substring(8,10);
		var minute =_datetime.substring(10,12);
		var second =_datetime.substring(12,14);
		
		if (_datetype == "yyyy-mm-dd hh:mm:ss")
		{
			formdatetime = year + "-" + month + "-" + day + " " +hours + ":" + minute + ":" + second;
		}	
		else if (_datetype == "yyyy-mm-dd")
	
		{
			formdatetime = year + "-" + month + "-" + day;
		}
		else if (_datetype == "mm-dd")
		{
			formdatetime = month + "-" + day;	
		}
		
	}
	return formdatetime;
}

/*显示时间*/
function showtime(_obj) {  
	var today;  
	var hour;  
	var second;  
	var minute;  
	var year;  
	var month;  
	var date;  
	var strDate;   
	today=new Date();   
	var n_day = today.getDay();   
	switch (n_day)   
	{   
	case 0:{   
	strDate = "星期日"   
	}break;   
	case 1:{   
	strDate = "星期一"   
	}break;   
	case 2:{   
	strDate ="星期二"   
	}break;   
	case 3:{   
	strDate = "星期三"   
	}break;   
	case 4:{   
	strDate = "星期四"   
	}break;   
	case 5:{   
	strDate = "星期五"   
	}break;   
	case 6:{   
	strDate = "星期六"   
	}break;   
	case 7:{   
	strDate = "星期日"   
	}break;   
	}   
	year = today.getFullYear();   
	month = today.getMonth()+1;   
	date = today.getDate();   
	hour = today.getHours();   
	minute =today.getMinutes();   
	second = today.getSeconds();   
	if(month<10) month="0"+month;   
	if(date<10) date="0"+date;   
	if(hour<10) hour="0"+hour;   
	if(minute<10) minute="0"+minute;   
	if(second<10) second="0"+second;   
	document.getElementById('"'+ _obj+'"').innerHTML = year + "年" + month + "月" + date + "日 "+" " + hour + ":" + minute + ":" + second;   
	setTimeout("showtime();", 1000); 
} 
//校验密码复杂度
function checkPwdComplexity(id){
	var pwd = $("#"+id).val();
	var regex = new RegExp('(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}');
	var flag = regex.test(pwd);
	if(!flag){
		$("#"+id).val("");
		return false;
	}
	return true;
}

function checkmobilePhone(mobile)
{
	if(mobile.length==0)
	{
		return false;
	}
	if(mobile.length!=11)
	{
		return false;
	}

	//var telReg = !mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
	var pattern = /^1[34578]\d{9}$/;

	//如果手机号码不能通过验证
	if(!pattern.test(mobile)){
		return false;
	}
	return true;
}

function checkRule(id){
	
	if (id == 'passWord') {
		$("#passWord").attr("style","top:69px;right:263px");
		$("#tippassWord").hide();
	}
	if (id == 'rpassWord') {
		$("#rpassWord").attr("style","");
		$("#tiprpassWord").hide();
	}
	if (id == 'randomCode') {
		$("#randomCode").attr("style","");
		$("#tiprandomCode").hide();
	}
	
}

/**焦点在输入框时隐藏提示**/
function checkRules(id) {
	if (id == 'realName') {
		$("#realName").attr("style","");
		$("#tiprealName").hide();
	}
	if (id == 'passWord') {
		$("#passWord").attr("style","position: relative;top: 70px;right: 273px");
		$("#tippassWord").hide();
	}
	if (id == 'rpassWord') {
		$("#rpassWord").attr("style","position: relative;left: 273px");
		$("#tiprpassWord").hide();
	}
	if (id == 'billCode') {
		$("#billCode").attr("style","");
		$("#tipbillCode").hide();
	}
	if (id == 'billNumber') {
		$("#billNumber").attr("style","");
		$("#tipbillNumber").hide();
	}
	if (id == 'securityCode') {
		$("#securityCode").attr("style","");
		$("#tipsecurityCode").hide();
	}
	if (id == 'mobilePhone') {
		$("#mobilePhone").attr("style","width: 190px;top:75px;right:191px");
		$("#tipmobilePhone").hide();
	}
	if (id == 'authCode') {
		$("#authCode").attr("style","left:360px; width: 190px;top:5px");
		$("#tipauthCode").hide();
	}
	if (id == 'code') {
		$("#code").attr("style","");
		$("#tipcode").hide();
	}
}

/**重新获取验证码**/
function changePicCode(id) {
    var img = document.getElementById(id);
    img.src = baseUrl+"/page/chkcode.jsp?" + Math.random();
}