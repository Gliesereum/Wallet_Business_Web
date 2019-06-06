import React from 'react';

import {
  Form, Collapse, Checkbox, Button, Row, Col, notification,
} from 'antd';

import { asyncRequest, withToken } from '../../../utils';

const FormItem = Form.Item;
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

const ServiceAdditional = (props) => {
  const {
    form, filters, servicePrice, updateServicePrice,
  } = props;

  function handleSaveChange(e) {
    e.preventDefault();

    form.validateFields(async (error, values) => {
      if (!error) {
        const filterAttrUrl = `price/filter-attributes/${servicePrice.id}`;
        let body = [];
        for (const key in values) {
          if (Object.prototype.hasOwnProperty.call(values, key)) {
            body = [...body, ...values[key]];
          }
        }

        try {
          const newServicePrice = await withToken(asyncRequest)({
            url: filterAttrUrl, method: 'POST', moduleUrl: 'karma', body,
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
    });
  }

  function getCheckedOpts(attrs) {
    const checkedFilters = [];

    servicePrice.attributes.forEach((item) => {
      attrs.forEach((attr) => {
        if (attr.id === item.id) {
          checkedFilters.push(attr.id);
        }
      });
    });
    return checkedFilters;
  }

  return (
    <Form
      onSubmit={handleSaveChange}
    >
      {
        filters.map(filter => (
          <FormItem key={filter.id}>
            <Collapse>
              <Panel header={filter.title} key={filter.id}>
                {form.getFieldDecorator(filter.value, {
                  initialValue: servicePrice ? getCheckedOpts(filter.attributes) : undefined,
                })(
                  <CheckboxGroup>
                    <Row>
                      {
                        filter.attributes.map(attr => (
                          <Col span={filter.length === 1 ? 24 : 7} key={attr.id}>
                            <Checkbox value={attr.id}>{attr.title}</Checkbox>
                          </Col>
                        ))
                      }
                    </Row>
                  </CheckboxGroup>
                )}
              </Panel>
            </Collapse>
          </FormItem>
        ))
      }

      <Button type="primary" htmlType="submit">Сохранить</Button>
      <Button>Отмена</Button>
    </Form>
  );
};

export default Form.create({})(ServiceAdditional);
