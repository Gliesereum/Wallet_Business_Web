import React from 'react';
import {connect} from 'react-redux';

import {Form, Collapse, Checkbox, Button, Row, Col, notification} from 'antd/lib/index';

import {
  asyncRequest,
  withToken,
} from '../../utils';
import { actions } from '../../state';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;

const ServiceAdditional = (props) => {
  const {form, filters, servicePrice, onCancel, modals, updateServicePrice} = props;

  function handleCancel() {
    form.resetFields();
    onCancel(modals.ADDITIONAL, false, null)();
  }

  function handleSaveChange(e) {
    e.preventDefault();

    form.validateFields(async (error, values) => {
      if (!error) {
        const filterAttrUrl = `price/filter-attributes/${servicePrice.id}`;
        let body = [];
        for (let key in values) {
          if (values.hasOwnProperty(key)) {
            body = [...body, ...values[key]];
          }
        }

        try {
          const newServicePrice = await withToken(asyncRequest)({url: filterAttrUrl, method: 'POST', moduleUrl: 'karma', body});
          await updateServicePrice(newServicePrice);
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.message || 'Ошибка',
            description: 'Возникла ошибка',
          });
        } finally {
          handleCancel();
        }
      }
    })
  }

  function getCheckedOpts(attrs) {
    const checkedFilters = [];

    servicePrice.attributes.forEach(item => {
        attrs.forEach(attr => {
          if (attr.id === item.id) {
            checkedFilters.push(attr.id)
          }
        });
      }
    );
    return checkedFilters;
  }

  return (
    <Form onSubmit={handleSaveChange}>
      {
        filters.map(filter => (
          <FormItem key={filter.id}>
            <Collapse>
              <Panel header={filter.title} key={filter.id}>
                {form.getFieldDecorator(filter.value, {
                  initialValue: getCheckedOpts(filter.attributes)
                })(
                  <CheckboxGroup>
                    <Row>
                      {
                        filter.attributes.map(attr => (
                          <Col span={24} key={attr.id}>
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
      <Button onClick={handleCancel}>Отмена</Button>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  updateServicePrice: servicePrice => dispatch(actions.business.$updateServicePrice(servicePrice)),
});

export default connect(null, mapDispatchToProps)(Form.create({})(ServiceAdditional));
