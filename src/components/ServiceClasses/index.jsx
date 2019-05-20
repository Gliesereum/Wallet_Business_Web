import React from 'react';

import { Switch, Button, notification } from 'antd/lib/index';

import { asyncRequest, withToken } from '../../utils';

const ServiceClasses = (props) => {
  const {
    classes, servicePrice, modals, onCancel, updateServicePrice,
  } = props;

  function classSwitched(serviceClass) {
    const classIndex = servicePrice.serviceClass.findIndex(item => item.id === serviceClass.id);
    return classIndex !== -1;
  }

  async function pushClassToServicePrice(priceClass) {
    const pushClassUrl = 'price/class';
    const body = { priceId: servicePrice.id, serviceClassId: priceClass.id };

    try {
      const newServicePrice = await withToken(asyncRequest)({
        url: pushClassUrl, moduleUrl: 'karma', method: 'PUT', body,
      });
      await updateServicePrice(newServicePrice);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  }

  async function removeClassFromServicePrice(priceClass) {
    const removeClassUrl = `price/class/${servicePrice.id}/${priceClass.id}`;

    try {
      await withToken(asyncRequest)({ url: removeClassUrl, moduleUrl: 'karma', method: 'DELETE' });
      const newServicePrice = {
        ...servicePrice,
        serviceClass: servicePrice.serviceClass.filter(item => item.id !== priceClass.id),
      };
      await updateServicePrice(newServicePrice);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  }

  function triggerSwitch(priceClass) {
    return (boolSwitch) => {
      boolSwitch ? pushClassToServicePrice(priceClass) : removeClassFromServicePrice(priceClass);
    };
  }

  function handleCancel() {
    onCancel(modals.CLASSES, false, null)();
  }

  return (
    <div>
      <p>Если хотите чтобы услуга была доступна всем, оставьте пустым</p>
      {
        classes.map(item => (
          <div
            key={item.description}
          >
            <span>{item.name}</span>
            <Switch
              checked={classSwitched(item)}
              onClick={triggerSwitch(item)}
            />
            <br />
          </div>
        ))
      }
      <Button
        type="primary"
        onClick={handleCancel}
      >
        Отмена
      </Button>
    </div>
  );
};

export default ServiceClasses;
