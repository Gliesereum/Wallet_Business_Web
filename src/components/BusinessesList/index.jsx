import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import bem from 'bem-join';

import { List, Card } from 'antd';

import DefaultBusinessLogo from '../../assets/defaultBusinessLogo.svg';
import AddIcon from '../../assets/AddIcon.svg';

import './index.scss';

const b = bem('businessesList');

class BusinessesList extends PureComponent {
  render() {
    const { chosenCorp, business } = this.props;
    const data = business.map(item => ({
      name: item.name,
      category: item.businessCategory.name,
      logoUrl: item.logoUrl,
      id: item.id,
    }));
    data.push({ addCard: true });

    return (
      <div className={b()}>
        <div className={b('corpName')}>
          <p>{chosenCorp.name}</p>
        </div>
        <List
          grid={{
            gutter: 16,
            xl: 2,
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
                      chosenCorp,
                    },
                  }}
                  >
                    <Card className={b('card', { addCard: true })}>
                      <img src={AddIcon} alt="addBusiness" />
                      <div className={b('card--addCard-addText')}>Добавить бизнес</div>
                    </Card>
                  </Link>
                ) : (
                  <Card className={b('card')}>
                    <Link
                      to={`/business/${id}`}
                    >
                      <div
                        style={{ backgroundImage: `url(${logoUrl || DefaultBusinessLogo})` }}
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
      </div>
    );
  }
}

export default BusinessesList;
