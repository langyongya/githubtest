$(document).ready(function () {
    isLogined();
    var str = $('#relatename').val();
    if(str!=null && str != ''){
        var names = str.split(",");
        for (i = 0; i < names.length; i++){
            if(names[i]!=null && names[i] != ''){
                var name = $("<li id='"+names[i]+"'>" + names[i] + "</li>");
                $(".add").before(name);
            }
        }
    }
    var size = $("#ul1").children("li").length;
    if(size >= 8){
        $(".add").hide();
        $("#relateMaxMsg").show();
    }

    $("#ul1 li[class!='add']").on("click",removeThis);

    $(".add").click(function(){
        var size = $(this).parent().children("li").length;
        if(size == 9){
            return;
        }
        if(size == 8){
            $(this).hide();
            $("#relateMaxMsg").show();
        }
        var li = $("<li><input type='text' /></li>");
        //li.click(removeThis);
        $(this).before(li);
        li.children().focus();
    });
});

function removeThis(){
    var size = $(this).parent().children("li").length;
    $(this).remove();
    var size = $(this).parent().children("li").length;
    if(size < 9){
        $(".add").show();
        $("#relateMaxMsg").hide();
    }
}

$(window).keydown(function(event){

    if(event.keyCode == 13) {
        // 回车
        var id = $(event.srcElement).parent().parent().attr("id");

        if(id == 'ul1'){
            var value = $(event.srcElement).val();
            $(event.srcElement).parent().on("click" ,removeThis);
            $(event.srcElement).parent().attr("id", value)
            $(event.srcElement).parent().html(value);
        }
    }
});

//一进页面判断是否登入
function isLogined() {
    //session
    var uid = $("#uid").val();
    if (uid != null && uid != "") {
    } else {
        layer.alert('请先登录');
        window.parent.location.href = baseUrl + "page/front/login.jsp";
    }
}

function validatemobile(mobile)
{
    if(mobile.length==0)
    {
        layer.alert('请输入手机号码！');
        return false;
    }
    if(mobile.length!=11)
    {
        layer.alert('请输入有效的手机号码！');
        return false;
    }

    //var telReg = !mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
    var pattern = /^1[34578]\d{9}$/;

    //如果手机号码不能通过验证
    if(!pattern.test(mobile)){
        layer.alert('请输入有效的手机号码！');
        return false;
    }
    return true;
}

var timer;
var leftTime = 60;
/**
 * 发送手机验证码
 * @return
 */
function sendAuthCode() {
    var mobile = $("#mobilePhone").val();
    var mobilePartton = /^1[3,5,8]\d{9}$/;
    if (mobile == '' || !mobilePartton.test(mobile)) {
        layer.alert('请输入正确的手机号码');
        return;
    } else {
        layer.alert("已给尾号" + mobile.substring(7, 11) + "的手机发送验证码");
        $.ajax({
            type: "POST",
            url: baseUrl + "user/sendMessage",
            dataType: "text",
            cache: false,
            data: {
                mobilePhone: mobile
            },
            success: function (data) {
                if (data != 0) {
                    layer.alert("消息", "短信发送失败!", "info");
                }
            }
        });
    }
}

function showYzm(){
    var yzm = $("#randomCode").val();
    if ($("#randomCode").is(":hidden")) {
        $('#bg-yzm').show();
    }else if(!($("#randomCode").is(":hidden"))&&yzm != null && yzm != ""){
        updateUser();
    }else{
        layer.alert("请输入图片随机码！");
    }
}

/**
 * 修改个人用户信息
 * @return
 */
function updateUser() {
	//接受Token
	var headers = $("#CSRFToken").val();
	
	var isAuthCode = true;
	var realname = $('#realName').val();
    if(realname.replace(/\s+/g,"")==""){
    	$("#realName").attr("style","border: #ff6060 1px solid;");
		$("#tiprealName").show();
		isAuthCode = false;
    }
    if(realname.length < 1 || realname.length > 100){
    	$("#realName").attr("style","border: #ff6060 1px solid;");
		$("#tiprealName").show();
		isAuthCode = false;
    }
    var patternName = /^[\u0391-\uFFE5|\w]+$/;
    if(!patternName.test(realname)){
    	$("#realName").attr("style","border: #ff6060 1px solid;");
		$("#tiprealName").show();
		isAuthCode = false;
    }
    if($("#mobilePhone").val().length==0)
    {
    	$("#mobilePhone").attr("style","border: #ff6060 1px solid;top: 75px;right: 191px;");
		$("#tipmobilePhone").show();
		isAuthCode = false;
    }    
    if($("#mobilePhone").val().length!=11)
    {
    	$("#mobilePhone").attr("style","border: #ff6060 1px solid;top: 75px;right: 191px;");
		$("#tipmobilePhone").show();
		isAuthCode = false;
    }
    
    
    var mobile = $('#mobilePhone').val();
    if (mobile != null && mobile != "") {
        var mobilePartton = /^1[3,5,8]\d{9}$/;
        if (mobile == '' || !mobilePartton.test(mobile)) {
        	$("#mobilePhone").attr("style","border: #ff6060 1px solid;top: 75px;right: 191px;");
    		$("#tipmobilePhone").show();
    		isAuthCode = false;
        }
        
  }
    if (!$("#authCode").is(":hidden")) {
    	if ($("#authCode").val() == null || $("#authCode").val() == '') {
    		$("#authCode").attr("style","border: #ff6060 1px solid;position: relative;top: 5px;left: 360px;");
    		$("#tipauthCode").show();
    		isAuthCode = false;
		}
    }
    
    var names = $("#ul1").children("li");
    var result = "";
    $.each(names, function(i, item){
        var id = $(item).attr("id");
        if(id != undefined){
            result = result + "," + $(item).attr("id");
        }
    
    });
    if (isAuthCode) {
            $.ajax({
            	//将Token加入headers
            	beforeSend: function(request) {
            		request.setRequestHeader("CSRFToken", headers)},
            	
                type: "POST",
                url: baseUrl + "user/updateRegUser",
                dataType: "text",
                cache: false,
                data: {
                    uid: $('#uid').val(),
                    mobilePhone: $('#mobilePhone').val(),
                    relateName: result,
                    realName: $('#realName').val(),
                    authCode: $("#authCode").val(),
                    randomCode: $('#randomCode').val()
                },
                success: function (data) {
                    if (data == 0) {
                        layer.alert('修改成功');
                        window.parent.location.href = baseUrl + "page/front/myInformation.jsp";
                    }else if(data == 2){
                        layer.alert('随机码错误');
                    } else {
                        layer.alert('修改失败');
                    }
                }
            });
    } 
}

function modifyPhone() {
	var phone = document.getElementById("mobilePhone").value;
    $('#mobilePhone').val(phone);
    $('#btn').show();
    $('#authCodeMark').show();
    $('#authCode').show();
}

