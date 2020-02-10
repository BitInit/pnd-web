import request from './request'

/**
 * 获取系统信息，例如：系统容量，文件数等
 */
export const systemInfo = () => {
  return request({
    url: `/v1/system`
  })
}