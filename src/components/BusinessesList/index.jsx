import React, { PureComponent } from 'react';
import bem from 'bem-join';
import compose from 'recompose/compose';

import { List, Card } from 'antd';

import { fetchDecorator } from '../../utils';
import { fetchBusinessesByCorp } from '../../fetches';
import DefaultBusinessLogo from '../../assets/defaultBusinessLogo.svg';
import AddIcon from '../../assets/AddIcon.svg';

import './index.scss';

const b = bem('businessesList');

class BusinessesList extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.chosenCorp
      && ((this.props.chosenCorp && (nextProps.chosenCorp.id !== this.props.chosenCorp.id)) || !this.props.chosenCorp)
    ) {
      this.props.fetch();
    }
  }

  render() {
    const { chosenCorp, business } = this.props;
    const data = business.map(item => ({
      name: item.name,
      category: item.businessCategory.name,
      logoUrl: item.logoUrl,
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
            name, category, logoUrl, addCard,
          }) => (
            <List.Item className={b('item')}>
              {
                addCard ? (
                  <Card className={b('card', { addCard: true })}>
                    <img src={AddIcon} alt="addBusiness" />
                    <div className={b('card--addCard-addText')}>Добавить бизнес</div>
                  </Card>
                ) : (
                  <Card className={b('card')}>
                    <div
                      style={{ backgroundImage: `url(${logoUrl || DefaultBusinessLogo})` }}
                      className={b('card-img')}
                    />
                    <div className={b('card-text')}>
                      <p>{name}</p>
                      <p>{category}</p>
                    </div>
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

export default compose(
  fetchDecorator({ actions: [fetchBusinessesByCorp], config: { loader: true } }),
)(BusinessesList);
