import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Table,
  Icon,
  Row,
  Col,
  Button,
} from 'antd';

import EmptyState from '../EmptyState';
import ScreenLoading from '../ScreenLoading';

import { getDate } from '../../utils';
import { recordTranslate } from '../../mocks';

const b = bem('ordersList');

class OrdersList extends Component {
  state = {
    expandedRowKeys: [], // for Icon type regulation
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

  renderExpandedRow = ({
    packageDto,
    services,
    business,
    statusPay,
    price,
    statusProcess,
    canceledDescription,
  }) => {
    const isPackageExist = !!packageDto;
    const { statusPay: statusPayLocalize } = recordTranslate;

    return (
      <Row
        className={b('expandTable')}
        gutter={56}
      >
        <Col lg={8}>
          {
            isPackageExist && (
              <>
                <div className={b('expandTable-infoBox')}>
                  <div className="title">Пакет услуг:</div>
                  <div className="data">{packageDto.name}</div>
                </div>
                <div className={b('expandTable-infoBox')}>
                  <div className="title">Список услуг, которые входят в пакет:</div>
                  <ul className="data listMode">
                    {
                      packageDto.services.map(packageService => <li key={packageService.id}>{packageService.name}</li>)
                    }
                  </ul>
                </div>
              </>
            )
          }
          {
            (services && services.length > 0) && (
              <div className={b('expandTable-infoBox')}>
                <div className="title">{isPackageExist ? 'Дополнительные услуги' : 'Список услуг:'}</div>
                <ul className="data listMode">
                  {
                    services.map(service => <li key={service.id}>{service.name}</li>)
                  }
                </ul>
              </div>
            )
          }
        </Col>
        <Col lg={8}>
          <div className={b('expandTable-infoBox')}>
            <div className="title">Филиал компании:</div>
            <div className="data">{business.name}</div>
          </div>
          <div className={b('expandTable-infoBox')}>
            <div className="title">Статус платежа:</div>
            <div className="data">{statusPayLocalize[statusPay]}</div>
          </div>
          <div className={b('expandTable-infoBox')}>
            <div className="title">Сумма платежа:</div>
            <div className="data">{`${price} грн`}</div>
          </div>
        </Col>
        <Col lg={8}>
          <div className={b('expandTable-infoBox')}>
            <div className="title">Статус заказа:</div>
            <div className="data">{recordTranslate.statusProcess[statusProcess]}</div>
          </div>
          {
            canceledDescription && (
              <div className={b('expandTable-infoBox')}>
                <div className="title">Причина отмены:</div>
                <div className="data">{canceledDescription}</div>
              </div>
            )
          }
          <Button
            className={b('expandTable-editBtn')}
            type="primary"
          >
            Loc
          </Button>
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
                        ...pagination,
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
                    scroll={{ y: 336, x: 950 }}
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
