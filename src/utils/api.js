import { getAccessToken } from 'src/states/token';
import { isInServerSide } from './ssr';

const baseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

export const fetcher = (url, init) => {
  return fetch(baseUrl + url, init).then(async (res) => {
    if (isInServerSide()) {
      if (res.status === 404 && !url.startsWith('auth/')) {
        throw 'not found';
      }
    }

    return {
      data: res.status === 204 ? null : await res.json(),
      error: !res.ok,
    };
  });
};

export const useUnauthPostApi = async (path, data) => {
  return fetcher(path, {
    method: 'POST',
    accept: 'application/json',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  });
};

export const usePostApi = async (path, data, token = null) => {
  return fetcher(path, {
    method: 'POST',
    accept: 'application/json',
    body: JSON.stringify(data),
    headers: {
      authorization: 'Bearer ' + (token ?? (await getAccessToken()) ?? ''),
      'content-type': 'application/json',
    },
  });
};

export const useGetApi = async (path, data, token = null) => {
  let query = '';
  for (const key in data) {
    query += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
  }

  return fetcher(`${path}?${query}`, {
    method: 'GET',
    accept: 'application/json',
    headers: {
      authorization: 'Bearer ' + (token ?? (await getAccessToken()) ?? ''),
    },
  });
};

export const usePatchApi = async (path, data, token = null) => {
  return fetcher(path, {
    method: 'PATCH',
    accept: 'application/json',
    body: JSON.stringify(data),
    headers: {
      authorization: 'Bearer ' + (token ?? (await getAccessToken()) ?? ''),
      'content-type': 'application/json',
    },
  });
};

export const usePutApi = async (path, data, token = null) => {
  return fetcher(path, {
    method: 'PUT',
    accept: 'application/json',
    body: JSON.stringify(data),
    headers: {
      authorization: 'Bearer ' + (token ?? (await getAccessToken()) ?? ''),
      'content-type': 'application/json',
    },
  });
};

export const useDeleteApi = async (path, data, token = null) => {
  let query = '';
  for (const key in data) {
    query += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
  }

  return fetcher(`${path}?${query}`, {
    method: 'DELETE',
    accept: 'application/json',
    headers: {
      authorization: 'Bearer ' + (token ?? (await getAccessToken()) ?? ''),
    },
  });
};

export const usePostUploadApi = async (file, token = null) => {
  const formData = new FormData();
  formData.append('file', file);
  console.log({ file });

  return fetcher('upload', {
    method: 'POST',
    accept: 'application/json',
    body: formData,
    headers: {
      authorization: 'Bearer ' + (token ?? (await getAccessToken()) ?? ''),
    },
  });
};
