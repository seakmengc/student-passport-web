import { refreshIfExpired } from 'src/states/token';
import Cookies from 'cookies';

export async function ssrGetToken({ req, res }) {
  if (req.token) {
    return req.token;
  }

  if (!req.headers.cookie) {
    return { accessToken: null, refreshToken: null };
  }

  const cookies = new Cookies(req, res);
  const original = JSON.parse(decodeURIComponent(cookies.get('persist')))[
    'token'
  ];
  const token = await refreshIfExpired(original);
  if (token.exp !== original) {
    console.log('SSR Refreshed');
    cookies.set('persist', JSON.stringify({ token }), {
      httpOnly: false,
    });
  }

  req.token = token;

  return token;
}
