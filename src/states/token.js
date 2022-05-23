import { atom } from 'recoil';
import { useEffectPersisAtom } from 'src/utils/atom-effect';

export const tokenState = atom({
  key: 'token',
  default: {
    accessToken: null,
    refreshToken: null,
  },
  effects_UNSTABLE: [useEffectPersisAtom('token')],
});
