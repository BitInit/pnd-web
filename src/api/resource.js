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