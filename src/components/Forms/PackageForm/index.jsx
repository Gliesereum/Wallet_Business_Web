import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Input,
  InputNumber,
  Checkbox,
  Form,
  Row,
  Col,
  Card,
} from 'antd';

const { Item: FormItem } = Form;
const CheckboxGroup = Checkbox.Group;
const b = bem('packageForm');

class PackageForm extends Component {
  getCheckedOpts = () => {
    const { chosenPackage, servicePricesList } = this.props;
    const checkedServices = [];

    chosenPackage.services.forEach((item) => {
      servicePricesList.forEach((service) => {
        if (service.id === item.id) {
          checkedServices.push(service.id);
        }
      });
    });
    return checkedServices;
  };

  getPackagePrice = () => {
    const { form, servicePricesList } = this.props;
    const { servicesIds = [], discount } = form.getFieldsValue(['servicesIds', 'discount']);

    const sumServicesPrice = servicePricesList
      .filter(item => servicesIds.includes(item.id))
      .reduce((acc, service) => acc += service.price, 0);
    return discount <= 0 ? sumServicesPrice : sumServicesPrice - sumServicesPrice * discount / 100;
  };

  getPackageDuration = (servicesIds) => {
    const { form, servicePricesList } = this.props;
    const sumServicesDuration = servicePricesList
      .filter(item => servicesIds.includes(item.id))
      .reduce((acc, service) => acc += service.duration, 0);
    form.setFieldsValue({ duration: sumServicesDuration });
  };

  render() {
    const {
      form,
      servicePricesList,
      chosenPackage,
    } = this.props;

    return (
      <Form className={b()}>
        <Row gutter={40}>
          <Col lg={12}>
            <FormItem>
              <Card
                title="Услуги, входящие в пакет"
                className={b('card')}
              >
                {form.getFieldDecorator('servicesIds', {
                  initialValue: chosenPackage && chosenPackage.services ? this.getCheckedOpts() : undefined,
                  rules: [
                    { required: true, message: 'Для создания пакета нужно выбрать хотя бы одну услугу' },
                  ],
                })(
                  <CheckboxGroup onChange={this.getPackageDuration}>
                    <Row gutter={10}>
                      {
                      servicePricesList.map(({ id, name }) => (
                        <Col
                          key={id}
                          lg={8}
                          className={b('card-checkbox')}
                        >
                          <Checkbox
                            key={id}
                            value={id}
                          >
                            {name}
                          </Checkbox>
                        </Col>
                      ))
                    }
                    </Row>
                  </CheckboxGroup>
                )}
              </Card>
            </FormItem>
          </Col>
          <Col lg={12}>
            <FormItem
              label="Название пакета услуг"
            >
              {form.getFieldDecorator('name', {
                initialValue: chosenPackage ? chosenPackage.name : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(
                <Input placeholder="Ввод..." />
              )}
            </FormItem>
            <Row gutter={40}>
              <Col lg={12}>
                <FormItem
                  label="Скидка (процентов)"
                >
                  {form.getFieldDecorator('discount', {
                    initialValue: chosenPackage ? chosenPackage.discount : '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                    ],
                  })(
                    <InputNumber
                      step={5}
                      min={0}
                      max={100}
                      parser={value => value.replace(/\D/g, '')}
                      placeholder="00"
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={12}>
                <FormItem
                  label="Длительность (минут)"
                >
                  {form.getFieldDecorator('duration', {
                    initialValue: chosenPackage ? chosenPackage.duration : '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                    ],
                  })(
                    <InputNumber
                      step={5}
                      min={1}
                      max={1440}
                      parser={value => value.replace(/\D/g, '')}
                      placeholder="00"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <div className={b('totalPrice')}>
              <div className={b('totalPrice-text')}>Общая стоимость пакета услуг (гривен)</div>
              <div className={b('totalPrice-sum')}>{this.getPackagePrice()}</div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({})(PackageForm);
