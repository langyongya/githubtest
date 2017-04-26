<%@page language="java"  pageEncoding="UTF-8"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@taglib prefix="bs" uri="/bstag" %><%
String path = request.getContextPath();
String port=":"+request.getServerPort();

String basePath = request.getScheme()+"://"+request.getServerName()+port+path+"/";
pageContext.setAttribute("basePath",basePath);

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<meta charset="utf-8">
	<title>财政电子票据公共服务平台-登录</title>
	<link rel="shortcut icon" href="http://www.bosssoft.com.cn:80/favicon.ico">
	<link rel="stylesheet" type="text/css" href="${basePath}theme/front/login.css">
	<link rel="stylesheet" type="text/css" href="${basePath}theme/front/base316.css">
	<link rel="stylesheet" type="text/css" href="${basePath}theme/front/style.css">
	<link rel="stylesheet" type="text/css" href="${basePath}theme/front/wx_qrcode.css">
	<script type="text/javascript" src="${basePath}js/jquery-1.7.2.min.js"></script>
	<script> var  baseUrl='${basePath}';</script>
	<script src="${basePath}page/front/js/wxLogin.js"></script>
	<script src="${basePath}js/jquery.luara.0.0.1.min.js"></script>
	<script src="${basePath}js/easyui/jquery.easyui.min.js"></script>
	<script src="${basePath}page/front/js/login.js"></script>
	<script src="${basePath}page/front/js/pub.js"></script>
	<script src="${basePath}js/pub.js"></script>
	<script type="text/javascript">
		$(function(){
			$('#mobilePhone').bind('focus',function(){
				var text = $(this).val();
				if (text == '请输入手机号'){
					$(this).val('');
				}
			});
			$('#mobilePhone').bind('blur',function(){
				var text = $(this).val();
				if (text == ''){
					$(this).val('请输入手机号');
				}
			});
			$('#passwordstr').bind('focus',function(){
				$(this).hide();
				$('#passWord').show();
				$('#passWord').focus();
			});
			$('#passWord').bind('blur',function(){
				var text = $(this).val();
				if (text == ''){
					$(this).hide();
					$('#passwordstr').show();
				}
			});
		})
	</script>
</head>

<body>
<div id="Layer1" style="position:absolute; left:0px; top:0px; width:100%; height:100%">
	<img src="../../theme/front/images/login-bgNew.png" width="100%" height="100%"/>
</div>
<div class="login-bg">
		<%@include file="/page/front/headerNew.jsp" %>
		<div class="login">
			<div class="login-tit">
				<ul>
					<li class="loginChange" onclick="changeLoginToName()">账号登录</li>
					<li class="loginChange" onclick="changeLoginToWx()">微信登录</li>
				</ul>
			</div>
			<div class="login-ny" id="loginWithName">
				<div class="cuowu" id="warning" name="warning" style="display: none;">账户或密码不正确</div>
				<input type="text" class="number" value="请输入手机号" id="mobilePhone" name="mobilePhone" onkeyup="oPub.toNextFocus(event,'passWord')">
				<input type="text" class="number" id="passwordstr" value="请输入密码" >
				<input type="password" class="number" id="passWord" name="passWord" style="display: none;">
				<div class="login-dl" id="loginsubmit" name="loginsubmit" onclick="formsub()">登录</div>
				<div class="bot">
					<div class="login-zc"><a href="javascript:void(0)" onclick="toReg()">免费注册</a></div>
					<div class="login-mm"><a href="${basePath}page/forgetPwd/forgetPwd_3.jsp">忘记密码</a></div>
				</div>
			</div>
			<div class="login-ny" style="display: none" id="loginWithWX">
				<div id="login_container"></div>
			</div>
		</div>
</div>
<%@include file="/page/front/bottom.jsp" %>
  </body>
</html>
