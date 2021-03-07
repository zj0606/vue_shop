import axios from 'axios'
import store from '../store'

// 创建axios
const instance = axios.create({
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
  timeout: 5000
})
// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.token ? store.state.token : window.sessionStorage.getItem('logintoken')
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.error(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status) {
      console.log(error.response.status)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get (url, params) {
  return new Promise((resolve, reject) => {
    instance.get(url, params)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post (url, params) {
  return new Promise((resolve, reject) => {
    instance.post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function put (url, params) {
  return new Promise((resolve, reject) => {
    instance.put(url, params)
      .then(res => {
        resolve(res.data)
        // Loading.service(true).close();
        //  Message({message: '请求成功', type: 'success'});
      })
      .catch(err => {
        reject(err.data)
        // Loading.service(true).close();
        // Message({message: '加载失败', type: 'error'});
      })
  })
}

/**
* delete
* @param {String} url [请求的url地址]
* @param {Object} params [请求时携带的参数]
*/
export function deletefn (url, params) {
  return new Promise((resolve, reject) => {
    instance.delete(url, params)
      .then(res => {
        resolve(res.data)
        // Loading.service(true).close();
        //  Message({message: '请求成功', type: 'success'});
      })
      .catch(err => {
        reject(err.data)
        // Loading.service(true).close();
        // Message({message: '加载失败', type: 'error'});
      })
  })
}
