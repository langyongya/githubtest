<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@taglib prefix="bs" uri="/bstag" %>
<div class="top">
        <div class="logo">
            <div class="bsrj"></div>
        </div>
        <c:if test="${not empty sessionScope.uid}">
            <div class="dl">
                <ul>
                    <li onclick="toUserInfo()" style="background: transparent;width: 160px;" >欢迎,${sessionScope.name}</li>
                    <li onclick="userLogout()" style="position: absolute;left: 120px">退出</li>
                </ul>
            </div>

            <div style="margin-right: 10px;" class="she" onclick="toUserInfo()">用户中心</div>
            <div class="she" onclick="toMyBill()">我的票据</div>
        </c:if>
        <c:if test="${empty sessionScope.uid}">
            <div class="dl">
                <ul>
                    <li class="loginIcon" onclick="toLogin()">登录</li>
                    <li class="regIcon" onclick="toReg()">注册</li>
                    <div class="henz"></div>
                </ul>

            </div>

        </c:if>
        <div class="she" onclick="toBillCheck()">票据查验</div>
        <div class="she" onclick="toIndex()">首页</div>
</div>
