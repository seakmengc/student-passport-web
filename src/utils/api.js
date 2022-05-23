import { tokenState, useTokenState } from 'src/states/token';
import { getRecoil, getRecoilPromise } from 'recoil-nexus';

const baseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const fetcher = (url, init) => {
  return fetch(baseUrl + url, init).then(async (res) => ({
    data: await res.json(),
    error: !res.ok,
  }));
};

export const usePostApi = async (path, data, token = null) => {
  const tokensStore = getRecoil(tokenState);

  return fetcher(path, {
    method: 'POST',
    accept: 'application/json',
    body: JSON.stringify(data),
    headers: {
      authorization: 'Bearer ' + (token ?? tokensStore.accessToken ?? ''),
      'content-type': 'application/json',
    },
  });
};

export const useGetApi = async (path, data, token = null) => {
  const tokensStore = getRecoil(tokenState);
  console.log(tokensStore);
  let query = '';
  for (const key in data) {
    query += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
  }

  return fetcher(`${path}?${query}`, {
    method: 'GET',
    accept: 'application/json',
    headers: {
      authorization: 'Bearer ' + (token ?? tokensStore.accessToken ?? ''),
    },
  });
};

export const usePatchApi = async (path, data, token = null) => {
  const tokensStore = getRecoil(tokenState);

  return fetcher(path, {
    method: 'PATCH',
    accept: 'application/json',
    body: data,
    headers: {
      authorization: 'Bearer ' + (token ?? tokensStore.accessToken ?? ''),
    },
  });
};

export const useDeleteApi = async (path, data, token = null) => {
  const tokensStore = getRecoil(tokenState);

  let query = '';
  for (const key in data) {
    query += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
  }

  return fetcher(`${path}?${query}`, {
    method: 'DELETE',
    accept: 'application/json',
    headers: {
      authorization: 'Bearer ' + (token ?? tokensStore.accessToken ?? ''),
    },
  });
};
