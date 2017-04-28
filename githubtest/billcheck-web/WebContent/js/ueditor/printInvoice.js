/**
 * @author hongbo.wang
 **/
Date.prototype.pattern = function(fmt){         
    var o = {          
    'M+' : this.getMonth()+1, //月份         
    'd+' : this.getDate(), //日         
    'h+' : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    'H+' : this.getHours(), //小时         
    'm+' : this.getMinutes(), //分         
    's+' : this.getSeconds(), //秒         
    'q+' : Math.floor((this.getMonth()+3)/3), //季度         
    'S' : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    '0' : '日',
    '1' : '一',
    '2' : '二',
    '3' : '三',
    '4' : '四',
    '5' : '五',
    '6' : '六' 
    };         
    if(/(y+)/.test(fmt)) {         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+'').substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)) {         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? '星期' : '周') : '')+week[this.getDay()+'']);         
    }         
    for(var k in o) {         
        if(new RegExp('('+ k +')').test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (('00'+ o[k]).substr((''+ o[k]).length)));         
        }         
    }         
    return fmt;         
}
	
function getGoldTaxState(statcode) {
	var m = new Map();
	m.put('1','尚未开启金税卡');
    m.put('1007','金税卡不能独占');
    m.put('1011','金税卡成功开启');
    m.put('3011','金税卡成功开启,获取信息成功');
    m.put('4001','传入发票数据不合法');
    m.put('4002','开票前金税卡状态错');
    m.put('4003','金税卡开票调用错误');
    m.put('4004','开票后取金税卡状态错');
    m.put('4011','开票成功');
    m.put('4012','开票失败');
    m.put('4013','所开发票已作废');
    m.put('5001','未找到发票或清单');
    m.put('5011','打印成功');
    m.put('5012','未打印');
    m.put('5013','打印失败');
    m.put('6001','当月发票库未找到该发票');
    m.put('6002','该发票已作废');
    m.put('6011','作废成功');
    m.put('6012','未作废');
    m.put('6013','作废失败');
	return m.get(statcode);
}

/**
 * 根据增票主键查询发票信息,并将其转成json对象
 **/
function getInvoiceInfoByInvId(invId){
	var json;
	dwr.engine.setAsync(false);
	printInvoiceCall.getInvoince(invId, function(value){json = value});
	dwr.engine.setAsync(true);
	var invoiceInfo = eval("(" + json + ")"); //json为接收的后台返回的数据
	return invoiceInfo;
}
/**
 * 根据网点编码查询网点对应的开票机
 **/
function getPrintNos(nodeNo){
	var printNos;
	dwr.engine.setAsync(false);
	printInvoiceCall.getPrintNos(nodeNo, function(value){printNos = value;});
	dwr.engine.setAsync(true);
	return printNos;
}
/**
 * 根据主键查询当前状态
 **/
function getCurrentStatus(invId){
	var currentStatus;
	dwr.engine.setAsync(false);
	printInvoiceCall.getCurrentStatus(invId, function(value){currentStatus = value;});
	dwr.engine.setAsync(true);
	return currentStatus;
}

/**
 * 当前网点开票机下发票状态为开票中的数量
 **/
function getNumber(currentPrintNo,nodeNo){
	var num;
	dwr.engine.setAsync(false);
	printInvoiceCall.getNumber(currentPrintNo,nodeNo,function(value){num = value;});
	dwr.engine.setAsync(true);
	return num;
}

/**
 * 修改票据信息
 **/
function updateInvoice(invId, certType, preinvnumber, userName, nodeNo, currentPrintNo){
	var flag;
	dwr.engine.setAsync(false);
	printInvoiceCall.updateInvoice(invId, certType, preinvnumber, userName, nodeNo, currentPrintNo, function(value){flag = value});
	dwr.engine.setAsync(true);
	return flag;
}

/**
 * 验证发票库存信息
 **/
function checkInvoiceStore(invId, stnCode, vatCode, vatNumber){
	var flag;
	dwr.engine.setAsync(false);
	printInvoiceCall.checkInvoiceStore(invId, stnCode, vatCode, vatNumber, function(value){flag = value});
	dwr.engine.setAsync(true);
	return flag;
}
	
/**
 * 联机打印发票
 **/
function printInvoice(invId, nodeNo, userName, userId, name){
	if(null == userId || '' == userId){
		alert('会话失效，请重新登录!');
		return;
	}
	var invoiceInfo = getInvoiceInfoByInvId(invId);
	 //发票状态(1：未打票,2：打票中,3：已打票,4：打票失败,5：作废中,6：已作废,7：已冲红)
	if(invoiceInfo.certType == 3){
		alert('已打印发票,不能重复打印!');
		return;
	}
	if(invoiceInfo.certType == 4){//如果该票证状态为打票失败,不能联机打票
		alert('打票失败记录不能进行联机打票!');
		return;
	}
	var printNos = getPrintNos(nodeNo);
	var preinvnumber; //预发票号码
	var currentPrintNo = window.parent.frames['hidden_frame'].document.getElementById('printno').value;
	if(printNos.length == 0) {//(printNos)根据本网点查询对应的开票机号,如果没有对应的开票机号,则视为本网点没有绑定开票机
		alert('本网点没有绑定打票机!');
		return;
	}else{
		if('' == currentPrintNo){ //当本网点开票机号为空,则要求开启金税卡
			alert('请开启金税卡!');
			return;
		}
//		var defaultPrintNo = invoiceInfo.billingNo; //221;
//		if(defaultPrintNo != currentPrintNo){  //当本网点绑定的开票机号与发票指定开票机号不符,不能进行打印
//			alert('本网点绑定开票机与发票指定开票机不符,不能打印!');
//			return;
//		}
		var GoldTax = window.parent.frames['hidden_frame'].document.getElementById('GoldTax');
		if(eval(GoldTax.RetCode) == null){  //检查金税卡返回状态,如果为空表示满意安装金税卡控件
			alert('请安装金税卡控件!');
			return;
		}
		if(invoiceInfo.invoicedetail.length > 8){
			alert('发票明细超过8行,发票打印完成后,必须另换专用纸打印清单!');
		}
		if(invoiceInfo.invType == 1){
			GoldTax.InfoKind = 0; //传入参数(0代表专用发票)
		}else{
			GoldTax.InfoKind = invoiceInfo.invType;
		}
		GoldTax.GetInfo(); //调用查询库存发票接口
		if(getGoldTaxState(GoldTax.RetCode) == null){
			alert('查询金税卡库存发票操作,返回不可知状态: ' + GoldTax.RetCode + '!');
			return;
		}
		if(GoldTax.RetCode != 3011){//如果返回状态不是(金税卡成功开启,获取信息成功)
			alert('查询金税卡库存发票操作,返回状态: ' + getGoldTaxState(GoldTax.RetCode) + '!');
			return;
		}
		if(GoldTax.InvStock == 0){//联机状态为0(联机打票);发票剩余份数等于0
			alert('发票剩余份数为零!'); 
			return;
		}
		var invNumber = '00000000' + GoldTax.InfoNumber; //发票号码
		invNumber = invNumber.substring(invNumber.length - 8);
		var typeCode = GoldTax.InfoTypeCode; //10位发票代码
		
		// 检查发票库存情况
		var checkRet = checkInvoiceStore(invId, nodeNo, typeCode, invNumber);
		if (checkRet == 0) {
			alert('发票库存中不存在该发票号码!\n发票十位代码：' + typeCode + '\n发票号码:' + invNumber);
			return;
		}
		
		if(!confirm('发票号码:' + invNumber + '发票十位代码:' + typeCode + ', 确定要打印吗?')){
			return false;
		}
		preinvnumber = invNumber; //预发票号码
	}
	var currentStatus = getCurrentStatus(invoiceInfo.invId);//当前状态
	if(currentStatus != invoiceInfo.certType) {
		alert('该票据已被操作,请重新查询后再操作!');
		return;
	}else{
		var num = getNumber(currentPrintNo,nodeNo); //当前开票机下已有开票中的记录数
		if(num < 0){
			alert('当前开票机下已有开票中的记录,请先处理!');
			return;
		}else{
			var flag = updateInvoice(invoiceInfo.invId, invoiceInfo.certType, preinvnumber, userName, nodeNo, currentPrintNo);
			if(flag == 0){
				alert('该票据已被操作,请重新查询后再操作!');
				return;
			}
			var GoldTax = window.parent.frames['hidden_frame'].document.getElementById('GoldTax');
			GoldTax.InvInfoInit(); //初始化发票整体信息各项
			GoldTax.InfoClientName = invoiceInfo.taxName; //纳税人名称
			//if(!(invoiceInfo.dataSource == 1 && invoiceInfo.invType == 2)){//erp增值税普通发票，不传税号(盈科确认过)
			//}
			if(invoiceInfo.taxTariff !='尚缺'){
			    GoldTax.InfoClientTaxCode = invoiceInfo.taxTariff; //纳税人税号
			}
			//alert(GoldTax.InfoClientTaxCode);
			GoldTax.InfoClientBankAccount = invoiceInfo.taxBankName + invoiceInfo.taxBankAccount; //纳税人开户行与帐号
			GoldTax.InfoClientAddressPhone = invoiceInfo.taxAddr + invoiceInfo.taxPhone;//纳税人地址与电话
			GoldTax.InfoTaxRate = invoiceInfo.taxRateFormat;//税率
			GoldTax.InfoNotes = invoiceInfo.remark;//备注
			GoldTax.InfoInvoicer = name;//操作员(当前登录用户名称)
			GoldTax.InfoChecker = invoiceInfo.payeeName; //复核人
			GoldTax.InfoCashier = invoiceInfo.recheckName; //收款人
//			if(invoiceInfo.invoicedetail.length > 8){
//				GoldTax.InfoListName = '(详见销货清单)';
//			}else{
//				GoldTax.InfoListName = '';//如不为空，则开具销货清单，此为发票上商品名称栏的清单信息，应为"(详见销货清单)"字样
//			}
			GoldTax.InfoListName = '';//如不为空，则开具销货清单，此为发票上商品名称栏的清单信息，应为"(详见销货清单)"字样
			GoldTax.InfoSellerAddressPhone = invoiceInfo.sellAddress + invoiceInfo.sellPhone;//销方地址与电话
			GoldTax.InfoSellerBankAccount = invoiceInfo.sellBankName + invoiceInfo.sellBankAccount;//销房开户行与帐号
			GoldTax.ClearInvList(); //清空增值税发票明细List
			for(var i = 0; i < invoiceInfo.invoicedetail.length; i++){
				GoldTax.InvListInit(); //初始化增值税发票明细List
				GoldTax.ListGoodsName = invoiceInfo.invoicedetail[i].goodsName; //商品或劳务名称
				if(null==invoiceInfo.invoicedetail[i].taxItems||
						''==invoiceInfo.invoicedetail[i].taxItems||
						invoiceInfo.invoicedetail[i].taxItems.length<4){ //石化盈科(魏鹏确认)要求如果税目为空需要给一个4长度的数字默认为4001
					GoldTax.ListTaxItem = 4001;
				}else{
					GoldTax.ListTaxItem = invoiceInfo.invoicedetail[i].taxItems; //税目，4位数字，商品所属类别
				}
				if(null!=invoiceInfo.invoicedetail[i].spec||''==invoiceInfo.invoicedetail[i].spec){
					GoldTax.ListStandard = invoiceInfo.invoicedetail[i].spec;  //规格型号
				}
				if(null!=invoiceInfo.invoicedetail[i].units||''==invoiceInfo.invoicedetail[i].units){
					GoldTax.ListUnit = invoiceInfo.invoicedetail[i].units;  //计量单位，如计量单位为空，则忽略数量和单价
				}
				if(null!=invoiceInfo.invoicedetail[i].quantity||''==invoiceInfo.invoicedetail[i].quantity){
					GoldTax.ListNumber = invoiceInfo.invoicedetail[i].quantity;  //数量
				}
				GoldTax.ListAmount = invoiceInfo.invoicedetail[i].noTaxAmount;  //金额，可以不传（为0），由接口软件计算，如传入则应符合计算关系
				GoldTax.ListTaxAmount = invoiceInfo.invoicedetail[i].tax;  //税额，可以不传（为0），由接口软件计算，如传入则应符合计算关系
				if(null!=invoiceInfo.invoicedetail[i].uPrice||''==invoiceInfo.invoicedetail[i].uPrice){
					GoldTax.ListPrice = invoiceInfo.invoicedetail[i].uPrice;  //单价
				}
				GoldTax.ListPriceKind = 0; //金额，可以不传（为0），由接口软件计算，如传入则应符合计算关系
				GoldTax.AddInvList(); //添加增值税发票明细
			}
			GoldTax.Invoice(); //传入开票数据，将开票数据记入防伪税控开票数据库，并在金税卡中开具此发票
			if(getGoldTaxState(GoldTax.RetCode) == null){
				alert('发票开具操作 返回不可知状态：'+GoldTax.RetCode+'!');
			}else if (GoldTax.RetCode != 4011){ 
				alert('发票开具操作 返回状态：'+getGoldTaxState(GoldTax.RetCode)+'!');
			}else {
				var amount = GoldTax.InfoAmount; //合计不含税金额
				var taxAmount = GoldTax.InfoTaxAmount;  //合计税额
				var d = GoldTax.InfoDate;  //开票日期
				var dd = new Date(Date.parse(d));  
				var invDate = dd.pattern('yyyy-MM-dd HH:mm:ss');
				var month = GoldTax.InfoMonth;  //所属月份
				var typeCode = GoldTax.InfoTypeCode;  //发票十位代码
				var infoNumber = '00000000' + GoldTax.InfoNumber;  //发票号码
				var invNumber = infoNumber.substring(infoNumber.length - 8);
				var listFlag = GoldTax.GoodsListFlag; //销货清单标志，0-无销货清单，1-有销货清单
				var invoiceStatus = GoldTax.RetCode;  //返回状态
				
				//金税系统打印发票
				GoldTax.InfoTypeCode = typeCode; //发票十位代码
				GoldTax.InfoNumber = invNumber; //发票号码
				GoldTax.GoodsListFlag = listFlag;//销货清单标志，0-无销货清单，1-有销货清单
				GoldTax.PrintInv(); //调用防伪开票标准打印程序，打印指定发票
				if(getGoldTaxState(GoldTax.RetCode) == null){
					alert('发票打印操作 返回不可知状态：'+ GoldTax.RetCode + '!');
					return;
				}else if (GoldTax.RetCode != 5011){ 
					alert('发票打印操作 返回状态：' + getGoldTaxState(GoldTax.RetCode) + '!');
					return;
				}
				var printStatus = GoldTax.RetCode;
				var vatType = printStatus;//盈科要求返回金税打票状态
				if(invoiceStatus != 4011){
					alert('金税开票失败!');
					return;
				}
				var processStatus = 1; //过程表状态
				var status = 3; //已打票
				if(printStatus == 5011){ //打印成功
					processStatus = 3; //打票
				}else{//打印失败
					status = 4; //打票失败
				}
				dwr.engine.setAsync(false);
				printInvoiceCall.updateInvoiceByPrint(invoiceInfo.invId,
											 		  amount,
													  taxAmount,
													  invDate,
													  month,
													  typeCode,
													  invNumber,
													  listFlag,
													  status,
													  processStatus, 
													  userId,
													  vatType);
				dwr.engine.setAsync(true);
				printInvoiceCall.updateQuerySystemInvoice(invoiceInfo.invId,userId);
				alert('联机打印发票成功!');								
			}
		}
	}
	printInvoicePageBreak();
}

/**
 * 联机作废发票
 **/
function cancelInvoice(invId, nodeNo, userName){
	var invoiceInfo = getInvoiceInfoByInvId(invId); //json为接收的后台返回的数据
	 //发票状态(1：未打票,2：打票中,3：已打票,4：打票失败,5：作废中,6：已作废,7：已冲红)
	if(!confirm('对发票号码为：'+invoiceInfo.vatNumber+'的发票做废票处理，是否继续？')){
		return false;
	} 
	var printNos = getPrintNos(nodeNo);
	var currentPrintNo = window.parent.frames['hidden_frame'].document.getElementById('printno').value;
	if(printNos.length == 0) {//(printNos)根据本网点查询对应的开票机号,如果没有对应的开票机号,则视为本网点没有绑定开票机
		alert('本网点没有绑定打票机!');
		return false;
	}else{
		if('' == currentPrintNo){ //当本网点开票机号为空,则要求开启金税卡
			alert('请开启金税卡!');
			return false;
		}
		var defaultPrintNo = invoiceInfo.billingNo;		
		if(defaultPrintNo != currentPrintNo){  //当本网点绑定的开票机号与发票指定开票机号不符,不能进行打印
			alert('本网点绑定开票机与发票指定开票机不符,不能打印!');
			return false;
		}
		var GoldTax = window.parent.frames['hidden_frame'].document.getElementById('GoldTax');
		if(eval(GoldTax.RetCode) == null){  //检查金税卡返回状态,如果为空表示满意安装金税卡控件
			alert('请安装金税卡控件!');
			return false;
		}
		if(invoiceInfo.invType == 1){
			GoldTax.InfoKind = 0; //传入参数(0代表专用发票)
		}else{
			GoldTax.InfoKind = invoiceInfo.invType;
		}
		GoldTax.GetInfo(); //调用查询库存发票接口
		if(getGoldTaxState(GoldTax.RetCode) == null){
			alert('查询库存发票操作,返回不可知状态: ' + GoldTax.RetCode + '!');
			return false;
		}
		if(GoldTax.RetCode != 3011){//如果返回状态不是(金税卡成功开启,获取信息成功)
			alert('查询库存发票操作,返回状态: ' + getGoldTaxState(GoldTax.RetCode) + '!');
			return false;
		}
	}
	var currentStatus = getCurrentStatus(invoiceInfo.invId);//当前状态

	var defaultStatus = invoiceInfo.certType;
	if(currentStatus != defaultStatus) {
		alert('该票据已被操作,请重新查询后再操作!');
		return false;
	}else{
//		var date1 = new Date();
//		date1.setDate(1);
//		date1.setHours(0, 0, 0);
//		var date2 = new Date(Date.parse(date1));
//		var date = date2.pattern('yyyy-MM-dd HH:mm:ss');
//		if(date > invoiceInfo.opTime){
//			alert('发票已缴销,不能作废!');
//			return false;
//		}
		
		var GoldTax = window.parent.frames['hidden_frame'].document.getElementById('GoldTax');
		
		GoldTax.InfoTypeCode = invoiceInfo.vatCode; //要开具发票的十位代码
		GoldTax.InfoNumber = invoiceInfo.vatNumber; //要开具发票的号码
		GoldTax.CancelInv();  //在金税卡及防伪开票数据库中作废已开发票
		if(getGoldTaxState(GoldTax.RetCode) == null){
			alert('发票作废操作 返回不可知状态：'+GoldTax.RetCode);
			window.event.returnValue = false;
			return false;
		}else{
			if (GoldTax.RetCode != 6011){ 
				alert('发票作废操作 返回状态：'+getGoldTaxState( GoldTax.RetCode ));
				window.event.returnValue = false;
				return false;
			}else {
				//dwr.engine.setAsync(false);
				//printInvoiceCall.saveInvoiceByCancel(invoiceInfo.invId,userName);
				//dwr.engine.setAsync(true);
				//alert('联机做废成功!');
				return true;
			}
		}
	}
}
