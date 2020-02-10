import request from './request'

/**
 * 上传文件地址
 */
export const resourceUploadUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin + '/v1/resource/chunk'
  }
  return process.env.VUE_APP_API_URI + `/v1/resource/chunk`
}

/**
 * 合并上传的资源
 * @param {Object} resource resource
 */
export const mergeResource = (resource) => {
  return request({
    url: '/v1/resource/merge',
    method: 'post',
    data: resource
  })
}