import config from '../config';
import {cookieStorage} from './';


const timeoutMessageError = new Error("Превишен интервал ожидания. Повторите попытку!");

const timeout = (reject, time = 60000) => (setTimeout(() => reject(timeoutMessageError), time));

const requestConfig = (method, token, body) => {
  return {
    method,
    cache: "default",
    headers: header(token),
    body: JSON.stringify(body)
  };
};

const header = token => {
  const defaultHeaders = {"content-type": "application/json", "accept": "application/json"};
  if (!token) {
    return defaultHeaders;
  }
  return {...defaultHeaders, "Authorization": `Bearer ${token}`};
};

export const withToken = fn => params => {
  const token = cookieStorage.get('access_token');
  try {
    if (!token) {
      alert('There is not access_token in cookies!');
      return
    }
    return fn({...params, token})
  }
  catch (e) {
    alert('Usage function error. Take a look at console');
    console.log(e);
  }

};

export const asyncRequest = ({url, method = "GET", moduleUrl = "account", token, body, requestTime, fullUrl = undefined}) => {
  return new Promise(async (resolve, reject) => {
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
};
