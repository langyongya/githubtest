

//*****************************************************************************************
//   区划树

/**
 * 利用ajax获取区划树的所以数据
 * @param treeid 树id
 * @param ischeck 是否有多选框 true 有 false 没有
 * @param backfilldata  回填数据，array格式的树对象id
 * @param querydata  查询条件 格式{xx:xx,[xx:xx]}
 * @author jdq
 * @return
 */
function ajaxTreeData(treeid,ischeck,backfilldata,querydata){
		$.ajax({
				type:'post',
				url:baseUrl+'m/dict/selectZTreeArea.do',
				data:querydata,
				async : false,
				dataType:'json',
				success :function(data){
					
					 openAreazTree(treeid,data,ischeck,backfilldata);
			}
    });
}

/**
 * 初始化区划ztree树
 * @param treeid 树的id
 * @param data 建立树的所有json数据
 * @param ischeck 是否有多选框 true 有 false 没有
 * @param backfilldata 回填数据，array格式的树对象id
 */
function openAreazTree(treeid,data,ischeck,backfilldata){
	  var setting = {
	  		callback: {
	//			onClick: zTreeOnClick,
			},
	  		check: {
	  			enable: ischeck
	  		},
	  		data: {
	  			simpleData: {
	  				enable: true,
	  				idKey:"id",
	  				pIdKey:"pid",
	  				rootPId: "area"
	  			}
	  		},
	  		view: {
				fontCss: getFontCss
			}
	  	};
	  	var zNodes =data;
	  	$.fn.zTree.init($("#"+treeid), setting, zNodes);
	  	//数据回填
	  	backfill(treeid,backfilldata); 	
}


/**
 * 区划树数据回填
 * @param treeid 树id
 * @param arrStrIds 回填数据
 */
function backfill(treeid ,arrStrIds){
		  var treeObj = $.fn.zTree.getZTreeObj(treeid);
		  if(arrStrIds!=null){
			  var shu = arrStrIds;
			  for(var i =0 ; i<shu.length ;i++){
				  var node = treeObj.getNodeByParam("id",shu[i], null);
				  if(node!= null && !node.open ){
					  node.checked = true;
					  treeObj.updateNode(node,true);
				  }
		     }
		  }

}

//*************************************************************************
//      大数据获取部门树

/**
 * 一次性获取所有部门数据，构建部门ZTree树
 * @param treeid	树id
 * @param ischeck	是否多选 true 多选
 * @param backfilldata	回填数据 格式json
 * @param quertdata	查询条件 格式{xx:xx,[xx:xx]}
 *  				请到action查询是否你想要的查询的条件，也可自行添加
 * @author jdq
 * @return
 */
function ajaxTreeDateOrg(treeid,ischeck,backfilldata,quertdata){
		$.ajax({
			type:'post',
			url:baseUrl+'m/org/queryZTreeOrg.do',
			data:quertdata,
			dataType:'json',
			success :function(data){
				openorgzTree(treeid,data,ischeck,backfilldata);
		}
	});
}




/**
 * 初始化部门ztree树
 * @param treeid 树的id
 * @param data 建立树的所有json数据
 * @param ischeck 是否有多选框 true 有 false 没有
 * @param backfilldata 回填数据，array格式的树对象id
 */
function openorgzTree(treeid,data,ischeck,backfilldata){
	  var setting = {
	  		callback: {
	//			onClick: zTreeOnClick,
			},
	  		check: {
	  			enable: ischeck
	  		},
	  		data: {
	  			simpleData: {
	  				enable: true,
	  				idKey:"id",
	  				pIdKey:"pid",
	  				rootPId: "0"
	  			}
	  		},
	  		view: {
				fontCss: getFontCss
			}
	  	};
	  	var zNodes =data;
	  	$.fn.zTree.init($("#"+treeid), setting, zNodes);
	  	//数据回填
	  	orgbackfill(treeid,backfilldata); 	
}


/**
 * 部门树数据回填
 * @param treeid 树id
 * @param arrStrIds 回填数据
 */
function orgbackfill(treeid ,arrStrIds){
		  var treeObj = $.fn.zTree.getZTreeObj(treeid);
		  if(arrStrIds!=null){
			  var shu = arrStrIds;
			  for(var i =0 ; i<shu.length ;i++){
				  var node = treeObj.getNodeByParam("id",shu[i], null);
				  if(node!= null){
					  var parentnode = node.getParentNode();
					  if(parentnode!=null){
						  treeObj.expandNode(parentnode, true, true, true);
					  }
					  if(node.state=='open'){
						  node.checked = true;
						  treeObj.updateNode(node,true);
					  }
				  } 
		     }
		  }
//		treeObj.expandAll(false);
}

/**
 * 区划树获取最细级demo
 * @return
 */
function getSelectNodeas(){
		  var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		  var nodes = treeObj.getCheckedNodes(true);
		  var str ="";
		  alert(nodes.length);
		  for(var i=0 ;i < nodes.length ;i++){
			 var treeNode = nodes[i];
			 if(!treeNode.open){
				  str +=(treeNode.id + ", " + treeNode.name +" , "+treeNode.pid+" , "+treeNode.state);
				  str +="\n";
			  }
		  }
		  $("#area").val(str);
}

//*************************************************************************
//   异步加载获取部门树

/**
 * 异步加载获取部门树，构建部门ZTree树(左侧功能树)
 * @param treeid	树id
 * @param ischeck	是否多选 true 多选
 * @param quertdata	查询条件 格式{xx:xx,[xx:xx]} 例如：{ "id":"1", "name":"test"}
 * @param zTreeOnClick	单击事件 function zTreeOnClick(event, treeId, treeNode)自行设定函数，将函数名传入;
 * @author jdq
 * @return
 */
function ajaxGetOrgData(treeid,ischeck,querydata,zTreeOnClick,url){
	if(!url) url = baseUrl+'m/org/query.do';
	  var setting = {
				async: {
					enable: true,
					url: url,//员工页面加载部门过滤登录者区划
					autoParam: ["id"],
					otherParam: querydata
				},
		  		callback: {
					onClick: zTreeOnClick
				},
		  		check: {
		  			enable: ischeck
		  		},
		  		view: {
					fontCss: getFontCss
				}
		  	};
	$.fn.zTree.init($("#"+treeid), setting);
}



//*************************************************************************
//异步加载获取垂管单位树

/**
* 异步加载获取垂管单位树，构建垂管单位树ZTree树(左侧功能树)
* @param treeid	树id
* @param ischeck	是否多选 true 多选
* @param quertdata	查询条件 格式{xx:xx,[xx:xx]} 例如：{ "id":"1", "name":"test"}
* @param zTreeOnClick	
					单击事件 function zTreeOnClick(event, treeId, treeNode)自行设定函数，将函数名传入;
* @param zTreeOnExpand	
* 					捕获节点被展开的事件回调函数 function zTreeOnExpand(event, treeId, treeNode) 自行设定函数，将函数名传入;
* @author jdq
* @return
*/
function ajaxVerticalData(treeid,ischeck,querydata,zTreeOnClick,zTreeOnExpand){

 var setting = {
			async: {
				enable: true,
				url: baseUrl+'m/verticalOrg/queryVerticalOrg.do',
				autoParam: ["id"],
				otherParam: querydata
			},
	  		callback: {
				onClick: zTreeOnClick,
				onExpand: zTreeOnExpand
			},
	  		check: {
	  			enable: ischeck
	  		},
	  		view: {
				fontCss: getFontCss
			}
	  	};
     $.fn.zTree.init($("#"+treeid), setting);
}




//**************************************************************************************
//                                 查询方法 


//上次查询得到的数据
var selectNode='';

/**
 * 模糊查询输入框输入的条件
 * @param queryid 查询框id
 * @param treeid  树id
 * @return
 */
function queryZTreeArea(treeid,queryid){
	var qryname = $("#"+queryid).val();
	var zTree = $.fn.zTree.getZTreeObj(treeid);

	//更新之前被选中的节点
	if(selectNode!=null && selectNode.length >0){
		updateNodes(treeid,selectNode,false);
	}
	var nodeList = zTree.getNodesByParamFuzzy("name", qryname);
	selectNode  = nodeList;
	
	//渲染选中的节点
	if( nodeList.length <=0){
		$.messager.alert('提示','查询结果为空！','info');
		return ;
	}else{
		updateNodes(treeid,nodeList,true);
	}
}

/**
 * 渲染查询选中的节点
 * @param treeid 树id
 * @param nodeList 符合条件的节点
 * @param highlight	是否渲染字体
 * @return
 */
function updateNodes(treeid,nodeList,highlight) {
	var zTree = $.fn.zTree.getZTreeObj(treeid);
	if(nodeList.length> 0){
		for( var i=0, l=nodeList.length; i<l; i++) {
			nodeList[i].highlight = highlight;
			zTree.updateNode(nodeList[i]);
		}
		zTree.selectNode(nodeList[0]);
	}
}

/**
 * 渲染方法
 * @param treeId
 * @param treeNode 选中节点
 * @return
 */
function getFontCss(treeId, treeNode) {
	return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
//*****************************************************************************************
//菜单树

/**
* 利用ajax获取菜单树的所有数据
* @param treeid 树id
* @param ischeck 是否有多选框 true 有 false 没有
* @param backfilldata  回填数据，array格式的树对象id
* @param querydata  查询条件 格式{xx:xx,[xx:xx]} 
* @return
*/
function ajaxmwTreeData(treeid,ischeck,backfilldata,querydata){
	$.ajax({
			type:'post',
			url: baseUrl+'m/rolemgr/query-module.do',
			data:querydata,
			dataType:'json',
			success :function(data){
				 openMwzTree(treeid,data,ischeck,backfilldata);
		}
	});
}

/**
* 初始化菜单ztree树
* @param treeid 树的id
* @param data 建立树的所有json数据
* @param ischeck 是否有多选框 true 有 false 没有
* @param backfilldata 回填数据，array格式的树对象id
*/
function openMwzTree(treeid,data,ischeck,backfilldata){
 var setting = {
 		callback: {
//			onClick: zTreeOnClick,
		},
 		check: {
 			enable: ischeck
 		},
 		data: {
 			simpleData: {
 				enable: true,
 				idKey:"id",
 				pIdKey:"pid",
 				rootPId: "0"
 			}
 		},
 		view: {
			fontCss: getFontCss
		}
 	};
 	var zNodes =data;
 	$.fn.zTree.init($("#"+treeid), setting, zNodes);
 	//数据回填
 	mwbackfill(treeid,backfilldata); 	
}


/**
* 菜单数据回填
* @param treeid 树id
* @param arrStrIds 回填数据
*/
function mwbackfill(treeid ,arrStrIds){
	  var treeObj = $.fn.zTree.getZTreeObj(treeid);
	  if(arrStrIds!=null){
		  var shu = arrStrIds;
		  for(var i =0 ; i<shu.length ;i++){
			  var node = treeObj.getNodeByParam("target",shu[i], null);
			  if(node!= null){
				  var parentnode = node.getParentNode();
				  if(parentnode!=null){
					  treeObj.expandNode(parentnode, true, false, false);
				  }
				  if(node.state=='open'){
					  node.checked = true;
					  treeObj.updateNode(node,true);
				  }			  
			  } 
	     }
		  //treeObj.expandAll(true);
	  }else{
		  //treeObj.expandAll(true);		  
	  }
}

//*************************************************************************
//获取ztree职位树
/**
 * 利用ajax获取职位树的所有数据
 * @param treeid 树id
 * @param ischeck 是否有多选框 true 有 false 没有
 * @param backfilldata  回填数据，array格式的树对象id
 * @param querydata  查询条件 格式{xx:xx,[xx:xx]}
 * @author jdq
 * @return
 */
function ajaxRoleTreeDatas(treeid,ischeck,backfilldata,querydata){
		$.ajax({
				type:'post',
				url:baseUrl+'m/dict/queryRoleSetZTree.do',
				data:querydata,
				dataType:'json',
				success :function(data){
					openRolezTree(treeid,data,ischeck,backfilldata);
			}
    });
}

/**
 * 利用ajax获取职位树的所有数据
 * @param treeid 树id
 * @param ischeck 是否有多选框 true 有 false 没有
 * @param backfilldata  回填数据，array格式的树对象id
 * @param querydata  查询条件 格式{xx:xx,[xx:xx]}
 * @author jdq
 * @return
 */
function ajaxRoleTreeToOrgData(treeid,ischeck,backfilldata,querydata,winid,name,id){
		$.ajax({
				type:'post',
				url:baseUrl+'m/rolemgr/getStaffOrgRoles.do',
				data:querydata,
				dataType:'json',
				success :function(data){
					if(querydata){
						if(data==''||data==null){
							 $('#'+winid).window('close');
							 $.messager.alert('提示','该部门下没有职位','info');		
							 $('#'+name).val("");
							 $('#'+id).val("");
							 return; 
						}
					}

					openRolezTree(treeid,data,ischeck,backfilldata);
			}
    });
}

/**
 * 初始化职位ztree树
 * @param treeid 树的id
 * @param data 建立树的所有json数据
 * @param ischeck 是否有多选框 true 有 false 没有
 * @param backfilldata 回填数据，array格式的树对象id
 */
function openRolezTree(treeid,data,ischeck,backfilldata){
	  var setting = {
	  		check: {
	  			enable: ischeck
	  		},
	  		data: {
	  			simpleData: {
	  				enable: true,
	  				idKey:"id",
	  				pIdKey:"pid",
	  				rootPId: "role"
	  			}
	  		},
	  		view: {
				fontCss: getFontCss
			}
	  	};
	  	var zNodes =data;
	  	$.fn.zTree.init($("#"+treeid), setting, zNodes);
	  	//数据回填
	  	
	  	orgbackfill(treeid, backfilldata);
}








//*************************************************************************
/**
* 利用ajax获取角色树的所有数据
* @param treeid 树id
* @param ischeck 是否有多选框 true 有 false 没有
* @param backfilldata  回填数据，array格式的树对象id
* @param querydata  查询条件 格式{xx:xx,[xx:xx]} 
* @return
*/
function ajaxRoleTreeData(treeid,ischeck,backfilldata,querydata){
	$.ajax({
			type:'post',
			//url : baseUrl+"m/rolemgr/queryZTreeRole.do?areaId="+querydata,
			url : baseUrl+"m/rolemgr/queryZTreeRole.do?",
			data:querydata,
			dataType:'json',
			success :function(data){
				 openRolezTree(treeid,data,ischeck,backfilldata);
		}
});
}

/**
* 初始化菜单ztree树
* @param treeid 树的id
* @param data 建立树的所有json数据
* @param ischeck 是否有多选框 true 有 false 没有
* @param backfilldata 回填数据，array格式的树对象id
* @param isradio true--单选; false-- 多选
*/
function openRolezTree(treeid,data,ischeck,backfilldata,isradio){
	var style = "";
	if(isradio){
		style = "radio"; 
	}else{
		style = "checkbox";
	}
 var setting = {
 		callback: {
//			onClick: zTreeOnClick,
		},
 		check: {
 			enable: ischeck,
 			chkStyle: style
 		},
 		data: {
 			simpleData: {
 				enable: true,
 				idKey:"id",
 				pIdKey:null,
 				rootPId:null
 			}
 		},
 		view: {
			fontCss: getFontCss
		}
 	};
 	var zNodes =data;
 	$.fn.zTree.init($("#"+treeid), setting, zNodes);
 	//数据回填
 	rolebackfill(treeid,backfilldata); 	
}


/**
* 菜单数据回填
* @param treeid 树id
* @param arrStrIds 回填数据
*/
function rolebackfill(treeid ,arrStrIds){
	  var treeObj = $.fn.zTree.getZTreeObj(treeid);
	  if(arrStrIds!=null){
		  var shu = arrStrIds;
		  for(var i =0 ; i<shu.length ;i++){
			  var node = treeObj.getNodeByParam("id",shu[i], null);
			  if(node!= null){
				  var parentnode = node.getParentNode();
				  if(parentnode!=null){
					  treeObj.expandNode(parentnode, true, true, true);
				  }
				  if(node.state=='open'){
					  node.checked = true;
					  treeObj.updateNode(node,true);
				  }
			  } 
	     }
		  //treeObj.expandAll(true);
	  }else{
		  //treeObj.expandAll(true);		  
	  }
}
//*************************************************************************
//异步加载获取开票区划单位树

/**
* 异步加载获取开票单位树，构建开票ZTree树(左侧功能树)
* @param treeid	树id
* @param ischeck	是否多选 true 多选
* @param quertdata	查询条件 格式{xx:xx,[xx:xx]} 例如：{ "id":"1", "name":"test"}
* @param zTreeOnClick	单击事件 function zTreeOnClick(event, treeId, treeNode)自行设定函数，将函数名传入;
* @return
*/
function ajaxGetInvoiceAreaData(treeid,ischeck,querydata,zTreeOnClick,flag,zTreeOnAsyncSuccess){
 var setting = {
			async: {
				enable: true,
				url: baseUrl + 'm/invoice/query-AreaTree.do?flag='+flag,
				autoParam: ["id"],
				otherParam: querydata
				//dataFilter: ajaxDataFilter
			},
	  		callback: {
				onClick: zTreeOnClick,
				onAsyncSuccess: zTreeOnAsyncSuccess
			},
	  		check: {
	  			enable: ischeck
	  		},
	  		view: {
				fontCss: getFontCss,
				expandSpeed: ""//不显示动画效果
			}
	  	};
$.fn.zTree.init($("#"+treeid), setting);
}
function ajaxDataFilter(treeId, parentNode, responseData) {
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	var nodes = zTree.transformToArray(zTree.getNodes());
	for(var i = 0;i < nodes.length;i++){
		var node = nodes[i];
		if(node.isParent==true){
			node.nocheck = true;
			zTree.updateNode(node);
		} 
	}
   return responseData
}
/**
 * 异步加载登录用户角色所属的区划
 * @param {Object} url 取数据路径
 * @param {Object} treeid 树的ID
 * @param {Object} ischeck	是否复选
 * @param {Object} querydata 查询条件 
 * @param {Object} enable  是否使用ztree
 * @param {Object} zTreeOnClick 点击事件处理方法
 * @param {Object} zTreeOnAsyncSuccess 加载成功事件处理方法
 */
function ajaxGetAreaOfLoginUser(url,treeid,ischeck,querydata,enable,zTreeOnClick,zTreeOnAsyncSuccess){
 var setting = {
			async: {
				enable: true,
				url: url,
				autoParam: ["id"],
				otherParam: querydata,
				enable:enable
			},
	  		callback: {
				//onClick: zTreeOnClick,
				onAsyncSuccess: zTreeOnAsyncSuccess
			},
	  		check: {
	  			enable: ischeck
	  		},
	  		view: {
				fontCss: getFontCss
			}
	  	};
$.fn.zTree.init($("#"+treeid), setting);
}
/**
 * 区划树异步加载后展开全部节点
 * @param {Object} nodes
 * @return {TypeName} 
 */
function expandNodes(nodes) {
	if (!nodes) return;
	var zTree = $.fn.zTree.getZTreeObj("areaTree");
	for (var i=0, l=nodes.length; i<l; i++) {
		zTree.expandNode(nodes[i], true, false, false);
		if (nodes[i].isParent && nodes[i].zAsync) {
			expandNodes(nodes[i].children);
		} 
	}
}
/**
* 异步加载获取角色用户树，构建角色用户ZTree树
* @param treeid	树id
* @param ischeck	是否多选 true 多选
* @param quertdata	查询条件 格式{xx:xx,[xx:xx]} 例如：{ "id":"1", "name":"test"}
* @param zTreeOnClick	单击事件 function zTreeOnClick(event, treeId, treeNode)自行设定函数，将函数名传入;
* @return
*/
function ajaxGetRoleUserData(treeid,ischeck,querydata,backfilldata,zTreeOnAsyncSuccess){
 var setting = {
			async: {
				enable: true,
				url: baseUrl + 'm/rolemgr/queryRoleUserTree.do',
				autoParam: ["id"],
				otherParam:querydata
				//dataFilter: ajaxDataFilter
			},
	  		callback: {
				//onClick: zTreeOnClick,
				onAsyncSuccess: zTreeOnAsyncSuccess
			},
	  		check: {
	  			enable: ischeck
	  		},
	  		view: {
				fontCss: getFontCss
			}
	  	};
$.fn.zTree.init($("#"+treeid), setting);
}
/**
 * 用户树异步加载后展开全部节点
 * @param {Object} nodes
 * @return {TypeName} 
 */
function expandUserNodes(nodes) {
	if (!nodes) return;
	var zTree = $.fn.zTree.getZTreeObj("userTree");
	for (var i=0, l=nodes.length; i<l; i++) {
		zTree.expandNode(nodes[i], true, false, false);
		if (nodes[i].isParent && nodes[i].zAsync) {
			expandUserNodes(nodes[i].children);
		} 
	}
}
function expandAreaNodes(nodes) {
	if (!nodes) return;
	var zTree = $.fn.zTree.getZTreeObj("qryareaTree");
	for (var i=0, l=nodes.length; i<l; i++) {
		zTree.expandNode(nodes[i], true, false, false);
		if (nodes[i].isParent && nodes[i].zAsync) {
			expandAreaNodes(nodes[i].children);
		} 
	}
}
/**
 * 模糊查询输入框输入的条件
 * @param queryid 查询框id
 * @param treeid  树id
 * @return
 */
function queryZTreeRoleUser(treeid){
	var zTree = $.fn.zTree.getZTreeObj(treeid);

	//更新之前被选中的节点
	if(selectNode!=null && selectNode.length >0){
		updateNodes(treeid,selectNode,false);
	}
	var nodeList = zTree.getNodesByFilter(filter);
	selectNode  = nodeList;
	
	//渲染选中的节点
	if( nodeList.length <=0){
		$.messager.alert('提示','查询结果为空！','info');
		return ;
	}else{
		updateNodes(treeid,nodeList,true);
	}
}
function filter(node) {
    return (node.name.indexOf($('#qryOrgName').val())>-1 
    		&& node.name.indexOf($('#qryCode').val())>-1 
    		&& node.name.indexOf($('#qryUserName').val())>-1);
}
/**
* 异步加载获取回访区划单位树，构建ZTree树(左侧功能树)
* @param treeid	树id
* @param ischeck	是否多选 true 多选
* @param quertdata	查询条件 格式{xx:xx,[xx:xx]} 例如：{ "id":"1", "name":"test"}
* @param zTreeOnClick	单击事件 function zTreeOnClick(event, treeId, treeNode)自行设定函数，将函数名传入;
* @return
*/
function ajaxGetVisitAreaData(treeid,ischeck,querydata,zTreeOnClick,zTreeOnAsyncSuccess){
 var setting = {
			async: {
				enable: true,
				url: baseUrl + 'm/worklogvisit/query-AreaTree.do?modId='+moduleId,
				autoParam: ["id"],
				otherParam: querydata
			},
	  		callback: {
				onClick: zTreeOnClick,
				onAsyncSuccess: zTreeOnAsyncSuccess
			},
	  		check: {
	  			enable: ischeck
	  		},
	  		view: {
				fontCss: getFontCss
			}
	  	};
$.fn.zTree.init($("#"+treeid), setting);
}
/**
 * 模糊查询输入开票树客户查询输入的条件
 * @param queryid 查询框id
 * @param treeid  树id
 * @return
 */
function queryZTreeCustomer(treeid){
	var zTree = $.fn.zTree.getZTreeObj(treeid);

	//更新之前被选中的节点
	if(selectNode!=null && selectNode.length >0){
		updateNodes(treeid,selectNode,false);
	}
	var nodeList = zTree.getNodesByFilter(cfilter);
	selectNode  = nodeList;
	
	//渲染选中的节点
	if( nodeList.length <=0){
		$.messager.alert('提示','查询结果为空！','info');
		return ;
	}else{
		updateNodes(treeid,nodeList,true);
	}
}
function cfilter(node) {
    return (node.name.indexOf($('#qryCustomerName').val())>-1);
}