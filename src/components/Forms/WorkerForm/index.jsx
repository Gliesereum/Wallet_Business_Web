import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Form,
  Input,
  Select,
} from 'antd';

const b = bem('workerForm');
const { Item: FormItem } = Form;
const { Option } = Select;

class WorkerForm extends PureComponent {
  render() {
    const { form, chosenWorker, corporations = [] } = this.props;

    return (
      <Form
        colon={false}
        className={b()}
      >
        <Row gutter={33}>
          <Col lg={16}>
            <Row gutter={31}>
              <Col lg={12}>
                <FormItem label="Фамилия">
                  {
                    form.getFieldDecorator('lastName', {
                      initialValue: chosenWorker && chosenWorker.user ? chosenWorker.user.lastName : '',
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
                <FormItem label="Компания в которой работает сотрудник">
                  {
                    form.getFieldDecorator('corporationId', {
                      initialValue: chosenWorker ? chosenWorker.corporationId : undefined,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select placeholder="Выбрать компанию...">
                        {
                          corporations.length && corporations.map(corporation => (
                            <Option
                              key={corporation.id}
                              value={corporation.id}
                            >
                              {corporation.name}
                            </Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <FormItem label="Пол">
                  {
                    form.getFieldDecorator('corporationId', {
                      initialValue: chosenWorker ? chosenWorker.corporationId : '',
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select placeholder="Выбрать компанию...">
                        <Option value={12}>12</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col lg={8}>
            Дни та часы работы
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({})(WorkerForm);
