//验证扩展
$.extend($.fn.validatebox.defaults.rules, {
    CHS: {//验证汉字或字母或数字或下划线
        validator: function (value, param) {
            return /^[\u0391-\uFFE5|\w]+$/.test(value);
        },
        message: '请输入汉字或字母或数字或下划线!'
    }, 
    chinese : {// 验证中文 
        validator : function(value) { 
            return /^[\Α-\￥]+$/i.test(value); 
        }, 
        message : '请输入中文' 
    }, 
    english : {// 验证英语 
        validator : function(value) { 
            return /^[A-Za-z]+$/i.test(value); 
        }, 
        message : '请输入英文' 
    },
    ZIP: {//验证邮编
        validator: function (value, param) {
            return /^[1-9]\d{5}$/.test(value);
        },
        message: '邮政编码不存在'
    },
    QQ: {//验证QQ
        validator: function (value, param) {
            return /^[1-9]\d{4,10}$/.test(value);
        },
        message: 'QQ号码不正确'
    },
    phoneNo:{//验证电话号码
    	validator:function(v,p){
    		return /^\d{3,4}-\d{7,8}$/.test(v)  || /^\d{7,8}$/.test(v); 
    	},
    	message:'号码不正确'
    },
    mobile: {//验证手机号
        validator: function (value, param) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?1[3-9]\d{9}$/.test(value)||/^\d{3,4}-\d{7,8}$/.test(v);
        },
        message: '联系电话格式不正确' 
    },
    loginName: {//验证登录名
        validator: function (value, param) {
            return /^[\u0391-\uFFE5|\w]+$/.test(value);
        },
        message: '登录名称只允许汉字、英文字母、数字及下划线。'
    },
    safepass: {//验证密码
        validator: function (value, param) {
            return safePassword(value);
        },
        message: '密码由字母和数字组成，至少6位'
    },
    equalTo: {//验证两次输入字符是否相等
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: '两次输入的字符不一至'
    },
    number: {//验证数字
        validator: function (value, param) {
            return /^[\d|-]+$/.test(value);
        },
        message: '请输入数字'
    },
    idcard: {//验证身份证号码
        validator: function (value, param) {
            return idCard(value);
        },
        message:'请输入正确的身份证号码'
    },
    money: {//验证货币格式
        validator: function (value,param) {
            return fmoney(value);
        },
        message:'输入货币格式不正确'
    },
    floatData: {//验证浮点型数据
        validator: function (value,param) {
            return floatdata(value);
        },
        message:'输入格式不正确'
    },
    MSN: {//验证MSN
        validator: function (value,param) {
            return MSN(value);
        },
        message:'MSN格式不正确'
    },
    positive_int:{//验证非负整数
	    validator:function(value,param){  
	        if (value){  
	            return /(^[0]|^[1-9][0-9]*)$/.test(value);  
	        }else{  
	            return true;  
	        }  
	    },  
	    message:'请输入非负整数'  
	},
    p_int:{//验证正整数
	    validator:function(value,param){  
	        if (value){  
	            return /(^[1-9][0-9]*)$/.test(value);  
	        }else{  
	            return true;  
	        }  
	    },  
	    message:'请输入正整数'  
	},
	numeric:{//验证非负数  
	    validator:function(value,param){  
		if (value){  
		    return /^([0]|[1-9][0-9]*)(\.[0-9]+)?$/.test(value);  
		}else{  
		    return true;  
		}  
		},  
		message:'请输入非负数'  
	},
	CR: {//验证字母或数字或下划线
        validator: function (value, param) {
            return /^[\w]+$/.test(value);
        },
        message: '请输入字母或数字或下划线!'
    },
    faxno : {// 验证传真 
        validator : function(value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value); 
        }, 
        message : '传真号码不正确' 
    }, 
    ip : {// 验证IP地址 
        validator : function(value) { 
            return /d+.d+.d+.d+/i.test(value); 
        }, 
        message : 'IP地址格式不正确' 
    }, 
    unnormal : {// 验证是否包含空格和非法字符 
        validator : function(value) { 
            return /.+/i.test(value); 
        }, 
        message : '输入值不能为空和包含其他非法字符' 
    }, 
    integer : {// 验证整数 
        validator : function(value) { 
            return /^[+]?[1-9]+\d*$/i.test(value); 
        }, 
        message : '请输入整数' 
    }, 
    age : {// 验证年龄
        validator : function(value) { 
            return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value); 
        }, 
        message : '年龄必须是0到120之间的整数' 
    },
    minLength: {//验证最小字符长度
        validator: function(value, param){
            return value.length >= param[0];
        },
        message: '请输入至少（2）个字符.'
    },
    length:{//验证字符长度范围
    	validator:function(value,param){ 
	        var len=$.trim(value).length; 
	            return len>=param[0]&&len<=param[1]; 
	        }, 
        	message:"输入内容长度必须介于{0}和{1}之间." 
    }, 
    intOrFloat : {// 验证整数或小数 
        validator : function(value) { 
            return /^\d+(\.\d+)?$/i.test(value); 
        }, 
        message : '请输入数字，并确保格式正确' 
    },
    notEmpty : {// 验证是否非空
        validator : function(value) { 
            return !$.trim(value) == '';
        }, 
        message : '请输入非空字符' 
    },
     PostCode : {// 验证邮编 
        validator : function(value) { 
            return  /^\d{6}$/.test(value);
        }, 
        message : '请输入6位邮编' 
    },
     isNumberCode : {// 验证是否5位数字编号
        validator : function(value) { 
            return  /^\d{5}$/.test(value);
        }, 
        message : '请输入5位数字编号' 
    },
    MobileOrTelephone:{
    	validator:function(v){
    		return /^\d{3,4}-\d{7,8}$/.test(v)  || /^\d{7,8}$/.test(v) || /^\d{11}$/.test(v); 
    	},
    	message:'请输入固话或手机号码'
    },
     maxWords:{//验证字符长度范围
    	validator:function(value,param){ 
	        var len=$.trim(value).length; 
	            return len<=param[0] && !$.trim(value) == ''; 
	        }, 
        	message:"输入内容长度必须介于0和{0}之间." 
    }, 
    maxNumber:{//验证数量范围
    	validator:function(value,param){ 
	           return value>0 && value<=param[0]; 
	        }, 
        	message:"数量大小必须介于0和{0}之间." 
    }
});
/**
 * msn验证
 * @param {Object} value
 * @return {TypeName} 
 */
function MSN(value){
	 return /^\w+@\w+(\.\w{2,4})+$/.test(value);
}
/**
 * 货币验证
 * @param {Object} value
 * @return {TypeName} 
 */
function fmoney(value){
	    return /^([0]|[1-9][0-9]*)(\.[0-9][0-9]{0,1})?$/.test(value);
}
/**
 * 浮点型验证
 * @param {Object} value
 * @return {TypeName} 
 */
function floatdata(value){
	    return /^[0-9]+[\.]?[0-9]{0,7}$/.test(value);
}
/**
 * 密码由字母和数字组成，至少6位
 * @param {Object} value
 * @return {TypeName} 
 */
var safePassword = function (value) {
    return !(/^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/.test(value));
}
/**
 * 身份证验证
 * @param {Object} value
 * @return {TypeName} 
 */
var idCard = function (value) {
    if (value.length == 18 && 18 != value.length) return false;
    var number = value.toLowerCase();
    var d, sum = 0, v = '10x98765432', w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], a = '11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91';
    var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/);
    if (re == null || a.indexOf(re[1]) < 0) return false;
    if (re[2].length == 9) {
        number = number.substr(0, 6) + '19' + number.substr(6);
        d = ['19' + re[4], re[5], re[6]].join('-');
    } else d = [re[9], re[10], re[11]].join('-');
    if (!isDateTime.call(d, 'yyyy-MM-dd')) return false;
    for (var i = 0; i < 17; i++) sum += number.charAt(i) * w[i];
    return (re[2].length == 9 || number.charAt(17) == v.charAt(sum % 11));
}
/**
 * 时间验证
 * @param {Object} format
 * @param {Object} reObj
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
var isDateTime = function (format, reObj) {
    format = format || 'yyyy-MM-dd';
    var input = this, o = {}, d = new Date();
    var f1 = format.split(/[^a-z]+/gi), f2 = input.split(/\D+/g), f3 = format.split(/[a-z]+/gi), f4 = input.split(/\d+/g);
    var len = f1.length, len1 = f3.length;
    if (len != f2.length || len1 != f4.length) return false;
    for (var i = 0; i < len1; i++) if (f3[i] != f4[i]) return false;
    for (var i = 0; i < len; i++) o[f1[i]] = f2[i];
    o.yyyy = s(o.yyyy, o.yy, d.getFullYear(), 9999, 4);
    o.MM = s(o.MM, o.M, d.getMonth() + 1, 12);
    o.dd = s(o.dd, o.d, d.getDate(), 31);
    o.hh = s(o.hh, o.h, d.getHours(), 24);
    o.mm = s(o.mm, o.m, d.getMinutes());
    o.ss = s(o.ss, o.s, d.getSeconds());
    o.ms = s(o.ms, o.ms, d.getMilliseconds(), 999, 3);
    if (o.yyyy + o.MM + o.dd + o.hh + o.mm + o.ss + o.ms < 0) return false;
    if (o.yyyy < 100) o.yyyy += (o.yyyy > 30 ? 1900 : 2000);
    d = new Date(o.yyyy, o.MM - 1, o.dd, o.hh, o.mm, o.ss, o.ms);
    var reVal = d.getFullYear() == o.yyyy && d.getMonth() + 1 == o.MM && d.getDate() == o.dd && d.getHours() == o.hh && d.getMinutes() == o.mm && d.getSeconds() == o.ss && d.getMilliseconds() == o.ms;
    return reVal && reObj ? d : reVal;
    function s(s1, s2, s3, s4, s5) {
        s4 = s4 || 60, s5 = s5 || 2;
        var reVal = s3;
        if (s1 != undefined && s1 != '' || !isNaN(s1)) reVal = s1 * 1;
        if (s2 != undefined && s2 != '' && !isNaN(s2)) reVal = s2 * 1;
        return (reVal == s1 && s1.length != s5 || reVal > s4) ? -10000 : reVal;
    }
};



var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "}
function cidInfo(sId){
	var iSum=0;
	var info="";
	if(!/^d{17}(d|x)$/i.test(sId))
		return 	false;
	sId=sId.replace(/x$/i,"a");
	if(aCity[parseInt(sId.substr(0,2))]==null)
		return "error:非法地区";
	sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
	var d=new Date(sBirthday.replace(/-/g,"/"))
	if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))
		return "error:非法生日";
	for(var i = 17;i>=0;i --) 
		iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11)
	if(iSum%11!=1)
		return "error:非法证号";
	return aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女")
}
/**
 * 提交后台校验唯一性
 * @param {Object} value
 * @param {Object} url,id,paramName
 * @return {TypeName} 
 */
var b;
var msgs = '客户名称已存在';
$.extend($.fn.validatebox.defaults.rules,{ 
	unique: { 
	validator: function(value, param){ //param = [url,id,paramName1,...]
		//$("#customerName").focus();
		var rules = $.fn.validatebox.defaults.rules;
		if($.trim(value) == ''){
			 rules.unique.message = '请输入非空字符';
			 return false;
		}
		var areaId = $("#"+param[2]).val();
		//判断新增或者编辑  
		var flag = param[3];
		//console.info(flag)
		if( flag == value){
			b = true;
		}else{
			var url = param[0]+"?"+param[1]+"="+value+"&"+param[2]+"="+areaId;
			$.ajax({
				type : "get",
				url :url,
				dataType:"text",
				cache:false,
				async:false,
				success : function(data){
					//console.info(data);
					if(data == 'false'){
						b = true;
					}else{
						 rules.unique.message = '客户名称已存在';
						b = false;
					}
				}
			});
		}
		
		return b;
		}, 
		message: ""
	} 
}); 
/**
 * 
 * @param {Object} value
 * @param {Object} param 数组 param[0]是修改界面的传值，param[1]是url，其他自定义
 * @return {TypeName} 
 */
var notExsit;
var $Contractmsg='存档顺序号已存在';
$.extend($.fn.validatebox.defaults.rules,{  
	universalUnique: {       
		validator: function(value, param){
		    $("#contractSaveCode").focus();
			var rules = $.fn.validatebox.defaults.rules;
			//console.info(param[0]);
			url = param[1];
			if($.trim(value) != param[0] && $.trim(value) != ''){
				$.ajax({
					type : "POST",
					url :url,
					dataType:"text",
					cache:false,
					data:{"validName":$.trim(value)},
					success : function(data){
						//console.info(data);
						if(data == 'true'){
							notExsit = true;
						}else{
							notExsit = false;
						}
					}
				});
			}else{
				notExsit = true;
			}
			return notExsit; 
		},    
		
		message: $Contractmsg  
	}
});