import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Select,
  Icon,
  notification,
} from 'antd';

import { fetchBusinessesByCorp, fetchClientsByIds } from '../../fetches';

const b = bem('clientsList');
const { Option } = Select;

class ClientsList extends Component {
  state = {
    clients: [],
    chosenCorporation: '',
    chosenBusiness: undefined,
    businesses: [],
    searchedClients: [],
    searchProcess: false,
  };

  componentDidMount() {
    const { corporations } = this.props;

    corporations.length && corporations[0] && this.handleCorpChange(corporations[0].id);
  }

  handleCorpChange = async (corporationId) => {
    const businesses = await this.handleGetBusinessByCorporationId(corporationId, true);

    this.setState({
      chosenCorporation: corporationId,
      chosenBusiness: undefined,
      businesses,
    });
  };

  handleBusinessChange = async (businessId) => {
    await this.handleGetClientByBusinessId(businessId);
  };

  handleGetBusinessByCorporationId = async (corporationId, getClients = false) => {
    let businesses = [];
    try {
      const { data = [] } = await fetchBusinessesByCorp({ corporationId });
      getClients && await this.handleGetClientsByCorporationId(corporationId);

      businesses = data;
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }

    return businesses;
  };

  handleGetClientsByCorporationId = async (corporationId) => {
    try {
      const { data: clients = [] } = await fetchClientsByIds({ corporationId });
      this.setState({ clients });
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  handleGetClientByBusinessId = async (businessId) => {
    try {
      const { data: clients = [] } = await fetchClientsByIds({ businessId });
      this.setState({
        chosenBusiness: businessId,
        clients,
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
      clients,
      chosenCorporation,
      chosenBusiness,
      businesses,
      searchedClients,
      searchProcess,
    } = this.state;
    const { corporations } = this.props;
    const isWorkersExist = (clients && clients.length) || searchProcess;

    console.log(isWorkersExist, searchedClients, clients);

    return (
      <div className={b()}>
        <div className={b('header')}>
          <h1 className={b('header-title')}>Просмотр клиентов</h1>
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
      </div>
    );
  }
}

export default ClientsList;
