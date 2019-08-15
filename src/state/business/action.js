const actions = {
  GET_BUSINESS: 'GET_BUSINESS',
  UPDATE_BUSINESS: 'UPDATE_BUSINESS',
  ADD_BUSINESS: 'ADD_BUSINESS',
  REMOVE_BUSINESS: 'REMOVE_BUSINESS',

  GET_SERVICE_PRICE: 'GET_SERVICE_PRICE',
  UPDATE_SERVICE_PRICE: 'UPDATE_SERVICE_PRICE',
  ADD_SERVICE_PRICE: 'ADD_SERVICE_PRICE',
  REMOVE_SERVICE_PRICE: 'REMOVE_SERVICE_PRICE',

  GET_BUSINESS_PACKAGES: 'GET_BUSINESS_PACKAGES',
  UPDATE_BUSINESS_PACKAGE: 'UPDATE_BUSINESS_PACKAGE',
  ADD_BUSINESS_PACKAGE: 'ADD_BUSINESS_PACKAGE',
  DELETE_BUSINESS_PACKAGE: 'DELETE_BUSINESS_PACKAGE',

  UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',

  GET_WORKING_SPACES: 'GET_WORKING_SPACES',
  ADD_WORKING_SPACE: 'ADD_WORKING_SPACE',
  UPDATE_WORKING_SPACE: 'UPDATE_WORKING_SPACE',
  REMOVE_WORKER_FROM_OLD_WORKING_SPACE: 'REMOVE_WORKER_FROM_OLD_WORKING_SPACE',
  DELETE_WORKING_SPACE: 'DELETE_WORKING_SPACE',

  $getBusiness: business => ({
    type: actions.GET_BUSINESS,
    payload: business,
  }),

  $updateBusiness: updatedBusiness => ({
    type: actions.UPDATE_BUSINESS,
    payload: updatedBusiness,
  }),

  $addNewBusiness: newBusiness => ({
    type: actions.ADD_BUSINESS,
    payload: newBusiness,
  }),

  $removeBusiness: businessId => ({
    type: actions.REMOVE_BUSINESS,
    payload: businessId,
  }),

  $getPriceService: data => ({
    type: actions.GET_SERVICE_PRICE,
    payload: data,
  }),

  $updateServicePrice: newServicePrice => ({
    type: actions.UPDATE_SERVICE_PRICE,
    payload: newServicePrice,
  }),

  $addServicePrice: servicePrice => ({
    type: actions.ADD_SERVICE_PRICE,
    payload: servicePrice,
  }),

  $removeServicePrice: payload => ({
    type: actions.REMOVE_SERVICE_PRICE,
    payload,
  }),

  $getBusinessPackages: data => ({
    type: actions.GET_BUSINESS_PACKAGES,
    payload: data,
  }),

  $updateBusinessPackage: businessPackage => ({
    type: actions.UPDATE_BUSINESS_PACKAGE,
    payload: businessPackage,
  }),

  $createBusinessPackage: businessPackage => ({
    type: actions.ADD_BUSINESS_PACKAGE,
    payload: businessPackage,
  }),

  $deleteBusinessPackage: ({ businessId, packageId }) => ({
    type: actions.DELETE_BUSINESS_PACKAGE,
    payload: { businessId, packageId },
  }),

  $updateSchedule: scheduleList => ({
    type: actions.UPDATE_SCHEDULE,
    payload: scheduleList,
  }),

  $getWorkingSpaces: payload => ({
    type: actions.GET_WORKING_SPACES,
    payload,
  }),

  $addWorkingSpace: workingSpace => ({
    type: actions.ADD_WORKING_SPACE,
    payload: workingSpace,
  }),

  $updateWorkingSpace: workingSpace => ({
    type: actions.UPDATE_WORKING_SPACE,
    payload: workingSpace,
  }),

  $removeWorkerFromOldWS: worker => ({
    type: actions.REMOVE_WORKER_FROM_OLD_WORKING_SPACE,
    payload: worker,
  }),

  $deleteWorkingSpace: workingSpaceId => ({
    type: actions.DELETE_WORKING_SPACE,
    payload: workingSpaceId,
  }),
};

export default actions;
