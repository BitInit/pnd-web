export const baseUrl = "http://localhost:8989/"

export const formatterMillisecond = (date, format = 'yyyy-MM-dd hh:mm:ss') => {
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

export const formatterFileSize = (s) => {
    s = parseInt(s)
    if (s < 1024) {
        return s + 'B'
    } else if(s < 1024 * 1024) {
        return (s / 1024).toFixed(1) + 'K'
    } else if (s < 1024 * 1024 * 1024) {
        return (s / (1024 * 1024)).toFixed(1) + 'M'
    } else {
        return (s / (1024 * 1024 * 1024)).toFixed(1) + 'G'
    }
}

/**
 * 文件下载 地址：https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * @param {*} data 
 * @param {*} filename 
 * @param {*} mime 
 */
export const fileDownload = (data, filename, mime) => {
    var blob = new Blob([data], {type: mime || 'application/octet-stream'});
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were 
        // revoked by closing the blob for which they were created. 
        // These URLs will no longer resolve as the data backing 
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var blobURL = window.URL.createObjectURL(blob);
        var tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename); 
        
        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking 
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }
        
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
    }
}