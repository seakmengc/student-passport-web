import { recoilPersist } from 'recoil-persist';
import { getCookie, setCookies } from 'cookies-next';
import Cookies from 'cookies';
import { isInServerSide } from 'src/utils/ssr';
import { getRecoil } from 'recoil-nexus';

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

        return setCookies(key, value, {});
      },
    },
  });

  return persistAtom;
}

export function getAtom(atom, ctx) {
  if (isInServerSide()) {
    if (!ctx) {
      return {};
    }

    const cookies = new Cookies(ctx.req, ctx.res);
    const persist = JSON.parse(decodeURIComponent(cookies.get('persist')));

    return persist[atom.key];
  }

  return getRecoil(atom);
}
