import { atom } from 'recoil';
import { resetRecoil, setRecoil, getRecoil } from 'recoil-nexus';
import { fetcher } from 'src/utils/api';
import { useEffectPersisAtom } from 'src/utils/atom-effect';
import { parseJwt } from 'src/utils/jwt';
import { setAtomCookie, throwRedirectError } from 'src/utils/ssr';
import { authState, setAuth } from './auth';
import { isInServerSide } from 'src/utils/ssr';
import { officesState } from './offices';

export const tokenState = atom({
  key: 'token',
  default: {
    accessToken: null,
    refreshToken: null,
    //in ms
    exp: null,
  },
  effects_UNSTABLE: [useEffectPersisAtom('persist')],
});

export const setNewLogin = async (data) => {
  setRecoil(tokenState, {
    ...data,
    exp: (parseJwt(data.accessToken).exp - 30) * 1000,
  });

  return setAuth(data.accessToken);
};

export const refreshIfExpired = async ({ exp, refreshToken, accessToken }) => {
  if (exp > Date.now()) {
    return { exp, refreshToken, accessToken };
  }

  const { data, error } = await fetcher('auth/refresh-token', {
    method: 'POST',
    accept: 'application/json',
    body: JSON.stringify({
      refreshToken: refreshToken ?? '',
    }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (error) {
    if (isInServerSide()) {
      throwRedirectError('/auth/login');
    } else {
      window.location.reload();
      return {};
    }
  }

  const rtn = {
    ...data,
    exp: (parseJwt(data.accessToken).exp - 30) * 1000,
  };

  if (!isInServerSide()) {
    setRecoil(tokenState, rtn);
  }

  return rtn;
};

export const setLogout = (ctx = null) => {
  //client
  if (typeof window !== 'undefined') {
    resetRecoil(tokenState);
    resetRecoil(authState);
    resetRecoil(officesState);
  }

  //ssr

  if (ctx != null) {
    setAtomCookie(ctx, {});
  }
};

export const getAccessToken = async () => {
  let state = getRecoil(tokenState);
  if (state.exp === null || state.exp < Date.now()) {
    state = await refreshIfExpired(state);
  }

  return state.accessToken;
};
