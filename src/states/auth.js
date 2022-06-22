import { atom } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { useGetApi } from 'src/utils/api';
import { useEffectPersisAtom } from 'src/utils/atom-effect';
import { officesState } from './offices';
import { setLogout, tokenState } from './token';

export const authState = atom({
  key: 'auth',
  default: null,
  effects_UNSTABLE: [useEffectPersisAtom('persist')],
});

export const setAuth = async (accessToken = null) => {
  const { data, error } = await useGetApi(
    'auth/me',
    {},
    accessToken ?? getRecoil(tokenState).accessToken
  );

  const myOfficesData = await useGetApi(
    'auth/me/office',
    {},
    accessToken ?? getRecoil(tokenState).accessToken
  );

  if (error || myOfficesData.error) {
    setLogout();
    return;
  }

  setRecoil(authState, data);
  setRecoil(officesState, myOfficesData.data.offices);

  return data;
};
