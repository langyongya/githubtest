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
	<link rel="stylesheet" href="${basePath}theme/front/billshow.css" type="text/css"/>
	<script> var  baseUrl='${basePath}';</script>
	<script src="${basePath}page/front/js/pub.js"></script>
	<script src="${basePath}page/billcheck/js/billcheck.js"></script>
	<style media=print type="text/css"> 
		.noprint{visibility:hidden} 
	</style> 

  </head>
  <body>
    <div class="noprint">
	    <div class="ticketbutton">
	    	 <a href="javascript:void(0)" class="a-bg1" id="downbill" onclick="downloadBill()">下载电子票据</a> 
<%--	    	<br/>--%>
<%--	    	<font color="red"><b>如需下载票据，请单击鼠标右键后选取图片另存为。</b></font>--%>
	    </div>
    </div>
 	<div style="text-align:center;">
		<img id="imgObj" ></img>
	</div>
	<!-- 入账情况 -->

  </body> 
	<script>
       /* var attach = "${sessionScope.attach}";
       $(document).ready(function(){
    		$("#imgObj").attr("src",baseUrl+"billimg/" + attach);
       }); */
       
       
       $(document).ready(function(){
    		$("#imgObj").attr("src",baseUrl+"billcheck/showBill/${EInvoiceCode}.${EInvoiceNumber}.${RandomNumber}");
       });
       
       var attach = "billcheck/showBill/${EInvoiceCode}.${EInvoiceNumber}.${RandomNumber}";

    	function downloadBill(){
    		$("#downbill").attr("href",baseUrl+"billcheck/downofbill/"+"${EInvoiceCode}.${EInvoiceNumber}.${RandomNumber}");
    	}
    </script>
</html>
