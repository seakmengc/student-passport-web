import {
  isAccessTokenExpired,
  getRedirectHomePageUri,
  parseJwt,
} from 'src/utils/jwt';
import { ssrCallbackHandler, ssrGetToken } from 'src/utils/ssr';

export const AuthRoute = (callback = null) => {
  return ssrCallbackHandler(async (ctx) => {
    const { accessToken } = await ssrGetToken(ctx);

    const jwtPayload = parseJwt(accessToken);
    if (accessToken !== null || !isAccessTokenExpired(jwtPayload)) {
      return {
        redirect: {
          destination: getRedirectHomePageUri(jwtPayload),
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
