import { retrieveMyOffices, getMyOffices } from 'src/states/offices';
import { isAccessTokenExpired, parseJwt } from 'src/utils/jwt';
import {
  ssrCallbackHandler,
  ssrGetToken,
  throwRedirectError,
} from 'src/utils/ssr';

export const AdminRoute = (callback = null) => {
  return ssrCallbackHandler(async (ctx) => {
    const { accessToken } = await ssrGetToken(ctx);

    const jwtPayload = parseJwt(accessToken);
    if (accessToken === null || isAccessTokenExpired(jwtPayload)) {
      throwRedirectError('/auth/login');
    }

    if (!jwtPayload.role.endsWith('Admin')) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    await retrieveMyOffices(ctx);

    return callback
      ? callback(ctx)
      : {
          props: {},
        };
  });
};
