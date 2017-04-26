function chargeGist()
{
	//$.messager.alert("消息","攻城狮正在拼命加班中。。。","info");
	//window.print();
	//window.reload();
	//printWB.ExecWB(7,1)
	
//	if (getExplorer()=="ie")
//	{
//		WebBrowser.ExecWB(7,1)
//	}
//	else
//	{
		window.print();
	//}
	//printWB.ExecWB(4,1) 
  
}

function saveCode(obj) { 
	var winname = window.open('', '_blank', 'top=10000'); 
	winname.document.open('text/html', 'replace'); 
	winname.document.write(obj.value); 
	winname.document.execCommand('saveas','','code.htm'); 
	winname.close(); 
	} 

function getExplorer() {
	var explorer = window.navigator.userAgent ;
	//ie 
	if (explorer.indexOf("MSIE") >= 0) {
		return "ie"
	}
	//firefox 
	else if (explorer.indexOf("Firefox") >= 0) {
		return "Firefox";
	}
	//Chrome
	else if(explorer.indexOf("Chrome") >= 0){
		return "Chrome";
	}
	//Opera
	else if(explorer.indexOf("Opera") >= 0){
		return "Opera";
	}
	//Safari
	else if(explorer.indexOf("Safari") >= 0){
		return "Safari";
	}
}

function belong()
{
	var returnmsg = verifyUserSession();
	if (returnmsg == "0")
	{
		alert("请先登陆再操作");
		toLoginNewPage();
	}
	else
	{
		$.ajax({
			type : "POST",
			async:false,
			data:{
				billCode:$('#billCode').val(),
				billNumber:$('#billNumber').val(),
				securityCode:$('#securityCode').val(),
				billStyle:$('#billStyle').val(),
				sumMoney:$('#sumMoney').val(),
				billDate:$('#billDate').val(),
				billDept:$('#billDept').val()
			},
			url : baseUrl+"m/billData/belongBillData.do",
			success : function(data){
				//change('img');
				var obj = (new Function( "return " + data))();
				if (obj.msg.code == "1")
				{
					alert("归户成功");
		        	$('#belong').attr("class","a-bg2");
		        	$('#unbelong').attr("class","a-bg1");
				}
				else
				{
					alert(obj.msg.text);
				}

			  }
		});
	}
}

function unBelong()
{
	var returnmsg = verifyUserSession();
	if (returnmsg == "0")
	{
		alert("请先登陆再操作");
		toLoginNewPage();
	}
	else
	{
		$.ajax({
			type : "POST",
			async:false,
			data:{
				billCode:$('#billCode').val(),
				billNumber:$('#billNumber').val(),
				securityCode:$('#securityCode').val(),
				billStyle:$('#billStyle').val()
			},
			url : baseUrl+"m/billData/unBelongBillDataByOther.do",
			success : function(data){
				//change('img');
				var obj = (new Function( "return " + data))();
				if (obj.msg.code == "1")
				{
					alert("解除归户成功");
		        	$('#belong').attr("class","a-bg1");
		        	$('#unbelong').attr("class","a-bg2");
				}
				else
				{
					alert(obj.msg.text);
				}

			  }
		});
	}
}

