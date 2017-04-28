var hash;
hash = (!window.location.hash) ? "#flag1" : window.location.hash; // 若没登入的话hash=flag1,默认到票据查验

$(document).ready(function() {
	isLogined();
});

// 一进页面判断是否登入
function isLogined() {
	// session
	var uid = $("#uid").val();
	if (uid != null && uid != "") {
	} else {
		alert('请先登录');
		window.parent.location.href = baseUrl + "page/front/login.jsp";
	}
}

function updatePwd() {
	//获取随机Token的值
	var headers = $("#CSRFToken").val();
	var isPwd = true;
	$.ajax({
		type : "POST",
		url : baseUrl + "user/isPwd",
		dataType : "text",
		cache : false,
		async : false,
		data : {
			passWord : $('#upwd').val(),
			userName : $('#userName').val()
		},
		success : function(data) {
			if (data == 0) {
				isPwd = false;
			}
		}
	});
	var boolean = true;
	if (!isPwd) {
		$("#upwd").attr("style", "border: #ff6060 1px solid;width:278px;");
		$("#tipupwd").show();
		boolean = false;
	}

	if ($('#npwd').val() == null || $('#npwd').val() == ''
			|| $('#npwd').val().replace(/\s+/g, "") == ""
			|| $('#npwd').val().length < 6 || $('#npwd').val().length > 20) {
		$("#npwd").attr("style", "border: #ff6060 1px solid;width:278px;");
		$("#tipnpwd").show();
		boolean = false;
	}
	if ($('#npwd').val() != $('#nrpwd').val()) {
		$("#nrpwd").attr("style", "border: #ff6060 1px solid;width:278px;");
		$("#tipnrpwd").show();
		boolean = false;
	}
	if ($('#code').val() == null || $('#code').val() == '') {
		$("#code").attr("style", "border: #ff6060 1px solid;");
		$("#tipcode").show();
		boolean = false;
	}
	if (boolean) {
		$.ajax({
			//向请求头中加入Token
			beforeSend: function(request) {
	    		request.setRequestHeader("CSRFToken", headers)},
			type : "POST",
			url : baseUrl + "user/updateUserPwd",
			dataType : "text",
			cache : false,
			data : {
				passWord : $('#npwd').val(),
				randomCode : $('#code').val(),
			},
			success : function(data) {
				if (data == 0) {
					resetPwd();
					alert('密码修改成功');
				} else {
					alert('修改失败1');
				}
			}
		});
	}

}

/** 焦点在输入框时隐藏提示* */
function checkRules(id) {
	if (id == 'upwd') {
		$("#upwd").attr("style", "width:278px;");
		$("#tipupwd").hide();
	}
	if (id == 'npwd') {
		$("#npwd").attr("style", "width:278px;");
		$("#tipnpwd").hide();
	}
	if (id == 'nrpwd') {
		$("#nrpwd").attr("style", "width:278px;");
		$("#tipnrpwd").hide();
	}
	if (id == 'code') {
		$("#code").attr("style", "");
		$("#tipcode").hide();
	}
}

function showLeftTime(type) {
	if (leftTime < 0) {
		clearInterval(timer);
		if (type == 'p') {
			$('#countTime').hide();
			$('#sendUrl').show();
		} else {
			$('#unitCountTime').hide();
			$('#sendUnitUrl').show();
		}
		leftTime = 61;
	} else {
		if (type == 'p') {
			$('#countTime').show();
			$('#sendUrl').hide();
			$('#countTime').html(
					'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余时间：' + leftTime
							+ '秒');
		} else {
			$('#unitCountTime').show();
			$('#sendUnitUrl').hide();
			$('#unitCountTime').html(
					'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余时间：' + leftTime
							+ '秒');
		}
	}
	leftTime--;
}

function showELeftTime(type) {
	if (eleftTime < 0) {
		clearInterval(etimer);
		if (type == 'p') {
			$('#countETime').hide();
			$('#sendEUrl').show();
		} else {
			$('#unitCountETime').hide();
			$('#sendUnitEUrl').show();
		}
		eleftTime = 61;
	} else {
		if (type == 'p') {
			$('#countETime').show();
			$('#sendEUrl').hide();
			$('#countETime').html(
					'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余时间：' + eleftTime
							+ '秒');
		} else {
			$('#unitCountETime').show();
			$('#sendUnitEUrl').hide();
			$('#unitCountETime').html(
					'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余时间：' + eleftTime
							+ '秒');
		}
	}
	eleftTime--;
}

function resetPwd() {
	$('#upwd').val("");
	$("#upwd").attr("style", "width:278px;");
	$("#tipupwd").hide();
	
	$('#npwd').val("");
	$("#npwd").attr("style", "width:278px;");
	$("#tipnpwd").hide();
	
	$('#code').val("");
	$("#code").attr("style", "");
	$("#tipcode").hide();
	
	$('#nrpwd').val("");
	$("#nrpwd").attr("style", "width:278px;");
	$("#tipnrpwd").hide();
	changePicCode('img');
}