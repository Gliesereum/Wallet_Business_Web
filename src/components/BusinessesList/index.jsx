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
      chosenCorporation,
      businesses,
      defaultLanguage,
      phrases,
    } = this.props;
    const data = businesses.map(item => ({
      name: item.name,
      category: item.businessCategory.name,
      logoUrl: item.logoUrl,
      coverUrl: item.coverUrl,
      id: item.id,
    }));
    data.push({ addCard: true });

    return (
      <List
        className={b('list')}
        grid={{
          gutter: 32,
          xxl: 4,
          xl: 3,
          lg: 3,
          md: 2,
          sm: 1,
        }}
        dataSource={data}
        renderItem={({
          name,
          category,
          logoUrl,
          id,
          addCard,
          coverUrl,
        }) => (
          <List.Item className={b('list-item')}>
            {
              addCard ? (
                <Link to={{
                  pathname: '/business/add',
                  state: {
                    chosenCorp: chosenCorporation,
                  },
                }}
                >
                  <Card className={b('card')} id="addCard">
                    <div className={b('card-cover')}>
                      <div className={b('card-logo')}>
                        <img
                          className={b('card-logo-img')}
                          src={AddIcon}
                          alt="add_image"
                        />
                      </div>
                    </div>
                    <div className={b('card-text')}>
                      <div className="name">
                        {phrases['company.page.business.createNewBranch'][defaultLanguage.isoKey]}
                      </div>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card
                  className={b('card')}
                  onClick={this.goToBusiness(id)}
                >
                  <div className={b('card-cover')}>
                    <img
                      className={b('card-cover-img')}
                      src={coverUrl}
                      alt="cover_image"
                    />
                    <div className={b('card-logo')}>
                      <img
                        className={b('card-logo-img')}
                        src={logoUrl}
                        alt="logo_image"
                      />
                    </div>
                  </div>
                  <div className={b('card-text')}>
                    <p className="name">{name}</p>
                    <p className="category">{category}</p>
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
      businesses,
      chosenCorporation,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <div className={b()}>
        {
          businesses && businesses.length ? (
            this.renderBusinessesList()
          ) : (
            <EmptyState
              title={phrases['company.page.business.branch.emptyState.title'][defaultLanguage.isoKey]}
              descrText={phrases['company.page.business.branch.emptyState.description'][defaultLanguage.isoKey]}
              addItemText={phrases['company.page.business.createNewBranch'][defaultLanguage.isoKey]}
              linkToData={{
                pathname: '/business/add',
                state: {
                  chosenCorp: chosenCorporation,
                },
              }}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state, { chosenCorporation }) => {
  if (!chosenCorporation) return { businesses: [] };
  const businesses = state.business.business.filter(item => item.corporationId === chosenCorporation.id);

  return {
    businesses,
  };
};

const mapDispatchToProps = dispatch => ({
  changeChosenBusiness: businessId => dispatch(actions.business.$changeChosenBusiness(businessId)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(BusinessesList);
