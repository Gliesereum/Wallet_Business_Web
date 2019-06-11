import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Form,
  Card,
  Checkbox,
  Row,
  Col,
} from 'antd';

import './index.scss';

const b = bem('serviceAdditional');
const { Item: FormItem } = Form;
const CheckboxGroup = Checkbox.Group;

class ServiceAdditional extends Component {
  componentDidMount() {
    const { updateFormData, form } = this.props;
    form.validateFields(async (error, values) => {
      if (!error) {
        updateFormData('additionalInfo', values);
      }
    });
  }

  getCheckedOpts = (attrs) => {
    const { servicePrice } = this.props;
    const checkedFilters = [];

    servicePrice.attributes.forEach((item) => {
      attrs.forEach((attr) => {
        if (attr.id === item.id) {
          checkedFilters.push(attr.id);
        }
      });
    });
    return checkedFilters;
  };

  render() {
    const { form, filters, servicePrice } = this.props;
    return (
      <Form className={b()}>
        <Row
          gutter={40}
          className={b('container')}
        >
          {
            filters.map(filter => (
              <Col
                span={7}
                key={filter.id}
              >
                <FormItem key={filter.id}>
                  <Card
                    title={filter.title}
                    key={filter.id}
                    className={b('card')}
                  >
                    {form.getFieldDecorator(filter.value, {
                      initialValue: servicePrice && servicePrice.attributes ? this.getCheckedOpts(filter.attributes) : undefined,
                    })(
                      <CheckboxGroup>
                        {
                          filter.attributes.map(attr => (
                            <Checkbox
                              value={attr.id}
                              key={attr.id}
                            >
                              {attr.title}
                            </Checkbox>
                          ))
                        }
                      </CheckboxGroup>
                    )}
                    <div className={b('card-footerBlurer')} />
                  </Card>
                </FormItem>
              </Col>
            ))
          }
        </Row>
      </Form>
    );
  }
}

export default Form.create({
  onValuesChange: ({ updateFormData }, changedValues) => updateFormData('additionalInfo', changedValues),
})(ServiceAdditional);
