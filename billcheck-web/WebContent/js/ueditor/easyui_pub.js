/**
 * easyui公用脚本
 */

var pubObject = {};	//全局变量

var pubComboData = {};//全局下拉框数据

var lastOper = "";//上一次操作 add,del,update,qry,addOrUpdate (增、删除、改、查,添加或修改)
/**
 *  删除记录
 *  参数说明：
 * gridId 网格ID
 * idsId 存放被删除记录ID的隐藏域的ID
 * formId 表单ID（删除的表单）
 * idName 记录中ID字段名，多个ID以逗号隔开
 * hint 删除时提示信息
 */
function del(gridId,idsId,formId,idName,hint,sucHandle,failHandle){
	if(!hint) hint = "确定删除这些记录?";
	$.messager.confirm('提示', hint, function(r){
		if (r){
			lastOper ="del";
			var ids=getSelections(gridId,idName);
			$("#"+idsId).val(ids);
			if(ids.length<1){
				$.messager.alert('错误','请选择要删除的记录。','error');
			}else{
				loading();
				$('#'+formId).form('submit',{
					success:function(data){
					var obj = (new Function( "return " + data))();
					var info="";
					if(obj.msg.code == 1) info="<h5>"+obj.msg.text+"</h5>";
					if(obj.msg.code == 0){
						info+="<p style='color:red;border:solid 1px #ccc'>"+obj.msg.text+"</p>";
					}
					if(obj.opERROR){
						info+="<p style='color:red;border:solid 1px #ccc'>"+obj.opERROR+"</p>";
					}
					if(obj.msg.code == 1){//成功时
						$.messager.show({
							title:'消息',
							msg:info,
							timeout:5000,
							showType:'slide',
							width:350,
							height:180
						});
						if(sucHandle) sucHandle(); 
						$("#"+gridId).datagrid('reload');
					}else{
						$.messager.alert('消息',info,'info',function(){
						});
						$("a[class='l-btn']").focus();
						if(failHandle) failHandle();
					}
					removeLoading();
				},error:function(){				 
					removeLoading();
				}
				});
			}
		}
	});
}
/**
 * 从网格中取选中行(多行)
 * @param gridId 网格ID
 * @param keys 网格字段名，多个以逗号隔开
 * @return
 */
function getSelections(gridId,keys){
	var ids = [];
	if(!keys) keys = "id";
	var akey=keys.split(",");
	var rows = $('#'+gridId).datagrid('getSelections');
	if(rows == null || rows=="")
	{
		$.messager.alert('提示消息', "请选择一个信息", 'info');
		return "";
	}
	for(var i=0;i<rows.length;i++){
		var sp="",tmp="",row=rows[i];
		for(var j=0;j<akey.length;j++){
			tmp=tmp+sp+row[akey[j]];
			sp=",";
		}
		ids.push(tmp);
	}
	return ids.join(':');
}
/**
 * 从网格中取选中行（单行）
 * @param gridId 网格ID
 * @param keys 网格字段名
 * @return
 */
function getSingleSelection(gridId,keys){
	var ids = [];
	if(!keys) keys = "id";
	var akey=keys.split(",");
	var row = $('#'+gridId).datagrid('getSelected');
	if(row == null  || row=="")
	{
		$.messager.alert('提示消息', "请选择一个信息", 'info');
		return "";
	}
	return row;
}

function getSingleSelectionTree(gridId,keys){
	var ids = [];
	if(!keys) keys = "id";
	var akey=keys.split(",");
	var row = $('#'+gridId).treegrid('getSelected');
	if(row == null  || row=="")
	{
		$.messager.alert('提示消息', "请选择一个信息", 'info');
		return "";
	}

	var sp="",tmp="";
	for(var j=0;j<akey.length;j++){
		tmp=tmp+sp+row[akey[j]];
		sp=",";
	}

	ids.push(tmp);

	return ids.join(':');
}
/**
 * 打开添加或修改对话框
 * @param title 对话框标题
 * @param dialogId 对话框ID
 * @param gridId 网格ID
 * @param submitFrmId 添加或删除的表单ID
 * @param params 对话框参数json对象,json说明：width为宽、height为高、modal为是否为模式对话框，如{width:200,height:250}
 * @param sucHandle 服务端返回成功后处理
 * @param failHandle 服务端返回失败后处理
 * @param beforeHandle 表单提交前处理
 * @param beforeHandle 表单提交前自定义验证
 * @return
 */
function openDialog(title,dialogId,gridId,submitFrmId,params,sucHandle,failHandle,beforeHandle,beforeCheckForm){
	
	lastOper ="addOrUpdate";
	if(!params){
		params={};
		params.width=400;
		params.height=250;
		params.msgWidth=350;
		params.msgHeight=180;
		params.modal=true;
	}else{
		if(!params.width) params.width=400;
		if(!params.height) params.height=250;
		if(!params.modal) params.modal=true;
		if(!params.msgWidth) params.msgWidth=350;
		if(!params.msgHeight) params.msgHeight=180;
	}

	if(!title) title="对话框";
	if(!dialogId) dialogId="dlg";	
	if(!gridId) gridId="grid";
	if(!submitFrmId) submitFrmId="frm";

	if(params.clearForm==true){
		$('#'+submitFrmId).form('clear');
	}
	if(params.defaultCombo){
		var text=$('#'+params.defaultCombo).combobox('getData');
		$('#'+params.defaultCombo).combobox('select',text[0].id);
	}

	$('#'+dialogId).show();
	$('form input').removeClass("validatebox-invalid"); 
	$('form textarea').removeClass("validatebox-invalid"); 
	$('#'+dialogId+" .easyui-combotree").combotree();
	$('#'+dialogId).dialog({
		title:title,
		width:params.width,
		height:params.height,
		modal:params.modal,
		buttons:[{
			id:"easyuiSave",
			text:'确定',
			iconCls:'icon-ok',
			handler:function(){
			$('#easyuiSave').linkbutton("disable");
			$('#'+submitFrmId).form('submit',{
				onSubmit:function(){
				if(beforeHandle) beforeHandle();
				if(beforeCheckForm)	
				{
					if (!beforeCheckForm())
					{
						$('#easyuiSave').linkbutton("enable");
						return false;
					}
				}
				$('#easyuiSave').linkbutton("enable");
				return $("#"+submitFrmId).form('validate');  
			},
			success:function(data){
				var obj = (new Function( "return " + data))();
				var info="";
				if(obj.msg.code == 1) info="<h5>"+obj.msg.text+"</h5>";
				if(obj.msg.code == 0){
					info+="<p style='color:red;border:solid 1px #ccc'>"+obj.msg.text+"</p>";
				}
				if(obj.opERROR){
					info+="<p style='color:red;border:solid 1px #ccc'>"+obj.opERROR+"</p>";
				}
				if(obj.msg.code == 1){//成功时
					$.messager.show({
						title:'消息',
						msg:info,
						timeout:5000,
						showType:'slide',
						width:params.msgWidth,
						height:params.msgHeight
					});
					//clearSelect(gridId);
					$('#'+dialogId).dialog('close');
					$("#"+gridId).datagrid('reload');
					//$('form input').addClass("validatebox-invalid");  
//					$('#'+dialogId).form('clear');
					$('div.tooltip').css("display","none")
					$('#'+dialogId+" select option:first").attr("selected",true);
					if(sucHandle) sucHandle(obj);
				}else{
					$("select").hide();
					$.messager.alert('消息',info,'info',function(){$("select").show();});
					$("a[class='l-btn']").focus();
					if(failHandle) failHandle();
				}
				$('#easyuiSave').linkbutton("enable");
			},error:function(){
			//	$('form input').addClass("validatebox-invalid");  
				$('#easyuiSave').linkbutton("enable");
			}
			});
		}
		},{
			text:'取消',
			iconCls:'icon-cancel',
			handler:function(){
			$('div.tooltip').css("display","none")
			$('form input').addClass("validatebox-invalid");  
			$('#'+dialogId).dialog('close');
		}
		}],
		onBeforeClose : function (){
			$('div.tooltip').css("display","none");
		},
		onClose : function () {
			$('div.tooltip').css("display","none");
		}
	});
}
/**
 * 打开添加或修改对话框
 * @param title 对话框标题
 * @param dialogId 对话框ID
 * @param gridId 网格ID
 * @param submitFrmId 添加或删除的表单ID
 * @param params 对话框参数json对象,json说明：width为宽、height为高、modal为是否为模式对话框，如{width:200,height:250}
 * @param sucHandle 服务端返回成功后处理
 * @param failHandle 服务端返回失败后处理
 * @param beforeHandle 表单提交前处理
 * @return
 */
function openTreeDialog(title,dialogId,gridId,submitFrmId,params,sucHandle,failHandle,beforeHandle){
	lastOper ="addOrUpdate";
	if(!params){
		params={};
		params.width=400;
		params.height=250;
		params.msgWidth=350;
		params.msgHeight=180;
		params.modal=true;
	}else{
		if(!params.width) params.width=400;
		if(!params.height) params.height=250;
		if(!params.modal) params.modal=true;
		if(!params.msgWidth) params.msgWidth=350;
		if(!params.msgHeight) params.msgHeight=180;
	}

	if(!title) title="对话框";
	if(!dialogId) dialogId="dlg";	
	if(!gridId) gridId="grid";
	if(!submitFrmId) submitFrmId="frm";

	if(params.clearForm==true){
		$('#'+submitFrmId).form('clear');
	}

	$('#'+dialogId).show();
	$('#'+dialogId+" .easyui-combotree").combotree();
	$('#'+dialogId).dialog({
		title:title,
		width:params.width,
		height:params.height,
		modal:params.modal,
		buttons:[{
			id:"easyuiSave",
			text:'确定',
			iconCls:'icon-ok',
			handler:function(){
			$('#easyuiSave').linkbutton("disable");
			$('#'+submitFrmId).form('submit',{
				onSubmit:function(){  
				if(beforeHandle) beforeHandle();
				$('#easyuiSave').linkbutton("enable");
				return $("#"+submitFrmId).form('validate');  
			},
			success:function(data){
				var obj = (new Function( "return " + data))();
				var info="";
				if(obj.msg) info="<h5>"+obj.msg+"</h5>";
				if(obj.error){
					info+="<p style='color:red;border:solid 1px #ccc'>"+obj.error+"</p>";
				}
				if(obj.opERROR){
					info+="<p style='color:red;border:solid 1px #ccc'>"+obj.opERROR+"</p>";
				}
				if(obj.tag){//成功时
					$.messager.show({
						title:'消息',
						msg:info,
						timeout:5000,
						showType:'slide',
						width:params.msgWidth,
						height:params.msgHeight
					});
					$('#'+dialogId).dialog('close');
					$("#"+gridId).treegrid('reload');
					$('#'+dialogId).form('clear');
					if(sucHandle) sucHandle(obj);
				}else{
					$("select").hide();
					$.messager.alert('消息',info,'info',function(){$("select").show();});
					$("a[class='l-btn']").focus();
					if(failHandle) failHandle();
				}
				$('#easyuiSave').linkbutton("enable");
			},error:function(){
				$('#easyuiSave').linkbutton("enable");
			}
			});
		}
		},{
			text:'取消',
			iconCls:'icon-cancel',
			handler:function(){
			
			$('#'+dialogId).dialog('close');
		}
		}]
	});
}
/**
 * 网格查询
 * @param handler 查询处理方法
 * @param dlgParams 对话框参数，json对象
 * @param dialogId 对话框ID
 * @param formId 查询表单的ID
 * @return
 */
function query(handler,dlgParams,dialogId,formId,isRemove,hasToolbar){
	if(!dlgParams){
		dlgParams={};
		dlgParams.width=400;
		dlgParams.height=230;
		dlgParams.modal=true;
	}
	if(!dialogId) dialogId="dlg";
	if(!formId) formId="frm";
	if(!dlgParams.width) dlgParams.width=400;
	if(!dlgParams.height) dlgParams.height=230;
	if(!dlgParams.modal) dlgParams.modal=true;
	if(!dlgParams.title) dlgParams.title="查询";
	toolBar = [{
			text:'确定',
			iconCls:'icon-ok',
			handler:handler
		},{
			text:'清除',
			iconCls:'icon-remove',
			handler:function(){
			$(fid).form('clear');
		}	
		},{
			text:'取消',
			iconCls:'icon-cancel',
			handler:function(){
			$('#'+dialogId).dialog('close');
		}
		}];
	if(isRemove){
		toolBar = [{
				text:'确定',
				iconCls:'icon-ok',
				handler:handler
			},{
				text:'取消',
				iconCls:'icon-cancel',
				handler:function(){
				$('#'+dialogId).dialog('close');
			}
			}];
	}
	if(hasToolbar){
		toolBar = [];//true去掉toolbar
	}
	
	
	var fid="",tag="",forms=formId.split(",");
	for(var i=0;i<forms.length;i++){
		fid=fid+tag+"#"+forms[i];
		tag=",";
	}

	if(lastOper != "qry") {
		$(fid).form('clear');//上一次不是查询时，清除表单信息
	}
	lastOper ="qry";

	$('#'+dialogId).show();
	$('#'+dialogId+" .easyui-combotree").combotree();
	$('#'+dialogId).dialog({
		title:dlgParams.title,
		width:dlgParams.width,
		height:dlgParams.height,
		modal:dlgParams.modal,
		buttons:toolBar
	});
}
/**
 * 显示进度条
 * @return
 */
function loading(parentId){
	if(parentId == undefined || parentId == null) parentId = "body";
	removeLoading();
	$("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo(parentId);
	$("<div class=\"datagrid-mask-msg\" ></div>").html("正在处理，请稍候。。。").appendTo(parentId).css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 100) / 2});	
}

function loading4Dialog(parentId)
{
	if(parentId == undefined || parentId == null) parentId = "body";
	removeLoading();
	$("<div class=\"datagrid-mask\" style=\"z-index: 9998;\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo(parentId);
	$("<div class=\"datagrid-mask-msg\" style=\"z-index: 9999;\"></div>").html("正在处理，请稍候。。。").appendTo(parentId).css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 100) / 2});	

}
/**
 * 隐藏进度条
 * @return
 */
function removeLoading(){
	$(".datagrid-mask").remove();
	$(".datagrid-mask-msg").remove();
}


/**
 *取消DataGrid中的行选择(适用于Jquery Easy Ui中的dataGrid)
 *注意：解决了无法取消"全选checkbox"的选择,不过，前提是必须将列表展示
 *数据的DataGrid所依赖的Table放入html文档的最全面，至少该table前没有
 *其他checkbox组件。
 *
 *@paramdataTableId将要取消所选数据记录的目标table列表id
 */
function clearSelect(dataTableId) {
	$('#' + dataTableId).datagrid('clearSelections');
	//取消选择DataGrid中的全选
	$("input[type='checkbox']").eq(0).attr("checked", false);
}
/**
 *格式化gridtable页码显示为中文
 *
 *@dataTableId显示为中文的gridtableID
 */
function formatpagination(dataTableId) {
	$('#' + dataTableId).datagrid('getPager').pagination({
		beforePageText: '第',//页数文本框前显示的汉字 
		afterPageText: '页    共 {pages} 页',
		displayMsg:'当前显示从 {from} 到 {to} 共 {total} 记录'
	  });
}

//格式化时间格式
function formdate(_datetime,_datetype)
{
	var formdatetime="";
	if (_datetime != "" && _datetime != null)
	{
		var year =_datetime.substring(0,4);
		var month =_datetime.substring(4,6);
		var day =_datetime.substring(6,8);
		var hours =_datetime.substring(8,10);
		var minute =_datetime.substring(10,12);
		var second =_datetime.substring(12,14);
		
		if (_datetype == "yyyy-mm-dd hh:mm:ss")
		{
			formdatetime = year + "-" + month + "-" + day + " " +hours + ":" + minute + ":" + second;
		}	
		else if (_datetype == "yyyy-mm-dd")
	
		{
			formdatetime = year + "-" + month + "-" + day;
		}
		else if (_datetype == "mm-dd")
		{
			formdatetime = month + "-" + day;	
		}
	}
	return formdatetime;
}


function formatDate(date)
{
	var value;
	if(date==null||date==""){
		value="";
	}else{
		value= date.substr(0, 4)+"-"+date.substr(4, 2)+"-"+date.substr(6, 2);
	}
	return value; 
}

//格式化时间格式
function formdate(_datetime,_datetype)
{
	var formdatetime="";
	if (_datetime != "" && _datetime != null && _datetime != undefined)
	{
		
		var year =_datetime.substring(0,4);
		var month =_datetime.substring(4,6);
		var day =_datetime.substring(6,8);
		var hours =_datetime.substring(8,10);
		var minute =_datetime.substring(10,12);
		var second =_datetime.substring(12,14);
		
		if (_datetype == "yyyy-mm-dd hh:mm:ss")
		{
			formdatetime = year + "-" + month + "-" + day + " " +hours + ":" + minute + ":" + second;
		}	
		else if (_datetype == "yyyy-mm-dd")
	
		{
			formdatetime = year + "-" + month + "-" + day;
		}
		else if (_datetype == "mm-dd")
		{
			formdatetime = month + "-" + day;	
		}
		
	}
	return formdatetime;
}

function loadButton(){
	//禁用所有按钮
	$('.datagrid-toolbar a[id!=undefined]').linkbutton('disable');
	//$('a[action]').linkbutton('disable');
	$('a[action]').hide();$('div[action]').hide();
	if(this.actionList){
		$.each(this.actionList,function(i,v){
				$("#"+v).linkbutton("enable");
				//$("a[action="+v+"]").linkbutton("enable");
				$("a[action="+v+"]").show();$("div[action="+v+"]").show();
	 })
 }
}
$(document).ready(function(){
	
	loadButton()
	getPubComboData("businesstype,worktype,servicereason,logstatus,visitType," +
			"noticetype,satisfaction,serviceQuality,visitstatus,travel,sendtype," +
			"customerStage,customerBus,customerSort,customerType,servicetype," +
			"company,contractType,allowance,equipName,visitstatus,taskStatus," +
			"staffStatus,education,changeType,xscontractType,productunit,producttype")
	
})
/**
 * 删除查询条件，重新载入Grid
 * @return {TypeName} 
 */
function reloadGrid(){
	if($grid){
		$grid.datagrid("options").pageNumber=1;
		$grid.datagrid({'queryParams':{ }});	
	}else{
		return false;
	}
}
/**
 * 取消Grid编辑状态
 */
function cancelEdit(){
	if(cIndex != -1){
		if($grid){
			$grid.datagrid('rejectChanges');
			cIndex = -1;
		}
	}
}
/**
 * 转换数字显示格式为货 
 */
function setCurrency(s){ 
    if(/[^0-9\.\-]/.test(s)) return "invalid value"; 
    s=s.replace(/^(\d*)$/,"$1."); 
    s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1"); 
    s=s.replace(".",","); 
    var re=/(\d)(\d{3},)/; 
    while(re.test(s)) 
        s=s.replace(re,"$1,$2"); 
    s=s.replace(/,(\d\d)$/,".$1"); 
    return s.replace(/^\./,"0.") 
    }

//重写$.fn.validatebox.defaults.rules，验证正文的长度
$.extend($.fn.validatebox.defaults.rules, { 
	maxLength: { 
	validator: function(value, param){ 
	
	return value.length <= param[0]; 
	}, 
	message: '不能超过1000个字符！'
	} 
});

/**
 * DataGrid调用下拉框多选的方法
 */
$.extend($.fn.datagrid.defaults.editors.combobox, {
    getValue : function(jq) {
        var opts = $(jq).combobox('options');
        if(opts.multiple){
            var values = $(jq).combobox('getValues');
            if(values.length>0){
                if(values[0]==''||values[0]==' '){
                    return values.join(',').substring(1);//新增的时候会把空白当成一个值了，去掉
                }
            }
            return values.join(',');
        }
        else
            return $(jq).combobox("getValue");
    },
    setValue : function(jq, value) {
    	if(value)
    	{
        var opts = $(jq).combobox('options');
        if(opts.multiple&&value.indexOf(opts.separator)!=-1){//多选且不只一个值
            var values = value.split(opts.separator);
            $(jq).combobox("setValues", values);
        }
        else
            $(jq).combobox("setValue", value);
    	}
    }
});

/**
 * DataGrid调用下拉树多选的方法
 */
$.extend($.fn.datagrid.defaults.editors.combotree, {
    getValue : function(jq) {
        var opts = $(jq).combotree('options');
        if(opts.multiple){
            var values = $(jq).combotree('getValues');
            if(values.length>0){
                if(values[0]==''||values[0]==' '){
                    return values.join(',').substring(1);//新增的时候会把空白当成一个值了，去掉
                }
            }
            return values.join(',');
        }
        else
            return $(jq).combobox("getValue");
    },
    setValue : function(jq, value) {
    	if(value)
    	{
        var opts = $(jq).combotree('options');
        if(opts.multiple&&value.indexOf(opts.separator)!=-1){//多选且不只一个值
            var values = value.split(opts.separator);
            $(jq).combotree("setValues", values);
        }
        else
            $(jq).combotree("setValue", value);
    	}
    }
});

function doKey(event){
	var evt = window.event?window.event:event;
	var obj = evt.target || evt.srcElement;//获取事件源    
	var t = obj.type || obj.getAttribute('type');//获取事件源类型
	var attr = obj.readOnly;// || obj.getAttribute('readOnly');
	if(evt.keyCode== 13 ){
		return false;
	}
	if( evt.keyCode == 8){
		if((t == "password" || t == "text" || t == "textarea") && (attr == true))
			return false;
		else if(t == "password" || t == "text" || t == "textarea")
			return true;   
		else return false;
	}

	return true;
} 
document.onkeypress=doKey;
document.onkeydown=doKey;

/**
 * 重载表格。
 * @param {Object} id
 * @param {Object} title
 * @param {Object} url
 * @param {Object} param
 */
function reloadDataGrid(id,title,url,param){
	$('#'+id).datagrid({
		title:title,
    	'url':url,
    	'queryParams':param
	});
}

/**
 * 设置编辑状态
 * @param {Object} gridid
 * @param {Object} isEdit 设置其是否处于编辑状态
 */
function setAllEditor(gridid,isEdit){
	var rows = $('#'+gridid).datagrid('getRows');
	if(rows != null && rows != undefined && rows.length > 0){
		for(var i = 0; i < rows.length; i++){
			var index = $('#'+gridid).datagrid('getRowIndex',rows[i]);
			if(isEdit){//结束编辑
				$('#'+gridid).datagrid('beginEdit', index);
			}else{
				$('#'+gridid).datagrid('endEdit', index);
			}
		}
	}
}
/********************lean****************************/
/**
 * 重载表格。
 * @param {Object} id
 * @param {Object} title
 * @param {Object} url
 * @param {Object} param
 */
function reloadDataGrid(id,title,url,param){
	$('#'+id).datagrid({
		title:title,
    	'url':url,
    	'queryParams':param
	});
}
/** 网格合并行
 * @param tableID 网格Id
 * @param colList 列名称 可用逗号分割
 * @调用方法：mergeCellsByField('dataGrid','F_STATE,F_USER_CODE,F_USER_NAME')
 * 
 * @return
 */
function mergeCellsByField(tableID, colList) {
	var ColArray = colList.split(",");
	var tTable = $('#' + tableID);
	var TableRowCnts = tTable.datagrid("getRows").length;
	var tmpA;
	var tmpB;
	var PerTxt = "";
	var CurTxt = "";
	var alertStr = "";
	//for (j=0;j<=ColArray.length-1 ;j++ )
	for (j = ColArray.length - 1; j >= 0; j--) {
		//当循环至某新的列时，变量复位。
		PerTxt = "";
		tmpA = 1;
		tmpB = 0;

		//从第一行（表头为第0行）开始循环，循环至行尾(溢出一位)
		for (i = 0; i <= TableRowCnts; i++) {
			if (i == TableRowCnts) {
				CurTxt = "";
			} else {
				CurTxt = tTable.datagrid("getRows")[i][ColArray[j]];
			}
			if (PerTxt == CurTxt) {
				tmpA += 1;
			} else {
				tmpB += tmpA;
				tTable.datagrid('mergeCells', {
							index : i - tmpA,
							field : ColArray[j],
							rowspan : tmpA,
							colspan : null
						});
				tmpA = 1;
			}
			PerTxt = CurTxt;
		}
	}
}

//页面内的关闭
function closedTab(){
	var tab=parent.$('#main-tab').tabs('getSelected');
	var title =tab.panel('options').title;
	parent.$('#main-tab').tabs('close',title);
}

//格式化字符串
function formatString(_value){
	if (_value) return _value;
	return "&nbsp;";
	
}
//格式化字符串
function formatString2(_value){
	if (_value) return _value;
	return "";
	
}

/**
 * 格式化金额(无四舍五入)
 * @param {Object} num
 * @return {TypeName} 返回类似 123,456.00格式金额
 */
function formatCurrencyTenThou(num) {
	if(num == null || num == undefined || num == '') return;
  	num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
    num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
    cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num = num.substring(0,num.length-(4*i+3))+','+
    num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
}
/**
 * 根据id 获取{id：,text: }的text值
 * @param {Object} value id
 * @param {Object} data 数组
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
function getTextOfCombo(value,data){  
	var text='';
	if((value == null || value == undefined || value == '') 
			&& (data != null || data != undefined || data != '')){
		text = '';
	}else{
		$.each(data,function(i,v){
			if(data[i].id == value){
				text = data[i].text;
				return false;
			}
		});
	}
	return text;
}
/**
 * 动态获取服务器上的时间 格式为Tools下的getTime7()
 * @return {TypeName} 
 */
function DynamicGetSysTime(){
	var sysDate = '';
	$.ajax( {
		url : baseUrl + "m/servicebill/DynamicGetSysTime.do",
		dataType : "text",
		async:false,//同步
		cache : false,
		success : function (data) {
			sysDate = data;
		},
		error : function() {
		}
	});
	return sysDate;
}
/**
 * 判断数组是否包含某个元素
 * @param {Object} arr
 * @param {Object} value
 */
function isArrayContainsValue(arr,value){
	var haved = false;
	for(var i = 0;i<arr.length;i++ ){
		if(arr[i] == value){
			haved = true;
			break;
		}
	}
	return haved;
}
/**
 * datagrid网格字符串截取
 */
function showSimpleStr(str,length){
	if(length==null)
		length = 20;
	if(!checkIsEmpty(str)){
		if(str.length>length)
			return "<span title='"+str+"'>"+str.substring(0,length)+"... </span>";
	}else	{
		return "";
	}
	return "<span title='"+str+"'>"+str+"</span>";
}
/**
 * 检查字符串是否为空
 * @return
 */
function checkIsEmpty(str){
	return str==undefined||str==null||str==""||str=='undefined'||str=='null';
}

function getPubComboData(type){
	$.ajax({
		url:baseUrl+"m/dict/getdict.do?rnd="+Math.random(),
		type:"post",
		async:false,
		data:{"typeCode":type},
		dataType:"json",
		success :function (data) {
			for(var i in data){
				if(!pubComboData[i]){
					pubComboData[i] = data[i];//将取到的值放入全局变量中
				}
			} 
			return true;
		},
		error:function(obj){
			return false;
		}
	});	
}
/** 网格合并行
 * @param tableID 网格Id
 * @param colList 列名称 可用逗号分割
 * @调用方法：mergeCellsByField('dataGrid','F_STATE,F_USER_CODE,F_USER_NAME')
 * 
 * @return
 */
function mergeCellsByField(tableID, colList) {
	var ColArray = colList.split(",");
	var tTable = $('#' + tableID);
	var TableRowCnts = tTable.datagrid("getRows").length;
	var tmpA;
	var tmpB;
	var PerTxt = "";
	var CurTxt = "";
	var alertStr = "";
	//for (j=0;j<=ColArray.length-1 ;j++ )
	for (j = ColArray.length - 1; j >= 0; j--) {
		//当循环至某新的列时，变量复位。
		PerTxt = "";
		tmpA = 1;
		tmpB = 0;

		//从第一行（表头为第0行）开始循环，循环至行尾(溢出一位)
		for (i = 0; i <= TableRowCnts; i++) {
			if (i == TableRowCnts) {
				CurTxt = "";
			} else {
				CurTxt = tTable.datagrid("getRows")[i][ColArray[j]];
			}
			if (PerTxt == CurTxt) {
				tmpA += 1;
			} else {
				tmpB += tmpA;
				tTable.datagrid('mergeCells', {
							index : i - tmpA,
							field : ColArray[j],
							rowspan : tmpA,
							colspan : null
						});
				tmpA = 1;
			}
			PerTxt = CurTxt;
		}
	}
}
function cleanCMB(_id){
	$('#'+_id).combobox('clear');
}
/**
 * easyui window 组件扩展，窗口自动居中
 * 
 * @param left
 * @param top
 * @return
 */
var easyuiPanelOnOpen = function (left, top) {
    var iframeWidth = $(this).parent().parent().width();
   
    var iframeHeight = $(this).parent().parent().height();

    var windowWidth = $(this).parent().width();
    var windowHeight = $(this).parent().height();

    var setWidth = (iframeWidth - windowWidth) / 2;
    var setHeight = (iframeHeight - windowHeight) / 2;
    $(this).parent().css({/* 修正面板位置 */
        left: setWidth,
        top: setHeight
    });

    if (iframeHeight < windowHeight)
    {
        $(this).parent().css({/* 修正面板位置 */
            left: setWidth,
            top: 0
        });
    }
    $(".window-shadow").hide();
};
$.fn.window.defaults.onOpen = easyuiPanelOnOpen;