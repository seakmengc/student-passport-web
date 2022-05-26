import { useGetApi } from 'src/utils/api';
import { ssrGetToken } from 'src/utils/ssr';

export const AdminRoute = (callback = null) => {
  const redirectRes = {
    redirect: {
      destination: '/auth/login',
      permanent: false,
    },
  };

  return async (ctx) => {
    const { accessToken } = ssrGetToken(ctx.req);

    if (accessToken === null) {
      return redirectRes;
    }

    const { data, error } = await useGetApi(
      'auth/me/fields',
      {
        fields: 'role,email',
      },
      accessToken
    );
    console.log({ data });
    if (error || !data.isAdmin) {
      return redirectRes;
    }

    return callback
      ? callback(ctx)
      : {
          props: {},
        };
  };
};
