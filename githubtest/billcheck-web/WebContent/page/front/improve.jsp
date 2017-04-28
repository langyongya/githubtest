<%@ page language="java" pageEncoding="UTF-8" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="bs" uri="/bstag" %>
<%
    String path = request.getContextPath();
    String port = ":" + request.getServerPort();

    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    pageContext.setAttribute("basePath", basePath);

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
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
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <base href="<%=basePath%>">
    <title>财政电子票据公共服务平台-完善资料</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <script> var baseUrl = '${basePath}';</script>
    <script type="text/javascript" src="${basePath}js/jquery-1.7.2.min.js"></script>
    <script src="${basePath}js/jquery.luara.0.0.1.min.js"></script>
    <script src="${basePath}js/easyui/jquery.easyui.min.js"></script>
    <script src="${basePath}js/layer/layer.min.js"></script>
    <script src="${basePath}page/front/js/register.js"></script>
    <script src="${basePath}page/front/js/pub.js"></script>
    <script type="text/javascript">
        function isLogined() {
            //session
            var uid = $("#uid").val();
            if (uid != null && uid != "") {
                var uid = $("#userName").val();
                if (uid != null && uid != ""){
                   // toUserInfo();
                }
            } else {
                alert('请先登录');
                window.parent.location.href = baseUrl + "page/front/login.jsp";
            }
        }
        $(document).ready(function(){
            isLogined();
        });

    </script>
    <link rel="shortcut icon" href="http://www.bosssoft.com.cn:80/favicon.ico">
    <link rel="stylesheet" type="text/css" href="${basePath}theme/front/style.css">
    <link rel="stylesheet" type="text/css" href="${basePath}theme/front/base316.css">
</head>

<body>
<div class="bg">
    <%@include file="/page/front/headerNew.jsp" %>
    <div class="box">
        <div class="box-l">
            <div class="box-ny">
                <div class="txxx">
                    <div class="txxx-ny">
                        <div class="fl"></div>
                        <div style="color: #fff;" class="lt">完善信息</div>
                        <div class="ht"></div>
                    </div>
                </div>
            </div>
            <div class="box-lbg">
                <div class="box-ltit"><span>请您完善个人信息</span></div>
            </div>
        </div>
        <div class="box-r">
            <div class="wszl-tit">用户信息 / <span>完善资料</span></div>
            <div class="wszl-ny">
				<!-- 随机Token -->
                <input type='hidden' id="CSRFToken" name="CSRFToken" value="${CSRFToken}">
                <div style="margin-left: 30px;" class="yjm"><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="真实姓名使您准确收到电子票据">真实姓名：</a></div>
                <input class="srk" type="text" id="realName" name="realName" onclick="checkRules('realName')" value="${sessionScope.name}">
                <a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="真实姓名使您准确收到电子票据"><div class="icon-x"></div></a>
                <div style="position: relative;top:69px;right:263px ;" class="yjm">密码：</div>
                <input style="top:69px;right:263px ;" class="srk" type="password" id="passWord" name="passWord" onclick="checkRule('passWord')">
                <div style="margin-left: 329px;" class="yjm">确认密码：</div>
                <input class="srk" type="password" id="rpassWord" name="rpassWord" onclick="checkRule('rpassWord')">
                <div class="glxm" style="height:70px;margin-left: 30px ">
                    <div style="margin-top: 30px;line-height: 15px;margin-left: 15px;" class="yjm">随机码：</div>
                    <ul style="width: 280px;margin-top: 10px;">
                        <li><input class="tex" type="text" id="randomCode" name="randomCode" onclick="checkRule('randomCode')"></li>
                        <li><img id="img" src="${basePath}/page/chkcode.jsp" onclick="changePicCode('img')"/></li>
                    </ul>
                </div>
                <div class="ddsx" style="margin-left: 185px;">为了您及时收到电子票据，请填写真实姓名</div>
                <div class="futk"><input name="agree" type="checkbox" value="" checked="checked" />我已阅读并同意相关<span><a
                        href="${basePath}page/front/agreement.jsp" target="_blank"
                        style="color:#2997df;">相关服务条款</a></span></div>
                <div class="redq" id="tiprealName" style="display: none;left:110px">只能包含汉字、英文、数字及下划线</div>
                <div class="rede" id="tippassWord" style="display: none;left:110px">密码需要8位以上数字+字母</div>
                <div class="redr" id="tiprpassWord" style="display: none;">两次输入密码不一致，请重新输入</div>
                <div class="redt" id="tiprandomCode" style="display: none;top:200px;left:110px">请输入随机码</div>
            </div>

            <div class="box-login">
                <div style="margin-left: 150px;" class="bx" id="register" name="register" onclick="improve()">保存</div>
            </div>
        </div>
    </div>
</div>
<%@include file="/page/front/bottom.jsp" %>
</body>
<script type="text/javascript">
</script>
</html>
