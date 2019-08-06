import {
  Canceled,
  Completed,
  Timer,
  Waiting,
} from '../assets/iconComponents';

export const genders = {
  FEMALE: 'Женский',
  MALE: 'Мужской',
  UNKNOWN: 'Не указано',
};

export const dayTranslateTemporary = [
  {
    translate: 'Понедельник',
    dayOfWeek: 'TUESDAY',
  },
  {
    translate: 'Вторник',
    dayOfWeek: 'WEDNESDAY',
  },
  {
    translate: 'Среда',
    dayOfWeek: 'THURSDAY',
  },
  {
    translate: 'Четверг',
    dayOfWeek: 'FRIDAY',
  },
  {
    translate: 'Пятница',
    dayOfWeek: 'MONDAY',
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
    isWork: false,
    dayOfWeek: 'MONDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'TUESDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'WEDNESDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'THURSDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'FRIDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'SATURDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
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
  },
  statusIcon: {
    CANCELED: Canceled,
    WAITING: Waiting,
    STARTED: Timer,
    IN_PROCESS: Timer,
    COMPLETED: Completed,
  },
};
