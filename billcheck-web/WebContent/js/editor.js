/**
 * 
 * @param {Object} type
 * @return 返回表单编辑器类型
 */
function formtype(type){
	switch(type)
	   {
	   case "text":
	     	return "text"
			break
	   case "numeric":
	     	return "numberbox"
			break
	   case "money":
	     	return "numberbox"
			break
	   case "checkbox":
	     	return "checkbox"
			break
	   case "combobox":
	     	return "combobox"
			break
	   case "date":
	     	return "datebox"
			break
	   }
}

function getEditor(property){
	var editor;
	var options = "{";
	if(property.required == "1"){
 		options = options + "required:true,";
 	}
	switch(property.datatype){
	   case "text":	     	
			break
	   case "numeric":
	     	if(property.datavalue && property.data!='workLength'){
		   		options = options + "max:999999999,precision:"+property.datavalue+",";
		    }else if(property.data=='workLength'){
		    	options = options + "min:0,";
		    }
			break
	   case "money":
	     	if(property.datavalue){
		   		options = options + "max:999999999,precision:"+property.datavalue+",";//groupSeparator:\",\",
	   		}
			break
	   case "checkbox":		 
	   		options = options + "on: '1',off: '0',";	   	
			break
	   case "combobox":
	     	if(property.datavalue){
		   		options = options + "valueField:'id',textField:'words',editable:false,data:combodata[\""+property.datavalue+"\"],formatter:function(row){return row.text},";//groupSeparator:\",\",
	   		}
			break
			
	   case "date": 
		   		options = options + "editable:false,";//groupSeparator:\",\",
	   	 
			break
	   default:
	}
	
	if( right(options,1) == ","){
		options = left(options,options.length -1)+"}";
	}else{
		options = "";
	}
	
	editor = "editor:{type:\""+formtype(property.datatype)+"\"";
	if(options != ""){
		editor = editor + ",options:"+options;
	}
	editor = editor + "}";
	return editor;
}


var gridData={};

function loadGridColumns(changetype,grid,url,suchandle,dbchandle,cellClick){
	var thisColumns = "";
	var thisFcolumns = "";
	var combotype = "";
	$.ajax({
		url:baseUrl+'m/changesalary/querycolumns.do?rnd='+Math.random(),
		type:"post",
		data:{"type":changetype,"grid":grid},
		dataType:"json",
		cache:false,
		async:false,
		success :function (data) {
			if(data.rows){
				//拼接网格列数据
				var rows = data.rows;
				if(rows != null && rows != undefined && rows.length > 0){
					$.each(rows,function(i,v){
						if(v.isshow == "1"){
							var column = "{field:'"+v.data+"',title:'"+v.dname+"', width:"+v.width;
							if(v.datatype == "numeric" || v.datatype == "money" ){
								column += ",align:'right'"
							}else{
								column += ",align:'left'";
							}
							if(v.edit == 1){
								var editor = getEditor(v);
								if(editor != "")column = column + "," + getEditor(v);
							}
							//下拉框类型
							if(v.datatype == "combobox"){
								if(combotype != "")combotype += ",";
								combotype += v.datavalue;
								column += ",formatter:function(value,rec){return getComboText('"+v.datavalue+"',value)}"
							}
							if(v.datatype == "checkbox"){							
								column += ",formatter:function(value,rec){if(value == 1){return '是';}else if(!value){return '';}else{return '否';}}"
							}
							if((grid=='salarygrid'||grid=='retiregrid')&&v.datatype == "numeric"){							
								column += ",formatter:function(value,rec){return getFuNumber(value)}"
							}
							if(v.datatype == "date"){
								column += ",formatter:function(value,rec){if(value != null && value.length == 8){return formatDate(value)}else{return value}}";
							}
							
							column = column + "}";
							if(v.datatype == "fixed"||v.data == "personNum"){//固定列
								if(thisFcolumns != "")thisFcolumns += ",";
								thisFcolumns += column;
							}else{
								if(thisColumns != "")thisColumns += ",";
								thisColumns += column;
							}
							
						}
					});
					thisColumns = "["+thisColumns +"]";
					thisFcolumns = "["+thisFcolumns +"]";
					if(combotype!="")getComboData(combotype);//加载下拉框数据
					//console.log(thisColumns);console.log(thisFcolumns);
					thisColumns = eval('('+thisColumns+')');
					thisFcolumns = eval('('+thisFcolumns+')');
					
					if(thisColumns.length == 0){
						return false;
					}
					$.ajaxSetup({
						cache:false,
						async:false
					});
					//列数据完成，开始生成网格
					$grid = $('#'+grid); 
					$('#'+grid).datagrid( {
						fit:true,
						nowrap: true,
						striped: true,
						collapsible : false,
						url : baseUrl+url,//+'&rnd='+Math.random(), 
						remoteSort: false,
						pageNumber : 1,
						pageSize : 20,
						queryParams:{'rnd':Math.random()},
						frozenColumns : [thisFcolumns],
						columns : [thisColumns],
						pagination:true,
						rownumbers:false,
						singleSelect : false,
						onLoadSuccess:function(data){
							//console.log(data);
							gridData=data;
							$('#paymonth').val(data.fdate);
							if(data.rows.length > 0){//加载行数大于0才进行操作
									if(suchandle){
										var editor_total = data.total;
										suchandle(grid);
										data.total = editor_total;
									}
							}
							removeLoading();	
							
						 //columnsDrag(thisColumns,grid,thisFcolumns,suchandle);
						},
						onClickRow:function(rowIndex, rowData){
							if(dbchandle)dbchandle(rowIndex,rowData);
						},
						onClickCell:function(rowIndex, field, value){
							if(cellClick)cellClick(rowIndex, field, value)
						},
						onDblClickRow:function(rowIndex, rowData){
							if(dbchandle)dbchandle(rowIndex,rowData);
						}
					}).datagrid("columnMoving");
				}else{
					$.messager.alert("消息","该单位还未配置适用的列表项,请确认!","info");
					return false;
				}
			}                
		},
		error:function(obj){
		}
	});
}

function formatDate(date)
{
	var value="";
	value= date.substr(0, 4)+"-"+date.substr(4, 2)+"-"+date.substr(6, 2);
	return value; 
}

function saveGrid(url){
	loading();
	$('#changesalarysave').linkbutton('disable');
	var udata="",sdata="",rdata="";
	$.each(g,function(i,v){
		if(v=="u" && u1==1)udata = rows2json("usergrid");
		if(v=="r" && r1==1)rdata = rows2json("retiregrid");
		if(v=="s" && s1==1)sdata = rows2json("salarygrid");
	});	
	$("#sdata").val(sdata);
	$("#rdata").val(rdata);
	$("#udata").val(udata);
	$("#changebilltype").val(changebilltype);
	$("#changetype").val(changetype);
	$("#changeorgid").val($('#selectOrgId').val());
	$("#paymonth").val($('#transdate').val());
	$('#saveGridFrm').form('submit',{
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
//			$.ajax({
//				url:baseUrl+'/m/changemgr/countsalary.do',
//				type:"post",
//				data:{orgId:$('#changeorgid').val(),transdate:$('#paymonth').val()},
//				dataType:"json",
//				success :function (data) {			
					removeLoading();
					reloadcurGrid();
				$.messager.show({
					title:'消息',
					msg:info,
					timeout:5000,
					showType:'slide',
					width:350,
					height:180
				});
//				}
//			});
		}else{
			removeLoading();
			parent.$.messager.alert('消息',info,'info',function(){
				removeLoading();
			});
		}
		$('#changesalarysave').linkbutton('enable');
//		reloadallGrid();
//		removeLoading();
	},error:function(){
		$('#changesalarysave').linkbutton('enable');
		removeLoading();
	}
	});
}

//下拉框数据
var combodata = {};

function getComboData(type){
	$.ajax({
		url:baseUrl+"m/changesalary/querycombo.do"+'?rnd='+Math.random(),
		type:"post",
		async:false,
		data:{"type":type},
		dataType:"json",
		success :function (data) {
			for(var i in data){
				if(!combodata[i]){
					combodata[i] = data[i];//将取到的值放入全局变量中
				}
			}         
		},
		error:function(obj){
			
		}
	});	
	return combodata;
}

function getAllComboData(){
	return this.combodata;
}

//返回下拉框中文显示
function getComboText(type,id){
	if(!combodata[type]){
		return "";//没定义的时候返回空值
	}
	var result = "";
	$.each(combodata[type],function(i,v){
		if(id == v.id){
			result = v.text.substring(v.text.indexOf("]")+1);//返回text
			return false; 
		}
	});
	return result;//没定义的时候返回空值
}

function getFuNumber(value){
	if(value==''||value==undefined||value==null) return '0';
	if(changetype=='5'||changetype=='3'){
		//减员、停薪
		 var valueNew=''+value;
		 if(valueNew.indexOf('.')!=-1&&valueNew.indexOf('-')==-1){
			return "-"+value;
		  }
		return value;
	}
	return value;
}

/**
     * 克隆一个对象
     * @param Obj
     * @returns
     */ 
    function clone(Obj) {   
        var buf;   
        if (Obj instanceof Array) {   
            buf = [];  //创建一个空的数组 
            var i = Obj.length;   
            while (i--) {   
                buf[i] = clone(Obj[i]);   
            }   
            return buf;     
        }else if (Obj instanceof Object){   
            buf = {};  //创建一个空对象 
            for (var k in Obj) {  //为这个对象添加新的属性 
                buf[k] = clone(Obj[k]);   
            }   
            return buf;   
        }else{   
            return Obj;   
        }   
    } 

function rows2json(grid){
	$("#"+grid).datagrid("acceptChanges");
	var r = $("#"+grid).datagrid("getRows");
	var n="";
	$.each(r,function(i,v){
		if(i+1 != r.length || grid == "usergrid"){//合计行不提交
			var t="";
			for(j in v){
				if(t){t = t + ","}
				var kk = 0;
				var thisValue = "";
				if( eval("v."+j) ){
					thisValue =  eval("v."+j) ;
				}
				if( j == "benifit" ){
					abc = clone(thisValue); 
					t = t + j +":"+ O2String(abc);
					kk=1;	
				}else if(j=="salaryonce"){
					abc = clone(thisValue); 
					t = t + j +":"+O2String(abc);
					kk=1;	
				}else{
					t = t + j +":\""+thisValue+"\"";	
				}
				
			}
			t = "{"+t+"}";
			if(n){n = n + ","}
			n = n + t;
		}
	});
	return "[" + n + "]";	
}

function startEdit(grid,index){
	var $grid = $("#"+grid);
	if(index == "all"){
		var rows = $grid.datagrid("getRows");
		for(i=0;i<rows.length;i++){
			$grid.datagrid("beginEdit",i);
		}
	}else{
		var rowData = $grid.datagrid("getRows")[index];
		if(v.state && parseInt(v.state) > 1){//控制已经上报了则不开启编辑状态
		
		}else{
			$grid.datagrid("beginEdit",index);
		}
	}
}




function left(mainStr,lngLen) { 
if (lngLen>0) {return mainStr.substring(0,lngLen)} 
else{return null} 
} 

function right(mainStr,lngLen) { 
if (mainStr.length-lngLen>=0 && mainStr.length>=0 && mainStr.length-lngLen<=mainStr.length) { 
return mainStr.substring(mainStr.length-lngLen,mainStr.length)} 
else{return null} 
} 
function mid(mainStr,starnum,endnum){ 
if (mainStr.length>=0){ 
return mainStr.substr(starnum,endnum) 
}else{return null} 
}




//将对象转换成字符串
var O2String = function (O) {
			 //return JSON.stringify(jsonobj);
			 var S = [];
			 var J = "";
			 if (Object.prototype.toString.apply(O) === '[object Array]') {
					 for (var i = 0; i < O.length; i++)
							 S.push(O2String(O[i]));
					 J = '[' + S.join(',') + ']';
			 }
			 else if (Object.prototype.toString.apply(O) === '[object Date]') {
					 J = "new Date(" + O.getTime() + ")";
			 }
			 else if (Object.prototype.toString.apply(O) === '[object RegExp]' || Object.prototype.toString.apply(O) === '[object Function]') {
					 J = O.toString();
			 }
			 else if (Object.prototype.toString.apply(O) === '[object Object]') {
					 for (var i in O) {
							 O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? O2String(O[i]) : O[i]);
							 S.push(i + ':' + O[i]);
					 }
					 J = '{' + S.join(',') + '}';
			 }
			 return J;
};
//列拖拽扩展
$.extend($.fn.datagrid.methods,{
	columnMoving: function(jq){
		return jq.each(function(){
			var target = this;
			var cells = $(this).datagrid('getPanel').find('div.datagrid-header td[field]');
			cells.draggable({//easyui的拖拉函数
				revert:true, //未拖到指定地点，恢复原来位置
				cursor:'pointer',
				edge:5,
				proxy:function(source){  //拖拉过程中的图形样子
					var p = $('<div class="tree-node-proxy tree-dnd-no" style="position:absolute;border:1px solid #ff0000"/>').appendTo('body');
					p.html($(source).text());
					p.hide();
					return p;
				},
				onBeforeDrag:function(e){
					e.data.startLeft = $(this).offset().left;
					e.data.startTop = $(this).offset().top;
				},
				onStartDrag: function(){
					$(this).draggable('proxy').css({
						left:-10000,
						top:-10000
					});
				},
				onDrag:function(e){
					$(this).draggable('proxy').show().css({
						left:e.pageX+15,
						top:e.pageY+15
					});
					return false;
				}
			}).droppable({ //拖拉到指定地点的操作
				accept:'td[field]',
				onDragOver:function(e,source){//经过
					$(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes');
					$(this).css('border-left','1px solid #ff0000');
				},
				onDragLeave:function(e,source){//拖离开
					$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
					$(this).css('border-left',0);
				},
				onDrop:function(e,source){//拖到目的地
					$(this).css('border-left',0);
					var fromField = $(source).attr('field');
					var toField = $(this).attr('field');
					setTimeout(function(){
						moveField(fromField,toField);//表头顺序转换
						//$(target).datagrid();
						//loading();
						$(target).datagrid("acceptChanges");
						gridData.rows= $(target).datagrid("getRows");
						if(gridData.rows&&gridData.rows.length>0){
							gridData.total= $(target).datagrid("getRows")[0].TOTAL;
						}else{
							gridData.total = 0;
						}
						$(target).datagrid({url:null,onLoadSuccess:function(obj){}});//重载网格
						$(target).datagrid('loadData',gridData);//加载数据
						$(target).datagrid('columnMoving');//重新加入扩展
						rowNumsToZero();
					},0);
				}
			});
			
			// move field to another location
			function moveField(from,to){
				var columns = $(target).datagrid('options').columns;
				var cc = columns[0];
				var c = _remove(from);
				if (c){
					_insert(to,c);
				}
				
				function _remove(field){
					for(var i=0; i<cc.length; i++){
						if (cc[i].field == field){
							var c = cc[i];
							cc.splice(i,1);
							return c;
						}
					}
					return null;
				}
				function _insert(field,c){
					var newcc = [];
					for(var i=0; i<cc.length; i++){
						if (cc[i].field == field){
							newcc.push(c);
						}
						newcc.push(cc[i]);
					}
					columns[0] = newcc;
				}
			}
		});
	}
});

