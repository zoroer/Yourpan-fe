import fi from "element-ui/src/locale/lang/fi";
import de from "element-ui/src/locale/lang/de";

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

// 价格处理
export function priceHandle (price) {
  let priceString = String(price.toFixed(2))
  let [pre, sub] = priceString.split('.');
  if (Number(sub) === 0) {
    return pre
  }
  if (Number(sub.substr(1, 1)) === 0) {
    return pre + '.' + sub.substr(0, 1);
  }
  return priceString;
}


/**
 * 获取文件大小字节转换
 * @param fileByte 文件字节大小
 */
export function getFileSize(fileByte) {
  let value = Number(fileByte);
  if (fileByte && !isNaN(value)) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
    let index = 0;
    if (value >= 1024) {
      while (value >= 1024) {
        value = value / 1024;
        index++;
      }
    }
    return `${priceHandle(value)}${units[index]}`;
  }
  return '-';
}
