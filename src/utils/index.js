/**
 * 格式化文件大小, 输出成带单位的字符串
 * @method formatSize
 * @grammar formatSize( size ) => String
 * @grammar formatSize( size, pointLength ) => String
 * @grammar formatSize( size, pointLength, units ) => String
 * @param {Number} size 文件大小
 * @param {Number} [pointLength=2] 精确到的小数点数。
 * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
 * @example
 * console.log( formatSize( 100 ) );    // => 100B
 * console.log( formatSize( 1024 ) );    // => 1.00K
 * console.log( formatSize( 1024, 0 ) );    // => 1K
 * console.log( formatSize( 1024 * 1024 ) );    // => 1.00M
 * console.log( formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
 * console.log( formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
 */
export const formatSize = ( size, pointLength, units ) => {
  if (size === null || size === undefined){
    return undefined
  }
  var unit;
  units = units || [ 'B', 'K', 'M', 'G', 'TB' ];
  while ( (unit = units.shift()) && size > 1024 ) {
    size = size / 1024;
  }
  return (unit === 'B' ? size : size.toFixed( pointLength || 2 )) +
        unit;
}

/**
 * 格式化时间，输出指定格式的时间
 * @param {Number} timestamp 时间戳
 * @param {String} format 格式
 * @example
 * console.log( formatDateTime(1578754162044) );    // => 2020-01-11 22:49:22
 */
export const formatDateTime = (timestamp, format = 'yyyy/MM/dd hh:mm:ss') => {
  var date = new Date(timestamp),
      o = {
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