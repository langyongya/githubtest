function register(){
	var boolean = true;
	if(!$("input[type='checkbox']").is(':checked')){
		layer.alert("相关服务条款未同意！");
		boolean = false;
	}

    var realName = $('#realName').val();
    if(realName.replace(/\s+/g,"")==""){
    	$("#realName").attr("style","border: #ff6060 1px solid;");
		$("#tiprealName").show();
		boolean = false;
    }
    if(realName.length < 1 || realName.length > 100){
    	$("#realName").attr("style","border: #ff6060 1px solid;");
		$("#tiprealName").show();
		boolean = false;
    }
    var patternName = /^[\u0391-\uFFE5|\w]+$/;
    if(!patternName.test(realName)){
    	$("#realName").attr("style","border: #ff6060 1px solid;");
		$("#tiprealName").show();
		boolean = false;
    }
    
	//validatemobilePhone($("#mobilePhone").val());//校验手机号码
    if($("#mobilePhone").val().length==0)
    {
    	$("#mobilePhone").attr("style","border: #ff6060 1px solid;position: relative;top: 70px;right: 295px;");
		$("#tipmobilePhone").show();
		boolean = false;
    }    
    if($("#mobilePhone").val().length!=11)
    {
    	$("#mobilePhone").attr("style","border: #ff6060 1px solid;position: relative;top: 70px;right: 295px;");
		$("#tipmobilePhone").show();
		boolean = false;
    }
    
    //如果手机号码不能通过验证
    if(!checkmobilePhone($("#mobilePhone").val())){
    	$("#mobilePhone").attr("style","border: #ff6060 1px solid;position: relative;top: 70px;right: 295px;");
		$("#tipmobilePhone").show();
		boolean = false;
    }

    if($('#authCode').val()==null||$('#authCode').val()==''){
    	$("#authCode").attr("style","border: #ff6060 1px solid;position: relative;left: 294px");
		$("#tipauthCode").show();
		boolean = false;
	}
	if($('#passWord').val()==null||$('#passWord').val()==''){
		$("#passWord").attr("style","border: #ff6060 1px solid;position: relative;top: 70px;right: 271px");
		$("#tippassWord").show();
		boolean = false;
	}
	if($('#passWord').val().replace(/\s+/g,"")==""){
		$("#passWord").attr("style","border: #ff6060 1px solid;position: relative;top: 70px;right: 271px");
		$("#tippassWord").show();
		boolean = false;
	}
	if(!checkPwdComplexity('passWord')){
		$("#passWord").attr("style","border: #ff6060 1px solid;position: relative;top: 70px;right: 271px");
		$("#tippassWord").show();
		boolean = false;
	}	
	if($('#passWord').val()!=$('#rpassWord').val())
	{
		$("#rpassWord").attr("style","border: #ff6060 1px solid;position: relative;left: 273px");
		$("#tiprpassWord").show();
		boolean = false;
	}
	if (boolean) {
		$.ajax({
			type: "POST",
			url: baseUrl + "user/register",
			dataType: "text",
			cache: false,
			data: {
				realName: $('#realName').val(),
				passWord: $('#passWord').val(),
				mobilePhone: $("#mobilePhone").val(),
				authCode:$("#authCode").val()
			},
			success: function (data) {
				if (data != "") {
					layer.alert(data);
				} else {
					window.location.href = baseUrl + "page/front/my_bill.jsp";
				}
			}
	});
	}
	
}

function hideHint(id){
	if (id == 'realName') {
		$("#realName").attr("style","");
		$("#tiprealName").hide();
	}
	if (id == 'mobilePhone') {
		$("#mobilePhone").attr("style","position: relative;top: 70px;right: 295px;");
		$("#tipmobilePhone").hide();
	}
	if (id == 'authCode') {
		$("#authCode").attr("style","position: relative;left: 294px");
		$("#tipauthCode").hide();
	}
	if (id == 'passWord') {
		$("#passWord").attr("style","position: relative;top: 70px;right: 271px");
		$("#tippassWord").hide();
	}
	if (id == 'rpassWord') {
		$("#rpassWord").attr("style","position: relative;left: 273px");
		$("#tiprpassWord").hide();
	}
	
}

function resetReg(){
	$('#name').val('');
	$('#orgCode').val('');
	$('#email').val('');
	$('#passWord').val('');
	$('#rpassWord').val('');
	$('#mobilePhone').val('');
	$('#authCode').val('');
	//清空省份
	$("#registerArea").combobox('setValue','');
	$('#registerAreaCode').val('');
	$("[name = isReg]:checkbox").attr("checked", true);
	$('#register').css("color","#FFF");
	$('#register').unbind("click");
	$('#register').click(function(){  
		register();
    });	
	window.location.href = baseUrl + "page/front/index.jsp";
}
function setReg(){
	    var isReg  = document.getElementById("isReg")
	    if(isReg.checked==true){
	    	$('#register').css("color","#FFF");
	    	$('#register').click(function(){  
	    		register();
	        });
	    }else{
	        $('#register').css("color","#CCC");
	        $('#register').unbind("click");
	    }
}

function validatemobilePhone(mobilePhone)
{
    if(mobilePhone.length==0)
    {
       layer.alert('请输入手机号码！');
       return false;
    }    
    if(mobilePhone.length!=11)
    {
        layer.alert('请输入有效的手机号码！');
        return false;
    }
    
    //var telReg = !mobilePhone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
    var pattern = /^1[34578]\d{9}$/;  
    
    //如果手机号码不能通过验证
    if(!pattern.test(mobilePhone)){
    	$("#mobilePhone").attr("style","border: #ff6060 1px solid;");
		$("#tipmobilePhone").show();
    	return false;
    }
    return true;
}

/*******发送手机验证码****/
function sendCheckNum(){
	$.ajax({
		type : "POST",
		url : baseUrl+"user/sendMessage",
		dataType:"text",
		cache:false,
		async:false,
		data:
		{
			mobilePhone:$("#mobilePhone").val()
		},
		success : function(data){
			//$("#authCode").val(data);
			if (data != 0)
			{
				layer.alert("短信未发送成功，请重试！");
			}
		},error:function(){
			layer.alert("系统繁忙请重试！");
		}
	});
}

/*******发送手机验证码****/
function sendCheckNumByUid(){
	$.ajax({
		type : "POST",
		url : baseUrl+"user/sendMessageByUid",
		dataType:"text",
		cache:false,
		async:false,
		data:
		{
			mobilePhone:$("#mobilePhone").val()
		},
		success : function(data){
			//$("#authCode").val(data);
			if (data != 0)
			{
				layer.alert("短信未发送成功，请重试！");
			}
		},error:function(){
			layer.alert("系统繁忙请重试！");
		}
	});
}

function improve(){
	//接受Token
	var headers = $("#CSRFToken").val();
	var boolean = true;
    if(!$("input[type='checkbox']").is(':checked')){
        layer.alert("相关服务条款未同意！");
        return;
    }

    var realName = $('#realName').val();
    if(realName.replace(/\s+/g,"")==""){
    	$("#realName").attr("style","border: #ff6060 1px solid;");
		$("#tiprealName").show();
		boolean = false;
    }
    if(realName.length < 1 || realName.length > 100){
    	$("#realName").attr("style","border: #ff6060 1px solid;");
		$("#tiprealName").show();
		boolean = false;
    }
    var patternName = /^[\u0391-\uFFE5|\w]+$/;
    if(!patternName.test(realName)){
    	$("#realName").attr("style","border: #ff6060 1px solid;");
		$("#tiprealName").show();
		boolean = false;
    }
    

    if($('#passWord').val()==null||$('#passWord').val()==''){
		$("#passWord").attr("style","border: #ff6060 1px solid;position: relative;top: 70px;right: 263px");
		$("#tippassWord").show();
		boolean = false;
	}
	if($('#passWord').val().replace(/\s+/g,"")==""){
		$("#passWord").attr("style","border: #ff6060 1px solid;position: relative;top: 70px;right: 263px");
		$("#tippassWord").show();
		boolean = false;
	}
	if(!checkPwdComplexity('passWord')){
		$("#passWord").attr("style","border: #ff6060 1px solid;position: relative;top: 70px;right: 263px");
		$("#tippassWord").show();
		boolean = false;
	}	
	if($('#passWord').val()!=$('#rpassWord').val())
	{
		$("#rpassWord").attr("style","border: #ff6060 1px solid;");
		$("#tiprpassWord").show();
		boolean = false;
	}
	if($('#randomCode').val()==null||$('#randomCode').val()==''){
    	$("#randomCode").attr("style","border: #ff6060 1px solid;");
		$("#tiprandomCode").show();
		boolean = false;
	}

	if (boolean) {
		$.ajax({
			//将Token加入headers
        	beforeSend: function(request) {
        		request.setRequestHeader("CSRFToken", headers)},
			type: "POST",
			url: baseUrl + "user/improve",
			dataType: "text",
			cache: false,
			data: {
				realName: $('#realName').val(),
				passWord: $('#passWord').val(),
				randomCode:$("#randomCode").val()
			},
			success: function (data) {
				if (data != "") {
					layer.alert(data);
				} else {
					window.location.href = baseUrl + "page/front/my_bill.jsp";
				}

			}
		});
	}
	

}


