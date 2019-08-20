import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  appStatus: 'loading',
  loading: false,
  // TODO Вот так пишем многоязычность!
  defaultLanguage: {
    isoKey: 'ru',
    label: 'Русский',
    icon: '',
    direction: 'ltr',
    module: 'web',
  },
  langPack: [
    {
      isoKey: 'ru',
      label: 'Русский',
      icon: '',
      direction: 'ltr',
      module: 'web',
    },
    {
      isoKey: 'en',
      label: 'English',
      icon: '',
      direction: 'ltr',
      module: 'web',
    },
  ],
  language: {
    phrases: {
      'signIn.form.header': {
        ru: 'ПАНЕЛЬ УПРАВЛЕНИЯ БИЗНЕСОМ',
        en: 'BUSINESS MANAGEMENT PANEL',
      },
      'signIn.form.title': {
        ru: 'удаленный контроль 24/7',
        en: '24/7 remote control',
      },
      'signIn.form.welcome': {
        ru: 'Попробуйте простую и удобную CRM',
        en: 'Try simple and convenient CRM',
      },
      'signIn.form.inputPhone.label': {
        ru: 'Номер телефона',
        en: 'Phone number',
      },
      'signIn.form.message.sendCode': {
        ru: 'Код был отправлен на номер',
        en: 'The code was sent to',
      },
      'signIn.form.inputPhone.label.validation': {
        ru: 'Введите номер телефона',
        en: 'Enter phone number',
      },
      'signIn.form.inputPhone.mask': {
        ru: '+380 93 000 00 03',
        en: '+380 93 000 00 03',
      },
      'signIn.form.inputCode.label.validation': {
        ru: 'Неверный код',
        en: 'Incorrect code',
      },
      'signIn.form.inputCode.label': {
        ru: 'Одноразовый пароль из смс',
        en: 'One-time password from SMS',
      },
      'signIn.form.inputPhone.timerReturn': {
        ru: 'Отправить повторно',
        en: 'Resend',
      },
      'signIn.form.inputPhone.confirm': {
        ru: 'Подтвердить пароль',
        en: 'Confirm password',
      },
      'signIn.form.button.getCode': {
        ru: 'Получить одноразовый пароль',
        en: 'Get a one-time password',
      },
      'footer.copyright': {
        ru: 'Все права защищены. ',
        en: 'All rights reserved. ',
      },
      'footer.copyright.link.policy': {
        ru: 'Политика конфиденциальности',
        en: 'Privacy policy',
      },
      'footer.copyright.link.terms': {
        ru: 'Условия использования',
        en: 'Terms of Use',
      },
      'footer.copyright.company': {
        ru: 'Coupler App LLC 2019 год',
        en: 'Coupler App LLC 2019 year',
      },
    },
  },
  message: 'Start server connect!',
  error: undefined,
};

const initReducers = {
  [actions.APP_STATUS]: (state, payload) => ({
    ...state,
    appStatus: payload,
  }),

  [actions.SET_LANGUAGE]: (state, payload) => ({
    ...state,
    defaultLanguage: payload,
  }),

  [actions.DATA_LOADING_STATUS]: (state, payload) => ({
    ...state,
    loading: payload,
  }),
};

export default createReducer(initState, initReducers);
