import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import { Select, Icon, notification } from 'antd';

import EmptyState from '../EmptyState';

import { fetchBusinessesByCorp } from '../../fetches';

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
    const { getWorkers } = this.props;

    try {
      const { data: businesses = [] } = await fetchBusinessesByCorp({ corporationId });
      this.setState({
        businesses,
        chosenCorporation: corporationId,
        chosenBusiness: undefined,
      }, () => getWorkers(corporationId));
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  handleBusinessChange = businessId => this.setState({ chosenBusiness: businessId });

  render() {
    let { workers } = this.props;
    const {
      changeActiveWorker,
      corporations,
    } = this.props;
    const { chosenCorporation, chosenBusiness, businesses } = this.state;

    if (chosenBusiness) {
      workers = workers.filter(worker => chosenBusiness === worker.businessId);
    }

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
              onChange={this.handleBusinessChange}
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
        <div className={b('content')}>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

export default connect(mapStateToProps)(WorkersList);
