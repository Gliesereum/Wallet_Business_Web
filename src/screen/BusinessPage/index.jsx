import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { Button, Icon } from 'antd';

import { Modal } from '../../components';
import { BusinessMainInfo } from '../../components/Forms';

import { actions } from '../../state';
import { fetchDecorator } from '../../utils';
import { fetchPriceServices, fetchBusinessPackages, fetchBusinessOrders } from '../../fetches';

import './index.scss';

export const BusinessPageContext = React.createContext();

class BusinessPage extends Component {
  state = {
    addModalVisible: false,
  };

  toggleAddModalVisible = () => {
    this.setState(state => ({ addModalVisible: !state.addModalVisible }));
  };

  render() {
    const isAddPage = this.props.location.pathname.match('/add');
    const { addModalVisible } = this.state;
    const {
      business, corporations, businessTypes, businessCategories, children, dataLoading,
    } = this.props;

    return (
      <div className="karma-app-business">
        <div className="karma-app-business-header">
          {!isAddPage && (
            <div className="karma-app-business-header-addBtn">
              <Button
                type="primary"
                onClick={this.toggleAddModalVisible}
              >
                <Icon type="plus" />
                <span className="karma-app-business-header-addBtn-text">Добавить бизнесс</span>
              </Button>
            </div>
          )}
        </div>
        <div className="karma-app-business-contentBox">
          <BusinessPageContext.Provider
            value={{
              business,
              corporations,
              businessTypes,
              businessCategories,
              dataLoading,
            }}
          >
            {children}
          </BusinessPageContext.Provider>
        </div>
        {addModalVisible && (
          <Modal
            visible={addModalVisible}
            footer={null}
            closable={false}
          >
            <BusinessMainInfo
              corporations={corporations}
              isAddMode
              onToggleModal={this.toggleAddModalVisible}
              businessCategories={businessCategories}
              businessTypes={businessTypes}
              addNewBusiness={this.addNewBusiness}
              dataLoading={dataLoading}
            />
          </Modal>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addNewBusiness: newBusiness => dispatch(actions.business.$addNewBusiness(newBusiness)),
  dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
});

const mapStateToProps = state => ({
  business: state.business.business,
  corporations: state.corporations.corporations,
  businessCategories: state.business.businessCategories,
  businessTypes: state.business.businessTypes,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  fetchDecorator(fetchPriceServices),
  fetchDecorator(fetchBusinessPackages),
  fetchDecorator(fetchBusinessOrders),
)(BusinessPage);
