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
    <script type="text/javascript">
        $(document).ready(function(){
            var str = $('#relatename').val();
            if(str!=null && str != ''){
                var names = str.split(",");
                for (var i = 0; i < names.length; i++){
                    if(names[i]!=null && names[i] != ''){
                    var name = $("<li style=\"background:none;\" id='"+names[i]+"'>" + names[i] + "</li>");
                    $(".markdown").before(name);
                    }
                }
            }else{
                var name = $("<li style=\"background:none;\">暂无</li>");
                $(".markdown").before(name);
            }
        });
    </script>
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
                            <div style="border-left: solid 3px #00b1cb; background: #fff;" class="txxx-ny">
                                <div style="background: url(theme/front/images/icon-yh.png) no-repeat scroll 35px 12px;" class="fl"></div>
                                <div style="color: #000000;" class="lt">个人信息</div>
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
                    <div class="wszl-tit">我的 / <span>资料</span></div>
                    <div class="zcxx">
                       <%--  <div class="yjm" style="margin-left: 17px;">用户名：</div>
                        <input style="width: 245px;" class="srk" type="text" value="${sessionScope.username}" readonly="readonly"> --%>
                        <div class="yjm"><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="真实姓名使您准确收到电子票据">真实姓名：</a></div>
                        <input style="width: 245px;" class="srk" type="text" value="${sessionScope.name}" readonly="readonly">
                        <div class="yjm" style="position: absolute;top:106px"><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="用于网站登录及接受电子票据通知">手机号码：</a></div>
                        <input style="width: 245px;top:38px;left:80px;" class="srk" type="text" value="${sessionScope.phone}" readonly="readonly">

                    </div>
                    <div class="img-yh"></div>
                    <div class="glxm">
                        <div style="margin-left: 7px;line-height: 15px;" class="yjm"><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="归集其他交款人的电子票据">关联交款人：</a></div>
                        <ul>
                            <li class="markdown" style="display:none;"></li>
                        </ul>
                    </div>
                    <div class="ddsx" style="position: absolute;top:368px">增加关联交款人后，可将相关的电子票据归集到您的账户</div>
                    <div class="xg-btn">
                        <ul>
                            <li class="lrrq" onclick="toUserInfoChange()">修改</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
<%@include file="/page/front/bottom.jsp" %>
</body>
</html>
