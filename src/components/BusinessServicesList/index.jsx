import React, { Component } from 'react';
import bem from 'bem-join';

import {
  List,
  Button,
} from 'antd';

import EmptyState from '../EmptyState';

import AddIcon from '../../assets/AddIcon.svg';
import {
  DurationIcon,
  PriceIcon,
  AddIconSmall,
} from '../../assets/iconComponents';

const b = bem('businessServicesList');
const { Item } = List;

class BusinessServicesList extends Component {
  componentDidMount() {
    const { services, changeTabDisable } = this.props;
    if (services && !services.length) {
      changeTabDisable('packages', true);
    }
  }

  renderServiceCard = (service) => {
    const {
      defaultLanguage,
      phrases,
      changeActiveService,
    } = this.props;

    if (service.addCard) {
      return (
        <Item onClick={changeActiveService(null, true)}>
          <div className={b('list-item', { addCard: true })}>
            <img src={AddIcon} alt="addService" />
            <div className={b('list-item-addText')}>
              {phrases['servicesPage.button.addService'][defaultLanguage.isoKey]}
            </div>
          </div>
        </Item>
      );
    }

    return (
      <Item onClick={changeActiveService(service, false)}>
        <div className={b('list-item')}>
          <div className={b('list-item-title')}>
            {service.name}
          </div>
          <div className={b('list-item-description')}>
            {service.description || 'Описание отсутствует'}
          </div>
          <div className={b('list-item-otherInfo')}>
            <div className={b('list-item-otherInfo-block')}>
              <DurationIcon />
              <p>{service.duration}</p>
            </div>
            <div className={b('list-item-otherInfo-block')}>
              <PriceIcon />
              <p>
                {service.price}
                {` ${phrases['core.currency.uah'][defaultLanguage.isoKey]}`}
              </p>
            </div>
          </div>
        </div>
      </Item>
    );
  };

  render() {
    const {
      services,
      defaultLanguage,
      phrases,
      changeActiveService,
    } = this.props;
    const servicesList = [
      ...services,
      {
        addCard: true,
      },
    ];

    return (
      <div className={b()}>
        {
          (services && services.length) ? (
            <>
              <div className={b('header')}>
                <div className={b('header-title')}>{phrases['business.services.list'][defaultLanguage.isoKey]}</div>
                <div className={b('header-addBtn')}>
                  <Button onClick={changeActiveService(null, true)}>
                    <AddIconSmall />
                    {phrases['servicesPage.button.addService'][defaultLanguage.isoKey]}
                  </Button>
                </div>
              </div>
              <List
                className={b('list')}
                grid={{
                  gutter: 32,
                  lg: 3,
                  md: 2,
                  xs: 1,
                }}
                dataSource={servicesList}
                renderItem={this.renderServiceCard}
              />
            </>
          ) : (
            <EmptyState
              title={phrases['servicesPage.emptyList.title'][defaultLanguage.isoKey]}
              descrText={phrases['servicesPage.emptyList.description'][defaultLanguage.isoKey]}
              addItemText={phrases['servicesPage.button.createService'][defaultLanguage.isoKey]}
              addItemHandler={changeActiveService}
            />
          )
        }
      </div>
    );
  }
}

export default BusinessServicesList;
