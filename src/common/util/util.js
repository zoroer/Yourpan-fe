// import { MessageBox } from 'element-ui';

export default {

  /**
   * 获取查询字符串，并转换为key=>value对象
   *
   * @return {Object} 查询字符串的对象
   */
  getQuery () {
    let pathName = location.search;
    const obj = {};
    if (!pathName) {
      return obj;
    }

    // 查询字符串
    pathName = pathName.substring(1);

    // 转换为对象
    const searArr = pathName.split('&');
    searArr.forEach(item => {
      const arr = item.split('=');
      obj[arr[0]] = arr[1];
    });
    return obj;
  },

  /**
   * 获取某个查询字符串的值
   *
   * @param {string} key 查询字符串的key
   * @return {string} key对应的查询字符串的value
   */
  getQueryofKey (key) {
    if (key == null) {
      return;
    }

    return this.getQuery()[key];
  }
};

/**
 * 检测数据类型
 *
 * @param {*} param 检验的数据
 * @return {string} 数据类型 Object => Object Array => Array string => String
 *                           number => Number null => Null undefined => Undefined...
 */
export function getType (param) {
  return Object.prototype.toString.call(param).slice(8, -1);
}

const timePad = (time = 0) => time < 10 ? '0' + time : time;

export function timeToDate (now) {
  var year = now.getFullYear();
  var month = timePad(now.getMonth() + 1);
  var date = timePad(now.getDate());
  var hour = timePad(now.getHours());
  var minute = timePad(now.getMinutes());
  var second = timePad(now.getSeconds());
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}

/**
 * 深度clone
 *
 * @param {(Object|Array)} origin 需要clone的数据源
 * @return {(Object|Array)} clone的数据
 */
export function deepClone (origin) {
  if (getType(origin) === 'Array' || getType(origin) === 'Object') {
    const json = JSON.stringify(origin);
    return JSON.parse(json);
  }
  return origin;
}
