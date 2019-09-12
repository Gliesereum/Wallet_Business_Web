import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Table,
  Icon,
  Row,
  Col,
  Button,
  Input,
  Select,
  notification,
} from 'antd';

import EmptyState from '../EmptyState';
import ScreenLoading from '../ScreenLoading';

import { getDate } from '../../utils';
import { fetchAction } from '../../fetches';
import { recordTranslate } from '../../mocks';

const b = bem('ordersList');
const { Option } = Select;

const statusesArray = (() => {
  const array = [];

  for (const key in recordTranslate.statusProcess) {
    if (Object.prototype.hasOwnProperty.call(recordTranslate.statusProcess, key)) {
      if (key === 'STARTED' || key === 'EXPIRED' || key === 'WAITING') continue;
      array.push({
        value: key,
        textValue: recordTranslate.statusProcess[key],
      });
    }
  }

  return array;
})();

class OrdersList extends Component {
  state = {
    expandedRowKeys: [], // for Icon type regulation
    editedOrderId: null,
    editedCanceledDescription: null,
    editedStatusProcess: null,
  };

  toggleStatusEditMode = (
    id = null,
    editedCanceledDescription = null,
    editedStatusProcess = null,
  ) => () => this.setState({
    editedOrderId: id,
    editedCanceledDescription,
    editedStatusProcess,
  });

  statusChange = editedStatusProcess => this.setState(prevState => ({
    editedStatusProcess,
    editedCanceledDescription: editedStatusProcess === 'CANCELED' ? prevState.editedCanceledDescription : null,
  }));

  descriptionChange = e => this.setState({ editedCanceledDescription: e.target.value });

  saveStatus = order => async () => {
    const {
      editedStatusProcess,
      editedCanceledDescription,
      editedOrderId,
    } = this.state;
    const { updateOrderStatus } = this.props;

    try {
      if (editedCanceledDescription) {
        const updatedOrder = {
          ...order,
          statusProcess: editedStatusProcess,
          canceledDescription: editedCanceledDescription,
        };
        await fetchAction({
          url: `record/canceled-record?idRecord=${editedOrderId}&message=${editedCanceledDescription}`,
          fieldName: 'newOrder',
          fieldType: {},
          method: 'PUT',
          reduxAction: updateOrderStatus(updatedOrder),
        })();
      } else {
        const updatedOrder = {
          ...order,
          statusProcess: editedStatusProcess,
          canceledDescription: null,
        };

        await fetchAction({
          url: `record/update-status-process?idRecord=${editedOrderId}&status=${editedStatusProcess}`,
          fieldName: 'newOrder',
          fieldType: {},
          method: 'PUT',
          reduxAction: updateOrderStatus(updatedOrder),
        })();
      }
      this.toggleStatusEditMode()();
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    }
  };

  handleExpandRow = worker => ({
    onClick: () => this.setState((prevState) => {
      let newExpandedRowKeys = prevState.expandedRowKeys;

      if (prevState.expandedRowKeys.includes(worker.id)) {
        newExpandedRowKeys = newExpandedRowKeys.filter(key => key !== worker.id);
      } else {
        newExpandedRowKeys.push(worker.id);
      }

      return {
        expandedRowKeys: newExpandedRowKeys,
      };
    }),
  });

  renderExpandedRow = (record) => {
    const isPackageExist = !!record.packageDto;
    const { statusPay: statusPayLocalize } = recordTranslate;
    const { editedOrderId, editedCanceledDescription, editedStatusProcess } = this.state;

    return (
      <Row className={b('expandTable')}>
        <Col lg={8}>
          {
            isPackageExist && (
              <>
                <div className={b('expandTable-infoBox')}>
                  <div className="title">Пакет услуг:</div>
                  <div className="data">{record.packageDto.name}</div>
                </div>
                <div className={b('expandTable-infoBox')}>
                  <div className="title">Список услуг, которые входят в пакет:</div>
                  <ul className="data listMode">
                    {
                      record.packageDto.services.map(packageService => (
                        <li key={packageService.id}>{packageService.name}</li>
                      ))
                    }
                  </ul>
                </div>
              </>
            )
          }
          {
            (record.services && record.services.length > 0) && (
              <div className={b('expandTable-infoBox')}>
                <div className="title">{isPackageExist ? 'Дополнительные услуги' : 'Список услуг:'}</div>
                <ul className="data listMode">
                  {
                    record.services.map(service => <li key={service.id}>{service.name}</li>)
                  }
                </ul>
              </div>
            )
          }
        </Col>
        <Col lg={8}>
          <div className={b('expandTable-infoBox')}>
            <div className="title">Филиал компании:</div>
            <div className="data">{record.business.name}</div>
          </div>
          <div className={b('expandTable-infoBox')}>
            <div className="title">Статус платежа:</div>
            <div className="data">{statusPayLocalize[record.statusPay]}</div>
          </div>
          <div className={b('expandTable-infoBox')}>
            <div className="title">Сумма платежа:</div>
            <div className="data">{`${record.price} грн`}</div>
          </div>
        </Col>
        <Col lg={8}>
          {
            (editedOrderId === record.id) ? (
              <>
                <div className={b('expandTable-editBox')}>
                  {
                    record.statusProcess === 'CANCELED' ? (
                      <div className={b('expandTable-infoBox')}>
                        <div className="title">Статус заказа:</div>
                        <div className="data">{recordTranslate.statusProcess[record.statusProcess]}</div>
                      </div>
                    ) : (
                      <Select
                        onChange={this.statusChange}
                        defaultValue={editedStatusProcess}
                      >
                        {
                          statusesArray.map(({ value, textValue }) => (
                            <Option
                              key={value}
                              value={value}
                              disabled={record.statusProcess === 'EXPIRED' && value === 'IN_PROCESS'}
                            >
                              {textValue}
                            </Option>
                          ))
                        }
                      </Select>
                    )
                  }
                </div>
                {
                  ((record.canceledDescription && !editedStatusProcess === 'CANCELED') || editedStatusProcess === 'CANCELED') && (
                    <div className={b('expandTable-editBox')}>
                      <Input
                        onChange={this.descriptionChange}
                        value={editedCanceledDescription}
                      />
                    </div>
                  )
                }
                <Button
                  className={b('expandTable-editBox')}
                  type="primary"
                  onClick={this.saveStatus(record)}
                >
                  Сохранить
                </Button>
                <Button
                  className={b('expandTable-editBox backBtn')}
                  onClick={this.toggleStatusEditMode()}
                >
                  Отмена
                </Button>
              </>
            ) : (
              <>
                <div className={b('expandTable-infoBox')}>
                  <div className="title">Статус заказа:</div>
                  <div className="data">{recordTranslate.statusProcess[record.statusProcess]}</div>
                </div>
                {
                  record.canceledDescription && (
                    <div className={b('expandTable-infoBox')}>
                      <div className="title">Причина отмены:</div>
                      <div className="data">{record.canceledDescription}</div>
                    </div>
                  )
                }
                <Button
                  className={b('expandTable-editBtn')}
                  type="primary"
                  disabled={record.statusProcess === 'STARTED' && record.statusProcess !== 'COMPLETED'}
                  onClick={this.toggleStatusEditMode(
                    record.id,
                    record.canceledDescription,
                    record.statusProcess
                  )}
                >
                  Редактировать
                </Button>
              </>
            )
          }
        </Col>
      </Row>
    );
  };

  render() {
    const {
      orders,
      loader,
      pagination,
      paginationChange,
    } = this.props;
    const {
      expandedRowKeys,
    } = this.state;
    const isOrdersExist = orders && orders.length;

    const columns = [
      {
        key: 'orderNumber',
        title: 'Заказ',
        render: (text, { recordNumber }) => <span>{recordNumber}</span>,
        width: 70,
      },
      {
        key: 'businessName',
        title: 'Бизнес',
        render: (text, { business }) => <span>{business.name}</span>,
        width: 240,
      },
      {
        key: 'date',
        title: 'Дата',
        render: (text, { begin }) => <span>{getDate(begin)}</span>,
        width: 100,
      },
      {
        key: 'time',
        title: 'Время',
        render: (text, { begin }) => <span>{getDate(begin, true)}</span>,
        width: 70,
      },
      {
        key: 'status',
        className: 'status-column',
        title: 'Статус',
        render: (text, { statusProcess }) => (
          <div>
            {recordTranslate.statusIcon[statusProcess]()}
          </div>
        ),
        width: 70,
      },
      {
        key: 'client',
        title: 'Клиент',
        render: (text, { client }) => <span>{client ? `${client.firstName} ${client.middleName}` : ''}</span>,
      },
      {
        key: 'price',
        title: 'Сумма',
        render: (text, { price }) => <span>{`${price} грн`}</span>,
        width: 150,
      },
      {
        title: '',
        align: 'right',
        width: 50,
        render: record => <Icon type={expandedRowKeys.includes(record.id) ? 'up' : 'down'} />,
      },
    ];

    return (
      <div className={b()}>
        {
          isOrdersExist ? (
            <div className={b('content')}>
              {
                loader ? (
                  <ScreenLoading />
                ) : (
                  <Table
                    rowKey={record => record.id}
                    className={b('content-table', { isEmpty: !isOrdersExist })}
                    columns={columns}
                    dataSource={orders}
                    pagination={pagination.totalPages > 1
                      ? {
                        total: pagination.totalElements,
                        current: pagination.number,
                        pageSize: 7,
                        className: b('content-table-pagination'),
                      }
                      : false
                    }
                    expandIconAsCell={false} // need for hidden default expand icon
                    expandRowByClick
                    expandedRowRender={record => this.renderExpandedRow(record)}
                    onRow={this.handleExpandRow}
                    onChange={paginationChange}
                    scroll={{ y: 336, x: 900 }}
                  />
                )
              }
            </div>
          ) : (
            <EmptyState
              title="У вас пока нет заказов"
              descrText="Здесь будут появляться заказы, сделанные вашими клиентами через Coupler и Coupler Widget"
              withoutBtn
            />
          )
        }
      </div>
    );
  }
}

export default OrdersList;
