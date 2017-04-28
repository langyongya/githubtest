/**
 * 加载区域树结构
 * @param {Object} id 树id
 * @param {Object} check 是否显示复选框
 * @param {Object} url 地址
 * @param {Object} clickFun 单击触发函数
 * @param {Object} selectFun 选中触发函数
 * @param {Object} loadFun 加载完成触发函数
 * @param {Object} dbClickFun 双击触发函数
 * @param {Object} beforeSelFun 节点被选中前触发函数
 * @param {Object} onlyLeafCheck 是否叶子节点才显示复选框
 */
function initAreaTree(id,check,url,clickFun,selectFun,loadFun,dbClickFun,beforeSelFun,onlydfdf){
	if(!onlydfdf) onlydfdf=false;
	$('#'+id).tree({
		animate:true,//展开折叠时是否显示动画效果
		checkbox:true,//是否有复选框
		onlyLeafCheck:true,//是否有复选框
		lines:true,
		url:url,//地址
		onClick:changeFun(clickFun),//单击触发函数
		onSelect:changeFun(selectFun),//被选中时触发
		onLoadSuccess:changeFun(loadFun),//加载成功时触发
		onDblClick:changeFun(dbClickFun),//双击时加载
		onBeforeSelect:changeFun(beforeSelFun)//节点被选中前触发
	});
	
}

/**
 * 改变方法，无任何实现。控制当触发函数传进来为null时使用，防止easyui报错
 */
function changeFun(fun){
	if(fun == null || fun == undefined){
		fun = function(){};
	}
	return fun;
}