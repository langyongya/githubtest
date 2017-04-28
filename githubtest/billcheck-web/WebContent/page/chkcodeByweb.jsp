<%@page import="com.bosssoft.einvoice.billcheck.pub.util.RandImgCreater"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	response.setHeader("Pragma","No-cache");
	response.setHeader("Cache-Control","no-cache");
	response.setDateHeader("Expires", 0);
	response.reset();
	RandImgCreater rc = new RandImgCreater(response);
	String rand = rc.createRandImageByWebSelf();
	
	session.setAttribute("code",rand);
//	RandImgCreater rc1 = new RandImgCreater();
//	rc1.createRandImageWithResponse();
	out.clear();
	out = pageContext.pushBody(); 
	%>