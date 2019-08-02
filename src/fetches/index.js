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

export const fetchGetPriceServices = async ({ singleBusiness, getPriceService }) => {
  if (!singleBusiness) return;
  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: `price/by-business/${singleBusiness.id}`,
      moduleUrl: 'karma',
    }).then(async (item) => {
      if (item.status === 204) return [];
      if (item.status === 200) return await item.json();
      if (item.status >= 400) throw Error('error');
      return [];
    }).then((data) => {
      getPriceService(data);
      result.push(data);
    });
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'servicePrices',
  };
};

export const fetchGetBusinessPackages = async ({ singleBusiness, getBusinessPackages }) => {
  if (!singleBusiness) return;
  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: `package/by-business/${singleBusiness.id}`,
      moduleUrl: 'karma',
    }).then(async (item) => {
      if (item.status === 204) return [];
      if (item.status === 200) return await item.json();
      if (item.status >= 400) throw Error('error');
      return [];
    }).then((data) => {
      getBusinessPackages(data);
      result.push(data);
    });
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'businessPackages',
  };
};

export const fetchGetWorkingSpaces = async ({ singleBusiness, getWorkingSpaces }) => {
  if (!singleBusiness) return;
  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: `working-space/${singleBusiness.id}`,
      moduleUrl: 'karma',
    }).then(async (item) => {
      if (item.status === 204) return [];
      if (item.status === 200) return await item.json();
      if (item.status >= 400) throw Error('error');
      return [];
    }).then((data) => {
      getWorkingSpaces(data);
      result.push(data);
    });
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'workingSpaces',
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

export const fetchBusinessesByCorp = async ({ corporationId }) => {
  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: `business/by-corporation-id?corporationId=${corporationId}`,
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

export const fetchWorkersByCorporationId = async (props) => {
  const result = [];
  const corporationId = props.corporationId || props.singleBusiness.corporationId;

  try {
    await withToken(fetchHelper)({
      urlPath: `workers?corporationId=${corporationId}`,
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
    fieldName: 'workers',
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
