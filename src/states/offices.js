import { atom } from 'recoil';
import { getRecoil, setRecoil, getRecoilPromise } from 'recoil-nexus';
import { useGetApi } from 'src/utils/api';
import { getAtomCookie, setAtomCookie, ssrGetToken } from 'src/utils/ssr';
import { useEffectPersisAtom } from 'src/utils/atom-effect';

export const officesState = atom({
  key: 'offices',
  default: null,
  effects_UNSTABLE: [useEffectPersisAtom('persist')],
});

export function getMyOffices() {
  return getRecoil(officesState);
}

export async function retrieveMyOffices(ctx) {
  const curr = getRecoil(officesState);
  if (curr !== null) {
    return;
  }

  const { accessToken } = await ssrGetToken(ctx);

  const { data, error } = await useGetApi('auth/me/office', {}, accessToken);
  if (error) {
    return;
  }

  setRecoil(officesState, data.offices);
  setAtomCookie(ctx, { ...getAtomCookie(ctx), offices: data.offices });
}
