import { refreshIfExpired, setLogout } from 'src/states/token';
import Cookies from 'cookies';

export async function ssrGetToken({ req, res }) {
  const def = { accessToken: null, refreshToken: null, exp: null };
  if (req.token) {
    return req.token;
  }

  if (!req.headers.cookie) {
    return def;
  }

  const cookies = new Cookies(req, res);
  const persist = JSON.parse(decodeURIComponent(cookies.get('persist')));
  const original = persist['token'];
  if (!original) {
    return def;
  }

  const token = await refreshIfExpired(original);
  if (token.exp !== original.exp) {
    console.log('SSR Refreshed');
    cookies.set('persist', JSON.stringify({ ...persist, token }), {
      httpOnly: false,
    });
  }

  req.token = token;

  return token;
}

function errorHandler(err, { req, res }) {
  if (typeof err === 'string') {
    // custom application error
    const is404 = err.toLowerCase().endsWith('not found');
    if (is404) {
      return {
        notFound: true,
      };
    }
  }

  if (err.type === 'redirect') {
    if (err.clearCreds === true) {
      setLogout({ req, res });
    }

    return {
      redirect: {
        destination: err.destination,
        permanent: false,
      },
    };
  }

  // default to 500 server error
  console.error(err);
  throw err;
}

export function ssrCallbackHandler(callback) {
  return async (ctx) => {
    try {
      const result = await callback(ctx);

      return result;
    } catch (err) {
      return errorHandler(err, ctx);
    }
  };
}

export function throwRedirectError(destination, clearCreds = true) {
  throw {
    type: 'redirect',
    destination,
    clearCreds,
  };
}
