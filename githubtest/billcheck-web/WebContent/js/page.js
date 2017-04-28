/**
 * 分页
 * 20110322
 */function page(){
	this.currentPage =0;
	this.pageCount = 0;
	this.pageParamName="";
	this.sendContent;
	this.url = "";
	this.method ="post";
	this.turnFunc;
	this.everyPageRec=0;
	this.recordAmount=0;
}
page.prototype.init = function(setting){
	this.currentPage =parseInt(setting["currentPage"]);
	this.pageCount = parseInt(setting["pageCount"]);
	this.pageParamName = setting["pageParamName"];
	this.url =setting["URL"];
	this.sendContent = setting["sendContent"];
	this.method = setting["method"];
	this.turnFunc = setting["turnFunc"];
	if(typeof(setting["everyPageRec"])!="undefined")
	this.everyPageRec = parseInt(setting["everyPageRec"]);
	this.recordAmount= parseInt(setting["recordAmount"]);
	if(this.recordAmount && this.everyPageRec){
		this.pageCount=(parseInt(this.recordAmount/this.everyPageRec)+(this.recordAmount%this.everyPageRec>0?1:0));
	}
};
page.prototype.first =function(){
	if(this.pageCount>0){
		this.subpage(1);
	}
};
page.prototype.upPage =function(){
	if(this.currentPage>1){
		this.currentPage--;
		this.subpage(this.currentPage);
		//event.srcElement.disabled="true";
	}else{
		alert("已是首页");
	}
};
page.prototype.nextPage = function(){
	if(this.currentPage<this.pageCount){
		this.currentPage++;
		this.subpage(this.currentPage);
	}else{
		alert("已是末页");
	}
};
page.prototype.endPage =function(){
	if(this.pageCount>0)this.subpage(this.pageCount);
};
page.prototype.subpage =function(cpage){
	var tmp =this.url.substring("?");
	var t = "";
	var p=1;
	if(tmp==-1) {
		t="?";
	}else{
		if(this.url.length>0){
			var str=this.url.substring(this.url.length-1,this.url.length);
			if(str=="&"){
				t="";
			}else{
				t="&"
			}
		}else{
			t="?"
		}
	}  
	
	theURL = this.url+t+this.pageParamName+"="+cpage+"&recordcount="+this.recordAmount;
	//location.href =  this.url+t+this.pageParamName+"="+cpage;;
	this.Submit(theURL);
};
page.prototype.Submit=function(pageURL){
	//alert("url:"+pageURL);
	if(this.sendContent!=null){
		if(typeof(this.turnFunc)=='function'){
			this.turnFunc();
		}
		var strAry = new Array();
		if(this.method=="post"){
			strAry.push("<form name='$markFrom_frm' id='$markFrom_frm' method='post' action='"+pageURL+"'>");
			for(var data in this.sendContent){
				strAry.push("<input type='hidden' name='"+data+"' value='"+this.sendContent[data]+"'/>");
			}
			strAry.push("</form>");
			document.write(strAry.join(''));
			//alert(document.getElementById("$markFrom_frm"));
			document.getElementById("$markFrom_frm").submit();
		}else{
			for(var data in this.sendContent){
				strAry.push("&"+data+"="+this.sendContent[data]);
			}
			location=pageURL+strAry.join('');
		}
	}
};
//分页工具栏初始化
page.prototype.pageTools=function(){
	var tmpthis = this;
	
	if(isNaN(this.pageCount) || this.pageCount<=1){
		$("#menubar a[@code=firstPage]").attr("disabled","true").find("IMG").attr("disabled","true");
		$("#menubar a[@code=nextPage]").attr("disabled","true").find("IMG").attr("disabled","true");
		$("#menubar a[@code=upPage]").attr("disabled","true").find("IMG").attr("disabled","true");
		$("#menubar a[@code=endPage]").attr("disabled","true").find("IMG").attr("disabled","true");
		
		$("#menubar a[@code=firstPage] img").attr("disabled","true").find("IMG").attr("disabled","true");
		$("#menubar a[@code=nextPage] img").attr("disabled","true").find("IMG").attr("disabled","true");
		$("#menubar a[@code=upPage] img").attr("disabled","true").find("IMG").attr("disabled","true");
		$("#menubar a[@code=endPage] img").attr("disabled","true").find("IMG").attr("disabled","true");
	}else{
		if(this.currentPage==1){//首页
			$("#menubar a[@code=firstPage]").attr("disabled","true").find("IMG").attr("disabled","true");
			$("#menubar a[@code=upPage]").attr("disabled","true").find("IMG").attr("disabled","true");
			$("#menubar a[@code=nextPage]").removeAttr("disabled").find("IMG").removeAttr("disabled");
			$("#menubar a[@code=endPage]").removeAttr("disabled").find("IMG").removeAttr("disabled");	
			
			$("#menubar a[@code=firstPage] img").attr("disabled","true").find("IMG").attr("disabled","true");
			$("#menubar a[@code=upPage] img").attr("disabled","true").find("IMG").attr("disabled","true");
			$("#menubar a[@code=nextPage] img").removeAttr("disabled").find("IMG").removeAttr("disabled");
			$("#menubar a[@code=endPage] img").removeAttr("disabled").find("IMG").removeAttr("disabled");	
			
			document.onkeydown = function(event){
				if(!event) event=window.event;
				if(event.keyCode==34){
					tmpthis.nextPage();
				}
			}
		}else{
			$("#menubar a[@code=firstPage]").removeAttr("disabled").find("IMG").removeAttr("disabled");
			$("#menubar a[@code=upPage]").removeAttr("disabled").find("IMG").removeAttr("disabled");	
			$("#menubar a[@code=firstPage] img").removeAttr("disabled").find("IMG").removeAttr("disabled");
			$("#menubar a[@code=upPage] img").removeAttr("disabled").find("IMG").removeAttr("disabled");
			if(this.currentPage==this.pageCount){//未页
				$("#menubar a[@code=nextPage]").attr("disabled","true").find("IMG").attr("disabled","true");
				$("#menubar a[@code=endPage]").attr("disabled","true").find("IMG").attr("disabled","true");
				$("#menubar a[@code=nextPage] img").attr("disabled","true").find("IMG").attr("disabled","true");
				$("#menubar a[@code=endPage] img").attr("disabled","true").find("IMG").attr("disabled","true");
				document.onkeydown = function(event){
					if(!event) event=window.event;
					if(event.keyCode==33){
						tmpthis.upPage();
					}
			}
			}else{
				$("#menubar a[@code=nextPage]").removeAttr("disabled").find("IMG").removeAttr("disabled");
				$("#menubar a[@code=endPage]").removeAttr("disabled").find("IMG").removeAttr("disabled");
				$("#menubar a[@code=nextPage] img").removeAttr("disabled").find("IMG").removeAttr("disabled");
				$("#menubar a[@code=endPage] img").removeAttr("disabled").find("IMG").removeAttr("disabled");
				document.onkeydown = function(event){
					if(!event) event=window.event;
					if(event.keyCode==33){
						tmpthis.upPage();
					}else if(event.keyCode==34){
						tmpthis.nextPage();
					}
				}
			}
		}
	}
};
