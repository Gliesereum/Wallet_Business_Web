export default [
  {
    key: 'name',
    label: 'Название',
    type: 'text',
    defaultValue: '',
    render: true,
  },
  {
    key: 'duration',
    label: 'Продолжительность, минуты',
    type: 'text',
    defaultValue: '',
    render: true,
  },
  {
    key: 'discount',
    label: 'Скидка, %',
    type: 'text',
    defaultValue: 0,
    render: true,
  },
  {
    key: 'servicesIds',
    label: 'Список услуг',
    type: 'array',
    defaultValue: [],
    render: true,
  },
  {
    key: 'businessId',
    type: 'text',
    defaultValue: '',
    render: false,
  },
];
