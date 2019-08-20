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
      'company.pageCreate.rightBar.header.title': {
        ru: 'Другие мои компании',
        uk: 'Другие мои компании',
        en: 'Другие мои компании',
      },
      'company.pageCreate.header.title': {
        ru: 'Создание компании',
        uk: 'Создание компании',
        en: 'Создание компании',
      },
      // -------------------------------------------------//
      'company.page.business.branch.emptyState.title': {
        ru: 'В вашем бизнесе пока нет филиалов',
        uk: 'У вашому бізнесі поки немає філій',
        en: 'There are no branches in your business yet',
      },
      'company.page.business.branch.emptyState.description': {
        ru: 'Создайте минимум один, чтобы добавить услуги, сотрудников, выбрать прочие атрибуты компании',
        uk: 'Створіть мінімум один, щоб додати послуги, співробітників, вибрати інші атрибути компанії',
        en: 'Create at least one to add services, employees, select other company attributes',
      },
      'company.page.business.createNewBranch': {
        ru: 'Создать филиал',
        uk: 'Створити філію',
        en: 'Create branch',
      },
      'company.page.emptyState.title': {
        ru: 'Компания не выбрана',
        uk: 'Компанія не обрана',
        en: 'No company selected',
      },
      'company.page.emptyState.information': {
        ru: 'Информация о компании',
        uk: 'Информация о компании',
        en: 'Информация о компании',
      },
      'company.page.emptyState.description': {
        ru: 'Выберите компанию, чтобы увидеть список филиалов',
        uk: 'Виберіть компанію, щоб побачити список філій',
        en: 'Select a company to see a list of branches',
      },
      'company.page.emptyState.createNewCompany.title': {
        ru: 'У вас пока нет компаний',
        uk: 'У вас поки немає компаній',
        en: 'You have no companies yet',
      },
      'company.page.emptyState.createNewCompany.description': {
        ru: 'Создайте свою первую компанию, в которую вы сможете добавить филиалы',
        uk: 'Створіть свою першу компанію, в яку ви зможете додати філії',
        en: 'Create your first company to which you can add branches',
      },
      'company.button.detailsInfo': {
        ru: 'Информация',
        uk: 'інформація',
        en: 'Details',
      },
      'company.button.addNewCompany': {
        ru: 'Добавить новую компанию',
        uk: 'Додати нову компанію',
        en: 'Add new company',
      },
      'sideBar.menu.company.label': {
        ru: 'Мои компании',
        uk: 'Мої компанії',
        en: 'My company',
      },
      'sideBar.menu.orders.label': {
        ru: 'Заказы',
        uk: 'Замовлення',
        en: 'Orders',
      },
      'sideBar.menu.employees.label': {
        ru: 'Сотрудники',
        uk: 'Співробітники',
        en: 'Employees',
      },
      'sideBar.menu.clients.label': {
        ru: 'Клиенты',
        uk: 'Клієнти',
        en: 'Clients',
      },
      'sideBar.menu.help.label': {
        ru: 'Помощь',
        uk: 'Допомога',
        en: 'Help',
      },
      'sideBar.menu.logOut.label': {
        ru: 'Выход',
        uk: 'Вихід',
        en: 'Log out',
      },
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
