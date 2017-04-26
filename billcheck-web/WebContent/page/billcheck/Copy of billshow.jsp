<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %><%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@taglib prefix="bs" uri="/bstag" %><%
String path = request.getContextPath();
String port=":"+request.getServerPort();

String basePath = request.getScheme()+"://"+request.getServerName()+port+path+"/";
pageContext.setAttribute("basePath",basePath);

%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <title>票据查验</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<script type="text/javascript" src="${basePath}js/jquery-1.7.2.min.js"></script>
	<script src="${basePath}js/jquery.luara.0.0.1.min.js"></script>
	<link rel="stylesheet" href="${basePath}theme/front/billshow.css" type="text/css"></link>
	<script> var  baseUrl='${basePath}';</script>
	<script src="${basePath}page/front/js/pub.js"></script>
	<style media=print type="text/css"> 
		.noprint{visibility:hidden} 
	</style> 
	<script>
	function status(){
	   if($('#isLogin').val()=='true'){
	//未归户
           if($('#isBelong').val()=='0'){
        	   $('#belong').attr("class","a-bg1");
        	   $('#unbelong').attr("class","a-bg2");
        	   //已归户
           }else if($('#isBelong').val()=='1'){
        	   $('#belong').attr("class","a-bg2");
        	   $('#unbelong').attr("class","a-bg1");
        	   //都不能按
           }else if($('#isBelong').val()=='2'){
    		   $('#belong').attr("class","a-bg2");
    		   $('#unbelong').attr("class","a-bg2");
           }
           //未登录
	   }else{
		   $('#belong').attr("class","a-bg2");
		   $('#unbelong').attr("class","a-bg2");
	   }
	   //$('#downloadBill').attr('href','http://58.22.61.222:8080/BILL/pdf/0114022000000075.pdf')   
	}
	function downloadBill(){
       window.open("${bs:getConfig('basePdfUrl')}${pdfSignFile}");
	}
	</script>
  </head>
  <body onload="status()">
	${billshow}
    <input type="hidden" id="billCode" value="${billCode}">
    <input type="hidden" id="billNumber" value="${billNumber}">
    <input type="hidden" id="securityCode" value="${securityCode}">
    <input type="hidden" id="billStyle" value="${billStyle}">
    <input type="hidden" id="sumMoney" value="${sumMoney}">
    <input type="hidden" id="billDate" value="${billDate}">
    <input type="hidden" id="isLogin" value="${isLogin}">
    <input type="hidden" id="isBelong" value="${isBelong}">
    <input type="hidden" id="billDept" value="${billDept}">
    
    <div class="noprint">
	    <div class="ticketbutton">
	    	<a href="javascript:void(0)" class="a-bg1" onclick="downloadBill()">下载电子票据</a>
	        <a href="javascript:void(0)" class="a-bg1" onclick="chargeGist()">打印电子票据</a>
	    </div>
    </div>
    
    <object ID='WebBrowser' WIDTH=0 HEIGHT=0 CLASSID='CLSID:8856F961-340A-11D0-A96B-00C04FD705A2'></object>
  
  </body> 
  
	<script src="${basePath}page/billcheck/js/billshow.js"></script>
</html>
