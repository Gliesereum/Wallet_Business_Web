import globalConfig from '../config';
import { header, withToken } from '../utils/request';

const requestConfig = (method, token, body, isStringifyNeeded) => ({
  method,
  cache: 'default',
  headers: isStringifyNeeded ? header(token) : { Authorization: `Bearer ${token}` },
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

export const fetchGetPriceServices = async (props) => {
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
        props.getPriceService(data);
        result.push(data);
      });
    } catch (e) {
      throw Error(e);
    }
  }));

  return {
    data: result,
    fieldName: 'servicePrices',
  };
};

export const fetchGetBusinessPackages = async (props) => {
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
        props.getBusinessPackages(data);
        result.push(data);
      });
    } catch (e) {
      throw Error(e);
    }
  }));

  return {
    data: result,
    fieldName: 'businessPackages',
  };
};

export const fetchGetBusinessOrders = async (props) => {
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
        props.getBusinessOrders(id, data);
        result.push(data);
      });
    } catch (e) {
      throw Error(e);
    }
  }));

  return {
    data: result,
    fieldName: 'businessOrders',
  };
};

export const fetchGetServiceTypes = async (props) => {
  if (!props.singleBusiness) return;

  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: `service/by-business-category?businessCategoryId=${props.singleBusiness.businessCategoryId}`,
      moduleUrl: 'karma',
    }).then(async (response) => {
      if (response.status === 204) return [];
      if (response.status === 200) return await response.json();
      if (response.status >= 400) throw Error('error');
      return [];
    }).then(data => result.push(...data));
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'serviceTypes',
  };
};

export const fetchGetFilters = async (props) => {
  if (!props.singleBusiness) return;

  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: `filter/by-business-category?businessCategoryId=${props.singleBusiness.businessCategoryId}`,
      moduleUrl: 'karma',
    }).then(async (response) => {
      if (response.status === 204) return [];
      if (response.status === 200) return await response.json();
      if (response.status >= 400) throw Error('error');
      return [];
    }).then(data => result.push(...data));
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'filters',
  };
};

export const fetchGetClasses = async (props) => {
  if (!props.singleBusiness) return;

  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: 'class',
      moduleUrl: 'karma',
    }).then(async (response) => {
      if (response.status === 204) return [];
      if (response.status === 200) return await response.json();
      if (response.status >= 400) throw Error('error');
      return [];
    }).then(data => result.push(...data));
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'classes',
  };
};

export const fetchGetNearbyBusinesses = async ({ currentLocation }) => {
  const result = [];

  try {
    await fetchHelper({
      urlPath: 'business/search/document',
      moduleUrl: 'karma',
      method: 'POST',
      body: {
        geoDistance: {
          longitude: currentLocation.lng,
          latitude: currentLocation.lat,
          distanceMeters: 50000,
        },
      },
    }).then(async (response) => {
      if (response.status === 204) return [];
      if (response.status === 200) return await response.json();
      if (response.status >= 400) throw Error('error');
      return [];
    }).then(data => result.push(...data));
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'nearbyBusinesses',
  };
};

export const fetchBusinessesByCorp = async ({ chosenCorp }) => {
  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: `business/by-corporation-id?corporationId=${chosenCorp.id}`,
      moduleUrl: 'karma',
    }).then(async (response) => {
      if (response.status === 204) return [];
      if (response.status === 200) return await response.json();
      if (response.status >= 400) throw Error('error');
      return [];
    }).then(data => result.push(...data));
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'business',
  };
};

export const fetchImageByUpload = async (body) => {
  let imageUrl = null;
  try {
    await withToken(fetchHelper)({
      urlPath: 'upload',
      moduleUrl: 'file',
      method: 'POST',
      isStringifyNeeded: false,
      body,
    }).then(async data => await data.json())
      .then(data => imageUrl = data.url);
  } catch (e) {
    throw Error(e);
  }

  return imageUrl;
};
