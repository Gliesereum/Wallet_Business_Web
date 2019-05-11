import React, {Component} from 'react';

import {Checkbox, List, TimePicker, Button, message} from 'antd';

import moment from 'moment';

import {asyncRequest, withToken} from '../../../utils';


const scheduleList = [
  {from: 1557554400000, to: 1557615600000, isWork: false, dayOfWeek: 'MONDAY'},
  {from: 1557554400000, to: 1557615600000, isWork: false, dayOfWeek: 'TUESDAY'},
  {from: 1557554400000, to: 1557615600000, isWork: false, dayOfWeek: 'WEDNESDAY'},
  {from: 1557554400000, to: 1557615600000, isWork: false, dayOfWeek: 'THURSDAY'},
  {from: 1557554400000, to: 1557615600000, isWork: false, dayOfWeek: 'FRIDAY'},
  {from: 1557554400000, to: 1557615600000, isWork: false, dayOfWeek: 'SATURDAY'},
  {from: 1557554400000, to: 1557615600000, isWork: false, dayOfWeek: 'SUNDAY'},
];

const dayTranslate = {
  'MONDAY': 'Понедельник',
  'TUESDAY': 'Вторник',
  'WEDNESDAY': 'Среда',
  'THURSDAY': 'Четверг',
  'FRIDAY': 'Пятница',
  'SATURDAY': 'Суббота',
  'SUNDAY': 'Воскресенье',
};

const mask = 'HH:mm';


class BusinessSchedule extends Component {

  state = {scheduleList: [], loading: false};

  componentDidMount() {
    this.initForm()
  }

  isNewSchedules = () => {
    return !this.state.scheduleList[0].id;
  };

  onSubmit = async () => {
    const method = this.isNewSchedules() ? 'POST' : 'PUT';
    const requests = this.state.scheduleList.map(day => this.createPromise('work-time', method, day))
    try {
      this.setState({loading: true});
      const newSchedules = await Promise.all(requests);
      this.setState({scheduleList: newSchedules});
      this.props.updateSchedule(newSchedules);
      message.success('Успешно сохранено')
    } catch (e) {
      console.log(e);
      message.error('Упс! Что-то пошло не так!')
    } finally {
      this.setState({loading: false});
    }

  };

  createPromise = (url, method, day) => {
    const {singleBusiness} = this.props;
    const body = {
      ...day,
      objectId: singleBusiness.id,
      businessCategoryId: singleBusiness.businessCategoryId
    };
    return withToken(asyncRequest)({url, body, method, moduleUrl: 'karma'});
  };

  initForm = () => {
    const {workTimes} = this.props.singleBusiness;
    const initDaysList = scheduleList.reduce((acc, day) => {
      const [initDay] = workTimes.filter(item => item.dayOfWeek === day.dayOfWeek);
      acc.push({...day, ...initDay});
      return acc
    }, []);
    this.setState({scheduleList: initDaysList})
  };

  isWorkToggle = (day) => () => {
    const {scheduleList} = this.state;
    const changedDayIndex = scheduleList.findIndex(item => item.dayOfWeek === day.dayOfWeek);
    const newDaysList = [
      ...scheduleList.slice(0, changedDayIndex),
      {...day, isWork: !day.isWork},
      ...scheduleList.slice(changedDayIndex + 1)
    ];
    this.setState({scheduleList: newDaysList})

  };

  timeHandler = (day, scheduleCase) => time => {
    const {scheduleList} = this.state;
    const changedDayIndex = scheduleList.findIndex(item => item.dayOfWeek === day.dayOfWeek);
    const newDaysList = [
      ...scheduleList.slice(0, changedDayIndex),
      {...day, [scheduleCase]: new Date(time._d).getTime()},
      ...scheduleList.slice(changedDayIndex + 1)
    ];
    this.setState({scheduleList: newDaysList})
  };

  renderItemDay = day => {
    const {isWork, from, to, dayOfWeek} = day;
    const fromTime = moment.utc(from);
    const toTime = moment.utc(to);
    return (
      <List.Item className="coupler-business-schedule-item-day">

        <div className="coupler-business-schedule-item-day-left">
          <Checkbox defaultChecked={isWork} onChange={this.isWorkToggle(day)}>
            {dayTranslate[dayOfWeek]}
          </Checkbox>
        </div>
        <div className="coupler-business-schedule-item-day-right">
          Начало:
          <TimePicker value={fromTime} format={mask} onChange={this.timeHandler(day, 'from')}/>
          Конец:
          <TimePicker value={toTime} format={mask} onChange={this.timeHandler(day, 'to')}/>
        </div>

      </List.Item>
    )
  };

  renderForm = () => {
    return (
      <div className="coupler-business-schedule-list">
        <List
          header={<div className={'coupler-business-schedule-list-header'}>Рассписание</div>}
          bordered
          dataSource={this.state.scheduleList}
          renderItem={this.renderItemDay}
        />
        <Button
          className={'schedule-submit-button'}
          type={'primary'}
          onClick={this.onSubmit}
          loading={this.state.loading}
          block
        >
          Сохранить
        </Button>
      </div>
    )

  };

  render() {
    return this.renderForm()
  }


}

export default BusinessSchedule;
