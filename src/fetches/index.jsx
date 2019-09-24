import React from 'react';
import { notification } from 'antd';

import globalConfig from '../config';
import { header, withToken } from '../utils/request';

import { NotificationIconError } from '../assets/iconComponents';

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
    }).then(async (response) => {
      if (response.status === 204) return fieldType;
      if (response.status === 200) return await response.json();
      if (response.status >= 400) {
        const { status } = response;
        const error = await response.json();
        error.status = status;
        throw error;
      }
      return fieldType;
    }).then((data) => {
      result = data;
      if (reduxAction && typeof reduxAction === 'function') reduxAction(data);
    });
  } catch (error) {
    const messages = [];
    for (const key in error.additional) {
      messages.push({
        message: error.additional[key],
        keyOfMessage: key,
      });
    }

    notification.error({
      className: 'notificationError',
      placement: 'bottomLeft',
      icon: <NotificationIconError />,
      duration: 5,
      message: error.message || 'Ошибка',
      description: (messages && messages.length)
        ? messages.map(item => <div key={item.keyOfMessage}>{`${item && item.keyOfMessage}: ${item.message}`}</div>)
        : 'Ошибка',
    });

    throw error;
  }

  return {
    data: result,
    fieldName,
  };
};
