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

import { scheduleListDefault, dayTranslate } from '../../mocks';

const b = bem('businessScheduleInfo');

class BusinessScheduleInfo extends PureComponent {
  state = {
    scheduleList: [],
    readOnlyMode: !this.props.isAddBusinessMode,
  };

  componentDidMount() {
    this.initForm();
  }

  initForm = () => {
    const { workTimes } = this.props.chosenBusiness || { workTimes: [] };
    const initDaysList = scheduleListDefault.reduce((acc, day) => {
      const [initDay] = workTimes.filter(item => item.dayOfWeek === day.dayOfWeek);
      acc.push({ ...day, ...initDay });
      return acc;
    }, []);
    this.setState({ scheduleList: initDaysList });
  };

  handleToggleReadOnlyMode = bool => () => this.setState({ readOnlyMode: bool });

  handleCancel = () => {
    this.handleToggleReadOnlyMode(true)();
    this.scheduleForm.props.form.resetFields();
  };

  handleSaveSchedule = async () => {
    const { chosenBusiness, updateSchedule } = this.props;
    const isNewScheduleList = !this.state.scheduleList[0].id;
    this.scheduleForm.props.form.validateFields(async (error, values) => {
      if (!error) {
        const body = [];

        if (!isNewScheduleList) {
          chosenBusiness.workTimes.forEach((item) => {
            body.push({
              ...item,
              from: values[`${item.dayOfWeek}-workHours`].from,
              to: values[`${item.dayOfWeek}-workHours`].to,
              isWork: values[`${item.dayOfWeek}-isWork`],
              type: 'BUSINESS',
            });
          });
        } else {
          for (const day in dayTranslate) {
            body.push({
              dayOfWeek: day,
              from: values[`${day}-workHours`].from,
              to: values[`${day}-workHours`].to,
              isWork: values[`${day}-isWork`],
              objectId: chosenBusiness.id,
              businessCategoryId: chosenBusiness.businessCategoryId,
              type: 'BUSINESS',
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
          this.handleToggleReadOnlyMode(true)();
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.code === 1436 ? 'Бизнес уже работает по этому расписанию' : err.message,
            description: 'Ошибка',
          });
        }
      }
    });
  };

  handleChangeActiveTab = toTab => () => this.props.changeActiveTab(toTab);

  render() {
    const { scheduleList, readOnlyMode } = this.state;
    const {
      isAddBusinessMode,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <div className={b()}>
        <BusinessScheduleForm
          wrappedComponentRef={form => this.scheduleForm = form}
          dayTranslate={dayTranslate}
          scheduleList={scheduleList}
          readOnlyMode={readOnlyMode}
          defaultLanguage={defaultLanguage}
          phrases={phrases}
        />

        <Row
          gutter={40}
          className={b('controlBtns')}
          type="flex"
        >
          <Col
            xs={{ span: 24, order: 2 }}
            sm={{ span: 24, order: 2 }}
            md={{ span: 12, order: 1 }}
          >
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn backBtn')}
                  onClick={this.handleChangeActiveTab('mainInfo')}
                >
                  <Icon type="left" />
                  {phrases['core.button.back'][defaultLanguage.isoKey]}
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn backBtn')}
                  onClick={isAddBusinessMode
                    ? this.handleChangeActiveTab('mainInfo')
                    : this.handleCancel}
                >
                  {phrases['core.button.cancel'][defaultLanguage.isoKey]}
                </Button>
              )
            }
          </Col>
          <Col
            xs={{ span: 24, order: 1 }}
            sm={{ span: 24, order: 1 }}
            md={{ span: 12, order: 2 }}
          >
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn')}
                  onClick={this.handleToggleReadOnlyMode(false)}
                  type="primary"
                >
                  {phrases['core.button.edit'][defaultLanguage.isoKey]}
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn')}
                  onClick={this.handleSaveSchedule}
                  type="primary"
                >
                  {phrases['core.button.save'][defaultLanguage.isoKey]}
                </Button>
              )
            }
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
