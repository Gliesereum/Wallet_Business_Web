import React, { Component } from 'react';
import bem from 'bem-join';
// import { connect } from 'react-redux';
import compose from 'recompose/compose';

import {
  Collapse,
  Icon,
  List,
  Card,
} from 'antd';
import { ServiceMainInfoForm, ServiceAdditional } from '../../../../../../components/Forms';

// import { ServiceClasses } from '../../../../../components';
import {
  // asyncRequest,
  // withToken,
  fetchDecorator,
} from '../../../../../../utils';
import { fetchGetServiceTypes, fetchGetFilters } from '../../../../../../fetches';
// import { actions } from '../../../../../state';
import './index.scss';

const b = bem('businessServices');
const { Panel } = Collapse;
const { Item } = List;

class BusinessServices extends Component {
  state = {
    activeKey: 'mainInfo',
    chosenService: null,
  //   classes: [],
  };

  // initLoad = async () => {
  // const { singleBusiness } = this.props;

  // const serviceTypesUrl = `service/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`;
  //   const filtersUrl = `filter/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`;
  //   const classesUrl = 'class';

  // try {
  //   const [serviseTypesList] = await Promise
  //     .all([
  //       withToken(asyncRequest)({ url: serviceTypesUrl, moduleUrl: 'karma' }),
  //       withToken(asyncRequest)({ url: classesUrl, moduleUrl: 'karma' }),
  //       withToken(asyncRequest)({ url: filtersUrl, moduleUrl: 'karma' }),
  // ]);
  //
  //     this.setState(() => ({
  //       serviceTypes: serviseTypesList || [],
  //       filters: filtersList || [],
  //       classes: classesList || [],
  //     }));
  //   } catch (err) {
  //     notification.error({
  //       duration: 5,
  //       message: err.message || 'Ошибка',
  //       description: 'Возникла ошибка',
  //     });
  //   }
  // };

  // handleRemoveService = item => async () => {
  //   const { removeServicePrice, singleBusiness } = this.props;
  //   const removeServicePriceUrl = `price/${item.id}`;
  //
  //   try {
  //     await withToken(asyncRequest)`({ url: removeServicePriceUrl, method: 'DELETE', moduleUrl: 'karma' });
  //     await removeServicePrice({ servicePriceId: item.id, businessId: singleBusiness.id });
  //   } catch (err) {
  //     notification.error({
  //       duration: 5,
  //       message: err.message || 'Ошибка',
  //       description: 'Возникла ошибка',
  //     });
  //   }
  // };
  triggerPanel = activeKey => this.setState({ activeKey });

  chosenService = service => () => this.setState({ chosenService: service });

  render() {
    const {
      singleBusiness,
      serviceTypes,
      filters,
      servicePrices,
      isAddMode,
    } = this.props;
    const { activeKey, chosenService } = this.state;
    const services = servicePrices[singleBusiness.id];

    return (
      <div className={b()}>
        {
          isAddMode || chosenService ? (
            <Collapse
              activeKey={activeKey}
              accordion
              bordered={false}
              expandIcon={({ isActive }) => <Icon type={isActive ? 'minus' : 'plus'} />}
              expandIconPosition="right"
              onChange={this.triggerPanel}
            >
              <Panel
                className={b('panelHeader')}
                header="Основная информация об услуге"
                key="mainInfo"
              >
                <ServiceMainInfoForm
                  serviceTypes={serviceTypes}
                  servicePrice={chosenService}
                />
              </Panel>
              <Panel
                className={b('panelHeader')}
                header="Дополнительная информация"
                key="additionalInfo"
              >
                <ServiceAdditional
                  filters={filters}
                  servicePrice={chosenService}
                />
              </Panel>
              <Panel
                className={b('panelHeader')}
                header="Класс обслуживания"
                key="classes"
              >
                classes
              </Panel>
            </Collapse>
          ) : (
            <List
              grid={{
                gutter: 8,
                lg: 4,
              }}
              dataSource={services}
              renderItem={item => (
                <Item onClick={this.chosenService(item)}>
                  <Card>{item.name}</Card>
                </Item>
              )}
            />
          )
        }
      </div>
    );
  }
}

// const mapDispatchToProps = dispatch => ({
//   removeServicePrice: servicePrice => dispatch(actions.business.$removeServicePrice(servicePrice)),
//   updateServicePrice: servicePrice => dispatch(actions.business.$updateServicePrice(servicePrice)),
//   addServicePrice: servicePrice => dispatch(actions.business.$addServicePrice(servicePrice)),
// });
//
// export default compose(
//   connect(null, mapDispatchToProps),
//   fetchDecorator({ actions: [fetchGetServiceTypes], config: { loader: true } }),
// )(BusinessServicesList);

export default compose(
  fetchDecorator({ actions: [fetchGetServiceTypes, fetchGetFilters], config: { loader: true } }),
)(BusinessServices);
