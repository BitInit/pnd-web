import Axios from "axios"
import { Message } from 'element-ui'

var req = Axios.create({
    baseURL: 'http://localhost:8989/',
    timeout: 10000
})

req.interceptors.response.use(response => {
    return response.data
}, error => {
    var msg = error
    if (error.response && error.response.data && error.response.data.msg) {
        msg = error.response.data.msg
    }
    Message({
        message: msg,
        type: 'error',
        duration: 3 * 1000
    })
    return Promise.reject(error)
})

export default req
