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
        url: '/v1/file/folder',
        method: 'post',
        params: {
            parentId, folderName
        }
    })
}

export function createFile (data){
    return request({
        url: '/v1/file',
        method: 'post',
        data
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

export function fetchSubfolder(id){
    return request({
        url: '/v1/file/' + id + '/subfolder',
        method: 'get'
    })
}

export function moveFile(id, targetId){
    return request({
        url: '/v1/file/' + id + '/move/' + targetId,
        method: 'put'
    })
}

export function copyFile(id, targetIds){
    return request({
        url: '/v1/file/' + id + '/copy',
        method: 'post',
        data: targetIds
    })
}

export function getConfig(){
    return request({
        url: 'v1/rs/config',
    })
}

export function resourceExist(fingerPrint){
    return request({
        url: '/v1/rs/fingerPrint',
        params: {
            fingerPrint
        }
    })
}

export function prepareFileUpload (clientId, size, md5, fileName, parentId){
    return request({
        url: '/v1/rs/preparation',
        method: 'post',
        params: {
            clientId, size, md5, fileName, parentId
        }
    })
}

export function fileUpload(formData){
    return request({
        url: '/v1/rs',
        method: 'post',
        config: {
            headers: {'Content-Type': 'multipart/form-data'}
        },
        data: formData
    })
}

export const changeFileState = (clientId, resourceId, type) => {
    return request({
        url: '/v1/rs/state',
        method: 'put',
        params: {
            clientId, resourceId, type
        }
    })
}

export const downloadResource = (resourceId) => {
    return request({
        url: '/v1/rs/' + resourceId
    })
}