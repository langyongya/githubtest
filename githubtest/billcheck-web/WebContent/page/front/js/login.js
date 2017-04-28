$(document).ready(function(){
	
    var appid;
    var scope;
    var redirect_uri;
    var state;
    
    $.ajax({
        async : false,//同步请求
        type : "POST",
        url : baseUrl + "user/getQrcodeInfo",
        dataType : "text",
        success : function(data) {
            var jsonData=JSON.parse(data);
            appid = jsonData.appid;
            scope = jsonData.scope;
            redirect_uri = jsonData.redirect_uri;
            state = jsonData.state;
        },
        error : function(data){
            alert("出现异常，异常原因【" + data + "】!");
        }
    });

    var obj = new WxLogin({
        id:"login_container",
        appid: appid,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        style: "black", //"black"、"white" default:black
        href: "https://liqw.online/css/wxqrcode.css"
    });



});
function changeLoginToWx() {
    $('#loginWithName').hide();
    $('#loginWithWX').show();
}
function changeLoginToName() {
    $('#loginWithWX').hide();
    $('#loginWithName').show();
}

function formsub() {
    $("#warning").hide();
    var mobilePhone = $("#mobilePhone").val();
    var passWord = $("#passWord").val();
    //var code = $("#code").val();
    var savepassword = document.getElementById("savepassword"); //是否保存用户
    //去掉了保存密码功能
    //var passwordtag = savepassword.checked;
    $.ajax({
        type: "POST",
        url: baseUrl + "user/login",
        dataType: "text",
        data: {
            //type:userType,
        	mobilePhone: mobilePhone,
            passWord: passWord,
            //savepassword:passwordtag
            
        },
        success: function (data) {
            var dataArray = data.split('$');
            if (dataArray[0] == '0') {
                window.parent.location.href = baseUrl + "page/front/my_bill.jsp";
            } else if (dataArray[0] == '1') {
                //window.parent.location.href=baseUrl + "page/front/register_email.jsp?email="+dataArray[1]+"&userId="+dataArray[2];
                window.parent.location.href = baseUrl + "page/front/my_bill.jsp";
            } else {
                $("#warning").show();
            }
        }
    });
}
function submitFrm(event) {
    //oPub.exeEnter(event,"$('#loginFrm').submit()");
    if (event.keyCode == 13) {
        document.all('loginsubmit').click();
    }
}
function changeUserType(value) {
    if (value != 1) {
        $('#usernamestr').val('机构代码')
    } else {
        $('#usernamestr').val('邮箱')
    }
    $('#type').val(value)
}
function submitFrm(event) {
    if (event.keyCode == 13) {
        document.all('loginsubmit').click();
    }
}