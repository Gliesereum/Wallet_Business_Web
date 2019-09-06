import {
  Canceled,
  Completed,
  Timer,
  Waiting,
  Expired,
} from '../assets/iconComponents';

export const genders = {
  FEMALE: 'Женский',
  MALE: 'Мужской',
  UNKNOWN: 'Не указано',
};

export const dayTranslateTemporary = [
  {
    translate: 'Понедельник',
    dayOfWeek: 'MONDAY',
  },
  {
    translate: 'Вторник',
    dayOfWeek: 'TUESDAY',
  },
  {
    translate: 'Среда',
    dayOfWeek: 'WEDNESDAY',
  },
  {
    translate: 'Четверг',
    dayOfWeek: 'THURSDAY',
  },
  {
    translate: 'Пятница',
    dayOfWeek: 'FRIDAY',
  },
  {
    translate: 'Суббота',
    dayOfWeek: 'SATURDAY',
  },
  {
    translate: 'Воскресенье',
    dayOfWeek: 'SUNDAY',
  },
];

export const scheduleListDefault = [
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: true,
    dayOfWeek: 'MONDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: true,
    dayOfWeek: 'TUESDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: true,
    dayOfWeek: 'WEDNESDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: true,
    dayOfWeek: 'THURSDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: true,
    dayOfWeek: 'FRIDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: true,
    dayOfWeek: 'SATURDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: true,
    dayOfWeek: 'SUNDAY',
  },
];

export const dayTranslate = {
  MONDAY: 'Понедельник',
  TUESDAY: 'Вторник',
  WEDNESDAY: 'Среда',
  THURSDAY: 'Четверг',
  FRIDAY: 'Пятница',
  SATURDAY: 'Суббота',
  SUNDAY: 'Воскресенье',
};

export const recordTranslate = {
  statusPay: {
    PAID: 'Оплачено',
    NOT_PAID: 'Не оплачено',
  },
  statusProcess: {
    CANCELED: 'Отменен',
    WAITING: 'Ожидается',
    STARTED: 'Начато',
    IN_PROCESS: 'В процессе',
    COMPLETED: 'Завершен',
    EXPIRED: 'Истекший',
  },
  statusIcon: {
    CANCELED: Canceled,
    WAITING: Waiting,
    IN_PROCESS: Timer,
    COMPLETED: Completed,
    EXPIRED: Expired,
  },
};

export const translateBusinessType = {
  CAR: 'Автомобильная',
  HUMAN: 'Другая',
};
