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
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <base href="<%=basePath%>">
    <title>财政电子票据公共服务平台-票据查验</title>
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
    <script src="${basePath}page/billcheck/js/billcheck.js"></script>
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
                    <div style="border-left: solid 3px #00b1cb; background: #fff;" class="txxx-ny">
                        <div style="background: url(theme/front/images/icon-cyjh.png) no-repeat scroll 35px 11px;"
                             class="fl"></div>
                        <div style="color: #000000;" class="lt">票据查验</div>
                        <div style="top:97px;" class="drr"></div>
                    </div>
                </div>
                <c:if test="${empty sessionScope.uid}">
                    <div class="img-sl"></div>
                </c:if>
                <c:if test="${not empty sessionScope.uid}">
                    <div style="background: url()" class="txxx">
                        <div class="txxx-ny">
                            <div style="background: url(theme/front/images/icon-pj.png) no-repeat scroll 35px 12px;"
                                 class="fl"></div>
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
                </c:if>
            </div>
            <div class="box-lbg">
                <div class="box-ltit"><span>票据</span>查验</div>
                <div class="hl">如有任何疑问请致电 400-8877-945</div>
            </div>
        </div>
        <div class="box-r">
            <div class="wszl-tit">财政电子票据 /<span>手工查验</span></div>
            <div style="width: 352px;margin-left: 53px;" class="zcxx">
                <div class="yjm">电子票据代码：</div>
                <input style="width: 188px;" class="srk" type="text" id="billCode" name="billCode" onclick="checkRules('billCode')">
                <div class="bt">必填</div>
                <div class="yjm">电子票据号码：</div>
                <input style="width: 188px;" class="srk" type="text" id="billNumber" name="billNumber" onclick="checkRules('billNumber')">
                <div class="bt">必填</div>
                <div style="margin-left: 48px" class="yjm">校验码：</div>
                <input style="width: 188px;" class="srk" type="text" id="securityCode" name="securityCode" onclick="checkRules('securityCode')">
                <div class="bt">必填</div>
                
                <div class="redq" id="tipbillCode" style="left: 112px;display: none;">票据代码不能为空</div>
                <div class="rede" id="tipbillNumber" style="left: 112px;display: none;">票据号码不能为空</div>
                <div class="redt" id="tipsecurityCode" style="left: 112px;display: none;">校验码不能为空</div>
                
            </div>
            <div class="img-th"></div>
            <div style="width:390px;margin-left: 30px;height: 73px;" class="glxm">
                <div style="margin-left: 7px;line-height: 15px; margin-left: 70px;" class="yjm">随机码：</div>
                <ul style="width: 240px">
                    <li><input class="tex" type="text" id="code" name="code" onclick="checkRules('code')"></li>
                    <li><img id="img" src="${basePath}page/chkcodeByweb.jsp" onclick="changeByweb('img')"/></li>
                </ul>
                <div class="redw" id="tipcode" style="top:353px;display: none;">随机码不能为空</div>
                
            </div>
            <div style="width: 221px;margin-left: 84px;" class="xg-btn">
                <ul>
                    <li class="lrrq" onclick="billCheck()">查验</li>
                    <li class="lrrs" onclick="billCheckReset()">重置</li>
                </ul>
            </div>
            <form  action="" method="post" target="_blank" id="frmShowBill">
                <input type="hidden" id="rbillCode" name="rbillCode"/>
                <input type="hidden" id="rbillNumber" name="rbillNumber"/>
				<input type="hidden" id="rsecurityCode" name="rsecurityCode"/>
				
                <input type="hidden" id="billCodeShow" name="billCodeShow"/>
                <input type="hidden" id="billNumberShow" name="billNumberShow"/>
                <input type="hidden" id="securityCodeShow" name="securityCodeShow"/>
                <input type="hidden" id="interFaceStrShow" name="interFaceStrShow"/>
            </form>
        </div>
    </div>
</div>
<%@include file="/page/front/bottom.jsp" %>
</body>
</html>
