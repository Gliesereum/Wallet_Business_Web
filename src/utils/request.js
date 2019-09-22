import Cookies from 'js-cookie';
import config from '../config';

const cookieStorage = Cookies;

const timeoutMessageError = new Error('Превишен интервал ожидания. Повторите попытку!');

const timeout = (reject, time = 60000) => (setTimeout(() => reject(timeoutMessageError), time));

export const header = (token) => {
  const defaultHeaders = {
    'content-type': 'application/json',
    'Application-Id': config.AplicationId,
    accept: 'application/json',
  };
  if (!token) {
    return defaultHeaders;
  }
  return { ...defaultHeaders, Authorization: `Bearer ${token}` };
};

const requestConfig = (method, token, body) => ({
  method,
  cache: 'default',
  headers: header(token),
  body: JSON.stringify(body),
});

export const withToken = fn => (params) => {
  const token = cookieStorage.get('access_token');
  try {
    if (!token) {
      console.log('There is not access_token in cookies!');
      return;
    }
    return fn({ ...params, token });
  } catch (e) {
    console.log('Usage function error. Take a look at console');
    console.log(e);
  }
};

export const asyncRequest = ({
  url,
  method = 'GET',
  moduleUrl = 'account',
  token,
  body,
  requestTime,
  fullUrl = undefined,
}) => new Promise(async (resolve, reject) => {
  const timer = timeout(reject, requestTime);
  try {
    const fullURL = !fullUrl ? `${config.urlPrefix}${moduleUrl}/v1/${url}` : `${config.urlPrefix}${fullUrl}`;
    const _requestConfig = requestConfig(method, token, body);
    const request = await fetch(fullURL, _requestConfig);
    if (request.status === 204) {
      resolve();
    }
    if (request.status >= 200 && request.status <= 300) {
      const data = await request.json();
      resolve(data);
    } else {
      const data = await request.json();
      reject(data);
    }
  } catch (e) {
    reject(e);
  } finally {
    clearTimeout(timer);
  }
});

export const asyncUploadFile = ({
  url, method = 'POST', moduleUrl = 'file', token, body, onSuccess,
}) => new Promise(async (resolve, reject) => {
  try {
    const fullURL = `${config.urlPrefix}${moduleUrl}/v1/${url}`;
    const _requestConfig = { method, headers: { Authorization: `Bearer ${token}`, 'Application-Id': config.AplicationId }, body };
    const request = await fetch(fullURL, _requestConfig);
    if (request.status === 204) {
      resolve();
    }
    if (request.status >= 200 && request.status <= 300) {
      const data = await request.json();
      await resolve(data);
      await onSuccess('done');
    } else {
      const data = await request.json();
      reject(data);
    }
  } catch (e) {
    reject(e);
  }
});
