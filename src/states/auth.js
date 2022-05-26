import { atom } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { useGetApi } from 'src/utils/api';
import { useEffectPersisAtom } from 'src/utils/atom-effect';
import { setLogout } from './token';

export const authState = atom({
  key: 'auth',
  default: null,
});

export const setAuth = async (accessToken) => {
  const { data, error } = await useGetApi('auth/me', {}, accessToken);

  if (error) {
    setLogout();
    return;
  }

  setRecoil(authState, data);

  return data;
};
