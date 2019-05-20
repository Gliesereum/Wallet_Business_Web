import globalConfig from '../config';
import { requestConfig, withToken } from '../utils/request';
import { actions } from '../state';

const fetchHelper = async ({
  urlPath,
  moduleUrl = 'account',
  method = 'GET',
  token,
  body,
}) => {
  const fullUrl = `${globalConfig.urlPrefix}${moduleUrl}/v1/${urlPath}`;
  const _requestConfig = requestConfig(method, token, body);

  return await fetch(fullUrl, _requestConfig);
};

export const fetchPriceServices = async (props) => {
  const result = [];

  await Promise.all(props.business.map(async ({ id }) => {
    const request = await withToken(fetchHelper)({
      urlPath: `price/by-business/${id}`,
      moduleUrl: 'karma',
    });

    try {
      await Promise.resolve(request).then(async (item) => {
        if (item.status === 204) return [];
        if (item.status === 200) return await item.json();
        if (item.status >= 400) throw Error('error');
        return [];
      }).then((data) => {
        actions.business.$getPriceService(data);
        result.push(data);
      });
    } catch (e) {
      throw Error(e);
    }
  }));

  return result;
};

export const fetchBusinessPackages = async (props) => {
  const result = [];

  await Promise.all(props.business.map(async ({ id }) => {
    const request = await withToken(fetchHelper)({
      urlPath: `package/by-business/${id}`,
      moduleUrl: 'karma',
    });

    try {
      await Promise.resolve(request).then(async (item) => {
        if (item.status === 204) return [];
        if (item.status === 200) return await item.json();
        if (item.status >= 400) throw Error('error');
        return [];
      }).then((data) => {
        actions.business.$getBusinessPackages(data);
        result.push(data);
      });
    } catch (e) {
      throw Error(e);
    }
  }));

  return result;
};

export const fetchBusinessOrders = async (props) => {
  const result = [];

  await Promise.all(props.business.map(async ({ id }) => {
    const request = await withToken(fetchHelper)({
      urlPath: 'record/business/params',
      moduleUrl: 'karma',
      method: 'POST',
      body: { businessIds: [id], from: 0, to: Date.now() },
    });

    try {
      await Promise.resolve(request).then(async (item) => {
        if (item.status === 204) return [];
        if (item.status === 200) return await item.json();
        if (item.status >= 400) throw Error('error');
        return [];
      }).then((data) => {
        actions.business.$getBusinessOrders(id, data);
        result.push(data);
      });
    } catch (e) {
      throw Error(e);
    }
  }));

  return result;
};
