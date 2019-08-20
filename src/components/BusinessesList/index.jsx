import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import bem from 'bem-join';

import { List, Card } from 'antd';

import EmptyState from '../EmptyState';

import AddIcon from '../../assets/AddIcon.svg';

const b = bem('businessesList');

class BusinessesList extends PureComponent {
  renderBusinessesList = () => {
    const {
      viewCorp,
      business,
      defaultLanguage,
      language,
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
                      {language.phrases['company.page.business.createNewBranch'][defaultLanguage.isoKey]}
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card className={b('card')}>
                  <Link
                    to={`/business/${id}`}
                  >
                    <div
                      style={{ backgroundImage: `url(${logoUrl})` }}
                      className={b('card-img')}
                    />
                    <div className={b('card-text')}>
                      <p>{name}</p>
                      <p>{category}</p>
                    </div>
                  </Link>
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
      language,
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
              title={language.phrases['company.page.business.branch.emptyState.title'][defaultLanguage.isoKey]}
              descrText={language.phrases['company.page.business.branch.emptyState.description'][defaultLanguage.isoKey]}
              addItemText={language.phrases['company.page.business.createNewBranch'][defaultLanguage.isoKey]}
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

export default BusinessesList;
