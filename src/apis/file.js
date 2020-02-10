import request from './request'

/**
 * 根据parentId获取所有的文件
 * @param {Number} parentId 
 */
export const getFileList = (parentId) => {
  return request({
    url: `/v1/file/parent/${parentId}`
  })
}

/**
 * 根据fileId获取文件
 * @param {Number} fileId 文件id
 */
export const getFile = (fileId) => {
  return request({
    url: `/v1/file/${fileId}`
  })
}

/**
 * 下载文件URL
 * @param {Number} fileId fileId
 */
export const downloadFileUrl = (fileId) => {
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin + `/v1/file/${fileId}/download`
  } else {
    return process.env.VUE_APP_API_URI + `/v1/file/${fileId}/download`
  }
}

/**
 * 创建新的文件
 * @param {Number}} parentId 父文件夹id
 * @param {String} fileName 文件名
 * @param {String} type 文件类型：folder/txt/pdf...
 */
export const createFile = (parentId, fileName, type) => {
  return request({
    url: `/v1/file`,
    method: 'post',
    data: {
      parentId, fileName, type
    }
  })
}

/**
 * 文件重命名
 * @param {Number} fileId 文件id
 * @param {String} fileName 文件名
 */
export const renameFile = (fileId, fileName) => {
  return request({
    url: `/v1/file/${fileId}/rename`,
    method: 'put',
    data: {
      fileName
    }
  })
}

/**
 * 根据文件id删除文件
 * @param {Array} fileIds 文件ids
 */
export const deleteFiles = (fileIds) => {
  return request({
    url: `/v1/file`,
    method: 'delete',
    data: fileIds
  })
}

/**
 * 移动或复制文件
 * @param {Array} fileIds 源文件ids
 * @param {Array} targetIds 目标文件ids
 * @param {String} type 类型
 */
export const moveOrCopyFiles = (fileIds, targetIds, type) => {
  return request({
    url: '/v1/file',
    method: 'put',
    data: {
      fileIds, targetIds, type
    }
  })
}