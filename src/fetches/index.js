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

export const fetchGetBusinessTypes = async () => {
  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: 'business-category/business-type',
      moduleUrl: 'karma',
    }).then(async (item) => {
      if (item.status === 204) return [];
      if (item.status === 200) return await item.json();
      if (item.status >= 400) throw Error('error');
      return [];
    }).then(data => result.push(...data));
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'businessTypes',
  };
};

export const fetchGetBusinessCategoriesAccordingToBusinessTypeId = async ({ businessType }) => {
  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: `business-category/by-business-type?businessType=${businessType}`,
      moduleUrl: 'karma',
    }).then(async (item) => {
      if (item.status === 204) return [];
      if (item.status === 200) return await item.json();
      if (item.status >= 400) throw Error('error');
      return [];
    }).then(data => result.push(...data));
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'businessCategories',
  };
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

export const fetchBusinessesByCorp = async ({ corporationId }) => {
  const result = [];

  try {
    await withToken(fetchHelper)({
      urlPath: `business/by-corporation-id?id=${corporationId}`,
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

export const fetchWorkersById = async ({
  corporationId = null,
  businessId = null,
  singleBusiness = null,
  page = 0,
  size = 7,
}) => {
  let result = {};
  const getById = (singleBusiness ? singleBusiness.id : businessId) || corporationId;

  try {
    await withToken(fetchHelper)({
      urlPath: `worker/${corporationId ? 'by-corporation?corporationId' : 'by-business?businessId'}=${getById}&page=${page}&size=${size}`,
      moduleUrl: 'karma',
    }).then(async (response) => {
      if (response.status === 204) return {};
      if (response.status === 200) return await response.json();
      if (response.status >= 400) throw Error('error');
      return {};
    }).then(data => result = data);
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'workersPage',
  };
};

export const fetchClientsByIds = async ({
  corporationId = null,
  businessId = null,
  query = '',
  page = 0,
  size = 7,
}) => {
  let result = {};
  const urlPath = `business/customers?${corporationId ? 'corporationId' : 'businessIds'}=${corporationId || [businessId]}&page=${page}&size=${size}${query ? `&query=${query}` : ''}`;
  try {
    await withToken(fetchHelper)({
      urlPath,
      moduleUrl: 'karma',
    }).then(async (response) => {
      if (response.status === 204) return {};
      if (response.status === 200) return await response.json();
      if (response.status >= 400) throw Error('error');
      return {};
    }).then(data => result = data);
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'clientsPage',
  };
};

export const fetchOrdersByIds = async ({
  corporationId = null,
  corporations,
  businessId = null,
  page = 0,
  size = 5,
  from = null,
  to = null,
}) => {
  let result = {};
  const urlPath = 'record/by-params-for-business';
  try {
    await withToken(fetchHelper)({
      urlPath,
      moduleUrl: 'karma',
      method: 'POST',
      body: {
        page,
        size,
        corporationId: corporationId || (!businessId ? corporations[0].id : null),
        businessIds: businessId ? [businessId] : [],
        from,
        to,
      },
    }).then(async (response) => {
      if (response.status === 204) return {};
      if (response.status === 200) return await response.json();
      if (response.status >= 400) throw Error('error');
      return {};
    }).then(data => result = data);
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'ordersPage',
  };
};

export const fetchCarByClientId = async ({
  chosenClient,
  chosenCorporationId,
}) => {
  const result = [];
  const urlPath = `car/user/as-worker?clientId=${chosenClient.id}&corporationId=${chosenCorporationId}`;

  try {
    await withToken(fetchHelper)({
      urlPath,
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
    fieldName: 'carInfo',
  };
};

export const fetchRecordsByClient = async ({
  chosenClient,
  chosenCorporationId,
  dateParams = { from: null, to: null },
}) => {
  let result = [];
  const urlPath = 'record/by-params-for-business';

  try {
    await withToken(fetchHelper)({
      urlPath,
      moduleUrl: 'karma',
      method: 'POST',
      body: {
        clientIds: [chosenClient.id],
        corporationId: chosenCorporationId,
        from: dateParams.from,
        to: dateParams.to,
      },
    }).then(async (response) => {
      if (response.status === 204) return [];
      if (response.status === 200) return await response.json();
      if (response.status >= 400) throw Error('error');
      return [];
    }).then(data => result = data.content || []);
  } catch (e) {
    throw Error(e);
  }

  return {
    data: result,
    fieldName: 'recordsByUser',
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
