<%@ page language="java" import="com.bosssoft.einvoice.billcheck.pub.util.Tools" pageEncoding="UTF-8" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="bs" uri="/bstag" %>
<%
    String path = request.getContextPath();
    String port = ":" + request.getServerPort();

    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    pageContext.setAttribute("basePath", basePath);
    String curDate = Tools.getDate();
    pageContext.setAttribute("curDate", curDate);
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
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <base href="<%=basePath%>">
    <title>财政电子票据公共服务平台-用户管理中心</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <script> var baseUrl = '${basePath}';</script>
    <link rel="shortcut icon" href="http://www.bosssoft.com.cn:80/favicon.ico">
    <link rel="stylesheet" type="text/css" href="${basePath}theme/front/style.css">
    <link rel="stylesheet" type="text/css" href="${basePath}theme/front/base316.css">
    <script type="text/javascript" src="${basePath}js/jquery-1.7.2.min.js"></script>
    <script src="${basePath}js/jquery.luara.0.0.1.min.js"></script>
    <script src="${basePath}js/easyui/jquery.easyui.min.js"></script>
    <script src="${basePath}js/validateForm.js"></script>
    <script src="${basePath}js/my97/WdatePicker.js"></script>
    <script src="${basePath}js/ajaxfileupload.js"></script>
    <script src="${basePath}page/front/js/pub.js"></script>
    <script src="${basePath}page/front/js/mypassword.js"></script>
    <script src="${basePath}js/layer/layer.min.js"></script>
</head>

<body>
<div class="bg">
    <%@include file="/page/front/headerNew.jsp" %>
            <div class="box">
                <div class="box-l">
                    <div class="box-ny">
                        <div style="background: url()" class="txxx">
                            <div class="txxx-ny">
                                <div style="background: url(theme/front/images/icon-jl.png) no-repeat scroll 35px 12px;"
                                     class="fl"></div>
                                <div class="lt" onclick="toIndex()">首页</div>
                                <div class="ht"></div>
                                <div class="lrr"></div>
                            </div>
                        </div>
                        <div style="background: url()" class="txxx">
                            <div class="txxx-ny">
                                <div style="background: url(theme/front/images/icon-cy.png) no-repeat scroll 35px 12px;"
                                     class="fl"></div>
                                <div class="lt" onclick="toBillCheck()">票据检验</div>
                                <div class="ht"></div>
                                <div class="arr"></div>
                            </div>
                        </div>
                        <div style="background: url()" class="txxx">
                            <div class="txxx-ny">
                                <div style="background: url(theme/front/images/icon-pj.png) no-repeat scroll 35px 12px;" class="fl"></div>
                                <div class="lt" onclick="toMyBill()">我的票据</div>
                                <div class="ht"></div>
                                <div class="srr"></div>
                            </div>
                        </div>
                        <div style="background: url()" class="txxx">
                            <div class="txxx-ny">
                                <div style="background: url(theme/front/images/icon-yddh.png) no-repeat 35px 12px;"
                                     class="fl"></div>
                                <div class="lt" onclick="toUserInfo()">个人信息</div>
                                <div class="drr"></div>
                            </div>
                        </div>
                        <div class="tcc">
                            <ul>
                                <li onclick="userLogout()">安全退出</li>
                                <li onclick="toChangePassword()">修改密码</li>
                            </ul>
                        </div>
                    </div>
                    <div class="box-lbg">
                        <div class="box-ltit"><span>用户</span>中心</div>
                        <div class="hl">欢迎回来，${sessionScope.name}</div>
                    </div>
                </div>
                <div class="box-r">
                    <div class="wszl-tit">我的 / <span>密码</span></div>
                    <div style="width: 430px;height: 309px;" class="zcxx">
                    	<!-- 随机Token -->
                    	<input type='hidden' id="CSRFToken" name="CSRFToken" value="${CSRFToken}">
                        <div style="margin-left: 80px;" class="yjm">原密码：</div>
                        <input style="width: 278px;" class="srk" type="password" id="upwd" name="upwd" onclick="checkRules('upwd')">
                        <div style="margin-left: 80px;" class="yjm">新密码：</div>
                        <input style="width: 278px;" class="srk" type="password" id="npwd" name="npwd" onclick="checkRules('npwd')">
                        <div class="yjm" style="margin-left: 64px;">确认密码：</div>
                        <input style="width: 278px;" class="srk" type="password" id="nrpwd" name="nrpwd" onclick="checkRules('nrpwd')">
                        <div class="glxm">
                            <div style="margin-top: 30px;line-height: 15px;margin-left: 80px;" class="yjm">随机码：</div>
                            <ul style="width: 280px;margin-top: 10px;">
                                <li><input class="tex" type="text" id="code" name="code" onclick="checkRules('code')"></li>
                                <li><img id="img" src="${basePath}/page/chkcode.jsp" onclick="changePicCode('img')"/></li>
                            </ul>
                        </div>
                        <div class="redq" id="tipupwd" style="display: none;left:144px">请输入正确的原密码</div>
                        <div class="rede" id="tipnpwd" style="display: none;left:144px">密码需要8位以上数字+字母</div>
                        <div class="redt" id="tipnrpwd" style="display: none;left:144px">两次输入密码不一致，请重新输入</div>
                        <div class="redt" id="tipcode" style="display: none;left:144px;top: 273px;">请输入验证码</div>
                    </div>

                    <div class="img-lef"></div>
                    <div class="xg-btn">
                        <ul>
                            <li class="lrrq" onclick="updatePwd()" id="confirm" name="confirm">确定</li>
                            <li class="lrrs" onclick="resetPwd()" id="reset" name="reset">重置</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
<%@include file="/page/front/bottom.jsp" %>
</body>
</html>
