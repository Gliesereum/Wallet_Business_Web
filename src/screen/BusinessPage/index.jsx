import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Button, Icon } from 'antd';

import { Modal } from '../../components';
import { BusinessMainInfo } from '../../components/Forms';

import './index.scss';
import { actions } from '../../state';

export const BusinessPageContext = React.createContext();

class BusinessPage extends Component {
  state = {
    addModalVisible: false,
  };

  async componentDidMount() {
    const { business, getPriceService, getBusinessPackages } = this.props;

    await Promise.all([
      business.map(b => getPriceService(b.id)),
      business.map(b => getBusinessPackages(b.id)),
    ]);
  }

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
  getPriceService: corpId => dispatch(actions.business.$getPriceService(corpId)),
  getBusinessPackages: businessId => dispatch(actions.business.$getBusinessPackages(businessId)),
  addNewBusiness: newBusiness => dispatch(actions.business.$addNewBusiness(newBusiness)),
  dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
});

const mapStateToProps = state => ({
  business: state.business.business,
  corporations: state.corporations.corporations,
  businessCategories: state.business.businessCategories,
  businessTypes: state.business.businessTypes,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BusinessPage));