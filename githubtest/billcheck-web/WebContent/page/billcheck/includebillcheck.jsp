<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>


    <ul>
<li><span class="query-form-span" style=" width: 100px">电子票据代码：</span><input id="billCode" name="billCode" class="query-input"   maxlength="50"/><font style="margin-left: 10px" color="red">*</font></li>
<li><span class="query-form-span"  style=" width: 100px">电子票据号码：</span><input id="billNumber" name="billNumber" class="query-input"    maxlength="50"/><font style="margin-left: 10px" color="red">*</font></li>
<li><span class="query-form-span"  style=" width: 100px">防伪码：</span><input id="securityCode" name="securityCode" class="query-input"    maxlength="50"/><font style="margin-left: 10px" color="red">*</font></li>
<li><span class="query-form-span" style=" width: 100px">验证码：</span><input id="code" name="code" class="query-input"   maxlength="4" width="80px"/>
&nbsp;<img  id="img"  src="${basePath}/page/chkcode.jsp" onclick="change('img')" /></li>
<li style="margin-top:30px;"><span class="query-form-span">&nbsp;</span><a href="javascript:void(0)" class="a-button4" onclick="billCheck()">查验</a><a href="javascript:void(0)" class="a-button5" onclick="billCheckReset()">重置</a></li>
     </ul>



<form  method="post" action=""  target="_blank" id="frmShowBill">
	    <input type="hidden" id="billCodeShow" name="billCodeShow"/>
	    <input type="hidden" id="billNumberShow" name="billNumberShow"/>
	    <input type="hidden" id="securityCodeShow" name="securityCodeShow"/>
	    <input type="hidden" id="interFaceStrShow" name="interFaceStrShow"/>
</form>

  <script src="${basePath}page/billcheck/js/billcheck.js"></script>