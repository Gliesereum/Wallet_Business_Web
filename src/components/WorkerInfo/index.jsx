import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Icon,
  Button,
  notification,
  Input,
} from 'antd';

import { WorkerForm } from '../Forms';
import DeleteModal from '../DeleteModal';

import { asyncRequest, withToken } from '../../utils';
import { scheduleListDefault, dayTranslate } from '../../mocks';

const b = bem('workerInfo');

class WorkerInfo extends Component {
  state = {
    readOnlyMode: !this.props.isAddMode,
    businesses: [],
    workingSpaces: [],
    workTimes: [],
    scheduleList: [],
    foundUser: null,
    deleteModalVisible: false,
    isAdmin: (this.props.chosenWorker && this.props.admins.length)
      ? this.props.admins.some(admin => admin.userId === this.props.chosenWorker.userId)
      : false,
  };

  async componentDidMount() {
    const { corporations = [], chosenWorker } = this.props;
    await this.initScheduleList();
    if (chosenWorker) {
      await this.handleGetBusinessByCorporationId(chosenWorker.corporationId);
      await this.handleGetWorkingSpacesByBusinessId(chosenWorker.businessId);
    } else if (corporations.length) {
      await this.handleGetBusinessByCorporationId(corporations[0].id);
    }
  }

  initScheduleList = (workingTime = { workTimes: [] }) => {
    const { workTimes } = (!this.state.foundUser && this.props.chosenWorker) || workingTime;
    const initDaysList = scheduleListDefault.reduce((acc, day) => {
      const [initDay] = workTimes.filter(item => item.dayOfWeek === day.dayOfWeek);
      acc.push({ ...day, ...initDay });
      return acc;
    }, []);
    this.setState({ scheduleList: initDaysList });
  };

  handleToggleReadOnlyMode = bool => () => this.setState({ readOnlyMode: bool });

  handleGetBusinessByCorporationId = async (corporationId) => {
    const { chosenWorker, getBusinessByCorporationId } = this.props;

    const businesses = await getBusinessByCorporationId(corporationId);
    this.setState({ businesses });
    chosenWorker && !this.state.foundUser && await this.handleGetWorkingSpacesByBusinessId(chosenWorker.businessId);
  };

  handleGetWorkingSpacesByBusinessId = (businessId) => {
    const { businesses } = this.state;
    const [business] = businesses.filter(item => item.id === businessId);
    this.initScheduleList({ workTimes: business.workTimes });
    this.setState({
      workingSpaces: business ? business.spaces : [],
    });
  };

  handleUpdateWorker = async () => {
    await this.workerForm.props.form.validateFields(
      async (error, {
        corporationId,
        businessId,
        workingSpaceId,
        position,
        firstName,
        lastName,
        middleName,
        phone,
        isAdmin,
        ...workTimesData
      }) => {
        if (!error) {
          const {
            isAddMode,
            chosenWorker,
            changeActiveWorker,
          } = this.props;
          const { scheduleList, foundUser, businesses } = this.state;

          const isWorkTimesExist = scheduleList[0].id;
          const workTimes = [];
          const [business] = businesses.filter(item => item.id === businessId);
          if (isWorkTimesExist && chosenWorker && !foundUser) {
            chosenWorker.workTimes.forEach((item) => {
              workTimes.push({
                ...item,
                from: workTimesData[`${item.dayOfWeek}-workHours`].from,
                to: workTimesData[`${item.dayOfWeek}-workHours`].to,
                isWork: workTimesData[`${item.dayOfWeek}-isWork`],
                objectId: chosenWorker.id,
                businessCategoryId: business.businessCategoryId,
              });
            });
          } else {
            for (const day in dayTranslate) {
              workTimes.push({
                dayOfWeek: day,
                from: workTimesData[`${day}-workHours`].from,
                to: workTimesData[`${day}-workHours`].to,
                isWork: workTimesData[`${day}-isWork`],
                businessCategoryId: business.businessCategoryId,
              });
            }
          }

          const method = isAddMode ? 'POST' : 'PUT';
          let url = 'worker';
          const body = {
            ...chosenWorker,
            corporationId,
            businessId,
            position,
            workingSpaceId: workingSpaceId || null,
            user: {
              ...(chosenWorker ? chosenWorker.user : {}),
              firstName,
              lastName,
              middleName,
              phone,
            },
            workTimes,
          };

          // check if worker is exist as user before adding
          if (isAddMode) {
            let isUserExist = false;
            try {
              const user = await withToken(asyncRequest)({ url: `user/by-phone?phone=${phone}` });
              isUserExist = !!(user && user.id);
              url = isUserExist ? 'worker' : 'worker/create-with-user';
              if (isUserExist) body.userId = user.id;
            } catch (err) {
              notification.error({
                duration: 5,
                message: err.message || 'Ошибка',
                description: 'Ошибка',
              });
            }
          }

          try {
            const newWorker = await withToken(asyncRequest)({
              url, body, method, moduleUrl: 'karma',
            });

            if (this.state.isAdmin !== isAdmin) {
              await withToken(asyncRequest)({
                url: `business-administrator?businessId=${businessId}&userId=${newWorker.userId}`,
                method: isAdmin ? 'POST' : 'DELETE',
                moduleUrl: 'karma',
              });

              this.setState({ isAdmin });
            }

            changeActiveWorker(null, false)();
          } catch (err) {
            notification.error({
              duration: 5,
              message: err.message || 'Ошибка',
              description: 'Ошибка',
            });
          }
        }
      }
    );
  };

  handleRemoveWorker = async () => {
    const { chosenWorker, changeActiveWorker } = this.props;
    const url = `worker/${chosenWorker.id}`;

    try {
      await withToken(asyncRequest)({ url, method: 'DELETE', moduleUrl: 'karma' });
      changeActiveWorker(null, false)();
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    }
  };

  handleSearchUserByNumber = async (e) => {
    const { value } = e.target;
    const searchedPhone = value.replace(/[()\s+]/g, '');

    if (searchedPhone.length !== 12) {
      this.props.changeActiveWorker(null, true)();
      return;
    }

    const user = await withToken(asyncRequest)({ url: `user/by-phone?phone=${searchedPhone}` }) || null;
    this.setState({ foundUser: user });
    if (!user) this.props.changeActiveWorker(null, true)();
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModalVisible: !prevState.deleteModalVisible,
    }));
  };

  renderHeader = () => {
    const { isAddMode, changeActiveWorker } = this.props;
    const { readOnlyMode, foundUser } = this.state;

    if (readOnlyMode) {
      return (
        <div className={b('header')}>
          <p className={b('header-title')}>Просмотр профиля сотрудника</p>
        </div>
      );
    } if (isAddMode) {
      return (
        <div className={b('header', { isAddMode })}>
          <p className={b('header-title')}>Создание профайла сотрудника</p>
          <div className={b('header-searchBlock')}>
            <span className={b('header-searchBlock-text')}>Поиск по номеру</span>
            <Input
              className={b('header-searchBlock-searchInput')}
              placeholder="+380507595188"
              onChange={this.handleSearchUserByNumber}
            />
            <Button
              type="primary"
              disabled={!foundUser}
              className={b('header-searchBlock-searchResultBlock')}
              onClick={changeActiveWorker({ user: foundUser }, true)}
            >
              {
                foundUser
                  ? `${foundUser.phone} | ${foundUser.lastName} ${foundUser.firstName} ${foundUser.middleName}`
                  : 'Результат поиска...'
              }
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className={b('header')}>
        <p className={b('header-title')}>Редактирование профиля сотрудника</p>
      </div>
    );
  };

  render() {
    const {
      isAddMode,
      chosenWorker,
      corporations,
      changeActiveWorker,
    } = this.props;
    const {
      readOnlyMode,
      businesses,
      workingSpaces,
      scheduleList,
      deleteModalVisible,
      isAdmin,
      foundUser,
      workTimes,
    } = this.state;

    return (
      <div className={b()}>
        {this.renderHeader()}
        <div className={b('content')}>
          <WorkerForm
            wrappedComponentRef={form => this.workerForm = form}
            corporations={corporations}
            businesses={businesses}
            workingSpaces={workingSpaces}
            workTimes={workTimes}
            scheduleList={scheduleList}
            dayTranslate={dayTranslate}
            chosenWorker={chosenWorker}
            readOnlyMode={readOnlyMode}
            isAddMode={isAddMode}
            isAdmin={isAdmin}
            getBusinessByCorporationId={this.handleGetBusinessByCorporationId}
            getWorkingSpacesByBusinessId={this.handleGetWorkingSpacesByBusinessId}
            onCorpChange={this.handleCorpChange}
          />
          <Row
            gutter={40}
            className={b('content-controlBtns')}
          >
            <Col lg={8}>
              {
                readOnlyMode ? (
                  <Button
                    className={b('content-controlBtns-btn backBtn')}
                    onClick={changeActiveWorker(null, false)}
                  >
                    <Icon type="left" />
                    К списку сотрудников
                  </Button>
                ) : (
                  <Button
                    className={b('content-controlBtns-btn backBtn')}
                    onClick={(chosenWorker && !foundUser)
                      ? this.handleToggleReadOnlyMode(true)
                      : changeActiveWorker(null, false)
                    }
                  >
                    <Icon type="left" />
                    Отмена
                  </Button>
                )
              }
            </Col>
            <Col lg={8}>
              {
                readOnlyMode ? (
                  <Button
                    className={b('content-controlBtns-btn deleteBtn')}
                    onClick={this.toggleDeleteModal}
                  >
                    Удалить сотрудника
                  </Button>
                ) : (
                  <div />
                )
              }
            </Col>
            <Col lg={8}>
              {
                readOnlyMode ? (
                  <Button
                    className={b('content-controlBtns-btn')}
                    type="primary"
                    onClick={this.handleToggleReadOnlyMode(false)}
                  >
                    Редактировать сотрудника
                  </Button>
                ) : (
                  <Button
                    className={b('content-controlBtns-btn')}
                    type="primary"
                    onClick={this.handleUpdateWorker}
                  >
                    Сохранить
                  </Button>
                )
              }
              {
                deleteModalVisible && (
                  <DeleteModal
                    visible={deleteModalVisible}
                    okText="Удалить"
                    cancelText="Отменить"
                    onOk={this.handleRemoveWorker}
                    onCancel={this.toggleDeleteModal}
                    deletedName={`${chosenWorker.user.lastName} ${chosenWorker.user.firstName} ${chosenWorker.user.middleName}`}
                    deletedItem="работника"
                  />
                )
              }
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default WorkerInfo;
