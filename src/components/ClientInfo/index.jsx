import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Icon,
  Button,
  Avatar,
  Table,
} from 'antd';

import PeriodSelector from '../PeriodSelector';

import { fetchDecorator } from '../../utils';
import {
  // fetchCarByClientId, TODO: need to discuss
  fetchRecordsByClient,
} from '../../fetches';
import { recordTranslate } from '../../mocks';

const b = bem('clientInfo');

const getDate = (date, inHours = false) => {
  if (!date) return 'Нету данных';

  const dateInMS = new Date(date);

  if (inHours) {
    const hh = String(dateInMS.getHours()).padStart(2, '0');
    const mm = String(dateInMS.getMinutes()).padStart(2, '0');

    return `${hh}:${mm}`;
  }

  const YYYY = dateInMS.getFullYear();
  const MM = String(dateInMS.getMonth() + 1).padStart(2, '0'); // month of the year
  const DD = String(dateInMS.getDate()).padStart(2, '0'); // day of the month

  return `${DD}.${MM}.${YYYY}`;
};

class ClientInfo extends Component {
  state = {
    recordsByUser: this.props.recordsByUser,
    expandedRowKeys: [], // for Icon type regulation
    columnSortOrder: {
      date: 'ascend',
      status: 'ascend',
    },
  };

  handleSortColumn = (columnName, prevOrder) => {
    const { recordsByUser } = this.state;
    let newRecordsByUser = recordsByUser;

    if (columnName === 'date') {
      newRecordsByUser = prevOrder === 'ascend'
        ? recordsByUser.sort((a, c) => a.begin - c.begin)
        : recordsByUser.sort((a, c) => c.begin - a.begin);
    } else if (columnName === 'status') {
      newRecordsByUser = prevOrder === 'ascend'
        ? recordsByUser.sort((a, c) => a.user && a.statusProcess.localeCompare(c.statusProcess))
        : recordsByUser.sort((a, c) => c.user && c.statusProcess.localeCompare(a.statusProcess));
    }

    this.setState(prevState => ({
      ...prevState,
      columnSortOrder: {
        ...prevState.columnSortOrder,
        [columnName]: prevOrder === 'ascend' ? 'descend' : 'ascend',
      },
      recordsByUser: newRecordsByUser,
    }));
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

  connectWithClient = () => {
    console.log('connectWithClient');
  };

  render() {
    const {
      recordsByUser,
      expandedRowKeys,
      columnSortOrder: { date, status },
    } = this.state;
    const { changeActiveClient, chosenClient } = this.props;

    const columns = [
      {
        title: (
          <div className={b('ordersInfo-recordsTable-columnHeaderText')}>
            <span>Дата заказа</span>
            <Icon type={date === 'ascend' ? 'arrow-up' : 'arrow-down'} />
          </div>
        ),
        key: 'date',
        onHeaderCell: () => ({
          onClick: () => this.handleSortColumn('date', date),
        }),
        render: (text, record) => <span>{getDate(record.begin)}</span>,
        width: 190,
      },
      {
        title: 'Время',
        render: (text, record) => <span>{getDate(record.begin, true)}</span>,
        width: 140,
      },
      {
        className: 'status-column',
        title: (
          <div className={b('ordersInfo-recordsTable-columnHeaderText')}>
            <span>Статус</span>
            <Icon type={status === 'ascend' ? 'arrow-up' : 'arrow-down'} />
          </div>
        ),
        onHeaderCell: () => ({
          onClick: () => this.handleSortColumn('status', status),
        }),
        render: (text, record) => (
          <div>
            <span>{recordTranslate.statusProcess[record.statusProcess]}</span>
            {recordTranslate.statusIcon[record.statusProcess]()}
          </div>
        ),
        width: 140,
      },
      {
        title: '',
        align: 'right',
        width: 120,
        render: record => <Icon type={expandedRowKeys.includes(record.id) ? 'up' : 'down'} />,
      },
    ];

    return (
      <div className={b()}>
        <div className={b('header')}>
          <p className={b('header-title')}>Просмотр профайла сотрудника</p>
        </div>
        <div className={b('infoWrapper')}>
          <div className={b('ordersInfo')}>
            <PeriodSelector />
            <Table
              rowKey={record => record.id}
              className={b('ordersInfo-recordsTable')}
              columns={columns}
              dataSource={recordsByUser}
              pagination={false}
              expandIconAsCell={false} // need for hidden default expand icon
              expandRowByClick
              onRow={this.handleExpandRow}
              scroll={{ y: 384 }}
            />
            <Row
              gutter={31}
              className={b('ordersInfo-controlBtns')}
            >
              <Col lg={12}>
                <Button
                  className={b('ordersInfo-controlBtns-btn backBtn')}
                  onClick={changeActiveClient(null, false)}
                >
                  <Icon type="left" />
                  К списку клиентов
                </Button>
              </Col>
              <Col lg={12}>
                <Button
                  className={b('ordersInfo-controlBtns-btn')}
                  type="primary"
                  disabled
                  onClick={this.connectWithClient}
                >
                  Связаться с клиентом
                </Button>
              </Col>
            </Row>
          </div>

          <div className={b('clientInfo')}>
            <Avatar
              src={chosenClient.avatarUrl}
              size={104}
              className={b('clientInfo-avatar')}
            />
            <div className={b('clientInfo-publicInfo')}>
              <div className={b('clientInfo-publicInfo-block')}>
                <div className="title">Фамилия:</div>
                <div className="data">{chosenClient.lastName}</div>
              </div>
              <div className={b('clientInfo-publicInfo-block')}>
                <div className="title">Имя:</div>
                <div className="data">{chosenClient.firstName}</div>
              </div>
              <div className={b('clientInfo-publicInfo-block')}>
                <div className="title">Отчество:</div>
                <div className="data">{chosenClient.middleName}</div>
              </div>
              <div className={b('clientInfo-publicInfo-block')}>
                <div className="title">Номер телефона:</div>
                <div className="data">{chosenClient.phone}</div>
              </div>
            </div>
            <div className={b('clientInfo-privateInfo')} />
          </div>
        </div>
      </div>
    );
  }
}


export default fetchDecorator({
  actions: [
    // fetchCarByClientId, TODO: need to discuss
    fetchRecordsByClient,
  ],
  config: { loader: true },
})(ClientInfo);
