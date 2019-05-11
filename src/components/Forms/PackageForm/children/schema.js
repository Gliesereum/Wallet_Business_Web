import * as Yup from 'yup';

const requiredMessage = 'Обязательно к заполнению';


export default Yup.object().shape({
  name: Yup.string().required(requiredMessage).min(2, 'Минимум 2 символа'),
  discount: Yup.number()
    .required(requiredMessage)
    .min(0, 'Не может быть меньше 0')
    .max(100, 'Не может быть больше 100')
    .typeError('Должно быть число'),
  duration: Yup.number().required(requiredMessage).min(0, 'Не может быть меньше 0').typeError('Должно быть число'),
  servicesIds: Yup.string().required(requiredMessage).min(1, 'Добавьте услуги'),
  businessId: Yup.string(),
});
