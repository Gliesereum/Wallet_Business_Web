import actions from './action';
import { createReducer } from '../../utils';

const initState = {
  appStatus: 'loading',
  loading: false,
  // TODO Вот так пишем многоязычность!
  defaultLanguage: {
    isoKey: 'uk',
    label: 'Українська',
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
      isoKey: 'uk',
      label: 'Українська',
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
        uk: 'ПАНЕЛЬ УПРАВЛІННЯ БІЗНЕСОМ',
        en: 'BUSINESS MANAGEMENT PANEL',
      },
      'signIn.form.title': {
        ru: 'удаленный контроль 24/7',
        uk: 'віддалений контроль 24/7',
        en: '24/7 remote control',
      },
      'signIn.form.welcome': {
        ru: 'Попробуйте простую и удобную CRM',
        uk: 'Спробуйте просту і зручну CRM',
        en: 'Try simple and convenient CRM',
      },
      'signIn.form.inputPhone.label': {
        ru: 'Номер телефона',
        uk: 'Номер телефону',
        en: 'Phone number',
      },
      'signIn.form.message.sendCode': {
        ru: 'Код был отправлен на номер',
        uk: 'Код був відправлений на номер',
        en: 'The code was sent to',
      },
      'signIn.form.inputPhone.label.validation': {
        ru: 'Введите номер телефона',
        uk: 'Введіть номер телефону',
        en: 'Enter phone number',
      },
      'signIn.form.inputPhone.mask': {
        ru: '+380 93 000 00 03',
        uk: '+380 93 000 00 03',
        en: '+380 93 000 00 03',
      },
      'signIn.form.inputCode.label.validation': {
        ru: 'Неверный код',
        uk: 'Невірний код',
        en: 'Incorrect code',
      },
      'signIn.form.inputCode.label': {
        ru: 'Одноразовый пароль из смс',
        uk: 'Одноразовий пароль з смс',
        en: 'One-time password from SMS',
      },
      'signIn.form.inputPhone.timerReturn': {
        ru: 'Отправить повторно',
        uk: 'Надіслати повторно',
        en: 'Resend',
      },
      'signIn.form.inputPhone.confirm': {
        ru: 'Подтвердить пароль',
        uk: 'Підтвердити пароль',
        en: 'Confirm password',
      },
      'signIn.form.button.getCode': {
        ru: 'Получить одноразовый пароль',
        uk: 'Отримати одноразовий пароль',
        en: 'Get a one-time password',
      },
      'footer.copyright': {
        ru: 'Все права защищены. ',
        uk: 'Всі права захищені. ',
        en: 'All rights reserved. ',
      },
      'footer.copyright.link.policy': {
        ru: 'Политика конфиденциальности',
        uk: 'Політика конфіденційності',
        en: 'Privacy policy',
      },
      'footer.copyright.link.terms': {
        ru: 'Условия использования',
        uk: 'Умови використання',
        en: 'Terms of Use',
      },
      'footer.copyright.company': {
        ru: 'Coupler App LLC 2019 год',
        uk: 'Coupler App LLC 2019 год',
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
