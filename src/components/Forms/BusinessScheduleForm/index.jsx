import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Input,
  Checkbox,
  List,
  Button,
  notification,
  Row,
  Col,
  Icon,
} from 'antd';

import moment from 'moment/moment';

import { asyncRequest, withToken } from '../../../utils';

import './index.scss';

const b = bem('businessScheduleForm');

const scheduleList = [
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'MONDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'TUESDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'WEDNESDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'THURSDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'FRIDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'SATURDAY',
  },
  {
    from: 1557554400000,
    to: 1557615600000,
    isWork: false,
    dayOfWeek: 'SUNDAY',
  },
];

const dayTranslate = {
  MONDAY: 'Понедельник',
  TUESDAY: 'Вторник',
  WEDNESDAY: 'Среда',
  THURSDAY: 'Четверг',
  FRIDAY: 'Пятница',
  SATURDAY: 'Суббота',
  SUNDAY: 'Воскресенье',
};
const mask = 'HH:mm';

class BusinessScheduleForm extends Component {
  state = { scheduleList: [] };

  componentDidMount() {
    this.initForm();
  }

  isNewSchedules = () => !this.state.scheduleList[0].id;

  onSubmit = async () => {
    const method = this.isNewSchedules() ? 'POST' : 'PUT';
    const requests = this.state.scheduleList.map(day => this.createPromise('work-time', method, day));
    try {
      const newSchedules = await Promise.all(requests);
      this.setState({ scheduleList: newSchedules });
      this.props.updateSchedule(newSchedules);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  createPromise = (url, method, day) => {
    const { singleBusiness } = this.props;
    const body = {
      ...day,
      objectId: singleBusiness.id,
      businessCategoryId: singleBusiness.businessCategoryId,
    };
    return withToken(asyncRequest)({
      url, body, method, moduleUrl: 'karma',
    });
  };

  initForm = () => {
    const { workTimes } = this.props.singleBusiness || [];
    const initDaysList = scheduleList.reduce((acc, day) => {
      const [initDay] = workTimes.filter(item => item.dayOfWeek === day.dayOfWeek);
      acc.push({ ...day, ...initDay });
      return acc;
    }, []);
    this.setState({ scheduleList: initDaysList });
  };

  isWorkToggle = day => () => {
    const { scheduleList: scheduleListFromState } = this.state;
    const changedDayIndex = scheduleListFromState.findIndex(item => item.dayOfWeek === day.dayOfWeek);
    const newDaysList = [
      ...scheduleListFromState.slice(0, changedDayIndex),
      { ...day, isWork: !day.isWork },
      ...scheduleListFromState.slice(changedDayIndex + 1),
    ];
    this.setState({ scheduleList: newDaysList });
  };

  timeHandler = (day, scheduleCase) => (time) => {
    const { scheduleList: scheduleListFromState } = this.state;
    const changedDayIndex = scheduleListFromState.findIndex(item => item.dayOfWeek === day.dayOfWeek);
    const newDaysList = [
      ...scheduleListFromState.slice(0, changedDayIndex),
      { ...day, [scheduleCase]: new Date(time._d).getTime() },
      ...scheduleListFromState.slice(changedDayIndex + 1),
    ];
    this.setState({ scheduleList: newDaysList });
  };

  renderItemDay = (day) => {
    const {
      isWork, from, to, dayOfWeek,
    } = day;
    const fromTime = moment.utc(from).format(mask);
    const toTime = moment.utc(to).format(mask);
    return (
      <List.Item className={b('listItem')}>
        <Checkbox defaultChecked={isWork} onChange={this.isWorkToggle(day)}>
          {dayTranslate[dayOfWeek]}
        </Checkbox>
        <div className={b('listItem-inputGroup')}>
          <Input value={fromTime} onChange={this.timeHandler(day, 'from')} />
          <Input value={toTime} onChange={this.timeHandler(day, 'to')} />
        </div>
      </List.Item>
    );
  };

  handleChangeActiveTab = toTab => () => this.props.changeActiveTab(toTab);

  render() {
    return (
      <div className={b()}>
        <List
          grid={{
            column: 2,
            gutter: 65,
          }}
          dataSource={this.state.scheduleList}
          renderItem={this.renderItemDay}
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
              Назад
            </Button>
          </Col>
          <Col lg={12}>
            <Button
              className={b('controlBtns-btn')}
              onClick={this.onSubmit}
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

export default BusinessScheduleForm;
