import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Radio,
} from 'antd';

import { genders } from '../../../mocks';

import './index.scss';

const b = bem('workerForm');
const { Item: FormItem } = Form;
const { Option } = Select;
const { Group: RadioGroup } = Radio;

class WorkerForm extends PureComponent {
  getInitialBusinessValue = () => {
    const { chosenWorker, businesses = [] } = this.props;

    if (chosenWorker && businesses.length) {
      const [business] = businesses.filter(businessItem => businessItem.id === chosenWorker.businessId);
      return business ? business.id : undefined;
    }
    return undefined;
  };

  getInitialWorkingSpaceValue = () => {
    const { chosenWorker, workingSpaces } = this.props;

    if (chosenWorker && workingSpaces.length) {
      const [workingSpace] = workingSpaces.filter(workingSpaceItem => workingSpaceItem.id === chosenWorker.workingSpaceId);
      return workingSpace ? workingSpace.id : undefined;
    }
    return undefined;
  };

  handleGetBusinessByCorporationId = async (corporationId) => {
    const { form, getBusinessByCorporationId } = this.props;

    await getBusinessByCorporationId(corporationId);
    form.resetFields(['businessId', 'workingSpaceId']);
  };

  handleGetWorkingSpacesByBusinessId = async (businessId) => {
    const { form, getWorkingSpacesByBusinessId } = this.props;

    await getWorkingSpacesByBusinessId(businessId);
    form.resetFields('workingSpaceId');
  };

  renderRadios = () => {
    const radios = [];
    for (const key in genders) {
      const radio = <Radio key={key} value={key}>{genders[key]}</Radio>;
      radios.push(radio);
    }
    return radios;
  };

  render() {
    const {
      form,
      chosenWorker,
      corporations = [],
      businesses = [],
      workingSpaces = [],
    } = this.props;

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
                      initialValue: (chosenWorker && chosenWorker.user) ? chosenWorker.user.lastName : '',
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
                <FormItem label="Имя">
                  {
                    form.getFieldDecorator('firstName', {
                      initialValue: (chosenWorker && chosenWorker.user) ? chosenWorker.user.firstName : '',
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
                <FormItem label="Отчество">
                  {
                    form.getFieldDecorator('middleName', {
                      initialValue: (chosenWorker && chosenWorker.user) ? chosenWorker.user.middleName : '',
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
                <FormItem label="Номер телефона">
                  {
                    form.getFieldDecorator('phone', {
                      initialValue: (chosenWorker && chosenWorker.user) ? chosenWorker.user.phone : '',
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Input
                        placeholder="+380 88 888 88 88"
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
                      <Select
                        placeholder="Выбрать..."
                        onSelect={this.handleGetBusinessByCorporationId}
                      >
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
                <FormItem label="Бизнесс в которой работает сотрудник">
                  {
                    form.getFieldDecorator('businessId', {
                      initialValue: this.getInitialBusinessValue(),
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select
                        placeholder="Выбрать..."
                        onSelect={this.handleGetWorkingSpacesByBusinessId}
                      >
                        {
                          businesses.length && businesses.map(business => (
                            <Option
                              key={business.id}
                              value={business.id}
                            >
                              {business.name}
                            </Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </FormItem>
                <FormItem label="Рабочее место сотрудника">
                  {
                    form.getFieldDecorator('workingSpaceId', {
                      initialValue: this.getInitialWorkingSpaceValue(),
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select
                        placeholder="Выбрать..."
                      >
                        {
                          workingSpaces.length && workingSpaces.map(ws => (
                            <Option
                              key={ws.id}
                              value={ws.id}
                            >
                              {ws.name}
                            </Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </FormItem>
                <FormItem label="Должность">
                  {
                    form.getFieldDecorator('position', {
                      initialValue: chosenWorker.position || '',
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Input
                        placeholder="+380 88 888 88 88"
                      />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <FormItem
                  className={b('formItem')}
                  label="Пол"
                >
                  {
                    form.getFieldDecorator('gender', {
                      initialValue: (chosenWorker && chosenWorker.user && chosenWorker.user.gender)
                        ? chosenWorker.user.gender
                        : 'UNKNOWN',
                    })(
                      <RadioGroup className={b('formItem-radioGroup')}>{this.renderRadios()}</RadioGroup>
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
