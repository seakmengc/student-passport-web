import { recoilPersist } from 'recoil-persist';
import { getCookie, setCookies } from 'cookies-next';

export function useEffectPersisAtom(key) {
  const { persistAtom } = recoilPersist({
    key: key,
    storage: {
      getItem: (key) => {
        console.log('Get Item', key);

        return getCookie(key);
      },
      setItem: (key, value) => {
        console.log('Set Item', key);

        return setCookies(key, value);
      },
    },
  });

  return persistAtom;
}
