// @flow
import React, { Component } from 'react';

import {
  Button, Input, Checkbox, Form as AntdForm,
} from 'antd';
import { Formik, Field, Form } from 'formik';


import type { P, S } from './children/types';
import PackageSchema from './children/schema';
import Fields from './children/fields';

import './styles.scss';


class Index extends Component<P, S> {
  initValues = () => {
    if (this.props.mode === 'update') {
      const { data } = this.props;
      return { ...data, servicesIds: data.services.map(item => item.id) };
    }
    return Fields.reduce((acc, field) => {
      if (field.key === 'businessId') {
        acc[field.key] = this.props.businessId;
        return acc;
      }
      acc[field.key] = field.defaultValue;
      return acc;
    }, {});
  };

  onSubmit = async (values) => {
    this.props.onSubmit(values, this.props.mode);
  };

  serviceListChecked = (checked, serviceId, packageServicesList, setFieldValue) => {
    if (checked) {
      setFieldValue('servicesIds', packageServicesList.filter(item => item !== serviceId));
      return;
    }
    if (!checked) {
      setFieldValue('servicesIds', [...packageServicesList, serviceId]);
    }
  };

  renderPackagePrice = (serviceIds, discount) => {
    const sumServicesPrice = this.props.servicePrices
      .filter(item => serviceIds.includes(item.id))
      .reduce((acc, service) => acc += service.price, 0);
    const price = discount <= 0 ? sumServicesPrice : sumServicesPrice - sumServicesPrice * discount / 100;
    return (
      <div className="package-total-price">
        <p>
          Стоимость пакета:
          {price.toFixed(2)}
          грн.
        </p>
      </div>
    );
  };

  renderServiceItem = (service, packageServicesList, setFieldValue) => {
    const checked = packageServicesList.findIndex(item => item === service.id) !== -1;
    return (
      <div className="coupler-packages-service-prices-item" key={service.id}>
        <Checkbox
          checked={checked}
          onChange={() => this.serviceListChecked(checked, service.id, packageServicesList, setFieldValue)}
          className="package-service-price-item"
        >
          <p>{service.name}</p>
          <p>
            {service.price.toFixed(2)}
            {' '}
            грн.
          </p>
        </Checkbox>
      </div>
    );
  };

  renderServicesList = (servicesList, setFieldValue) => (
    <div className="coupler-packages-service-prices-list">
      {this.props.servicePrices.map(item => this.renderServiceItem(item, servicesList, setFieldValue))}
    </div>
  );

  renderField = ({
    type, error, touched, value, label, name, setFieldValue,
  }) => {
    if (type === 'text') {
      return (
        <AntdForm.Item label={label} validateStatus={(touched && error) && 'error'} help={touched && error && error}>
          <Input value={value} onChange={e => setFieldValue(name, e.target.value)} />
        </AntdForm.Item>
      );
    }
    if (type === 'array') {
      return (
        <AntdForm.Item label={label} validateStatus={error && 'error'} help={error}>
          {this.renderServicesList(value, setFieldValue)}
        </AntdForm.Item>
      );
    }
  };

  renderForm = () => {
    const renderFields = Fields.filter(field => field.render);
    const RenderField = this.renderField;
    const buttonMessage = this.props.mode === 'update' ? 'Сохранить' : 'Создать';
    return (
      <div className="coupler-business-package-form">
        <Formik
          initialValues={this.initValues()}
          validationSchema={PackageSchema}
          onSubmit={this.onSubmit}
          render={({
            errors, touched, values, setFieldValue,
          }) => (
            <Form>
              {renderFields.map(fieldProps => (
                <Field
                  key={fieldProps.key}
                  name={fieldProps.key}
                  render={({ field }) => (
                    <RenderField {...{
                      ...fieldProps,
                      ...field,
                      error: errors[fieldProps.key],
                      touched: touched[fieldProps.key],
                      setFieldValue,
                    }}
                    />
                  )}
                />
              ))}

              <div className="package-form-footer">

                <div className="package-form-footer-submit">
                  <Button htmlType="submit" type="primary" loading={this.props.loading}>{buttonMessage}</Button>
                </div>
                <div className="package-form-footer-price">
                  {this.renderPackagePrice(values.servicesIds, values.discount)}
                </div>

              </div>

            </Form>
          )}
        />
      </div>
    );
  };

  render() {
    return this.renderForm();
  }
}

export default Index;
