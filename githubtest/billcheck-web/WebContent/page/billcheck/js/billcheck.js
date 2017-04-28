
function changeByweb(id) {
	var img = document.getElementById(id);
	img.src = baseUrl + "/page/chkcodeByweb.jsp?" + Math.random();
}

function billCheck() {
	var billCode = $("#billCode").val();
	var billNumber = $("#billNumber").val();
	var securityCode = $("#securityCode").val();
	var code = $("#code").val();
	var boolean = true;
	if (billCode == "") {
		$("#billCode").attr("style", "border: #ff6060 1px solid;");
		$("#tipbillCode").show();
		boolean = false;
	}
	if (billNumber == "") {
		$("#billNumber").attr("style", "border: #ff6060 1px solid;");
		$("#tipbillNumber").show();
		boolean = false;
	}

	if (securityCode == "") {
		$("#securityCode").attr("style", "border: #ff6060 1px solid;");
		$("#tipsecurityCode").show();
		boolean = false;
	}

	if (code == "") {
		$("#code").attr("style", "border: #ff6060 1px solid;");
		$("#tipcode").show();
		boolean = false;
	}

	if (boolean) {
		$.ajax({
			type : "POST",
			async : false,
			url : baseUrl + "queryBill",
			dataType : "text",
			data : {
				billCode : billCode,
				billNumber : billNumber,
				securityCode : securityCode,
				code : code
			},
			success : function(data) {
				change('img');
				data = eval("(" + data + ")");// 解析返回的json数据

				if (data.status != 0) {
					$("#frmShowBill").attr("action",
							baseUrl + "billcheck/toShowBill");
					$("#billCodeShow").val(data.msg);
					$("#rbillCode").val(billCode);
					$("#rbillNumber").val(billNumber);
					$("#rsecurityCode").val(securityCode);
					$("#frmShowBill").submit();
				} else {
					layer.alert(data.msg);
				}
			}
		});
	}

}
/** 重新获取验证码* */
function change(id) {
	var img = document.getElementById(id);
	img.src = baseUrl + "/page/chkcodeByweb.jsp?" + Math.random();
}
/**
 * @param _billCode
 * @param _billNumber
 * @param _securityCode
 * @return 调用票据查验不需验证码
 */
function interfacebillCheck(billCode, billNumber, securityCode) {
	$.ajax({
		type : "POST",
		async : false,
		url : baseUrl + "billcheck/queryBillWithOutCode",
		dataType : "text",
		data : {
			billCode : billCode,
			billNumber : billNumber,
			securityCode : securityCode
		},
		success : function(data) {
			data = eval("(" + data + ")");// 解析返回的json数据

			if (data.status != 0) {
				$("#frmShowBill").attr("action",
						baseUrl + "billcheck/toShowBill");
				$("#billCodeShow").val(data.msg);
				$("#rbillCode").val(billCode);
				$("#rbillNumber").val(billNumber);
				$("#rsecurityCode").val(securityCode);
				$("#frmShowBill").submit();
			} else {
				layer.alert(data.msg);
			}
		}
	});
}

function billCheckReset() {
	$('#billCode').val("");
	$("#billCode").attr("style", "");
	$("#tipbillCode").hide();

	$('#billNumber').val("");
	$("#billNumber").attr("style", "");
	$("#tipbillNumber").hide();

	$('#securityCode').val("");
	$("#securityCode").attr("style", "");
	$("#tipsecurityCode").hide();

	$('#code').val("");
	$("#code").attr("style", "");
	$("#tipcode").hide();
}
function queryAcctInfo() {
	var billCode = $("#_billCode").val();
	var billNumber = $("#_billNumber").val();
	$
			.ajax({
				type : "POST",
				async : false,
				url : baseUrl + "n/billCheck/queryAcctInfo.do",
				dataType : "text",
				data : {
					billCode : billCode,
					billNumber : billNumber
				},
				success : function(data) {
					data = eval("(" + data + ")");// 解析返回的json数据

					if (data.status != 0) {
						var acctInfoList = eval(data.data);
						if (acctInfoList.length == 0) {
							$("#acctData").hide();
							return;
						}
						for (var i = 0; i < acctInfoList.length; i++) {
							var acctInfo = acctInfoList[i];
							var date = acctInfo.Time.substring(0, 8);
							var status = "";
							if (acctInfo.AccountingOrg == "1") {
								status = "开票单位入账";
							} else {
								status = "报销单位入账";
							}
							var tr = "<tr><td>" + (i + 1) + "</td>" + "<td>"
									+ status + "</td>" + "<td>" + date
									+ "</td>" + "<td>"
									+ acctInfo.AccountingOrgCode + "</td>"
									+ "<td>" + acctInfo.AccountingOrgName
									+ "</td>" + "<td class='amt'>"
									+ acctInfo.Amount + "</td>" + "<td>"
									+ acctInfo.AccountingNumber + "</td></tr>";
							$("#acctInfo").append(tr);
						}
						$("#acctData").show();
					} else {
						$("#acctData").hide();
					}
				}
			});
}