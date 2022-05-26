import { getRecoil } from 'recoil-nexus';
import { authState } from 'src/states/auth';
import { useGetApi } from 'src/utils/api';
import { parseJwt } from 'src/utils/jwt';
import { ssrGetToken } from 'src/utils/ssr';

export const AdminRoute = (callback = null) => {
  const redirectRes = {
    redirect: {
      destination: '/auth/login',
      permanent: false,
    },
  };

  return async (ctx) => {
    const { accessToken } = await ssrGetToken(ctx);

    if (accessToken === null) {
      return redirectRes;
    }

    if (!parseJwt(accessToken).role?.endsWith('Admin')) {
      return redirectRes;
    }

    return callback
      ? callback(ctx)
      : {
          props: {},
        };
  };
};
