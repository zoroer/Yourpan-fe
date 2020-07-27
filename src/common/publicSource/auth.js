import Cookies from 'js-cookie';

const TokenKey = 'pan_token';

export function getToken () {
  return Cookies.get(TokenKey);
}

export function setToken (token, time) {
  let expires = time !== undefined ? { expires: time } : {};
  return Cookies.set(TokenKey, token, expires);
}

export function removeToken () {
  return Cookies.remove(TokenKey);
}
