const actions = {
  GET_BUSINESS: "GET_BUSINESS",

  $getBusiness: business => ({
    type: actions.GET_BUSINESS,
    payload: business,
  }),
};

export default actions;
