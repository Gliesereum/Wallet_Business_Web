import config from '../../config';

export default {
  storageKey: 'c7',
  appId: '4ba91ec3-5a50-400f-9d29-08e4f6f022e9',
  server: config.urlPrefix.slice(0, -1), // production or developer server
  corporationId: '',
  brandName: 'COUPLER WIDGET',
  version: 'ПРОБНАЯ ВЕРСИЯ',
  startButtonClassName: 'coupler-widget-demo', // className for startButton
  phrases: {
    'title.masters': 'Выберете исполнителя',
    'title.service': 'Выберете услуги',
    'button.start.label': 'ЗАПИСЬ ОНЛАЙН',
    'button.start.loading': 'Загрузка',
    currency: '₴',
    'record.header.label': 'Вы выбрали',
    'record.button.label': 'Заказать',
    'worker.any.label': 'Любой',
    'record.any.worker.title': 'Любой свободный мастер',
    'record.any.worker.desc': 'Система выберет свободного мастера автоматически',
    'record.result.order.title': 'Еще один шаг',
    'errors.1492': 'Бизнес в данный момент не работает',
    'errors.1434': 'В компании выходной',
    'errors.1430': 'Извините мастер сегодня полностью занят, выберете другого мастера или попробуйте сделать заказ позже',
    'errors.1428': 'Извините сегодня все занято',
    'errors.1164': 'Код СМС не верный',
    'errors.1045': 'Сервер не доступен',
    'errors.1124': 'Неправильный номер',
    'errors.1435': 'Компания в данный момент не работает',
  },
  theme: {
    coupler: {
      startButton: {
        labelVision: true,
        background: '#30303c', // TODO: add
        label: '#e77c22',
        brandColor: '#e77c22',
        width: '250px', // TODO: add
        height: '60px', // TODO: add
        fontSize: '18px', // TODO: add
        borderRadius: '10px', // TODO: add
        zIndex: 9999,
      },
      body: {
        baseColor: '#25272b',
        textColor: '#a4aec5',
        primaryColor: '#e77c22',
      },
    },
  },
};
