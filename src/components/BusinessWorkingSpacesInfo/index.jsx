import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  Row,
  Col,
  Button,
  Icon,
  notification,
} from 'antd';

import { WorkingSpaceForm } from '../Forms';
import WorkingSpaceInfoReadOnly from '../WorkingSpaceInfoReadOnly';

import { asyncRequest, withToken } from '../../utils';
import { actions } from '../../state';

import './index.scss';

const b = bem('workingSpaceInfo');

class BusinessWorkingSpacesInfo extends Component {
  state = {
    readOnlyMode: !this.props.isAddMode,
  };

  handleToggleReadOnlyMode = bool => () => this.setState({ readOnlyMode: bool });

  handleUpdateWorkingSpace = async () => {
    await this.workingSpaceForm.props.form.validateFieldsAndScroll(
      async (errors, values) => {
        if (!errors) {
          const {
            chosenSpace,
            isAddMode,
            changeActiveWorkingSpace,
            singleBusiness,
            addWorkingSpace,
            updateWorkingSpace,
          } = this.props;
          const url = 'working-space';
          const method = isAddMode ? 'POST' : 'PUT';

          const data = {
            ...chosenSpace,
            ...values,
            businessId: singleBusiness.id,
            businessCategoryId: singleBusiness.businessCategoryId,
          };

          try {
            const newWorkingSpace = await withToken(asyncRequest)({
              url, body: data, method, moduleUrl: 'karma',
            });
            isAddMode ? await addWorkingSpace(newWorkingSpace) : await updateWorkingSpace(newWorkingSpace);
            changeActiveWorkingSpace(null, false)();
          } catch (err) {
            notification.error({
              duration: 5,
              message: err.message || 'Ошибка',
              description: 'Возникла ошибка',
            });
          }
        }
      },
    );
  };

  handleRemoveWorkingSpace = async () => {
    const { chosenSpace, changeActiveWorkingSpace, deleteWorkingSpace } = this.props;
    const url = `working-space/${chosenSpace.id}`;

    try {
      await withToken(asyncRequest)({ url, method: 'DELETE', moduleUrl: 'karma' });
      await deleteWorkingSpace(chosenSpace.id);
      changeActiveWorkingSpace(null, false)();
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  render() {
    const { chosenSpace, changeActiveWorkingSpace } = this.props;
    const { readOnlyMode } = this.state;

    return (
      <div className={b()}>
        {
          readOnlyMode ? (
            <WorkingSpaceInfoReadOnly
              chosenSpace={chosenSpace}
            />
          ) : (
            <WorkingSpaceForm
              chosenSpace={chosenSpace}
              wrappedComponentRef={form => this.workingSpaceForm = form}
            />
          )
        }
        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={8}>
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn backBtn')}
                  onClick={changeActiveWorkingSpace(null, false)}
                >
                  <Icon type="left" />
                  К списку рабочих мест
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn backBtn')}
                  onClick={chosenSpace
                    ? this.handleToggleReadOnlyMode(true)
                    : changeActiveWorkingSpace(null, false)}
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
                  className={b('controlBtns-btn deleteBtn')}
                  onClick={this.handleRemoveWorkingSpace}
                >
                  Удалить рабочее место
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn deleteBtn')}
                >
                  Інфо блок
                </Button>
              )
            }
          </Col>
          <Col lg={8}>
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn')}
                  type="primary"
                  onClick={this.handleToggleReadOnlyMode(false)}
                >
                  Редактировать рабочее место
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn')}
                  type="primary"
                  onClick={this.handleUpdateWorkingSpace}
                >
                  Сохранить
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
  addWorkingSpace: newWorkingSpace => dispatch(actions.business.$addWorkingSpace(newWorkingSpace)),
  updateWorkingSpace: updatedWorkingSpace => dispatch(actions.business.$updateWorkingSpace(updatedWorkingSpace)),
  deleteWorkingSpace: workingServiceId => dispatch(actions.business.$deleteWorkingSpace(workingServiceId)),
});

export default connect(null, mapDispatchToProps)(BusinessWorkingSpacesInfo);
