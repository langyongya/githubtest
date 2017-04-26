function reset() {
	$('#mobilePhone').val('');
	$("#mobilePhone").attr("style", "width:278px;");
	$("#tipmobilePhone").hide();
	$('#authCode').val('');
	$("#authCode").attr("style", "width:278px;");
	$("#tipauthCode").hide();
	$('#passWord').val('');
	$("#passWord").attr("style", "width:278px;");
	$("#tippassWord").hide();
	$('#rpassWord').val('');
	$("#rpassWord").attr("style", "");
	$("#tiprpassWord").hide();
	$('#confirm').unbind("click");
	$('#confirm').click(function() {
		register();
	});
}

/** 焦点在输入框时隐藏提示* */
function checkRules(id) {
	if (id == 'mobilePhone') {
		$("#mobilePhone").attr("style", "width:278px;");
		$("#tipmobilePhone").hide();
	}
	if (id == 'authCode') {
		$("#authCode").attr("style", "width:278px;");
		$("#tipauthCode").hide();
	}
	if (id == 'passWord') {
		$("#passWord").attr("style", "width:278px;");
		$("#tippassWord").hide();
	}
	if (id == 'rpassWord') {
		$("#rpassWord").attr("style", "width:278px;");
		$("#tiprpassWord").hide();
	}
}

function formsub() {
	//接受Token
	var headers = $("#CSRFToken").val();
	var mobile = $('#mobilePhone').val();
	var code = $('#authCode').val();
	var password = $('#passWord').val();
	var password2 = $('#rpassWord').val();
	var passwordtrim = $('#rpassWord').val().trim().length;
	var length = document.getElementById("rpassWord").value.length;
	var boolean = true;
	if (!validatemobile(mobile)) {
		boolean = false;
	}
	if ($('#authCode').val() == null || $('#authCode').val() == '') {
		$("#authCode").attr("style", "border: #ff6060 1px solid;width:278px;");
		$("#tipauthCode").show();
		boolean = false;
	}
	if ($('#passWord').val() == null || $('#passWord').val() == '' || $('#passWord').val().replace(/\s+/g, "") == "" || $('#passWord').val().length < 6 || $('#passWord').val().length > 20) {
		$("#passWord").attr("style", "border: #ff6060 1px solid;width:278px;");
		$("#tippassWord").show();
		boolean = false;
	}
	if (password != password2 || passwordtrim != length || (length > 20)
			|| (length < 6)) {
		$("#rpassWord").attr("style", "border: #ff6060 1px solid;width:278px;");
		$("#tiprpassWord").show();
		boolean = false;
	}

	if (boolean) {
		$.ajax({
			//将Token加入headers
        	beforeSend: function(request) {
        		request.setRequestHeader("CSRFToken", headers)},
			type : "POST",
			url : baseUrl + "user/resetPwd",
			dataType : "text",
			async : false,
			data : {
				mobilePhone : mobile,
				authCode : code,
				passWord : password
			},
			success : function(data) {
				if (data == '0') {
					alert('修改失败！');
				} else {
					alert('密码已重置，请登录！');
					window.parent.location.href = baseUrl
							+ "page/front/login.jsp";
				}
			}
		});
	}
}

String.prototype.trim = function() {
	return Trim(this);
};
function LTrim(str) {
	var i;
	for (i = 0; i < str.length; i++) {
		if (str.charAt(i) != " " && str.charAt(i) != " ")
			break;
	}
	str = str.substring(i, str.length);
	return str;
}
function RTrim(str) {
	var i;
	for (i = str.length - 1; i >= 0; i--) {
		if (str.charAt(i) != " " && str.charAt(i) != " ")
			break;
	}
	str = str.substring(0, i + 1);
	return str;
}
function Trim(str) {
	return LTrim(RTrim(str));
}
