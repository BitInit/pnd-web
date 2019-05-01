import md5 from 'js-md5'

/**
 * 计算文件的md5值：每50M数据选取前1M得到md5，然后将所有的md5值再做一次md5运算
 * @param {File} file
 * @param {Function} callback 回调函数
 */
export const fileMd5 = (file, callback) => {
    var chunkSize = 1048576,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0, result = "",
        fileReader = new FileReader()

    fileReader.onload = function(e){
        currentChunk = currentChunk  + 50
        result += md5(e.target.result)

        if (currentChunk < chunks){
            loadNext()
        } else {
            callback(md5(result))
        }
    }

    function loadNext() {
        let start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size)? file.size: start + chunkSize
        fileReader.readAsBinaryString(file.slice(start, end))
    }

    loadNext()
}