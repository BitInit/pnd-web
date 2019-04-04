import Axios from "axios"
import { Message } from 'element-ui'

var r = Axios.create({
    baseURL: 'http://localhost:8989',
    timeout: 10000
})

r.interceptors.response.use(response => {
    return response.data
}, error => {
    Message({
        message: error,
        type: 'error',
        duration: 3 * 1000
    })
    return Promise.reject(error)
})

export default r