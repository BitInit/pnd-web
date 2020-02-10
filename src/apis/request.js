import Axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

let req = Axios.create({
  baseURL: process.env.VUE_APP_API_URI,
  timeout: 15000
})

const errorHandle = (status) => {
  if (status === 404){
    router.push('/404')
  }
}

req.interceptors.response.use(response => {
  return response.data
}, error => {
  const { response } = error
  if (response) {
    errorHandle(response.status)
    return Promise.reject(response)
  } else {
    // 处理断网
    if (!window.navigator.onLine){
      alert("断网了")
    } else {
      Message({
        message: error,
        type: 'error'
      })
    }
  }
  return Promise.reject(error)
})

export default req