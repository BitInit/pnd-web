
export function formatterMillisecond(date, format = 'yyyy-MM-dd hh:mm:ss'){
    var o = {
        "M+" : date.getMonth() + 1, // month
        "d+" : date.getDate(), // day
        "h+" : date.getHours(), // hour
        "m+" : date.getMinutes(), // minute
        "s+" : date.getSeconds(), // second
        "q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
        "S+" : date.getMilliseconds()
        // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
        - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
        var formatStr="";
        for(var i=1;i<=RegExp.$1.length;i++){
            formatStr+="0";
        }

        var replaceStr="";
        if(RegExp.$1.length == 1){
            replaceStr=o[k];
        }else{
            formatStr=formatStr+o[k];
            var index=("" + o[k]).length;
            formatStr=formatStr.substr(index);
            replaceStr=formatStr;
        }
        format = format.replace(RegExp.$1, replaceStr);
        }
    }
    return format;
}

export function formatterFileSize (s) {
    s = parseInt(s)
    if (s === 0) {
        return '-'
    } else if (s < 1024) {
        return s + 'B'
    } else if(s < 1024 * 1024) {
        return (s / 1024).toFixed(1) + 'K'
    } else if (s < 1024 * 1024 * 1024) {
        return (s / (1024 * 1024)).toFixed(1) + 'M'
    } else {
        return (s / (1024 * 1024 * 1024)).toFixed(1) + 'G'
    }
}

