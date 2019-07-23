import React, { Component } from 'react';
import bem from 'bem-join';

import { Form, Checkbox, notification } from 'antd';

import { asyncRequest, withToken } from '../../../utils';

const { Item: FormItem } = Form;
const CheckboxGroup = Checkbox.Group;
const b = bem('serviceClasses');

class ServiceClasses extends Component {
  classChecked = () => {
    const { servicePrice, classes } = this.props;
    const checkedFilters = [];

    if (!servicePrice) return;

    if (!servicePrice.serviceClass || servicePrice.serviceClass.length === 0) {
      classes.forEach(classItem => checkedFilters.push(classItem.id));
    } else {
      classes.forEach(classItem => servicePrice.serviceClass.forEach((serviceClassItem) => {
        if (classItem.id === serviceClassItem.id) checkedFilters.push(serviceClassItem.id);
      }));
    }

    return checkedFilters;
  };

  pushClassToServicePrice = async (priceClass) => {
    const { servicePrice, updateServicePrice } = this.props;
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
  };

  removeClassFromServicePrice = async (priceClass) => {
    const { servicePrice, updateServicePrice } = this.props;
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
  };

  render() {
    const {
      form,
      classes,
      // servicePrice,
      // updateServicePrice,
    } = this.props;


    return (
      <Form className={b()}>
        <FormItem>
          {form.getFieldDecorator('classes', {
            initialValue: this.classChecked(),
          })(
            <CheckboxGroup>
              {
                classes.map(item => (
                  <Checkbox
                    className={b('checkbox')}
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </Checkbox>
                ))
              }
            </CheckboxGroup>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({
  onValuesChange: ({ updateFormData }, changedValues) => updateFormData('classes', changedValues),
})(ServiceClasses);
