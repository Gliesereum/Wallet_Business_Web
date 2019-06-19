import React, { PureComponent } from 'react';
import bem from 'bem-join';
import { connect } from 'react-redux';

import {
  Button,
  Col,
  Icon,
  Row,
  notification,
} from 'antd';

import { BusinessScheduleForm } from '../Forms';

import { asyncRequest, withToken } from '../../utils';

import { actions } from '../../state';

import { scheduleListDefault, dayTranslate } from './scheduleConfig';
import './index.scss';

const b = bem('businessScheduleInfo');

class BusinessScheduleInfo extends PureComponent {
  state = {
    scheduleList: [],
  };

  componentDidMount() {
    this.initForm();
  }

  initForm = () => {
    const { workTimes } = this.props.singleBusiness || [];
    const initDaysList = scheduleListDefault.reduce((acc, day) => {
      const [initDay] = workTimes.filter(item => item.dayOfWeek === day.dayOfWeek);
      acc.push({ ...day, ...initDay });
      return acc;
    }, []);
    this.setState({ scheduleList: initDaysList });
  };

  handleSubmitForm = async () => {
    const { singleBusiness, updateSchedule } = this.props;
    const isNewScheduleList = !this.state.scheduleList[0].id;
    this.scheduleForm.props.form.validateFields(async (error, values) => {
      if (!error) {
        const body = [];

        if (!isNewScheduleList) {
          singleBusiness.workTimes.forEach((item) => {
            body.push({
              ...item,
              from: values[`${item.dayOfWeek}-workHours`].from,
              to: values[`${item.dayOfWeek}-workHours`].to,
              isWork: values[`${item.dayOfWeek}-isWork`],
            });
          });
        } else {
          for (const day in dayTranslate) {
            body.push({
              dayOfWeek: day,
              from: values[`${day}-workHours`].from,
              to: values[`${day}-workHours`].to,
              isWork: values[`${day}-isWork`],
              objectId: singleBusiness.id,
              businessCategoryId: singleBusiness.businessCategoryId,
            });
          }
        }

        const url = 'work-time/list';
        const method = isNewScheduleList ? 'POST' : 'PUT';

        try {
          const newSchedules = await withToken(asyncRequest)({
            url, body, method, moduleUrl: 'karma',
          });
          await updateSchedule(newSchedules);
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.message || 'Ошибка',
            description: 'Возникла ошибка',
          });
        }
      }
    });
  };

  handleChangeActiveTab = toTab => () => this.props.changeActiveTab(toTab);

  render() {
    const { scheduleList } = this.state;

    return (
      <div className={b()}>
        <h1 className={b('header')}>Дни недели и рабочее время</h1>
        <BusinessScheduleForm
          wrappedComponentRef={form => this.scheduleForm = form}
          dayTranslate={dayTranslate}
          scheduleList={scheduleList}
        />

        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={12}>
            <Button
              className={b('controlBtns-btn backBtn')}
              onClick={this.handleChangeActiveTab('packages')}
            >
              <Icon type="left" />
              Назад к пакетам услуг
            </Button>
          </Col>
          <Col lg={12}>
            <Button
              className={b('controlBtns-btn')}
              onClick={this.handleSubmitForm}
              type="primary"
            >
              Сохранить
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateSchedule: newSchedules => dispatch(actions.business.$updateSchedule(newSchedules)),
});

export default connect(null, mapDispatchToProps)(BusinessScheduleInfo);
