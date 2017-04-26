<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@taglib prefix="bs" uri="/bstag" %><%
String path = request.getContextPath();
String port=":"+request.getServerPort();

String basePath = request.getScheme()+"://"+request.getServerName()+port+path+"/";
pageContext.setAttribute("basePath",basePath);

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
    <base href="<%=basePath%>"> 
    <title>相关服务条款</title>   
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<script> var  baseUrl='${basePath}';</script>
	  <link rel="shortcut icon" href="http://www.bosssoft.com.cn:80/favicon.ico">
	  <link rel="stylesheet" type="text/css" href="${basePath}theme/front/style.css">
	  <link rel="stylesheet" type="text/css" href="${basePath}theme/front/base316.css">
	<script src="${basePath}page/front/js/pub.js"></script>
  </head>
  
  <body>

	<div class="bg">
		<%@include file="/page/front/headerNew.jsp" %>
	     <div class="sub-main-r2" style="background-color: ghostwhite;">
	          
	          <div class="s-m-r-notice-detail" >
	                 <div class="ser_detail_tit" style="text-align: center;">
	                       <h5 id="title" style="font-size: 20px;text-align: center;">相关服务条款</h5>
	                       <p><span id="pubdate"></span><span id="source"></span></p>
	                 </div>
	                 <div class="ser_detail_cont" id="noticeContent" style="margin-left: 200px;margin-right: 200px;">
	                 <p><strong class="tit">欢迎阅读财政电子票据公共服务平台服务条款，其阐述之内容和条件适用于您使用本网站提供的各项服务。</strong>
						</p>
						<h2>1、服务条款的确认</h2>
						<p> 您勾选注册页面下的“已经阅读并同意相关服务条款”，即视为您已阅读、了解并完全同意服务条款中的各项内容，包括本网站对服务条款所作的任何修改，自愿遵守相关公告的规定，办理电子票据公众服务平台的各项相关业务。除另行明确声明外，本网站任何服务范围或功能的变化均受服务条款约束。</p>
						<h2>2、服务条款的修改</h2>
						<p>本网站在必要时可修改服务条款，并在网站进行公告，一经公告，立即生效。如您继续使用服务，则视为您已接受修订的服务条款。</p>
						<h2>3、用户注册</h2>
						<p>本网站有权对您提供的资料进行核验，核验结果仅适用于您在本网站办理注册以及查询的相关业务；如您提供的资料不准确，或无法通过网站核验，或本网站有合理的理由认为该资料不真实、不完整、不准确，本网站有权暂停或终止您的注册身份及资料，并拒绝您使用本网站的服务。</p>
						<h2>4、用户资料及保密</h2>
						<p>注册时，请您选择填写用户名和密码，并按页面提示提交相关信息。您负有对用户名和密码保密的义务，并对该用户名和密码下发生的所有活动承担责任。请您不要把用户名、密码和注册时填写的个人信息提供给第三方网站或他人使用。您同意邮件服务的使用由您自己承担风险。本网站不会向您所使用服务所涉及相关方之外的其他方公开或透露您的个人资料，法律法规规定除外。</p>
						<h2>5、责任的免除和限制</h2>
						<p>(1)遇以下情况，本网站不承担任何责任，包括但不仅限于： ①因不可抗力、系统故障、通讯故障、网络拥堵、供电系统故障、恶意攻击等造成本网站未能及时、准确、完整地提供服务。 ②无论在任何原因下，您通过使用本网站上的信息或由本网站链接的其他网站上的信息，或其他与本网站链接的网站上的信息所导致的任何损失或损害。 ③在“3.用户注册”第二款情形下，注册用户被暂停使用的后果。</p>
						<p>(2)本网站负责对本网站上的信息进行核验与更新，但并不就信息的时效性、准确性以及服务功能的完整性和可靠性承担任何义务和赔偿责任。</p>
						<p>(3)如用户利用系统差错、故障或其他原因导致的漏洞，损害本网站及任何第三方的权益，本网站将终止该用户资格，并保留法律追究的权利。</p>
						<h2>6、保障</h2>
						<p>您同意保障和维护本网站的利益，并承担您或其他人使用您的用户资料造成本网站或任何第三方的损失或损害的赔偿责任。</p>
						<h2>7、知识产权</h2>
						<p>本网站所有内容和资源的版权归本网站所有(除非本网站已经标明版权所有人)，页面所有信息受《中华人民共和国著作权法》及相关法律法规和中国加入的所有知识产权方面的国际条约的保护。未经本网站事先的书面许可，任何单位和个人不得就本网站上的相关资源以任何方式、任何文字做全部或局部复制、修改、发送、储存、发布、交流或分发，或利用本网站上的相关资源创建其他商业用途的资源。否则本网站将追究其法律责任。</p>
						<h2>8、法律适用和管辖</h2>
						<p>本服务条款之效力、解释、变更、执行与争议解决均适用中华人民共和国法律。 因您使用本网站而导致的争议，您同意接受本网站注册地人民法院的管辖。 本网站享有对服务条款的最终解释与修改权。</p>
	                  </div>
	                  <div class="ser_detail_updown">
	                  </div>
	          </div>           
	     </div>
	</div>	  
<%@include file="/page/front/bottom.jsp" %>
  </body>
</html>
