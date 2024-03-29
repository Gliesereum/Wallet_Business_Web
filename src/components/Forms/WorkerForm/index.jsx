import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Checkbox,
  notification,
} from 'antd';

import PhoneInput from '../../PhoneInput';
import FromToInput from '../../FromToInput';

const b = bem('workerForm');
const { Item: FormItem } = Form;
const { Option } = Select;

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

  checkHours = (rule, value, callback) => {
    let errText = null;
    if (value.from <= 0) errText = 'Время начала работы должно быть больше 0';
    if (value.to <= 0) errText = 'Время конца работы должно быть больше 0';

    if (errText) {
      notification.error({
        duration: 5,
        message: errText || 'Ошибка расписания',
        description: 'Ошибка',
      });
      callback(true);
      return undefined;
    }

    callback();
    return undefined;
  };

  render() {
    const {
      form,
      chosenWorker,
      corporations = [],
      businesses = [],
      workingSpaces = [],
      scheduleList,
      dayTranslate,
      readOnlyMode,
      isAddMode,
      isAdmin,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <Form
        colon={false}
        className={b()}
      >
        <Row gutter={33}>
          <Col
            lg={16}
            className={b('col')}
          >
            <Row gutter={31}>
              <Col lg={12}>
                <FormItem
                  className={b('col-inputFormItem')}
                  label="Фамилия"
                >
                  {
                    form.getFieldDecorator('lastName', {
                      initialValue: (chosenWorker && chosenWorker.user) ? chosenWorker.user.lastName : '',
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                        { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                      ],
                    })(
                      <Input
                        placeholder="Ввод..."
                        readOnly={!isAddMode || (isAddMode && chosenWorker && chosenWorker.user)}
                      />
                    )
                  }
                </FormItem>
                <FormItem
                  className={b('col-inputFormItem')}
                  label="Отчество"
                >
                  {
                    form.getFieldDecorator('middleName', {
                      initialValue: (chosenWorker && chosenWorker.user) ? chosenWorker.user.middleName : '',
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                        { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                      ],
                    })(
                      <Input
                        placeholder="Ввод..."
                        readOnly={!isAddMode || (isAddMode && chosenWorker && chosenWorker.user)}
                      />
                    )
                  }
                </FormItem>
                <FormItem
                  className={b('col-inputFormItem')}
                  label="Номер телефона"
                >
                  {
                    form.getFieldDecorator('phone', {
                      initialValue: (chosenWorker && chosenWorker.user && chosenWorker.user.phone)
                        ? chosenWorker.user.phone
                        : '',
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                        { pattern: new RegExp(/^[\d ]{5,13}$/), message: 'Номер введен неверно. Повторите попытку' },
                      ],
                    })(
                      <PhoneInput readOnly={!isAddMode || (isAddMode && chosenWorker && chosenWorker.user)} />
                    )
                  }
                </FormItem>
                <FormItem
                  className={b('col-inputFormItem')}
                  label="Должность"
                >
                  {
                    form.getFieldDecorator('position', {
                      initialValue: (chosenWorker && chosenWorker.position) ? chosenWorker.position : '',
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                        { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                      ],
                    })(
                      <Input
                        placeholder="Ввод..."
                        readOnly={readOnlyMode}
                      />
                    )
                  }
                </FormItem>
              </Col>
              <Col lg={12}>
                <FormItem
                  className={b('col-inputFormItem')}
                  label="Имя"
                >
                  {
                    form.getFieldDecorator('firstName', {
                      initialValue: (chosenWorker && chosenWorker.user) ? chosenWorker.user.firstName : '',
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                        { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                      ],
                    })(
                      <Input
                        placeholder="Ввод..."
                        readOnly={!isAddMode || (isAddMode && chosenWorker && chosenWorker.user)}
                      />
                    )
                  }
                </FormItem>
                <FormItem
                  style={{ display: 'none' }}
                  className={b('col-inputFormItem')}
                  label="Компания"
                >
                  {
                    form.getFieldDecorator('corporationId', {
                      initialValue: (chosenWorker && chosenWorker.corporationId)
                        || (corporations && corporations.length) ? corporations[0].id : undefined,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select
                        placeholder="Выбрать..."
                        onSelect={this.handleGetBusinessByCorporationId}
                        className={readOnlyMode ? 'readOnly' : ''}
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
                <FormItem
                  className={b('col-inputFormItem')}
                  label="Филиал компании"
                >
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
                        className={readOnlyMode ? 'readOnly' : ''}
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
                <FormItem
                  className={b('col-inputFormItem')}
                  label="Рабочее место сотрудника"
                >
                  {
                    form.getFieldDecorator('workingSpaceId', {
                      initialValue: this.getInitialWorkingSpaceValue(),
                    })(
                      <Select
                        placeholder="Выбрать..."
                        className={readOnlyMode ? 'readOnly' : ''}
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
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <div className={b('col-isAdminBlock')}>
                  <FormItem
                    className={b('col-isAdminBlock-formItem')}
                    label="Права администратора"
                  >
                    {
                      form.getFieldDecorator('isAdmin', {
                        initialValue: isAdmin,
                        valuePropName: 'checked',
                      })(
                        <Checkbox
                          disabled={readOnlyMode}
                        >
                          Предоставить сотруднику права администратора в этом филиале компании
                        </Checkbox>
                      )
                    }
                  </FormItem>
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            lg={8}
            className={b('col')}
          >
            <h1 className={b('col-header')}>Дни и часы работы</h1>
            {
              scheduleList.map(({
                dayOfWeek,
                isWork,
                from,
                to,
              }) => (
                <div
                  className={b('col-scheduleBlock')}
                  key={dayOfWeek}
                >
                  <FormItem className={b('col-scheduleBlock-formItem')}>
                    {
                      form.getFieldDecorator(`${dayOfWeek}-isWork`, {
                        initialValue: isWork,
                        valuePropName: 'checked',
                      })(
                        <Checkbox
                          className={b('col-scheduleBlock-formItem-checkbox')}
                          value={isWork}
                          disabled={readOnlyMode}
                        >
                          {phrases[`core.day.${dayTranslate[dayOfWeek]}`][defaultLanguage.isoKey]}
                        </Checkbox>
                      )
                    }
                  </FormItem>
                  <FormItem className={b('col-scheduleBlock-formItem')}>
                    {
                      form.getFieldDecorator(`${dayOfWeek}-workHours`, {
                        initialValue: { from, to },
                        // rules: [{ validator: this.checkHours }],
                      })(
                        <FromToInput
                          defaultLanguage={defaultLanguage}
                          phrases={phrases}
                          isWork={form.getFieldValue(`${dayOfWeek}-isWork`)}
                          readOnly={readOnlyMode}
                        />
                      )
                    }
                  </FormItem>
                </div>
              ))
            }
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({})(WorkerForm);
