import request from '@/api/request'

export function fetchFileList(parentId) {
    return request({
        url: '/v1/file',
        method: 'get',
        params: {
            parentId
        }
    })
}

export function createNewFolder(parentId, folderName){
    return request({
        url: '/v1/file',
        method: 'post',
        params: {
            parentId, folderName
        }
    })
}

export function renameFile (id, fileName){
    return request({
        url: '/v1/file/' + id,
        method: 'put',
        params: {
            fileName
        }
    })
}

export function deleteFile(id){
    return request({
        url: '/v1/file/' + id,
        method: 'delete',
    })
}