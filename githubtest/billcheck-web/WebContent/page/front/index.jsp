<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
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
    <title>财政电子票据公共服务平台</title>
    <script> var  baseUrl='${basePath}';</script>
    <link rel="shortcut icon" href="http://www.bosssoft.com.cn:80/favicon.ico">
    <link rel="stylesheet" type="text/css" href="${basePath}theme/front/stylenew.css">
    <link rel="stylesheet" type="text/css" href="${basePath}theme/front/basenew.css">
    <script type="text/javascript" src="${basePath}js/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="${basePath}js/jquery-webox.js"></script>
    <script src="${basePath}js/jquery.luara.0.0.1.min.js"></script>
    <script src="${basePath}page/front/js/pub.js"></script>
</head>

<body>
<%@include file="/page/front/headerNew.jsp" %>
<div class="banner">
    <div class="banner-c">
        <div class="btn">
            <ul>
                <li onclick="toBillCheck()">票据查验</li>
<c:if test="${empty sessionScope.uid}">
                <li onclick="toLogin()">快速登录</li>
                <li onclick="toReg()">免费注册</li>
</c:if>
            </ul>
        </div>
    </div>
</div>

<div class="main">

    <div class="hs">
        <div class="stk-q"></div>
    </div>
    <div class="bs">
        <div class="stk-w"></div>
    </div>
    <div class="hs">
        <div class="stk-e"></div>
    </div>
    <div class="bs">
        <div class="stk-r"></div>
    </div>
</div>
<input type="hidden" id="uid" name="uid" value="${sessionScope.uid}"/>
<input type="hidden" id="mobilePhone" name="mobilePhone" value="${sessionScope.mobilePhone}"/>
<input type="hidden" id="userName" name="userName" value="${sessionScope.userName}"/>
<input type="hidden" id="realName" name="realName" value="${sessionScope.realName}"/>
<input type="hidden" id="relatename" name="relatename" value="${sessionScope.relateName}"/>
<div class="footer">
    <div class="footer-c">Copyright © 2008-2016 福建博思软件股份有限公司 All Rights Reserved 闽ICP备05019865号 </div>
</div>
<%--<%@include file="/page/front/style.jsp" %>--%>
</body>
</html>

