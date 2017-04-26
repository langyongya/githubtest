//公用的js函数文件
/**
 * 后台连接的ajax函数
 * @param {Object} url
 * @param {Object} parm
 * @return {TypeName} 
 */
function save(url,parm,async){	
	return $.ajax({
		type:"post",
		url:url,
		async: async,
		data:parm,
		dataType:"text"
	}).responseText;
}

/**
 * 异步加载。未验证
 * @param {Object} url
 * @param {Object} parm
 * @param {Object} funS
 * @param {Object} funE
 * @return {TypeName} 
 */
function saveAsync(url,parm,funS,funE){	
	return $.ajax({
		type:"post",
		url:url,
		async: true,
		data:parm,
		dataType:"text",
		success:function(data, status){
			if(funS != null || funS != undefined){
				funS(data);
			}
		},
		error:function(data, status, e){
			if(funE != null || funE != undefined){
				funE(data);
			}
		}
	});
}

function saveAsyncTrue(url,parm){
	loading();
	return $.ajax({
		type:"post",
		url:url,
		async: true,
		data:parm,
		dataType:"text",
		success:function(data){
		    data=eval("("+data+")");
		    removeLoading();
		    if(data.msg.code == 0){ 
				$.messager.alert('消息',data.msg.text,'error');
			}else{
				msgShow(data.msg.text);
				setTimeout("window.location.reload(true)",800);
			}
		},
		error:function(xhr,state){
			removeLoading();
			$.messager.alert('消息','操作失败！'+xhr.status+' '+xhr.statusText,'error');
		}
	});
}
/*****************************初始化dialog的相关内容开始******************************************/
/**
 * 消息提示窗体
 * @param {} t 展示类型 可选值: null,slide,fade,show，默认为slide
 * @param {} msg 消息内容
 * @param {} w 窗体宽度
 * @param {} h 窗体高度
 */
function msgShow(msg,t,w,h){
	$.messager.show({
		title:'消息',
		msg:msg,
		showType:t||'slide',
		timeout:3000,
		width:w||300,
		height:h||200
	});
}
/**
 * 初始化弹出框,处于打开状态
 * @param {Object} title 标题
 * @param {Object} id 控件id
 * @param {Object} fun 保存按钮的方法
 */
function showWinDefault(id,title,width,height,plain,fun){
	$('#'+id).show();
	$('#'+id).dialog({
		closed:false,
		modal:true,
		title:title,
		width:width||600,
		height:height||400,
		onMove:function (left,top){
			if(left < 0 ){
				$('#'+id).dialog({
					left:0,
					closed:false
				});
			}
			if(top < 0 ){
				$('#'+id).dialog({
					top:0,
					closed:false
				});
			}
		},
		buttons : [ {
			text : '确　定',
			plain:plain,
			iconCls : 'icon-ok',
			handler :function(){
				if(fun != null && fun != undefined){
					fun();
				}
			}
		},{
			text : '关　闭',
			plain:plain,
			iconCls:'icon-cancel',
			handler :function(){
				closeWin(id);
			}
		}]
	});
}
/**
 * 弹出弹出框
 * @param {Object} title 标题
 * @param {Object} id 窗体id
 * @param {Object} fun 保存按钮的方法
 * @param {Object} modal 模式
 */
function showWinWithBtn(id,title,width,height,modal,btn){
	$('#'+id).show();
	$('#'+id).dialog( {
		closed:false,
		modal:modal,
		title:title,
		width:width||600,
		height:height||400,
		onMove:function (left,top){
			if(left < 0 ){
					$(id).dialog({
						left:0,
						closed:false
					});
			}
			if(top < 0 ){
					$(id).dialog({
						top:0,
						closed:false
					});
				}
			},
		buttons : btn
		});
}

/**
 * 初始化弹出框
 * @param {Object} title 标题
 * @param {Object} id 窗体id
 * @param {Object} fun 保存按钮的方法
 * @param {Object} canClose 窗体是否处于关闭状态
 * @param {Object} modal 模式
 */
function initWinDefault(title,id,fun,canClose,modal){
	$('#'+id).show();
	$('#'+id).dialog( {
		closed:canClose,
		modal:modal,
		title:title,
		onMove:function (left,top){
			if(left < 0 ){
				$(id).dialog({
					left:0,
					closed:false
				});
			}
			if(top < 0 ){
				$(id).dialog({
					top:0,
					closed:false
				});
			}
		},
		buttons : [ {
			text : '保　存',
			plain:true,
			iconCls : 'icon-ok',
			handler :function(){
				if(fun != null && fun != undefined){
					fun();
				}
				closeWin(id);
			}
		},{
			text : '关　闭',
			plain:true,
			iconCls:'icon-cancel',
			handler :function(){
				closeWin(id);
			}
		}]
	});
}
/**
 * 初始化窗体,传入按钮组合
 * @param {Object} title 标题
 * @param {Object} id 窗体id
 * @param {Object} btn 按钮的btn数组
 * @param {Object} canClose 窗体是否处于关闭状态
 * @param {Object} modal 
 */
function initWinWithBtn(id,title,width,height,canClose,modal,btn){
	$('#'+id).show();
	$('#'+id).dialog( {
		closed:canClose,
		modal:modal,
		title:title,
		width:width||600,
		height:height||400,
		onMove:function (left,top){
			if(left < 0 ){
					$(id).dialog({
						left:0,
						closed:false
					});
			}
			if(top < 0 ){
					$(id).dialog({
						top:0,
						closed:false
					});
				}
			},
		buttons : btn
		});
}
/**
 * 显示弹出框，无按钮
 * @param {Object} title
 * @param {Object} id
 */
function showWinNoBtn(id,title,width,height){
	$('#'+id).show();
	$('#'+id).dialog( {
		closed:false,
		modal:true,
		title:title,
		width:width||600,
		height:height||400,
		buttons:null,
		onMove:function (left,top){
			if(left < 0 ){
				$(id).dialog({
					left:0,
					closed:false
				});
			}
			if(top < 0 ){
				$(id).dialog({
					top:0,
					closed:false
				});
			}
		}
	});
}

/**
 * 关闭窗体
 * @param {Object} id
 */
function closeWin(id){
	$('#'+id).dialog('close');
}
/*****************************初始化dialog的相关内容结束******************************************/
/*****************************初始化treegrid的相关内容开始******************************************/
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
 * treegrid初始化
 * @param {Object} id 控件id
 * @param {Object} idField id属性字段
 * @param {Object} showRowNumber 是否显示行数
 * @param {Object} frozenColumns 固定列
 * @param {Object} columns 普通列
 * @param {Object} toolbars 工具栏
 */
function treeGridModel(id,idField,showRowNumber,frozenColumns,columns,toolbars){
	$('#'+id).treegrid({
		fit:true,
		nowrap: true,
		rownumbers: showRowNumber,
		animate:false,
		collapsible:true,
		idField:idField,
		treeField:idField,
		frozenColumns:frozenColumns,
		columns:columns,
		toolbar:toolbars
	});
}
/*****************************初始化treegrid的相关内容结束******************************************/
/*****************************初始化datagrid的相关内容开始*************************************/
/**
 * 初始化表格datagrid
 * @param {Object} id 控件id
 * @param {Object} url 访问地址
 * @param {Object} idField id属性字段
 * @param {Object} pageList 分页
 * @param {Object} frozenColumns 固定列
 * @param {Object} columns 普通列
 * @param {Object} toolbars 工具栏
 * @param {Object} fun 双击出发函数
 * @param {Object} fun2 加载成功触发函数
 */
function tableModelDefault(id,url,idField,pageList,frozenColumns,columns,toolbars,fun,fun2){
	$('#'+id).datagrid({
		title:null,//文字标题
		fit:true,//是否允许自动缩放
		url:url,//地址
		width:'auto',//宽度
		height:'auto',//高度
		nowrap:true,//是否在同一行显示数据
		rownumbers:true,//是否显示行号
		showFooter:true,//是否显示底部
		remoteSort:false,
		pageList:pageList,//分页参数[5,10,15]
		striped:true,//是否显示斑马线
		pagination:true,//是否显示底部分页工具栏
		loadMsg:'正在加载......',//加载数据时显示的字符串
		idField:idField,//标识字段
		singleSelect:true,//是否只允许选择一行
		frozenColumns:frozenColumns,//固定列
		columns:columns,//普通列
		toolbar:toolbars,//工具栏
		pageNumber:1,//初始化页码
		onDblClickRow:function(){
			if(fun != null && fun != undefined){
				fun();
			}
		},//双击触发函数
		onLoadSuccess:function(){
			if(fun2 != null && fun2 != undefined){
				fun2();
			}
		}//加载完成成功触发函数
	});
}

/**
 * 初始化表格datagrid,含参数
 * @param {Object} id 控件id
 * @param {Object} url 访问地址
 * @param {Object} param 查询参数
 * @param {Object} idField id属性字段
 * @param {Object} pageList 分页
 * @param {Object} frozenColumns 固定列
 * @param {Object} columns 普通列
 * @param {Object} toolbars 工具栏
 * @param {Object} fun 双击出发函数
 * @param {Object} fun2 加载成功触发函数
 */
function tableModelDefaultWithParam(id,url,param,idField,pageList,frozenColumns,columns,toolbars,fun,fun2){
	$('#'+id).datagrid({
		title:null,//文字标题
		fit:true,//是否允许自动缩放
		url:url,//地址
		queryParams:param,//参数
		width:'auto',//宽度
		height:'auto',//高度
		nowrap:true,//是否在同一行显示数据
		rownumbers:true,//是否显示行号
		showFooter:true,//是否显示底部
		remoteSort:false,
		pageList:pageList,//分页参数[5,10,15]
		striped:true,//是否显示斑马线
		pagination:true,//是否显示底部分页工具栏
		loadMsg:'正在加载......',//加载数据时显示的字符串
		idField:idField,//标识字段
		singleSelect:true,//是否只允许选择一行
		frozenColumns:frozenColumns,//固定列
		columns:columns,//普通列
		toolbar:toolbars,//工具栏
		pageNumber:1,//初始化页码
		onDblClickRow:function(){
			if(fun != null && fun != undefined){
				fun();
			}
		},//双击触发函数
		onLoadSuccess:function(){
			if(fun2 != null && fun2 != undefined){
				fun2();
			}
		}//加载完成成功触发函数
	});
}
/**
 * 
 * @param {Object} id 控件id
 * @param {Object} title 标题
 * @param {Object} url 访问地址
 * @param {Object} width 宽
 * @param {Object} height 高
 * @param {Object} idField id属性字段
 * @param {Object} pageList 分页
 * @param {Object} isSingleSelect 是否只允许选择一行
 * @param {Object} frozenColumns 固定列
 * @param {Object} columns 普通列
 * @param {Object} toolbars 工具栏
 * @param {Object} fun 双击出发函数
 */
function tableModel(id,title,url,width,height,idField,pageList,isSingleSelect,frozenColumns,columns,toolbars,fun){
	$('#'+id).datagrid({
		title:title,//文字标题
		fit:true,//是否允许自动缩放
		url:url,//地址
		width:width,//宽度
		height:height,//高度
		nowrap:true,//是否在同一行显示数据
		rownumbers:true,//是否显示行号
		showFooter:true,//是否显示底部
		remoteSort:false,
		pageList:pageList,//分页参数[5,10,15]
		striped:true,//是否显示斑马线
		pagination:true,//是否显示底部分页工具栏
		loadMsg:'正在加载......',//加载数据时显示的字符串
		idField:idField,//标识字段
		singleSelect:isSingleSelect,//是否只允许选择一行
		frozenColumns:frozenColumns,//固定列
		columns:columns,//普通列
		toolbar:toolbars,//工具栏
		pageNumber : 1,//初始化页码
		pageSize : 20,//默认20条
		onDblClickRow:function(){
			if(fun != null && fun != undefined){
				fun();
			}
		}//双击触发函数
		
	});
}

/**
 * 含参数的table加载模板
 * @param {Object} id 控件id
 * @param {Object} title 标题
 * @param {Object} url 访问地址
 * @param {Object} param 查询参数
 * @param {Object} width 宽
 * @param {Object} height 高
 * @param {Object} idField id属性字段
 * @param {Object} pageList 分页
 * @param {Object} isSingleSelect 是否只允许选择一行
 * @param {Object} frozenColumns 固定列
 * @param {Object} columns 普通列
 * @param {Object} toolbars 工具栏
 * @param {Object} fun 双击出发函数
 */
function tableModelWithParam(id,title,url,param,width,height,idField,pageList,isSingleSelect,frozenColumns,columns,toolbars,fun,loadFun){
	$('#'+id).datagrid({
		title:title,//文字标题
		fit:true,//是否允许自动缩放
		'url':url,//地址
		queryParams:param,//参数
		width:width,//宽度
		height:height,//高度
		nowrap:true,//是否在同一行显示数据
		rownumbers:true,//是否显示行号
		showFooter:true,//是否显示底部
		remoteSort:false,
		pageList:pageList,//分页参数[5,10,15]
		striped:true,//是否显示斑马线
		pagination:true,//是否显示底部分页工具栏
		loadMsg:'正在加载......',//加载数据时显示的字符串
		idField:idField,//标识字段
		singleSelect:isSingleSelect,//是否只允许选择一行
		frozenColumns:frozenColumns,//固定列
		columns:columns,//普通列
		toolbar:toolbars,//工具栏
		pageNumber : 1,//初始化页码
		pageSize : 20,//默认20条
		onDblClickRow:function(){
			if(fun != null && fun != undefined){
				fun();
			}
		},//双击触发函数
		onLoadSuccess:function(){
			if(loadFun != null && loadFun != undefined){
				loadFun();
			}
		}//加载完成成功触发函数
	});
}

/**
 * 没有任何操作的表格(无可触发函数)
 * @param {Object} id 控件id
 * @param {Object} url 访问地址
 * @param {Object} idField id属性字段
 * @param {Object} pageList 分页
 * @param {Object} frozenColumns 固定列
 * @param {Object} columns 普通列
 * @param {Object} toolbars 工具栏
 */
function tableModelNoFun(id,url,idField,pageList,frozenColumns,columns,toolbars){
	$('#'+id).datagrid({
		title:null,//文字标题
		fit:true,//是否允许自动缩放
		url:url,//地址
		width:'auto',//宽度
		height:'auto',//高度
		nowrap:true,//是否在同一行显示数据
		rownumbers:true,//是否显示行号
		showFooter:true,//是否显示底部
		remoteSort:false,
		pageList:pageList,//分页参数[5,10,15]
		striped:true,//是否显示斑马线
		pagination:true,//是否显示底部分页工具栏
		loadMsg:'正在加载......',//加载数据时显示的字符串
		idField:idField,//标识字段
		singleSelect:true,//是否只允许选择一行
		frozenColumns:frozenColumns,//固定列
		columns:columns,//普通列
		toolbar:toolbars,//工具栏
		pageNumber:1,//初始化页码
		pageSize : 20//默认20条
	});
}

/**
 * 加载datagrid无分页
 * @param {Object} id
 * @param {Object} url
 * @param {Object} param
 * @param {Object} frozenColumns
 * @param {Object} columns
 * @param {Object} toolbars
 * @param {Object} fun
 * @param {Object} fun1
 * @param {Object} fun2
 * @param {Object} fun3
 */
function tableModelPage(id,url,param,frozenColumns,columns,toolbars,fun,fun1,fun2,fun3){
	$('#'+id).datagrid({
		url:url,//地址
		queryParams:param,//参数
		fit:true,
		width:'auto',//宽度
		height:'auto',//高度
		nowrap: true,//是否在同一行显示数据
		striped: true,
		collapsible : false,
		remoteSort: false,
		rownumbers:true,//是否显示行号
		frozenColumns:frozenColumns,
		columns :columns,
		pagination:false,
		loadMsg:'正在加载......',//加载数据时显示的字符串
		toolbar:toolbars,//工具栏
		onLoadSuccess:function(){
			if(fun != null && fun != undefined){
				fun();
			}
		},
		onClickRow:function(){
			if(fun1 != null && fun1 != undefined){
				fun1();
			}
		},
		onDblClickRow:function(){
			if(fun2 != null && fun2 != undefined){
				fun2();
			}
		},
		onAfterEdit:function(){
			if(fun3 != null && fun3 != undefined){
				fun3();
			}
		}
	});
}

function tableModelPage1(id,url,param,frozenColumns,columns,toolbars,fun,fun1,fun2,fun3,fun4,fun5,fun6,fun7){
	$('#'+id).datagrid({
		url:url,//地址
		queryParams:param,//参数
		fit:true,
		width:'auto',//宽度
		height:'auto',//高度
		nowrap: true,//是否在同一行显示数据
		striped: true,
		collapsible : false,
		remoteSort: false,
		rownumbers:true,//是否显示行号
		frozenColumns:frozenColumns,
		columns :columns,
		pagination:false,
		loadMsg:'正在加载......',//加载数据时显示的字符串
		toolbar:toolbars,//工具栏
		onLoadSuccess:function(){
			if(fun != null && fun != undefined){
				fun();
			}
		},
		onClickRow:function(){
			if(fun1 != null && fun1 != undefined){
				fun1();
			}
		},
		onDblClickRow:function(){
			if(fun2 != null && fun2 != undefined){
				fun2();
			}
		},
		onAfterEdit:function(){
			if(fun3 != null && fun3 != undefined){
				fun3();
			}
		},
		onSelect:function(){
			if(fun4 != null && fun4 != undefined){
				fun4();
			}
		},
		onUnselect:function(){
			if(fun5 != null && fun5 != undefined){
				fun5();
			}
		},
		onSelectAll:function(){
			if(fun6 != null && fun6 != undefined){
				fun6();
			}
		},
		onUnselectAll:function(){
			if(fun7 != null && fun7 != undefined){
				fun7();
			}
		}
	});
}
/*****************************初始化datagrid的相关内容结束***************************************/
/*****************************初始化tree的相关内容开始******************************************/
/**
 * 加载树结构
 * @param {Object} id 树id
 * @param {Object} url 地址
 * @param {Object} clickFun 单击触发函数
 * @param {Object} selectFun 选中触发函数
 * @param {Object} loadFun 加载完成触发函数
 * @param {Object} dbClickFun 双击触发函数
 */
function initTreeDefault(id,url,clickFun,selectFun,loadFun,dbClickFun){
	$('#'+id).tree({
		animate:true,//展开折叠时是否显示动画效果
		checkbox:false,//是否有复选框
		url:url,//地址
		onClick:function(){
			if(clickFun != null && clickFun != undefined){
				clickFun();
			}
		},//单击触发函数
		onSelect:function(){
			if(selectFun != null && selectFun != undefined){
				selectFun();
			}
		},//被选中时触发
		onLoadSuccess:function(){
			if(loadFun != null && loadFun != undefined){
				loadFun();
			}
		},//加载成功时触发
		onDblClick:function(){
			if(dbClickFun != null && dbClickFun != undefined){
				dbClickFun();
			}
		}//双击时加载
	});
}
/**
 * 加载树结构，控制了是否有多选款
 * @param {Object} id 树id
 * @param {Object} url 地址
 * @param {Object} animate 当节点展开或者收缩是否显示动画效果
 * @param {Object} hasCheckbox 是否有多选框
 * @param {Object} clickFun 单击触发函数
 * @param {Object} selectFun 选中触发函数
 * @param {Object} loadFun 加载完成触发函数
 * @param {Object} dbClickFun 双击触发函数
 */
function initTree(id,url,animate,hasCheckbox,clickFun,selectFun,loadFun,dbClickFun){
	$('#'+id).tree({
		animate:animate,//展开折叠时是否显示动画效果
		checkbox:hasCheckbox,//是否有复选框
		url:url,//地址
		onClick:function(){
			if(clickFun != null && clickFun != undefined){
				clickFun();
			}
		},//单击触发函数
		onSelect:function(){
			if(selectFun != null && selectFun != undefined){
				selectFun();
			}
		},//被选中时触发
		onLoadSuccess:function(){
			if(loadFun != null && loadFun != undefined){
				loadFun();
			}
		},//加载成功时触发
		onDblClick:function(){
			if(dbClickFun != null && dbClickFun != undefined){
				dbClickFun();
			}
		}//双击时加载
	});
}
/**
 * 加载树结构
 * @param {Object} id 树id
 * @param {Object} url 地址
 * @param {Object} clickFun 单击触发函数
 * @param {Object} selectFun 选中触发函数
 * @param {Object} loadFun 加载完成触发函数
 * @param {Object} dbClickFun 双击触发函数
 * @param {Object} beforeExpandFun 展开节点时触发函数
 */
function initTreeDefault1(id,url,clickFun,selectFun,loadFun,dbClickFun,beforeExpandFun){
	$('#'+id).tree({
		animate:true,//展开折叠时是否显示动画效果
		checkbox:false,//是否有复选框
		url:url,//地址
		onClick:function(){
			if(clickFun != null && clickFun != undefined){
				clickFun();
			}
		},//单击触发函数
		onSelect:function(){
			if(selectFun != null && selectFun != undefined){
				selectFun();
			}
		},//被选中时触发
		onLoadSuccess:function(){
			if(loadFun != null && loadFun != undefined){
				loadFun();
			}
		},//加载成功时触发
		onDblClick:function(){
			if(dbClickFun != null && dbClickFun != undefined){
				dbClickFun();
			}
		},//双击时加载
		onBeforeExpand:function(){
			if(beforeExpandFun != null && beforeExpandFun != undefined){
				beforeExpandFun();
			}
		}//展开节点时触发.若异步加载的参数变化，则需在这个方法里来改url
	});
}
/**
 * 加载树结构，控制了是否有多选款
 * @param {Object} id 树id
 * @param {Object} url 地址
 * @param {Object} animate 当节点展开或者收缩是否显示动画效果
 * @param {Object} hasCheckbox 是否有多选框
 * @param {Object} clickFun 单击触发函数
 * @param {Object} selectFun 选中触发函数
 * @param {Object} loadFun 加载完成触发函数
 * @param {Object} dbClickFun 双击触发函数
 * @param {Object} beforeExpandFun 展开节点时触发函数
 */
function initTree1(id,url,animate,hasCheckbox,clickFun,selectFun,loadFun,dbClickFun,beforeExpandFun){
	$('#'+id).tree({
		animate:animate,//展开折叠时是否显示动画效果
		checkbox:hasCheckbox,//是否有复选框
		url:url,//地址
		onClick:function(){
			if(clickFun != null && clickFun != undefined){
				clickFun();
			}
		},//单击触发函数
		onSelect:function(){
			if(selectFun != null && selectFun != undefined){
				selectFun();
			}
		},//被选中时触发
		onLoadSuccess:function(){
			if(loadFun != null && loadFun != undefined){
				loadFun();
			}
		},//加载成功时触发
		onDblClick:function(){
			if(dbClickFun != null && dbClickFun != undefined){
				dbClickFun();
			}
		},//双击时加载
		onBeforeExpand:function(){
			if(beforeExpandFun != null && beforeExpandFun != undefined){
				beforeExpandFun();
			}
		}//展开节点时触发.若异步加载的参数变化，则需在这个方法里来改url
	});
}
/**
 * 展开节点
 * @param {Object} treeId 树id
 * @param {Object} node 树节点
 */
function expandParentNode(treeId,node){
	var fnode = $("#"+treeId).tree('getParent',node.target);
	if(fnode!=null){
		$("#"+treeId).tree('expand',fnode.target);
	}
	$("#"+treeId).tree('expand',node.target);//自己也展开
}
/*****************************初始化tree的相关内容结束******************************************/
/*****************************初始化combotree的相关内容开始******************************************/

function initComBoTree(id,url,editable,clickFun,selectFun,loadFun,dbClickFun,beforeExpandFun){
	$('#'+id).combotree({
		animate:true,//展开折叠时是否显示动画效果
		checkbox:false,//是否有复选框
		url:url,//地址
		editable:editable,//是否可编辑
		onClick:function(){
			if(clickFun != null && clickFun != undefined){
				clickFun();
			}
		},//单击触发函数
		onSelect:function(){
			if(selectFun != null && selectFun != undefined){
				selectFun();
			}
		},//被选中时触发
		onLoadSuccess:function(){
			if(loadFun != null && loadFun != undefined){
				loadFun();
			}
		},//加载成功时触发
		onDblClick:function(){
			if(dbClickFun != null && dbClickFun != undefined){
				dbClickFun();
			}
		},//双击时加载
		onBeforeExpand:function(){
			if(beforeExpandFun != null && beforeExpandFun != undefined){
				beforeExpandFun();
			}
		}//展开节点时触发.若异步加载的参数变化，则需在这个方法里来改url
	});
}

function initComBoTreeCheck(id,url,editable,animate,hasCheckbox,clickFun,selectFun,loadFun,dbClickFun,beforeExpandFun){
	$('#'+id).combotree({
		editable:editable,//是否可编辑
		animate:animate,//展开折叠时是否显示动画效果
		checkbox:hasCheckbox,//是否有复选框
		url:url,//地址
		onClick:function(){
			if(clickFun != null && clickFun != undefined){
				clickFun();
			}
		},//单击触发函数
		onSelect:function(){
			if(selectFun != null && selectFun != undefined){
				selectFun();
			}
		},//被选中时触发
		onLoadSuccess:function(){
			if(loadFun != null && loadFun != undefined){
				loadFun();
			}
		},//加载成功时触发
		onDblClick:function(){
			if(dbClickFun != null && dbClickFun != undefined){
				dbClickFun();
			}
		},//双击时加载
		onBeforeExpand:function(){
			if(beforeExpandFun != null && beforeExpandFun != undefined){
				beforeExpandFun();
			}
		}//展开节点时触发.若异步加载的参数变化，则需在这个方法里来改url
	});
}
/*****************************初始化combotree的相关内容结束******************************************/
/*****************************初始化tabs的相关内容开始******************************************/
/**
 * 初始化选项卡
 * @param {Object} 选项卡id
 */
function initTabs(tid){
	$("#"+tid).tabs({
		fit:true
	});
}
/**
 * 初始化选项卡（含工具栏）
 * @param {Object} tid 选项卡id
 * @param {Object} tools 工具数组
 */
function initTabsWithTool(tid,tools){
	$("#"+tid).tabs({
		fit:true,
		tools:tools
	});
}
/**
 * 添加选项卡
 * @param {Object} tid 选项卡的id
 * @param {Object} title 标题
 * @param {Object} content 内容
 * @param {Object} iconCls 图标
 * @param {Object} closable 是否可关闭
 */
function addTabs(tid,title,content,iconCls,closable){
	$("#"+tid).tabs('add',{
		title:title,
		content:content,
		iconCls:iconCls,
		closable:closable
	});
}
/**
 * 添加工具栏的方法
 * @param {Object} text 文本
 * @param {Object} fName 操作函数
 * @param {Object} icon 图标
 * @return {TypeName} 
 */
function add(text,fName,icon){
	return {text:text,
			iconCls:icon,
			handler:fName
		};
}
/*****************************初始化tabs的相关内容结束******************************************/
/*****************************form相关内容开始******************************************/
/**
 * 验证form表单
 * @param {Object} formId 表单的id
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
function checkForm(submitFrmId){
//	var flag = true;
//	$("#"+formId+" input,textarea").each(function () {
//		if($(this).attr('required') && $.trim($(this).val())==""){
//			$(this).val('');//若为必填项并且填入的全是空格，则变为空
//		}
//		if ($(this).attr('required') || $(this).attr('validType')){
//			if (!$(this).validatebox('isValid')) {
//				$(this).focus();
//		        flag = false;
//		        return false;
//		    }else{
//		    	flag = true;
//		    }
//		}
//	});
//	return flag;
	$("#"+submitFrmId+" input,textarea").each(function () {
		if($(this).attr('required') && $.trim($(this).val())==""){
			$(this).val('');//若为必填项并且填入的全是空格，则变为空
		}
	});
	if($("#"+submitFrmId).form('validate')){
		return true;
	}else{
		return false;
	}
}
/**
 * 读取整个表单元素的值，并组合成JSON格式的字符串返回
 * @param {} fid
 * @return {}
 */
function getFormVaToString(fid){
	return $("#"+fid).serialize();
}
/**
 * 读取整个表单元素的值，并组合成JSON格式返回
 * @return {TypeName} 
 */
function getFormVaToJSON(fid){
	return JSON.stringify($("#"+fid).serializeArray());
}
/**
 * 表单重置方法
 * @param {} id
 */
function resetForm(id){
	removeErrorClass(id);
	$("#"+id).form('clear');
	
}
/**
 * 移除错误的样式
 * @param {Object} formId
 */
function removeErrorClass(formId){
	$("#"+formId+" input,textarea").removeClass("validatebox-invalid");
}
/*****************************form相关内容结束******************************************/
/**
 * 获取json数据
 * @param {Object} formName 表单名称
 * @return {TypeName} 
 */
function getJson(formName){
	var json="jsonValue={";
	var input = $('"'+formName+'"'+":input");
	for(var i = 0 ; i <  input.length ; i++){
			if(input[i].type == 'radio'){
				json+='"'+input[i].name+'":"'+input[i].value+'",';
				i++;
			}else if(input[i].type == 'text' || input[i].type == 'hidden'){
				if(input[i].name){
					json+='"'+input[i].name+'":"'+input[i].value+'",';
				}
			}
	}
	return json;
}
function getJson2(vName,formName){
	var json=vName+"={";
	var input = $(formName+" input");
	for(var i = 0 ; i <  input.length ; i++){
			if(input[i].type == 'radio'){
				json+='"'+input[i].name+'":"'+input[i].value+'",';
				i++;
			}else if(input[i].type == 'text' || input[i].type == 'hidden'){
				if(input[i].name){
					json+='"'+input[i].name+'":"'+input[i].value+'",';
				}

			}

	}
	return json;
}
/**
 * 转义特殊字符
 * @param {Object} val
 * @return {TypeName} 
 */
function escapeCharacter(val){
	if(val){
	  	var patrn1=/[%]/g;
		var patrn2=/[&]/g;
		var patrn3=/["]/g;
	  	val = val.replace(patrn3,"&quot;").replace(patrn1,"%25").replace(patrn2,"%26");
  	}
	return $.trim(val);
}
/**
 * 把双引号转回来字符
 * @param {Object} val
 * @return {TypeName} 
 */
function getCharacter(val){
	if(val){
	  	var patrn1=/&quot;/g;
	  	val = val.replace(patrn1,'"');
  	}
	return val;
}

/**
 * 截取过长的字符，鼠标移上去提示
 * @param {Object} v
 * @param {Object} r
 * @return {TypeName} 
 */
function textToShort(v,r){
	var result = "";
	if(v != null && v != ""){
		if(v.length > 20){
			result = '<label title="'+v+'">'+v.substring(0,20)+'......</label>';
		}else{
			result = '<label title="'+v+'">'+v+'</label>';
		}
	}
	return result;
}

function textToDiv(v,r){
	var result = "";
	if(v != null && v != ""){
		result = '<div title="'+v+'">'+v+'</div>';
	}
	return result;
}


/**
 * 是否以某个字符串结尾
 * @param {Object} s1
 * @param {Object} s2
 * @return {TypeName} 
 */
function endWith(s1,s2){
	if(s1.length < s2.length){
		return false;  
	}  
	if(s1 == s2){
		return true;  
	}  
	if(s1.substring(s1.length-s2.length) == s2) {
		return true;  
	} 
	return false;  
}

/**
 * 时间格式规范.拼接时间字符串。yyyy-MM-dd
 * @param {Object} dateStr
 * @return {TypeName} 
 */
function dataFormat(dateStr){
	if(dateStr != null && dateStr != undefined && dateStr.length >= 8){
		return dateStr.substring(0,4)+"-"+dateStr.substring(4,6)+"-"+dateStr.substring(6,8);
	}else{
		return "";
	}
}
function dateFormat(dateStr){
	if(dateStr != null && dateStr != undefined && dateStr.length >= 8){
		return dateStr.replace("T"," ")
	}else{
		return "";
	}	
}
/**
 * 获取当前时间
 */
function findNowTime(){
	var myDate = new Date();
	var mYear = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
	var mMonth = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
	if(mMonth < 10){
		mMonth = "0"+mMonth;
	}
	var mDate = myDate.getDate();        //获取当前日(1-31)
	if(mDate < 10){
		mDate = "0"+mDate;
	}
	var mHour = myDate.getHours();       //获取当前小时数(0-23)
	if(mHour < 10){
		mHour = "0"+mHour;
	}
	var mMinutes = myDate.getMinutes();     //获取当前分钟数(0-59)
	if(mMinutes < 10){
		mMinutes = "0"+mMinutes;
	}
	var mSencond = myDate.getSeconds();     //获取当前秒数(0-59)
	if(mSencond < 10){
		mSencond = "0"+mSencond;
	}
	return mYear+""+mMonth+""+mDate+""+mHour+""+mMinutes+""+mSencond+"";
}

/* 
用途：检查输入对象的值是否符合整数格式 
输入：str 输入的字符串 
返回：如果通过验证返回true,否则返回false 
*/
function isInteger( str )
{
    var regu = /^[-]{0,1}[0-9]{1,}$/;
    return regu.test(str);
};
/* 
用途：检查输入字符串是否符合正整数格式 
输入：s：字符串 
返回：如果通过验证返回true,否则返回false 
*/
function isNumber( s )
{
    var regu = "^[0-9]+$";
    var re = new RegExp(regu);
    if (s.search(re) != - 1) {
        return true;
    }
    else {
        return false;
    }
};
/* 
用途：检查输入字符串是否是带小数的数字格式,可以是负数 
输入：str：字符串 
返回：如果通过验证返回true,否则返回false 
*/
function isDecimal( str )
{
    if (isInteger(str)) {
        return true;
    }
    var re = /^[-]{0,1}(\d+)[\.]+(\d+)$/;
    if (re.test(str)) {
        if (RegExp.$1 == 0 && RegExp.$2 == 0) {
            return false;
        }
        return true;
    }
    else {
        return false;
    }
};


String.prototype.replaceAll = function(s1,s2) {

    return this.replace(new RegExp(s1,"gm"),s2);

}
/**
 * 使用my97扩展easyui可编辑时间控件
 * @return {TypeName} 
 */
function extendDateEditorWithMy97(){
	var isShowClear = true;
	var maxDate = '2200-10-01';
	$.extend($.fn.datagrid.defaults.editors, {
	my97 : {
		init : function(container, options) {
			if (options.isShowClear!= undefined) isShowClear = options.isShowClear;
			if (options.maxDate) maxDate = options.maxDate;
			
			var input = $('<input class="Wdate" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',readOnly:true,isShowClear:'+ isShowClear +',maxDate:\'' + maxDate +'\'});"  />').appendTo(container);
			return input;
		},
		getValue : function(target) {
			return $(target).val();
		},
		setValue : function(target, value) {
			$(target).val(value);
		},
		resize : function(target, width) {
			var input = $(target);
			if ($.boxModel == true) {
				input.width(width - (input.outerWidth() - input.width()));
			} else {
				input.width(width);
			}
		}
	}
});
	
//	/**
//	 * 使用my97扩展easyui可编辑时间控件
//	 * @return {TypeName} 
//	 */
//	function extendDateEditorWithMy97(){
//		$.extend($.fn.datagrid.defaults.editors, {
//		my97_1 : {
//			init : function(container, options) {
//				var input = $('<input class="Wdate" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',readOnly:true});"  />').appendTo(container);
//				return input;
//			},
//			getValue : function(target) {
//				return $(target).val();
//			},
//			setValue : function(target, value) {
//				$(target).val(value);
//			},
//			resize : function(target, width) {
//				var input = $(target);
//				if ($.boxModel == true) {
//					input.width(width - (input.outerWidth() - input.width()));
//				} else {
//					input.width(width);
//				}
//			}
//		}
//	});
//	}
}


