///////////////////////////Array start////////////////////////////////////
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

Array.prototype.clear = function () {
    return this.remove(0, this.length - 1);
};

Array.prototype.insertAt = function (index, obj) {
    this.splice(index, 0, obj);
};

//if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
    //}

    Array.prototype.inObjectArray = function (keyAttribute, value) {//用于查找指定的对象数组中是否存在指定属性，并检测该属性中是否存在属性值与形参value的值恒等。
        if (!($.isArray(this)) || this == undefined || this == null || this.length == 0 || keyAttribute == undefined || value == undefined) {
            return false;
        }
        else {
            for (var i = 0; i < this.length; i++) {
                var obj = this[i];
                for (var prop in obj) {
                    if (prop == keyAttribute && obj[prop] === value) {
                        return true;
                    }
                }
            }
            return false;
        }
    };

    /*----@xcp@----*/
    /*
    *用于弹出数组中指定的数字下标所对应的值，即移除数组中该下标对应位置的值，并返回该值,注意：该操作改变了原数组的引用；
    */
    Array.prototype.popValueOf = function (index) {
        if (index >= 0 && !isNaN(index)) {
            var array = this.slice(index, index + 1);
            if (array != undefined && array.length != 0) {
                this.remove(index, index);
                return array[0];
            }
            else
                return undefined;
        }
        else {
            return undefined;
        }
    };

    /*----@xcp@----*/
    /*
    *用于查找指定的对象数组中是否存在指定属性，并检测该属性中是否存在属性值与形参value的值恒等。
    *eg. 给定对象数组array1=[{SysRoleId:123,RoleName:"xcp"},{SysRoleId:456,RoleName:"xcp"},{SysRoleId:"456",RoleName:"neusoft"},{SysRoleId:"456"}{SysRoleId:"789",RoleName:"bzd",SysUserId:"123"}];
    *调用array1.indexOfObjectArray("SysRoleId","456")将返回2，不是1，也不是3；
    */
    Array.prototype.indexOfObjectArray = function (keyAttribute, value) {
        if (!($.isArray(this)) || this == undefined || this == null || this.length == 0 || keyAttribute == undefined || value == undefined) {
            return -1;
        }
        else {
            for (var i = 0; i < this.length; i++) {
                var obj = this[i];
                for (var prop in obj) {
                    if (prop == keyAttribute && obj[prop] === value) {
                        return i;
                    }
                }
            }
            return -1;
        }
    };
///////////////////////////Array end////////////////////////////////////


///////////////////////////String start////////////////////////////////////
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

String.format = function (text) {
    if (arguments.length <= 1) {
        return text;
    }

    var tokenCount = arguments.length - 2;

    for (var token = 0; token <= tokenCount; token++) {
        text = text.replace(new RegExp("\\{" + token + "\\}", "gi"),
                                                arguments[token + 1]);
    }
    return text;
};

String.prototype.startsWith = function (prefix) {
    return this.indexOf(prefix) === 0;
}

String.prototype.endsWith = function (suffix) {
    return this.match(suffix + "$") == suffix;
};

String.compare = function (source, target, ignoreCase) {
    if (ignoreCase) {
        return source.toLowerCase() == target.toLowerCase();
    }
    else {
        return source == target;
    }
};

/* contains version 2
if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
}

if (!('contains' in Array.prototype)) {
  Array.prototype.contains = function(arr, startIndex) {
    return ''.indexOf.call(this, arr, startIndex) !== -1;
  };
}
*/

String.contains = function(string, substr, isIgnoreCase) {
    if (isIgnoreCase) {
        string = string.toLowerCase();
        substr = substr.toLowerCase();
    }
    var startChar = substr.substring(0, 1);
    var strLen = substr.length;
    for (var j = 0; j < string.length - strLen + 1; j++) {
        if (string.charAt(j) == startChar)//如果匹配起始字符,开始查找
        {
            if (string.substring(j, j + strLen) == substr)//如果从j开始的字符与str匹配，那ok
            {
                return true;
            }
        }
    }
    return false;
}

String.prototype.contains = function (substr, isIgnoreCase) {
    return String.contains(this.toString(), substr, isIgnoreCase);
}

String.prototype.replaceAll = function (oldString, newString) {
    return this.replace(new RegExp(oldString,"gm"),newString);
}
///////////////////////////String end////////////////////////////////////


///////////////////////////Date start////////////////////////////////////
Date.prototype.formatString = function () {
    var displayFormat = String.format("{0}/{1}/{2} {3}:{4}:{5}"
			, this.getFullYear()
			, this.getMonth() + 1
			, this.getDate()
			, this.getHours() >= 10 ? this.getHours() : '0' + this.getHours()
			, this.getMinutes() >= 10 ? this.getMinutes() : '0' + this.getMinutes()
			, this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds());
    return displayFormat;
};

Date.prototype.dateString = function () {
    var displayFormat = String.format("{0}/{1}/{2}"
			, this.getFullYear()
			, this.getMonth() + 1
			, this.getDate());
    return displayFormat;
};
Date.prototype.timeString = function(){
	var displayFormat = String.format("{0}/{1}/{2} {3}:{4}:{5}"
			, this.getFullYear()
			, this.getMonth() + 1
			, this.getDate()
			, this.getHours()
			, this.getMinutes()
			, this.getSeconds());
    return displayFormat;
}

Date.showMonthLastDay = function (month) {
    var nowdate = new Date();
    var monthNextFirstDay = new Date(nowdate.getYear(), month, 1);
    var monthLastDay = new Date(monthNextFirstDay - 86400000);
    return monthLastDay;
}

Date.getCurrentMonthFirstDate = function () {
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1;

    if (month < 4)
        year = year - 1;

    //month = month.padLeft(2, '0');

    return String.format("{0}-{1}-{2}", year, "04", "01");
}

Date.getNextYearDate = function () {
    var nowDate = new Date();
    var year = nowDate.getFullYear() + 1;
    var month = nowDate.getMonth() + 1;

    if (month < 4)
        year = year - 1;

    //month = month.padLeft(2, '0');
    //return String.format("{0}-{1}-{2}", year, month, Date.showMonthLastDay(month).getDate().padLeft(2, '0'));
    return String.format("{0}-{1}-{2}", year, "03", "31");
}

Date.getDelta = function (date1, date2) {
    var days = (date2.getTime() - date1.getTime()) / 86400000;
    return days;
}

Date.nowDate = function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();

    return String.format("{0}-{1}-{2}", yyyy, mm, dd);
}

/*----@xcp@----*/
/**
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).pattern ("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).pattern ("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
**/
Date.prototype.pattern = function (fmt) { //
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
///////////////////////////Date end////////////////////////////////////

///////////////////////////File start////////////////////////////////////
if (!$.browser.msie) {
    File.prototype.getExtName = function () {
        return this.name.substring(this.name.lastIndexOf(".") + 1).toLowerCase();
    };
}
///////////////////////////File end////////////////////////////////////

///////////////////////////Number start////////////////////////////////////
Number.prototype.padLeft = function (n, str) {
    return Array(n - String(this).length + 1).join(str || '0') + this;
};

Number.prototype.padRight = function (n, str) {
    return this + Array(n - String(this).length + 1).join(str || '0');
};
///////////////////////////Number end////////////////////////////////////
