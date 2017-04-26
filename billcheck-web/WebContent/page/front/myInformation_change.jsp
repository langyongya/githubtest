<%@ page language="java" import="com.bosssoft.einvoice.billcheck.pub.util.Tools"
	pageEncoding="UTF-8"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="bs" uri="/bstag"%>
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
body {
	display: none !important;
}
</style>

<script type='text/javascript'>
	if (self === top) {
		var antiClickjack = document.getElementById('antiClickjack');
		antiClickjack.parentNode.removeChild(antiClickjack);
	} else {
		top.location = self.location;
	}
</script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<base href="<%=basePath%>">
<title>财政电子票据公共服务平台-用户管理中心</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<script>
	var baseUrl = '${basePath}';
</script>
<link rel="shortcut icon"
	href="http://www.bosssoft.com.cn:80/favicon.ico">
<link rel="stylesheet" type="text/css"
	href="${basePath}theme/front/style.css">
<link rel="stylesheet" type="text/css"
	href="${basePath}theme/front/base316.css">
<script type="text/javascript" src="${basePath}js/jquery-1.7.2.min.js"></script>
<script src="${basePath}js/jquery.luara.0.0.1.min.js"></script>
<script src="${basePath}js/easyui/jquery.easyui.min.js"></script>
<script src="${basePath}js/validateForm.js"></script>
<script src="${basePath}js/my97/WdatePicker.js"></script>
<script src="${basePath}js/ajaxfileupload.js"></script>
<script src="${basePath}page/front/js/pub.js"></script>
<script src="${basePath}page/front/js/myinfo_change.js"></script>
<script src="${basePath}js/layer/layer.min.js"></script>
</head>

<body>
	<div class="bg">
		<%@include file="/page/front/headerNew.jsp"%>
		<div class="box">
			<div class="box-l">
				<div class="box-ny">
					<div style="background: url()" class="txxx">
						<div class="txxx-ny">
							<div
								style="background: url(theme/front/images/icon-jl.png) no-repeat scroll 35px 12px;"
								class="fl"></div>
							<div class="lt" onclick="toIndex()">首页</div>
							<div class="ht"></div>
							<div class="lrr"></div>
						</div>
					</div>
					<div style="background: url()" class="txxx">
						<div class="txxx-ny">
							<div
								style="background: url(theme/front/images/icon-cy.png) no-repeat scroll 35px 12px;"
								class="fl"></div>
							<div class="lt" onclick="toBillCheck()">票据检验</div>
							<div class="ht"></div>
							<div class="arr"></div>
						</div>
					</div>
					<div style="background: url()" class="txxx">
						<div class="txxx-ny">
							<div
								style="background: url(theme/front/images/icon-pj.png) no-repeat scroll 35px 12px;"
								class="fl"></div>
							<div class="lt" onclick="toMyBill()">我的票据</div>
							<div class="ht"></div>
							<div class="srr"></div>
						</div>
					</div>
					<div style="background: url()" class="txxx">
						<div style="border-left: solid 3px #00b1cb; background: #fff;"
							class="txxx-ny">
							<div
								style="background: url(theme/front/images/icon-yh.png) no-repeat scroll 35px 12px;"
								class="fl"></div>
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
					<div class="box-ltit">
						<span>用户</span>中心
					</div>
					<div class="hl">欢迎回来，${sessionScope.name}</div>
				</div>
			</div>
			<div class="box-r">
				<div class="wszl-tit">
					我的 / <span>资料</span>
				</div>
				<div class="bg-yzm" id="bg-yzm" style="display: none;">
					<div class="sr-yzm">请输入随机码</div>
					<div class="yzm-hs">
						<img id="img" style="height: 30px;"
							src="${basePath}page/chkcode.jsp" onclick="changePicCode('img')" />
					</div>
					<div class="sq-yzm">然后点击保存</div>
					<input class="sasd" type="text" id="randomCode">
				</div>
				<div style="width: 610px; height: 161px;" class="zcxx">
					<%--  <div   style="margin-left: 30px;"  class="yjm">用户名：</div>
                        <input style="width: 190px;" class="srk" type="text" value="${sessionScope.username}" id="userName" name="userName" maxlength="50" readonly="readonly"> --%>
					<!-- 随机Token -->
					<input type='hidden' id="CSRFToken"
						name="CSRFToken" value="${CSRFToken}">
					<div style="margin-left: 10px;" class="yjm">
						<a href="javascript:void(0);" data-toggle="tooltip"
							data-placement="top" title="真实姓名使您准确收到电子票据">真实姓名：</a>
					</div>
					<input style="width: 190px;" class="srk" type="text" id="realName"
						name="realName" value="${sessionScope.name}" maxlength="18"
						onclick="checkRules('realName')">

					<div style="margin-left: 10px; position: absolute; top: 75px"
						class="yjm">
						<a href="javascript:void(0);" data-toggle="tooltip"
							data-placement="top" title="用于网站登录及接受电子票据通知">手机号码：</a>
					</div>
					<input style="width: 190px; top: 75px; right: 191px" class="srk"
						type="text" id="mobilePhone" name="mobilePhone"
						value="${sessionScope.phone}" maxlength="11"
						onchange="modifyPhone()" onclick="checkRules('mobilePhone')">

					<div
						style="position: absolute; top: 75px; margin-left: 295px; display: none;"
						class="yjm" id="authCodeMark">验证码：</div>
					<input style="left: 360px; width: 190px; top: 5px; display: none;"
						class="srk" type="text" id="authCode" name="authCode"
						onclick="checkRules('authCode')"> <input
						style="top: 99px; left: 473px; display: none;" class="asd"
						id="btn" value="获取验证码" />

					<div class="redq" id="tiprealName"
						style="display: none; left: 89px">请输入正确的姓名</div>
					<div class="rede" id="tipmobilePhone"
						style="display: none; left: 90px">请输入有效的手机号码</div>
					<div class="rede" id="tipauthCode"
						style="display: none; left: 359px">请输入验证码</div>

				</div>
				<div style="margin-left: 15px;" class="glxm">
					<div style="margin-left: 5px; line-height: 15px;" class="yjm">
						<a href="javascript:void(0);" data-toggle="tooltip"
							data-placement="top" title="归集其他交款人的电子票据">关联交款人：</a>
					</div>
					<ul id="ul1">
						<li style="color: #00c1de; background: url()" class="add">添加交款人</li>
						<div
							style="position: absolute; top: 290px; left: 648px; display: none;"
							class="ddsx" id="relateMaxMsg">关联交款人已达上限...</div>
					</ul>
					<div style="color: #00c1de; font-size: 14px;" class="xgglxm">请按回车确定</div>

				</div>
				<div style="margin-top: 40px;" class="xg-btn">
					<ul>
						<li class="lrrq" style="margin-left: 0px;" onclick="showYzm()">保存</li>
						<li class="lrrs" onclick="toUserInfo()">取消</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<%@include file="/page/front/bottom.jsp"%>
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
			setTimeout(function() {
				time(o)
			}, 1000)
		}
	}
	document.getElementById("btn").onclick = function() {
		var mobile = $("#mobilePhone").val();
		if (mobile == '' || mobile == null) {
			$("#authCode")
					.attr("style",
							"border: #ff6060 1px solid;position: relative;top: 5px;left: 360px;");
			$("#tipauthCode").show();
		} else {
			var istrue = validatemobile(mobile);
			if (istrue) {
				time(this);
				sendAuthCode();
			}
		}
	}
</script>
</html>
