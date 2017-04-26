<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String port=":"+request.getServerPort();

String basePath = request.getScheme()+"://"+request.getServerName()+port+path+"/";
pageContext.setAttribute("basePath",basePath);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>财政电子票据公共服务平台-登录</title>
	<base href="<%=basePath%>">  
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<script> var  baseUrl='${basePath}';</script>
	<link rel="shortcut icon" href="http://www.bosssoft.com.cn:80/favicon.ico">
	<link rel="stylesheet" type="text/css" href="${basePath}theme/front/style.css">
	<link rel="stylesheet" type="text/css" href="${basePath}theme/front/base316.css">
	<script type="text/javascript" src="${basePath}js/jquery-1.7.2.min.js"></script>
	<script src="${basePath}js/jquery.luara.0.0.1.min.js"></script>	
	<script src="${basePath}page/front/js/pub.js"></script>
</head>

<body>
<%@include file="/page/front/headerNew.jsp" %>

<div class="sub-404">
     <p style=" font-size:28px; font-weight:bold;">很抱歉，你访问的页面不存在</p>
     <p style="padding:15px 0; line-height:24px; font-size:14px;">输入地址有误或该地址已被删除，<br />你可以返回财政电子票据公共服务平台<a href="${basePath}" style="color:#046cc4;">首页</a></p>
</div>

<%@include file="/page/front/bottom.jsp" %>

</html>

