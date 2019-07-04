import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Form,
  Input,
} from 'antd';

import './index.scss';

const b = bem('workingSpaceForm');
const { Item: FormItem } = Form;

class WorkingSpaceForm extends PureComponent {
  render() {
    const { form, chosenSpace } = this.props;

    return (
      <Form
        colon={false}
        className={b()}
      >
        <Row gutter={24}>
          <Col lg={12}>
            <FormItem label="Название рабочего места">
              {
                form.getFieldDecorator('name', {
                  initialValue: chosenSpace.name,
                  rules: [
                    { required: true, message: 'Поле обязательное для заполнения' },
                  ],
                })(
                  <Input
                    placeholder="Ввод..."
                  />
                )
              }
            </FormItem>
          </Col>
          <Col lg={12}>
            <FormItem label="Описание рабочего места">
              {
                form.getFieldDecorator('name', {
                  initialValue: chosenSpace.description,
                })(
                  <Input
                    placeholder="Ввод..."
                  />
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({})(WorkingSpaceForm);
