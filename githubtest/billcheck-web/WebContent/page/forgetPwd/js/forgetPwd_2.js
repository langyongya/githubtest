var timer;
var leftTime = 60;

/*******发送手机验证码****/
function getAuthCode() {
    $.ajax({
        type: "POST",
        url: baseUrl + "user/sendMessage",
        dataType: "text",
        cache: false,
        async: false,
        data: {
            mobilePhone: $("#mobilePhone").val()
        },
        success: function (data) {
            //$("#teleyzm").val(data);
            if (data != 0) {
                alert("短信未发送成功，请重试！");
            }
        }, error: function () {
            alert("系统繁忙请重试！");
        }
    });
}

function showLeftTime() {
    if (leftTime < 0) {
        clearInterval(timer);
        $('#countTime').hide();
        $('#sendUrl').show();
        leftTime = 61;
    } else {
        $('#countTime').show();
        $('#sendUrl').hide();
        $('#countTime').html('&nbsp;&nbsp;&nbsp;剩余时间：' + leftTime + '秒');
    }
    leftTime--;
}

//屏蔽 验证码输入后点击回车  表单消失的问题
function quickQueryCust(evt) {
    evt = (evt) ? evt : ((window.event) ? window.event : "") //兼容IE和Firefox获得keyBoardEvent对象
    var key = evt.keyCode ? evt.keyCode : evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值
    if (key == 13) { //判断是否是回车事件。
                     //根据需要执行某种操作。
        if ($('.ac_over').length > 0) {
            return true;
        } else {
            return false;
        }
    }
}

function validatemobile(mobile)
{
    if(mobile.length==0)
    {
    	$("#mobilePhone").attr("style","border: #ff6060 1px solid;width:278px;");
		$("#tipmobilePhone").show();
        return false;
    }
    if(mobile.length!=11)
    {
    	$("#mobilePhone").attr("style","border: #ff6060 1px solid;width:278px;");
		$("#tipmobilePhone").show();
        return false;
    }

    //var telReg = !mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
    var pattern = /^1[34578]\d{9}$/;

    //如果手机号码不能通过验证
    if(!pattern.test(mobile)){
    	$("#mobilePhone").attr("style","border: #ff6060 1px solid;width:278px;");
		$("#tipmobilePhone").show();
        return false;
    }
    return true;
}

