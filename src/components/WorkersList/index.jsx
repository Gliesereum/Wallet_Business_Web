import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import { Select, Icon, notification } from 'antd';

import EmptyState from '../EmptyState';

import { asyncRequest, withToken } from '../../utils';

import './index.scss';

const b = bem('workersList');
const { Option } = Select;

class WorkersList extends Component {
  state = {
    businesses: [],
    chosenCorporation: '',
    chosenBusiness: undefined,
  };

  componentDidMount() {
    const { corporations } = this.props;

    corporations && corporations[0] && this.handleCorpChange(corporations[0].id);
  }

  handleCorpChange = async (corporationId) => {
    try {
      const url = `business/by-corporation-id?corporationId=${corporationId}`;
      const businesses = await withToken(asyncRequest)({ url, method: 'GET', moduleUrl: 'karma' }) || [];
      this.setState({
        businesses,
        chosenCorporation: corporationId,
      });
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  render() {
    const {
      workers,
      changeActiveWorker,
      corporations,
    } = this.props;
    const { chosenCorporation, chosenBusiness, businesses } = this.state;
    console.log(businesses);
    return (
      <div className={b()}>
        <div className={b('header')}>
          <h1 className={b('header-title')}>Просмотр сотрудников</h1>
          <div className={b('header-selectorBox')}>
            <Select
              onChange={this.handleCorpChange}
              style={{ width: '280px' }}
              value={chosenCorporation}
            >
              {
                corporations.map(item => (
                  <Option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </Option>
                ))
              }
            </Select>
            <Icon
              type="right"
              className={b('header-selectorBox-rightArrow')}
            />
            <Select
              style={{ width: '280px' }}
              value={chosenBusiness}
              placeholder="Выберите бизнес"
            >
              {
                businesses.length && businesses.map(item => (
                  <Option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </Option>
                ))
              }
            </Select>
          </div>
        </div>
        {
          workers && workers.length ? (
            <div>WorkingList</div>
          ) : (
            <EmptyState
              title="У вас нету зарегистрированных сотрудников"
              descrText="Создайте работника, чтобы просматривать и редактировать информацию о нем"
              addItemText="Создать сотрудника"
              addItemHandler={changeActiveWorker}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

export default connect(mapStateToProps)(WorkersList);
