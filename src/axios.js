import axios from "axios"
import {Message} from 'iview'

axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        // console.log(error)
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
        // console.log(111, response);
        return response
    },
    error => {
        Message.error(error.response.data.message.data)
        return Promise.reject(error)
    }
)

export default axios
