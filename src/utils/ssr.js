import { refreshIfExpired } from 'src/states/token';
import Cookies from 'cookies';

export async function ssrGetToken({ req, res }) {
  if (req.token) {
    return req.token;
  }

  if (!req.headers.cookie) {
    return { accessToken: null, refreshToken: null, exp: null };
  }

  const cookies = new Cookies(req, res);
  const persist = JSON.parse(decodeURIComponent(cookies.get('persist')));
  const original = persist['token'];

  const token = await refreshIfExpired(original);
  if (token.exp !== original) {
    console.log('SSR Refreshed');
    cookies.set('persist', JSON.stringify({ ...persist, token }), {
      httpOnly: false,
    });
  }

  req.token = token;

  return token;
}
