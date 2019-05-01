import {fileMd5} from '@/util/md5_utils.js'
import {resourceExist, createFile, prepareFileUpload, fileUpload, changeFileState} from '@/api/resource.js'

export const getPercent = function(num, total) {
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
        return "-";
    }
    return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
}

function nop (){}
export const FileUploader = class {

    /**
     * 初始化
     */
    constructor (maxConcurrentUploadNumber, chunkByteSize, clientId, 
            originFileArr, successCallback){
        this.maxConcurrentUploadNumber = maxConcurrentUploadNumber
        this.chunkByteSize = chunkByteSize
        this.clientId = clientId
        this.id = 0
        this.originFileArr = originFileArr
        this.successCallback = successCallback || nop
    }
    
    
    getAndIncreateId () {
        return this.id++
    }

    addNewFiles (newFiles) {
        for (let i in newFiles){
            let newFile = newFiles[i],
                file = {
                    id: this.getAndIncreateId(),
                    fileName: newFile.file.name,
                    status: 'preupload', //preupload, check, uploading, paused, resume,success
                    description: '等待中...',
                    size: newFile.file.size,
                    targetFolderName: newFile.targetFolderName,
                    targetFolderId: newFile.targetFolderId,
                    blob: newFile.file,
                    completionBytes: 0,
                    resourceId: 0
                }
            if (!contains(this.originFileArr, file)){
                this.originFileArr.push(file)
            }
        }
        this.upload()
    }

    go (file, that) {
        let end = file.completionBytes + that.chunkByteSize
        if (end > file.size) {
            end = file.size
        }

        var chunk = file.blob.slice(file.completionBytes, end),
            reader = new FileReader()
        var formData = new FormData()
        formData.set('resourceId', file.resourceId)
        formData.set('clientId', that.clientId)
        formData.append('file', chunk)

        reader.onloadend = function(e){
            if (e.target.readyState == FileReader.DONE){
                fileUpload(formData).then((response) => {
                    file.completionBytes = response.data.completeBytes
                    if (response.data.code !== 0){ //暂停
                        setPaused(file)
                        that.upload()
                    } else {
                        if (file.completionBytes === file.size){ // 上传完成
                            setSuccess(file)
                            that.successCallback()
                            that.upload()
                        } else { // 还需要继续上传文件块
                            file.description = getPercent(file.completionBytes, file.size)
                            setTimeout(that.go, 2, file, that);
                        }
                    }
                })
            }
        }
        reader.readAsBinaryString(chunk)
    }

    upload0 (file, that) {
        if (file.status === 'preupload'){
            checkFileIsExists(file, function (resourceId) { // 系统存在该文件，不需要再次上传
                createFile({
                    resourceId: resourceId,
                    name: file.fileName,
                    parentId: file.targetFolderId
                }).then(() => {
                    that.successCallback()
                    setSuccess(file)
                    that.upload()
                })
            }, function(md5) { // 系统不存在该文件，则进行文件上传预处理
                prepareFileUpload(that.clientId, file.size, md5, file.fileName, file.targetFolderId).then((response) => {
                    file.resourceId = response.data.resourceId
                    setUploading(file)
                    that.go(file, that)
                })
            })
        } else if (file.status === 'resume'){
            setUploading(file)
            that.go(file, that)
        }
    }

    /**
     * 开始上传文件
     * @param {*} originFileArr 
     */
    upload (that){
        that = that || this
        let canUploadFileNumber = that.maxConcurrentUploadNumber - numberOfCurrentlyUploading(that.originFileArr)
        if (canUploadFileNumber > 0){
            for (let i = 0; i < that.originFileArr.length && canUploadFileNumber > 0; i++){
                let file = that.originFileArr[i]
                if (file.status === 'preupload' || file.status === 'resume'){
                    setTimeout(that.upload0, 5, file, that);
                    canUploadFileNumber--
                }
            }
        }
    }

    pause (id) {
        let file = this.originFileArr.find((element) => {
            return element.id === id
        }), that = this
        changeFileState(this.clientId, file.resourceId, "pause").then(() => {
            setPaused(file)
            that.upload()
        })
    }

    resume (id) {
        let file = this.originFileArr.find((element) => {
            return element.id === id
        }), that = this
        changeFileState(this.clientId, file.resourceId, "resume").then(() => {
            setResume(file)
            that.upload()
        })
    }

    delete (id) {
        let index = this.originFileArr.findIndex((element) => {
            return element.id === id
        })
        if (this.originFileArr[index].status === 'uploading'){
            this.pause(id)
        }
        let rest = this.originFileArr.slice(index + 1)
        this.originFileArr.length = index
        this.originFileArr.push.apply(this.originFileArr, rest)
    }

    pauseAll () {
        for (let i in this.originFileArr){
            let file = this.originFileArr[i]
            if (file.status === 'uploading'){
                this.pause(file.id)
            }
        }
    }
};

function contains(originFileArr, newFile){
    for (let i in originFileArr){
        let file = originFileArr[i]
        if (file.fileName === newFile.fileName && file.size === newFile.size
            && file.targetFileId === newFile.targetFileId){
            return true
        }
    }
    return false
}

function numberOfCurrentlyUploading (originFileArr){
    let numberOfUploadsBeingProcessed = 0
    for (let i in originFileArr){
        var file = originFileArr[i]
        if (file.status === 'uploading'){
            numberOfUploadsBeingProcessed++
        }
    }
    return numberOfUploadsBeingProcessed
}

function checkFileIsExists (file, existsCallback, inexistsCallback) {
    setCheck(file)
    fileMd5(file.blob, function (md5){
        resourceExist(md5).then((response) => {
            if (response.data.exist){
                existsCallback(response.data.resourceId)
            } else {
                inexistsCallback(md5)
            }
        })
    })
}

function setSuccess (file){
    file.status = 'success'
    file.description = '上传成功'
}
function setCheck (file){
    file.status = 'check'
    file.description = '校验中...'
}
function setPaused (file){
    file.status = 'paused'
    file.description = '已中断'
}
function setResume (file) {
    file.status = 'resume'
    file.description = '等待中...'
}
function setUploading(file){
    file.status = 'uploading'
    file.description = '上传中...'
}