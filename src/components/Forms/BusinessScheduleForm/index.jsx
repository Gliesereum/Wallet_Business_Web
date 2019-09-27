import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Checkbox,
  Form,
  notification,
} from 'antd';

import FromToInput from '../../FromToInput';

const b = bem('businessScheduleForm');
const { Item: FormItem } = Form;

class BusinessScheduleForm extends Component {
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
      dayTranslate,
      scheduleList,
      readOnlyMode,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <div className={b()}>
        <Form
          colon={false}
          layout="horizontal"
        >
          {scheduleList.map(({
            dayOfWeek,
            isWork,
            from,
            to,
          }) => (
            <div
              className={b('dayForm')}
              key={dayOfWeek}
            >
              <FormItem
                className={b('dayForm-formItem', { isWorkItem: true })}
              >
                {form.getFieldDecorator(`${dayOfWeek}-isWork`, {
                  initialValue: isWork,
                  valuePropName: 'checked',
                })(
                  <Checkbox
                    value={isWork}
                    disabled={readOnlyMode}
                  >
                    {phrases[`core.day.${dayTranslate[dayOfWeek]}`][defaultLanguage.isoKey]}
                  </Checkbox>
                )}
              </FormItem>
              <FormItem className={b('dayForm-formItem', { timeItem: true })}>
                {form.getFieldDecorator(`${dayOfWeek}-workHours`, {
                  initialValue: { from, to },
                  // rules: [{ validator: this.checkHours }],
                })(
                  <FromToInput
                    defaultLanguage={defaultLanguage}
                    phrases={phrases}
                    isWork={form.getFieldValue(`${dayOfWeek}-isWork`)}
                    readOnly={readOnlyMode}
                    screen="business_schedule"
                  />
                )}
              </FormItem>
            </div>
          ))}
        </Form>
      </div>
    );
  }
}

export default Form.create({})(BusinessScheduleForm);
