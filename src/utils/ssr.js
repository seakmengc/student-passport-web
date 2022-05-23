import cookie from 'cookie';

export function ssrGetToken(req) {
  const { token } = cookie.parse(req.headers.cookie);

  return JSON.parse(token)['token'];
}
