import axios from 'axios'
import config from './config'

const service = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000
})

export default service
