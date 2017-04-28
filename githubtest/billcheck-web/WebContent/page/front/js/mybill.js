var hash;
hash = (!window.location.hash) ? "#flag1" : window.location.hash; //若没登入的话hash=flag1,默认到票据查验

$(document).ready(function () {
    $(document).ready(function () {
        $('li[name="group"]').bind("click", function () {
            var flag = $(this).val();
            $('li[name="group"]').attr("style","none;");
            $('li[name="group"]').removeClass("chosen");
            $(this).attr('style','background: url("theme/front/images/rain-l.png") no-repeat scroll 0px 6px;');
            $(this).addClass("chosen");
            if (flag == 4) {
                $('#moreLi').show();
                $('#queryLi').show();
            } else {
                $('#moreLi').hide();
                $('#queryLi').hide();
                pagingOfBill(1);
            }
        });
    });
    isLogined();

});

//一进页面判断是否登入
function isLogined() {
    //session
    var uid = $("#uid").val();
    if (uid != null && uid != "") {
        $('#radio0').attr('style', 'background: url("theme/front/images/rain-l.png") no-repeat scroll 0px 6px;');
        $('#radio0').addClass("chosen");
        pagingOfBill(1);
    } else {
        layer.alert('请先登录');
        window.parent.location.href = baseUrl + "page/front/login.jsp";
    }
}

function userInfo(_flag) {
    //$('#userLogOut').show();
    $('#bpwdinfo').show();
    //session
    var uid = $("#uid").val();
    if (uid != null && uid != "") {
        changeList(_flag);
    } else {
        $('#bpwdinfo').hide();
        layer.alert('请先登录');
        window.parent.location.href = baseUrl + "page/front/login.jsp";
    }
}

var pageSize = 8;
var titleTr = "";
function pagingOfBill(pageNow, isBack) {
    var startList = $('#lastStartPos').val().split(',');
    var givenPos;
    
    if (startList != null && startList != "") {
        if (pageNow < startList.length) {
            startList.pop();
        }
        givenPos = (!!isBack && startList.pop() ) || $('#endpos').val();
    } else {
        startList = new Array();
        givenPos = $('#endpos').val();
    }
    $.ajax({
    	
        type: "POST",
        url: baseUrl + "user/pageOfBill",
        dataType: "json",
        cache: false,
        data: {
            pageNow: pageNow,
            pageSize: pageSize,
            endPos: givenPos,
            qryInvoiceCode: $('#qryInvoiceCode').val(),
            qryInvoiceNum: $('#qryInvoiceNum').val(),
            userId: $('#uid').val(),
            beginDate: $('#sDate1').val(),
            endDate: $('#sDate2').val(),
            timeFlag: $('.chosen').val(),
        },
        success: function (data) {
            var dataUl = $(".bor");
            if (data == null || data.length == 0 || data.totalCount == 0) {
                dataUl.empty();
                appendTitleTr(dataUl);
                $("#page").hide();
                $("#pageNum").hide();
                $("#first").hide();
                $("#back").hide();
                $("#next").hide();
                $("#tail").hide();
                //layer.alert('暂无数据')
            } else {
                $("#page").show();
                $("#pageNum").show();
                $("#page").show();
                var currentPage = pageNow;
                var startPos = data.startPos;
                var endPos = data.endPos;
                var totalPage = data.totalPageNo;

                $("#pageNow").html(currentPage);
                $("#total").html(totalPage);
                $('#pageNum').html("共" + data.totalCount + "条");

                if (totalPage == 0) {
                    dataUl.empty();
                    $("#first").hide();
                    $("#back").hide();
                    $("#next").hide();
                    $("#tail").hide();
                }

                if (currentPage == 1 && totalPage == 1) {
                    dataUl.empty();
                    appendTitleTr(dataUl);
                    $("#first").hide();
                    $("#back").hide();
                    $("#next").hide();
                    $("#tail").hide();
                    $('#lastStartPos').val(startPos);
                    $('#endpos').val(endPos);
                }
                if (currentPage == 1 && totalPage > 1) {
                    dataUl.empty();
                    appendTitleTr(dataUl);
                    $("#first").hide();
                    $("#back").hide();
                    $("#next").show();
                    $("#tail").hide();
                    $('#lastStartPos').val(startPos);
                    $('#endpos').val(endPos);
                }
                if (1 < currentPage && currentPage < totalPage) {
                    dataUl.empty();
                    appendTitleTr(dataUl);
                    $("#first").show();
                    $("#back").show();
                    $("#next").show();
                    $("#tail").hide();
                    startList.push(startPos);
                    $('#lastStartPos').val(startList.join(','));
                    $('#endpos').val(endPos);
                }
                if (currentPage == totalPage && totalPage > 1) {
                    dataUl.empty();
                    appendTitleTr(dataUl);
                    $("#first").show();
                    $("#back").show();
                    $("#next").hide();
                    $("#tail").hide();
                    startList.push(startPos);
                    $('#lastStartPos').val(startList.join(','));
                    $('#endpos').val(endPos);
                }
                for (var i = 0; i < data.billList.length; i++) {
                    var tr = "<tr><td width=\"37px\">" + (i + 1) + "</td>";
                    tr = tr + "<td width=\"15%\">" + formdate(data.billList[i].issueDate, "yyyy-mm-dd") + "</td>";
                    tr = tr + "<td width=\"15%\"><span><label title=" + formatString(data.billList[i].payerPartyName) + ">" + formatString(data.billList[i].payerPartyName) + "</label></span></td>";
                    tr = tr + "<td width=\"15%\">" + data.billList[i].totalAmount + "</td>";
                    tr = tr + "<td width=\"23%\"><span><label title=" + data.billList[i].invoicingPartyName + ">" + data.billList[i].invoicingPartyName + "</label></span></td>";
                    tr = tr + "<td width=\"17%\">" + data.billList[i].eInvoiceNumber + "</td>";
                    tr = tr + "<td class=\"ck\" width=\"10%\"><div class=\"lack\" onclick=interfacebillCheck('" + data.billList[i].eInvoiceCode + "','" + data.billList[i].eInvoiceNumber + "','" + data.billList[i].randomNumber + "')>查看</a></td></tr>";
                    dataUl.append(tr);
                }
            }
        },
        error: function (data) {
            //layer.alert(data.error);
        }
    });
}

function appendTitleTr(table) {
    table.append(titleTr);
}
function updatePwd() {

    if ($('#npwd').val() == null || $('#npwd').val() == '') {
        layer.alert("请输入密码！");
        return;
    }
    if ($('#npwd').val().replace(/\s+/g, "") == "") {
        layer.alert("密码不能为空！");
        return;
    }
    if ($('#npwd').val().length < 6 || $('#npwd').val().length > 20) {
        layer.alert("密码长度为6-20位！");
        return;
    }
    if ($('#npwd').val() != $('#nrpwd').val()) {
        layer.alert("两次输入密码不一致，请重新输入！");
        return;
    }
    $.ajax({
        type: "POST",
        url: baseUrl + "nbcweb/n/updateUserPwd.do",
        dataType: "text",
        cache: false,
        data: {
            pwd: $('#npwd').val(),
            code: $('#code').val(),
        },
        success: function (data) {
            if (data == 0) {
                $('#upwd').val('');
                $('#npwd').val('');
                $('#nrpwd').val('');
                var date = new Date();
                date.setTime(date.getTime() - 10000);
                document.cookie = "cUser=v; expire=" + date.toGMTString() + "; path=/";
                $.ajax({
                    type: "POST",
                    url: baseUrl + "user/loginOut",
                    dataType: "text",
                    cache: false,
                    success: function (data) {
                        data = eval("(" + data + ")");//解析返回的json数据
                        if (data.msg.code == 1) {
                            layer.alert('密码修改成功,请重新登录');
                            window.location.href = baseUrl + "page/front/login.jsp";
                        }

                    }
                });
            } else {
                layer.alert('修改失败');
            }
        }
    });
}

/**
 * 检查要上传的文件是否有后缀名
 * @param {Object} obj
 * @return {TypeName}
 */
function validFileType(obj) {
    var allowExtention = ".jpg,.bmp,.gif,.jpeg,.png";//允许上传文件的后缀名document.getElementById("hfAllowPicSuffix").value;
    var extention = obj.value.substring(obj.value.lastIndexOf(".") + 1).toLowerCase();
    if (allowExtention.indexOf(extention) <= -1) {
        layer.alert("请上传图片格式的附件!");
        var file = $(obj);
        file.after(file.clone().val(""));
        file.remove();
        //$('#codeFile').val('');
    }
//	 else{
//		 $('#codeFile').val(obj.value);
//		 $('#f').val(obj.value);
//	 }
}

/**
 * 首页
 */
function billfirst() {
    $('#lastStartPos').val('');
    pagingOfBill(1);
}
/**
 * 下一页
 */
function billnext() {
    var pageNow = parseInt($("#pageNow").text());
    pageNow = pageNow + 1;
    pagingOfBill(pageNow);
}
/**
 * 上一页
 */
function billback() {
    var pageNow = parseInt($("#pageNow").text());
    pageNow = pageNow - 1;
    pagingOfBill(pageNow, true);
}
/**
 * 尾页
 */
function billtail() {
    var pageNow = parseInt($("#total").text());
    pagingOfBill(pageNow);
}
/**
 * 跳转查看机构代码证
 * @return
 */
function toCodeImg() {
    window.open(baseUrl + "page/front/code_view.jsp");
}
/**
 * 绑定手机
 * @return
 */
var timer;
var leftTime = 60;
var isBindMobile = false;
function bindMobile(type) {
    isBindMobile = true;
    if (type == 'p') {
        //$('#uMobile').hide();
        $('#authCodeLi').show();
        //if ($("#sendUrl").is(":hidden")){
        $('#sendUrl').show();
        //}
        $('input[name=mobile]').removeAttr("readonly");

        $('#mobile').val('');
    } else {
        //$('#uUnitMobile').hide();
        $('#unitAuthCodeLi').show();
        //if ($("#sendUnitUrl").is(":hidden")){
        $('#sendUnitUrl').show();
        //	}
        $('input[name=linkTel]').removeAttr("readonly");
        $('#linkTel').val('');
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
            $('#countTime').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余时间：' + leftTime + '秒');
        } else {
            $('#unitCountTime').show();
            $('#sendUnitUrl').hide();
            $('#unitCountTime').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余时间：' + leftTime + '秒');
        }
    }
    leftTime--;
}

/**
 * 发送手机验证码
 * @return
 */
function sendAuthCode(type) {
    var mobile = '';
    if (type == 'p') {
        mobile = $("#mobile").val();
    } else {
        mobile = $("#linkTel").val();
    }
    var mobilePartton = /^1[3,5,8]\d{9}$/;
    if (mobile == '' || !mobilePartton.test(mobile)) {
        layer.alert('请输入正确的手机号码');
        return;
    } else {
        timer = setInterval("showLeftTime('" + type + "')", 1000);
        layer.alert("已给尾号" + mobile.substring(7, 11) + "的手机发送验证码");
        $.ajax({
            type: "POST",
            url: baseUrl + "nbcweb/n/sendMessage.do",
            dataType: "text",
            cache: false,
            data: {
                mobileNo: mobile
            },
            success: function (data) {
                if (data != 0) {
                    $.messager.layer.alert("消息", "短信发送失败!", "info");
                }
            }
        });
    }
}

/**
 * 绑定邮箱
 * @return
 */
var etimer;
var eleftTime = 60;
var isBindEmail = false;
function bindEmail(type) {
    isBindEmail = true;
    if (type == 'p') {
        //$('#uEmail').hide();
        $('#authEmailLi').show();
        //if ($("#sendEUrl").is(":hidden")){
        $('#sendEUrl').show();
        // }
        $('input[name=userEmail]').removeAttr("readonly");
    } else {
        //$('#uUnitEmail').hide();
        $('#unitAuthEmailLi').show();
        //if ($("#sendUnitEUrl").is(":hidden")){
        $('#sendUnitEUrl').show();
        //}
        $('input[name=unitEmail]').removeAttr("readonly");
    }
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
            $('#countETime').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余时间：' + eleftTime + '秒');
        } else {
            $('#unitCountETime').show();
            $('#sendUnitEUrl').hide();
            $('#unitCountETime').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余时间：' + eleftTime + '秒');
        }
    }
    eleftTime--;
}

/**
 * 发送邮箱证码
 * @return
 */
function sendAuthEmail(type) {
    var email = '';
    if (type == 'p') {
        email = $("#userEmail").val();
    } else {
        email = $("#unitEmail").val();
    }
    var mailValidate = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!mailValidate.test(email)) {
        layer.alert("请输入有效的邮箱地址！");
        return;
    } else {
        //判断邮箱是否已注册
        $.ajax({
            type: "POST",
            url: baseUrl + "nbcweb/n/isRegEmail.do",
            dataType: "text",
            cache: false,
            async: false,
            data: {
                // userId:$('#suserId').val(),
                email: email
            },
            success: function (data) {
                if (data == 0) {
                    etimer = setInterval("showELeftTime('" + type + "')", 1000);
                    $.ajax({
                        type: "POST",
                        url: baseUrl + "nbcweb/n/sendEmailCode.do",
                        dataType: "text",
                        cache: false,
                        data: {
                            email: email
                        },
                        success: function (data) {
                            data = eval("(" + data + ")");//解析返回的json数据
                            if (data.msg.code == 0) {
                                layer.alert('邮件发送失败!');
                            }
                        }
                    });
                } else {
                    layer.alert('邮箱已存在');
                    return;
                }
            }
        });
    }
}


/**
 * 修改个人用户信息
 * @return
 */
function updateUser() {
    if ($('#idCard').val().length > 10) {
        layer.alert('请输入真实姓名');
        return;
    }
    var isAuthCode = true;
    if (isBindMobile) {
        var mobilePartton = /^1[3,5,8]\d{9}$/;
        if ($('#mobile').val() == '' || !mobilePartton.test($('#mobile').val())) {
            layer.alert('请输入正确的手机号码');
            return;
        }
        if ($('#authCode').val() == '') {
            layer.alert("请输入手机验证码！");
            return;
        }
    }
    if (isAuthCode) {
        $.ajax({
            type: "POST",
            url: baseUrl + "nbcweb/n/updateRegUser.do",
            dataType: "text",
            cache: false,
            data: {
                uid: $('#uid').val(),
                phone: $('#mobile').val(),
                relateName: $('#userEmail').val(),
                realName: $('#idCard').val(),
                code: $('#authCode').val()
            },
            success: function (data) {
                if (data == 0) {
                    layer.alert('修改成功');
                    //手机
                    $('#authCodeLi').hide();
                    $('#bMobile').hide();
                    $('#sendUrl').hide();
                    $('#uMobile').show();
                    clearInterval(timer);
                    leftTime = 60;
                    $('#countTime').hide();
                    $('#authCode').val('');
                    isBindMobile = false;
                    $('input[name=mobile]').attr("readonly", "readonly");
                    //邮箱
                    $('#authEmailLi').hide();

                    $('#sendEUrl').hide();

                    if ($('#userEmail').val() == "") {
                        $('#bEmail').show();
                        $('#uEmail').hide();
                    }
                    else {
                        $('#bEmail').hide();
                        $('#uEmail').show();
                    }
                    clearInterval(etimer);
                    eleftTime = 60;
                    $('#countETime').hide();
                    $('#authEmail').val('');
                    isBindEmail = false;
                    $('input[name=userEmail]').attr("readonly", "readonly");
                    window.location.hash = "#flag3";
                } else {
                    layer.alert('修改失败');
                }
            }
        });
    } else {
        layer.alert('请输入正确的手机验证码');
        return;
    }
}

function resetUser() {
    $('#userForm').form('clear')
}


function updateUnit() {
    var isAuthCode = true;
    if (isBindMobile) {

        var mobilePartton = /^1[3,5,8]\d{9}$/;
        if ($('#linkTel').val() == '' || !mobilePartton.test($('#linkTel').val())) {
            layer.alert('请输入正确的手机号码');
            return;
        }
        if ($('#unitAuthCode').val() == '') {
            layer.alert("请输入手机验证码！");
            return;
        }
        //判断手机验证码是否正确
        $.ajax({
            type: "POST",
            url: baseUrl + "nbcweb/n/isAuthCode.do",
            dataType: "text",
            cache: false,
            async: false,
            data: {
                authCode: $('#unitAuthCode').val(),
                mobile: $('#linkTel').val()
            },
            success: function (data) {
                if (data == 1) {
                    isAuthCode = false;
                }
            }
        });
    }
    var isEmailCode = true;
    if (isBindEmail) {
        var mailValidate = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!mailValidate.test($('#unitEmail').val())) {
            layer.alert("请输入有效的邮箱地址！");
            return;
        }
        if ($('#unitAuthEmail').val() == '') {
            layer.alert("请输入邮箱验证码！");
            return;
        }
        //判断邮箱验证码是否正确
        $.ajax({
            type: "POST",
            url: baseUrl + "nbcweb/n/isEmailCode.do",
            dataType: "text",
            cache: false,
            async: false,
            data: {
                emailCode: $('#unitAuthEmail').val(),
                email: $('#unitEmail').val()
            },
            success: function (data) {
                if (data == 1) {
                    isEmailCode = false;
                }
            }
        });
    }
    if (isAuthCode) {
        if (isEmailCode) {
//				if($('#codeFile').val()!=''){					
//					$.ajaxFileUpload( {
//						url : baseUrl + "m/commonFileManager/fileUploadDefault.do",
//						secureuri : false,
//						fileElementId : 'codeFile',
//						dataType : 'json',
//						data : {
//							'filePath' : 'upload',
//							'size' : '',
//							'type' : ''
//						},
//						success: function (data) {
//							if(data.success=='0'){
//								submitUpdateUnit();
//								$('#scodeUrl').val("1");
//								$('#codeUrl').show();
//	
//							}else{
//								layer.alert('图片太大，无法上传');
//							}
//						}
//					});	
//				}else{
            submitUpdateUnit();
//				}
        } else {
            layer.alert('请输入正确的邮箱验证码');
            return;
        }
    } else {
        layer.alert('请输入正确的手机验证码');
        return;
    }
}

function submitUpdateUnit() {
    $.ajax({
        type: "POST",
        url: baseUrl + "nbcweb/n/updateRegUnit.do",
        dataType: "text",
        cache: false,
        //async:false,
        data: {
            userId: $('#suserId').val(),
            orgName: $('#unitName').val(),
            linkPerson: $('#linkPerson').val(),
            linkTel: $('#linkTel').val(),
            email: $('#unitEmail').val(),
            address: $('#address').val(),
            isBindMobile: isBindMobile
        },
        success: function (data) {
            var dataArray = data.split('$');
            if (dataArray[0] == 0) {
                layer.alert('修改成功');
                //手机
                $('#unitAuthCodeLi').hide();
                $('#bUnitMobile').hide();
                $('#sendUnitUrl').hide();
                $('#uUnitMobile').show();
                clearInterval(timer);
                leftTime = 60;
                $('#unitCountTime').hide();
                $('#unitAuthCode').val('');
                isBindMobile = false;
                $('input[name=linkTel]').attr("readonly", "readonly");
                //邮箱
                $('#unitAuthEmailLi').hide();

                $('#sendUnitEUrl').hide();


                if ($('#unitEmail').val() == "") {
                    $('#bUnitEmail').show();
                    $('#uUnitEmail').hide();
                }
                else {
                    $('#bUnitEmail').hide();
                    $('#uUnitEmail').show();
                }

                clearInterval(etimer);
                eleftTime = 60;
                $('#unitCountETime').hide();
                $('#unitAuthEmail').val('');
                isBindEmail = false;
                $('input[name=unitEmail]').attr("readonly", "readonly");
                window.location.hash = "#flag3";
            }
        }
    });
}
function changeToDX() {
    document.getElementById("securityCode").value = document.getElementById("securityCode").value.toUpperCase();
}