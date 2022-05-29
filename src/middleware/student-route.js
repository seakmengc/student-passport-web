import { isAccessTokenExpired, parseJwt } from 'src/utils/jwt';
import {
  ssrCallbackHandler,
  ssrGetToken,
  throwRedirectError,
} from 'src/utils/ssr';

export const StudentRoute = (callback = null) => {
  return ssrCallbackHandler(async (ctx) => {
    const { accessToken } = await ssrGetToken(ctx);

    const jwtPayload = parseJwt(accessToken);
    if (accessToken === null || isAccessTokenExpired(jwtPayload)) {
      throwRedirectError('/auth/login');
    }

    if (jwtPayload.role !== 'Student') {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }

    return callback
      ? callback(ctx)
      : {
          props: {},
        };
  });
};
