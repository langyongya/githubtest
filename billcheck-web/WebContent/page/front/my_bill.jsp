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
    <title>财政电子票据公共服务平台-我的票据</title>
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
    <script src="${basePath}page/front/js/mybill.js"></script>
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
                    <div style="border-left: solid 3px #00b1cb; background: #fff; height: 50px;" class="txxx-ny">
                        <div style="background:url(theme/front/images/icon-pjjh.png) no-repeat 35px 12px;"
                             class="fl"></div>
                        <div style="color: #000000;" class="lt">我的票据</div>
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
            <div style="margin-left: 5px;" class="wszl-tit">我的 / <span>票据</span></div>
            <div class="dica">
                <ul>
                    <li name="group" value="1" id="radio0" >近三个月</li>
                    <li name="group" value="2" id="radio1" >近六个月</li>
                    <li name="group" value="3" id="radio2" >本年度</li>
                    <li name="group" value="4" id="radio3" >更多</li>
                </ul>
                <div class="ykcx" id="queryLi" name="queryLi" style="display: none;" onclick="pagingOfBill(1)">查询</div>
            </div>
            <div class="rqsd" style="display: none;" id="moreLi" name="moreLi">
                <div class="qzsj">开始时间</div>
                <div class="qz-srk">
                    <input type="text" name="sDate1" id="sDate1" value="" size="12" class="Wdate"
                           onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'sDate2\')||\'2200-01-01 00:00:00\'}',readOnly:true})" />
                </div>
                <div class="qzsj">结束时间</div>
                <div class="qz-srk">
                    <input type="text" name="sDate2" id="sDate2" value="" size="12" class="Wdate"
                           onclick="WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'sDate1\')||\'1900-01-01 00:00:00\'}',readOnly:true})" />
                </div>
                <div class="qzsq">票据代码：</div>
                <input type="text" class="text-le" name="qryInvoiceCode" id="qryInvoiceCode">
                <div class="qzsq">票据号码：</div>
                <input type="text" class="text-le" name="qryInvoiceNum" id="qryInvoiceNum">
            </div>


            <div class="nayoya-bg">
                <table cellspacing="0" cellpadding="0" width="658">
                    <tbody class="table-hd">
                    <th width="33px">NO</th>
                    <th width="15%">开票日期</th>
                    <th width="15%">交款人</th>
                    <th width="15%">金额</th>
                    <th width="23%">开票单位</th>
                    <th width="17%">票据号码</th>
                    <th width="10%">操作</th>
                    </tbody>
                </table>
                <div class="table-ny" style="table-layout:fixed;">
                    <table width="658">
                        <tbody class="bor">
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="ymxz">
                <ul>
                    <li onclick="billfirst();" id="first">首页</li>
                    <li onclick="billback();" id="back">上一页</li>
                    <li onclick="billnext();" id="next">下一页</li>
                </ul>
                <div class="ymxz-jl" id="page">
                    当前第<span id="pageNow" class="page_on"></span>页　每页8条　共<span id="total" class="page_on"></span>页
                </div>
                <span id="lastStartPos" type="hidden"></span>
                <span id="endpos" type="hidden"></span>
            </div>
            <form  method="post" action=""  target="_blank" id="frmShowBill">
                <input type="hidden" id="rbillCode" name="rbillCode"/>
                <input type="hidden" id="rbillNumber" name="rbillNumber"/>
                <input type="hidden" id="rsecurityCode" name="rsecurityCode"/>
                <input type="hidden" id="billCodeShow" name="billCodeShow"/>
            </form>
        </div>
    </div>
</div>
<%@include file="/page/front/bottom.jsp" %>
</body>
<script src="${basePath}page/billcheck/js/billcheck.js"></script>
</html>
