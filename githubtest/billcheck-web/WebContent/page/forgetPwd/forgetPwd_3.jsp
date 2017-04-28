<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %><%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@taglib prefix="bs" uri="/bstag" %>
<%
String path = request.getContextPath();
String port=":"+request.getServerPort();

String basePath = request.getScheme()+"://"+request.getServerName()+port+path+"/";
pageContext.setAttribute("basePath",basePath);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style id='antiClickjack'>
    body{display:none !important;}
</style>

<script type='text/javascript'>
    if (self === top) {
    var antiClickjack = document.getElementById('antiClickjack');
    antiClickjack.parentNode.removeChild(antiClickjack);
    } else {
    top.location = self.location;
    }
</script>
<title>财政电子票据公共服务平台-密码找回</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" type="text/css" href="${basePath}theme/front/style.css">
    <link rel="stylesheet" type="text/css" href="${basePath}theme/front/base316.css">
	<script type="text/javascript" src="${basePath}js/jquery-1.7.2.min.js"></script>
	<script src="${basePath}js/jquery.luara.0.0.1.min.js"></script>
	<script src="${basePath}page/front/js/pub.js"></script>
	<script> var  baseUrl='${basePath}';</script>
    <script charset="utf-8" src="${basePath}page/forgetPwd/js/forgetPwd_3.js"></script>
    <script charset="utf-8" src="${basePath}page/forgetPwd/js/forgetPwd_2.js"></script>
</head>
<body>
<div class="bg">
    <%@include file="/page/front/headerNew.jsp" %>
    <div class="box">
        <div class="box-l">
            <div class="box-ny">
                <div class="img-sl"></div>
            </div>
            <div class="box-lbg">
                <div class="box-ltit"><span>找回密码</span></div>
                <div class="hl">如有任何疑问请致电 400-8877-945</div>
            </div>
        </div>
        <div class="box-r">
            <div class="wszl-tit">密码找回 <span></span></div>
            <div style="width: 430px;height: 309px;" class="zcxx">
           	 	<!-- 随机Token -->
                <input type='hidden' id="CSRFToken" name="CSRFToken" value="${CSRFToken}">
                <div style="margin-left: 80px;" class="yjm">手机号：</div>
                <input style="width: 278px;" class="srk" type="text" id="mobilePhone" name="mobilePhone" onclick="checkRules('mobilePhone')">
                <div style="margin-left: 80px;"  class="yjm">验证码：</div>
                <input style="width: 278px;" class="srk" type="text" name="authCode" id="authCode" onclick="checkRules('authCode')">
                <div style="margin-left: 80px;"  class="yjm">新密码：</div>
                <input style="width: 278px;" class="srk" type="password" id="passWord" name="passWord" onclick="checkRules('passWord')">
                <div class="yjm" style="margin-left: 64px;">确认密码：</div>
                <input style="width: 278px;" class="srk" type="password" id="rpassWord" name="rpassWord" onclick="checkRules('rpassWord')">
                <input class="zsj" id="btn" value="发送短信至手机"/>
                
                 <div class="redq" id="tipmobilePhone" style="display: none;left:144px">请输入正确的手机号码</div>
                 <div class="rede" id="tipauthCode" style="display: none;left:144px">请输入验证码</div>
                 <div class="redt" id="tippassWord" style="display: none;left:144px">请输入新密码</div>
                 <div class="redt" id="tiprpassWord" style="display: none;left:144px;top: 280px;">两次输入密码不一致，请重新输入</div>
            </div>
            <div class="img-lef"></div>
            <div class="xg-btn">
                <ul>
                    <li class="lrrq" onclick="formsub()" id="confirm" name="confirm">确定</li>
                    <li class="lrrs" onclick="reset()" id="reset" name="reset">重置</li>
                </ul>
            </div>
        </div>
    </div>
</div>
<%@include file="/page/front/bottom.jsp" %>
</body>
<script type="text/javascript">
    var wait = 60;
    document.getElementById("btn").disabled = false;
    function time(o) {
        if (wait == 0) {
            o.removeAttribute("disabled");
            //$(o).attr("disabled", false);  jquery
            o.value = "重新获取";
            wait = 60;
        } else {
            o.setAttribute("disabled", true);
            o.value = wait + "秒";
            wait--;
            setTimeout(function () {
                        time(o)
                    },
                    1000)
        }
    }
    document.getElementById("btn").onclick =
            function () {
                var mobile = $("#mobilePhone").val();
                if(mobile == '' || mobile == null){
                	$("#mobilePhone").attr("style","border: #ff6060 1px solid;width:278px;");
            		$("#tipmobilePhone").show();
                }else{
                    var istrue = validatemobile(mobile);
                    if(istrue){
                        time(this);
                        getAuthCode();
                    }
                }
            }
</script>
</html>

