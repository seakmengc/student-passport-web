import cookie from 'cookie';

export function ssrGetToken(req) {
  if (!req.headers.cookie) {
    return { accessToken: null, refreshToken: null };
  }

  const { persist } = cookie.parse(req.headers.cookie);

  return JSON.parse(persist)['token'];
}
