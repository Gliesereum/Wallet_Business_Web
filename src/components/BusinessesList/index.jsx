import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link, withRouter } from 'react-router-dom';
import bem from 'bem-join';

import { List, Card } from 'antd';

import EmptyState from '../EmptyState';

import AddIcon from '../../assets/AddIcon.svg';

import { actions } from '../../state';

const b = bem('businessesList');

class BusinessesList extends PureComponent {
  goToBusiness = businessId => async () => {
    const { history, changeChosenBusiness } = this.props;

    await changeChosenBusiness(businessId);
    history.replace(`/business/${businessId}`);
  };

  renderBusinessesList = () => {
    const {
      viewCorp,
      business,
      defaultLanguage,
      phrases,
    } = this.props;
    const data = business.map(item => ({
      name: item.name,
      category: item.businessCategory.name,
      logoUrl: item.logoUrl,
      id: item.id,
    }));
    data.push({ addCard: true });

    return (
      <List
        grid={{
          gutter: 32,
          xl: 3,
          lg: 3,
          md: 2,
          sm: 1,
        }}
        dataSource={data}
        renderItem={({
          name, category, logoUrl, id, addCard,
        }) => (
          <List.Item className={b('item')}>
            {
              addCard ? (
                <Link to={{
                  pathname: '/business/add',
                  state: {
                    chosenCorp: viewCorp,
                  },
                }}
                >
                  <Card className={b('card', { addCard: true })}>
                    <img src={AddIcon} alt="addBusiness" />
                    <div className={b('card--addCard-addText')}>
                      {phrases['company.page.business.createNewBranch'][defaultLanguage.isoKey]}
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card className={b('card')}>
                  <div
                    onClick={this.goToBusiness(id)}
                  >
                    <div
                      style={{ backgroundImage: `url(${logoUrl})` }}
                      className={b('card-img')}
                    />
                    <div className={b('card-text')}>
                      <p>{name}</p>
                      <p>{category}</p>
                    </div>
                  </div>
                </Card>
              )
            }
          </List.Item>
        )}
      />
    );
  };

  render() {
    const {
      business,
      viewCorp,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <div className={b()}>
        <div className={b('corpName')}>
          <p>{viewCorp.name}</p>
        </div>
        {
          business && business.length ? (
            this.renderBusinessesList()
          ) : (
            <EmptyState
              title={phrases['company.page.business.branch.emptyState.title'][defaultLanguage.isoKey]}
              descrText={phrases['company.page.business.branch.emptyState.description'][defaultLanguage.isoKey]}
              addItemText={phrases['company.page.business.createNewBranch'][defaultLanguage.isoKey]}
              linkToData={{
                pathname: '/business/add',
                state: {
                  chosenCorp: viewCorp,
                },
              }}
            />
          )
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeChosenBusiness: businessId => dispatch(actions.business.$changeChosenBusiness(businessId)),
});

export default compose(
  connect(null, mapDispatchToProps),
  withRouter,
)(BusinessesList);
