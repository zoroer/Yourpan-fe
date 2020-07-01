/**
 * @fileoverview 请求方法
 * @author  | zoroer
 * @version 1.0 | 2019-06-30 |
 */

import axios from 'axios';
import Qs from 'qs';
import Toast from '@common/components/toast';
import { getToken } from '@common/publicSource/auth';

/**
 * 发送请求
 * @param  {String} api     接口
 * @param  {String} method  请求方式
 * @param  {Object} data    请求数据
 * @param  {Object} options 其他参数选项
 */
function sendAjax (api, method, data, options) {
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
  // 需要token验证的Header添加token
  if (options.needAuth) {
    axios.defaults.headers = {
      'Authorization': getToken()
    }
  }
  // 如果跨域夹带cookie信息
  axios.defaults.withCredentials = true;
  return new Promise((resolve, reject) => {
    axios(ajaxConfig)
      .then(response => {
        // 成功逻辑
        if (response.data.code === 1) {
          resolve(response.data);
        } else {
          // 失败
          reject(response.data)
        }
      })
      .catch((error) => {
        Toast('网络错误，请稍后再试～')
      })
  });
}

/**
 * get请求
 * @param  {String} api      接口
 * @param  {Object} data     请求数据
 * @param  {Object} options  其他参数选项
 */
function get (api, data, options = {}) {
  return sendAjax(api, 'GET', data, options);
}

/**
 * post请求
 * @param  {String} api      接口
 * @param  {Object} data     请求数据
 * @param  {Object} options  其他参数选项
 */
function post (api, data, options = {}) {
  return sendAjax(api, 'POST', data, options)
}

export default {
  get,
  post,
  sendAjax
}
