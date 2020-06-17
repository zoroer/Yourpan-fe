/**
 * Copyright (c) 2018-2019 kaochong, All rights reserved.
 * @fileoverview 请求方法
 * @author qiuxiaoguang | qiuxiaoguang@kaochong.com
 * @version 1.0 | 2019-01-03 | qiuxiaoguang    // 初始版本。
 * @version 1.1 | 2019-05-06 | qiuxiaoguang    // 配置跨域携带cookie
 * @description 公用axios封装，暴露get、post、sendAjax（用于put等请求）接口
 */

import axios from 'axios'
import Qs from 'qs'
import Toast from '@common/components/toast'

/**
 * 发送请求
 * @param  {String} api     接口
 * @param  {String} method  请求方式
 * @param  {Object} data    请求数据
 * @param  {Object} options 其他参数选项
 */
function sendAjax (api, method, data, options, isOldApi) {
  if (!api || typeof api !== 'string') {
    return
  }
  const ajaxConfig = {
    url: api,
    method: method.toLowerCase()
  };
  if (method === 'GET') {
    ajaxConfig.params = data
  } else {
    if (data instanceof FormData) {
      ajaxConfig.data = data
    } else {
      ajaxConfig.data = Qs.stringify(data, { arrayFormat: 'brackets' })
    }
  }
  Object.assign(ajaxConfig, options);
  // 解决中文乱码的问题
  axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  };
  // 如果跨域夹带cookie信息
  axios.defaults.withCredentials = true;
  const _promise = new Promise((resolve, reject) => {
    axios(ajaxConfig)
      .then(response => {
        const _data = response.data;
        if (isOldApi) {
          if (_data.errorCode) {
            reject(_data)
          } else {
            resolve(_data)
          }
        } else {
          // 成功逻辑
          if (_data.code === 1) {
            resolve(_data.data)
          } else {
            // 失败
            reject(response.data)
          }
        }
      })
      .catch((error) => {
        if (isOldApi) {
          if (error.response && error.response.data) {
            reject(error.response.data)
          } else {
            reject(error);
            Toast('网络错误，请稍后再试～')
          }
        } else {
          Toast('网络错误，请稍后再试～')
        }
      })
  });
  return _promise
}

/**
 * get请求
 * @param  {String} api      接口
 * @param  {Object} data     请求数据
 * @param  {Object} options  其他参数选项
 * @param  {Object} isOldApi 老的接口返回值
 */
function get (api, data, options = {}, isOldApi = false) {
  return sendAjax(api, 'GET', data, options, isOldApi)
}

/**
 * post请求
 * @param  {String} api      接口
 * @param  {Object} data     请求数据
 * @param  {Object} options  其他参数选项
 * @param  {Object} isOldApi 老的接口返回值
 */
function post (api, data, options = {}, isOldApi = false) {
  return sendAjax(api, 'POST', data, options, isOldApi)
}

export default {
  get,
  post,
  sendAjax
}
