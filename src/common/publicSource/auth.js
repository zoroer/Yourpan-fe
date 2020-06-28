import Cookies from 'js-cookie'

const TokenExpire = 5; // 有效期(天)
const TokenKey = 'pan_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { expires: TokenExpire })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
