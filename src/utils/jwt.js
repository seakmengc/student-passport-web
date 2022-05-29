import { setLogout } from 'src/states/token';
import { throwRedirectError } from './ssr';

export function parseJwt(token) {
  if (token === '' || !token) {
    return {};
  }

  const base64Payload = token.split('.')[1];
  const payload = Buffer.from(base64Payload, 'base64');

  try {
    return JSON.parse(payload.toString());
  } catch (err) {
    throwRedirectError('/auth/login');
  }
}

export function isAccessTokenExpired({ exp }) {
  return !exp || exp * 1000 <= Date.now();
}

export function getRedirectHomePageUri({ role }) {
  return role === 'Student' ? '/' : '/admin';
}
