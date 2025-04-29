/**
 * @author dengxingquan
 * @date 2023-04-25
 * @description Axios请求封装
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 可以在这里添加请求头、token等
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    
    // 如果后端返回的不是正常状态码，显示错误消息
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
      
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  (error) => {
    console.error('请求错误', error)
    let message = '网络异常，请稍后重试'
    
    if (error.response) {
      // 根据状态码显示不同的错误消息
      switch (error.response.status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址出错'
          break
        case 408:
          message = '请求超时'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 501:
          message = '服务未实现'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = `请求失败: ${error.response.status}`
      }
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    
    return Promise.reject(error)
  }
)

// 封装GET请求
export function get<T>(url: string, params?: any): Promise<T> {
  return service.get(url, { params })
}

// 封装POST请求
export function post<T>(url: string, data?: any): Promise<T> {
  return service.post(url, data)
}

// 封装PUT请求
export function put<T>(url: string, data?: any): Promise<T> {
  return service.put(url, data)
}

// 封装DELETE请求
export function del<T>(url: string, params?: any): Promise<T> {
  return service.delete(url, { params })
}

export default service 