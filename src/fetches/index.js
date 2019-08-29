import globalConfig from '../config';
import { header, withToken } from '../utils/request';

const requestConfig = (method, token, body, isStringifyNeeded) => ({
  method,
  cache: 'default',
  headers: isStringifyNeeded
    ? header(token)
    : {
      Authorization: `Bearer ${token}`,
      'Application-Id': globalConfig.AplicationId,
    },
  body: isStringifyNeeded ? JSON.stringify(body) : body,
});

const fetchHelper = async ({
  urlPath,
  moduleUrl = 'account',
  method = 'GET',
  token,
  body,
  isStringifyNeeded = true,
}) => {
  const fullUrl = `${globalConfig.urlPrefix}${moduleUrl}/v1/${urlPath}`;
  const _requestConfig = requestConfig(method, token, body, isStringifyNeeded);

  return await fetch(fullUrl, _requestConfig);
};

export const fetchAction = ({
  url,
  fieldName,
  fieldType = [],
  method = 'GET',
  body = undefined,
  moduleUrl = 'karma',
  reduxAction = null,
}) => async () => {
  let result = fieldType;

  try {
    await withToken(fetchHelper)({
      urlPath: url,
      moduleUrl,
      method,
      body,
    }).then(async (item) => {
      if (item.status === 204) return fieldType;
      if (item.status === 200) return await item.json();
      if (response.status >= 400) {
        const error = await response.json();
        throw Error(error.message);
      }
      return fieldType;
    }).then((data) => {
      result = data;
      if (reduxAction && typeof reduxAction === 'function') reduxAction(data);
    });
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName,
  };
};
