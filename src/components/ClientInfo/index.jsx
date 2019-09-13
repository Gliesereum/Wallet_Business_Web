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
import ContentHeader from '../ContentHeader';

import { fetchDecorator, getDate } from '../../utils';
import { fetchAction } from '../../fetches';
import { recordTranslate } from '../../mocks';

const b = bem('clientInfo');

class ClientInfo extends Component {
  state = {
    recordsByUser: this.props.recordsByUser ? this.props.recordsByUser.content : [],
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

  handleRefreshRecordsByFromTo = async ({ from, to }) => {
    const { chosenClient, chosenCorporationId } = this.props;
    const { data } = await fetchAction({
      url: 'record/by-params-for-business',
      fieldName: 'recordsByUser',
      fieldType: {},
      method: 'POST',
      body: {
        clientIds: [chosenClient.id],
        corporationId: chosenCorporationId,
        from,
        to,
      },
    })();
    this.setState({
      recordsByUser: data.content,
      from,
      to,
    });
  };

  connectWithClient = () => {
    console.log('connectWithClient');
  };

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
    const { defaultLanguage, phrases } = this.props;

    return (
      <Row
        className={b('expandTable')}
        gutter={56}
      >
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
        </Col>
        <Col lg={8}>
          {
            isPackageExist && (
              <>
                <div className={b('expandTable-infoBox')}>
                  <div className="title">{`${phrases['clients.list.packages'][defaultLanguage.isoKey]}:`}</div>
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
          <div className={b('expandTable-infoBox')}>
            <div className="title">{isPackageExist ? 'Дополнительные услуги' : 'Список услуг:'}</div>
            <ul className="data listMode">
              {
                services.map(service => <li key={service.id}>{service.name}</li>)
              }
            </ul>
          </div>
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
            <div className="data">{`${price} ${phrases['core.currency.uah'][defaultLanguage.isoKey]}`}</div>
          </div>
        </Col>
      </Row>
    );
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
        width: 230,
      },
      {
        title: 'Время',
        render: (text, record) => <span>{getDate(record.begin, true)}</span>,
        width: 180,
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
            {recordTranslate.statusIcon[record.statusProcess]()}
          </div>
        ),
        width: 100,
      },
      {
        title: '',
        align: 'right',
        width: 80,
        render: record => <Icon type={expandedRowKeys.includes(record.id) ? 'up' : 'down'} />,
      },
    ];

    return (
      <div className={b()}>
        <ContentHeader
          title="Просмотр информации о клиенте"
          titleCentered
        />
        <div className={b('infoWrapper')}>
          <div className={b('ordersInfo')}>
            <PeriodSelector
              getFromToData={this.handleRefreshRecordsByFromTo}
            />
            <Table
              rowKey={record => record.id}
              className={b('ordersInfo-recordsTable', { isEmpty: !recordsByUser.length })}
              columns={columns}
              dataSource={recordsByUser}
              pagination={false}
              expandedRowRender={record => this.renderExpandedRow(record)}
              expandIconAsCell={false} // need for hidden default expand icon
              expandRowByClick
              onRow={this.handleExpandRow}
              scroll={{ y: 336 }}
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
    ({ chosenClient, chosenCorporationId }) => fetchAction({
      url: 'record/by-params-for-business',
      fieldName: 'recordsByUser',
      fieldType: {},
      method: 'POST',
      body: {
        clientIds: [chosenClient.id],
        corporationId: chosenCorporationId,
        from: null,
        to: null,
      },
    })(),
  ],
  config: { loader: true },
})(ClientInfo);
