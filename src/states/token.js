import { atom } from 'recoil';
import { resetRecoil, setRecoil } from 'recoil-nexus';
import { useEffectPersisAtom } from 'src/utils/atom-effect';
import { authState, setAuth } from './auth';

export const tokenState = atom({
  key: 'token',
  default: {
    accessToken: null,
    refreshToken: null,
  },
  effects_UNSTABLE: [useEffectPersisAtom('persist')],
});

export const setNewLogin = async (data) => {
  setRecoil(tokenState, data);

  await setAuth(data.accessToken);
};

export const setLogout = () => {
  resetRecoil(tokenState);

  resetRecoil(authState);
};
