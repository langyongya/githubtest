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
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <base href="<%=basePath%>">
    <title>财政电子票据公共服务平台-注册</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <script> var baseUrl = '${basePath}';</script>
    <script type="text/javascript" src="${basePath}js/jquery-1.7.2.min.js"></script>
    <script src="${basePath}js/jquery.luara.0.0.1.min.js"></script>
    <script src="${basePath}js/jquery.tooltip.js"></script>
    <script src="${basePath}js/easyui/jquery.easyui.min.js"></script>
    <script src="${basePath}page/front/js/register.js"></script>
    <script src="${basePath}page/front/js/pub.js"></script>
    <script src="${basePath}js/layer/layer.min.js"></script>
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
                        <div style="color: #fff;" class="lt">填写信息</div>
                        <div class="ht"></div>
                    </div>
                </div>
                <div style="background: url()" class="txxx">
                    <div class="txxx-ny">
                        <div style="background: url(theme/front/images/icon-cy.png) no-repeat scroll 35px 9px" class="fl"></div>
                        <div class="lt">注册完成</div>
                        <div class="ht"></div>
                    </div>
                </div>
            </div>
            <div class="box-lbg">
                <div class="box-ltit"><span>欢迎注册</span></div>
            </div>
        </div>
        <div class="box-r">
            <div class="wszl-tit">用户注册  <span></span></div>
            <div class="wszl-ny">

                <div style="margin-left: 30px;" class="yjm"><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="为及时收到电子票据，请填写真实姓名">真实姓名：</a></div>
                <input class="srk" type="text" id="realName" name="realName"  onclick="hideHint('realName')">
                <a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="为及时收到电子票据，请填写真实姓名"><div class="icon-x"></div></a>
                <div class="yjm" style="position: relative;top: 70px;right: 295px;"><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="用于网站登录及接收电子票据通知">手机号码：</a></div>
                <input class="srk" style="position: relative;top: 70px;right: 295px" type="text" id="mobilePhone" name="mobilePhone"  onclick="hideHint('mobilePhone')">
                <a style="position: relative;" href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="用于网站登录及接收电子票据通知"><div style="position: relative;top: 70px;right: 295px;" class="icon-x"></div></a>
                <div style="margin-left: 45px;position: relative;left: 294px" class="yjm">验证码：</div>
                <input class="asd" type="button" id="btn" value="获取验证码"/>
                <input style="position: relative;left: 294px" class="srk" type="text" id="authCode" name="authCode"  onclick="hideHint('authCode')">
                <div style="margin-left: 32px;position: relative;top: 70px;right: 271px" class="yjm">密码：</div>
                <input style="position: relative;top: 70px;right: 271px" class="srk" type="password" id="passWord" name="passWord"  onclick="hideHint('passWord')">
                <div style="margin-left: 50px;position: relative;left: 273px" class="yjm">确认密码：</div>
                <input style="position: relative;left: 273px" class="srk" type="password" id="rpassWord" name="rpassWord"  onclick="hideHint('rpassWord')">
                <div class="futk"><input name="agree" type="checkbox" value="" checked="checked" />我已阅读并同意相关<span><a
                        href="${basePath}page/front/agreement.jsp" target="_blank"
                        style="color:#2997df;">服务条款</a></span></div>
                <div class="redq" id="tiprealName" style="display: none;left: 109px">只能包含汉字、英文、数字及下划线</div>
                <div class="rede" id="tipmobilePhone" style="display: none;left: 109px">请输入有效的手机号码</div>
                <div class="redr" id="tipauthCode" style="display: none;">请输入验证码</div>
                <div class="redt" id="tippassWord" style="display: none;left: 109px">密码需要8位以上数字+字母</div>
                <div class="redy" id="tiprpassWord" style="display: none;">两次输入密码不一致，请重新输入</div>
                
                <!-- <div class="redt" id="tipclause" style="display: none;">相关服务条款未同意</div> -->
            </div>

            <div class="box-login">
                <div style="margin-left: 90px;" class="bx" id="register" name="register" onclick="register()">注册</div>
                <div class="cx" id="reset" onclick="resetReg()">取消</div>
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
                if (mobile == '' || mobile == null) {
                    alert('请先输入手机号码,谢谢您的合作！');
                } else {
                    var istrue = validatemobilePhone(mobile);
                    if (istrue) {
                        time(this);
                        sendCheckNum();
                    }
                }
            }
</script>
</html>
