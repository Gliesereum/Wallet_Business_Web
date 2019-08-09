import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';

import {
  Row,
  Col,
  Button,
  Icon,
  notification,
} from 'antd';

import { WorkingSpaceForm } from '../Forms';
import DeleteModal from '../DeleteModal';
import WorkingSpaceInfoReadOnly from '../WorkingSpaceInfoReadOnly';

import { asyncRequest, withToken, fetchDecorator } from '../../utils';
import { fetchWorkersByCorporationId } from '../../fetches';
import { actions } from '../../state';

const b = bem('workingSpaceInfo');

const addWorkersToWorkingSpace = (addedWorkers, newWorkingSpace, removeFromOldWS) => {
  if (!addedWorkers.length) return newWorkingSpace;

  const newModifiedWorkingSpace = newWorkingSpace;
  const workerUrl = 'worker';

  for (let i = 0; i < addedWorkers.length; i += 1) {
    const modifyWorker = {
      ...addedWorkers[i],
      workingSpaceId: newModifiedWorkingSpace.id,
    };

    try {
      withToken(asyncRequest)({
        url: workerUrl, body: modifyWorker, method: 'PUT', moduleUrl: 'karma',
      });
      newModifiedWorkingSpace.workers.unshift(modifyWorker);
      removeFromOldWS({ movedWorker: addedWorkers[i] });
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  }

  return newModifiedWorkingSpace;
};

const removeWorkersFromWorkingSpace = (removedWorkers, newWorkingSpace) => {
  if (!removedWorkers.length) return newWorkingSpace;

  const newModifiedWorkingSpace = newWorkingSpace;
  const workerUrl = 'worker';

  for (let i = 0; i < removedWorkers.length; i += 1) {
    const modifyWorker = {
      ...removedWorkers[i],
      workingSpaceId: null,
    };

    try {
      withToken(asyncRequest)({
        url: workerUrl, body: modifyWorker, method: 'PUT', moduleUrl: 'karma',
      });
      newModifiedWorkingSpace.workers = newWorkingSpace.workers.filter(person => person.id !== modifyWorker.id);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  }

  return newModifiedWorkingSpace;
};

class BusinessWorkingSpacesInfo extends Component {
  state = {
    readOnlyMode: !this.props.isAddMode,
    deleteModalVisible: false,
  };

  handleToggleReadOnlyMode = bool => () => this.setState({ readOnlyMode: bool });

  handleUpdateWorkingSpace = async () => {
    await this.workingSpaceForm.props.form.validateFieldsAndScroll(
      async (errors, values) => {
        if (!errors) {
          const { addedWorkers, removedWorkers } = this.workingSpaceForm.state;
          const {
            chosenSpace,
            isAddMode,
            changeActiveWorkingSpace,
            singleBusiness,
            addWorkingSpace,
            updateWorkingSpace,
            removeFromOldWS,
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
            let newWorkingSpace = await withToken(asyncRequest)({
              url, body: data, method, moduleUrl: 'karma',
            });

            // if some of workers were being added
            newWorkingSpace = await addWorkersToWorkingSpace(addedWorkers, newWorkingSpace, removeFromOldWS);
            // if some of workers were being removed
            newWorkingSpace = await removeWorkersFromWorkingSpace(removedWorkers, newWorkingSpace);

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

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModalVisible: !prevState.deleteModalVisible,
    }));
  };

  render() {
    const {
      chosenSpace,
      workers,
      changeActiveWorkingSpace,
      toggleWorkerInfoDrawer,
    } = this.props;
    const { readOnlyMode, deleteModalVisible } = this.state;

    return (
      <div className={b()}>
        {
          readOnlyMode ? (
            <WorkingSpaceInfoReadOnly
              chosenSpace={chosenSpace}
              toggleWorkerInfoDrawer={toggleWorkerInfoDrawer}
            />
          ) : (
            <WorkingSpaceForm
              workers={workers}
              chosenSpace={chosenSpace}
              wrappedComponentRef={form => this.workingSpaceForm = form}
              toggleWorkerInfoDrawer={toggleWorkerInfoDrawer}
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
                  onClick={this.toggleDeleteModal}
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
          {
            deleteModalVisible && (
              <DeleteModal
                visible={deleteModalVisible}
                okText="Удалить"
                cancelText="Отменить"
                onOk={this.handleRemoveWorkingSpace}
                onCancel={this.toggleDeleteModal}
                deletedName={chosenSpace.name}
                deletedItem="рабочее место"
              />
            )
          }
        </Row>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addWorkingSpace: newWorkingSpace => dispatch(actions.business.$addWorkingSpace(newWorkingSpace)),
  updateWorkingSpace: updatedWorkingSpace => dispatch(actions.business.$updateWorkingSpace(updatedWorkingSpace)),
  removeFromOldWS: worker => dispatch(actions.business.$removeWorkerFromOldWS(worker)),
  deleteWorkingSpace: workingServiceId => dispatch(actions.business.$deleteWorkingSpace(workingServiceId)),
});

export default compose(
  connect(null, mapDispatchToProps),
  fetchDecorator({
    actions: [fetchWorkersByCorporationId],
    config: { loader: true },
  })
)(BusinessWorkingSpacesInfo);
