import { ssrGetToken } from 'src/utils/ssr';

export const AdminRoute = (callback = null) => {
  return (ctx) => {
    const { accessToken } = ssrGetToken(ctx.req);

    console.log({ accessToken });

    if (accessToken === null) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    return callback
      ? callback(ctx)
      : {
          props: {},
        };
  };
};
