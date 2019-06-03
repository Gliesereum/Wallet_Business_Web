import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import bem from 'bem-join';

import { Collapse, Button, Avatar as CorpAvatar } from 'antd';

import DefaultLightCorporationLogo from '../../assets/corporationWhiteLogo.svg';

import './index.scss';

const { Panel } = Collapse;
const b = bem('corporationsList');

class CorporationsList extends PureComponent {
  chooseCorporationHandle = corpId => this.props.chooseCorporation(corpId);

  render() {
    const { corporations } = this.props;

    return (
      <div className={b()}>
        <Collapse
          defaultActiveKey={corporations[0].id}
          accordion
          onChange={this.chooseCorporationHandle}
        >
          {
            corporations.map(({
              name, description, id, logoUrl,
            }) => (
              <Panel
                showArrow={false}
                header={(
                  <div>
                    <CorpAvatar className={b('panel-logo')} src={logoUrl || DefaultLightCorporationLogo} />
                    <span>{name}</span>
                  </div>
                )}
                key={id}
                className={b('panel')}
              >
                <p className={b('panel-name')}>{name}</p>
                <p className={b('panel-descr')}>{description}</p>
                <Button className={b('panel-editBtn')}>
                  <Link to={`/corporations/single/${id}`}>Редактировать информацию</Link>
                </Button>
              </Panel>
            ))
          }
        </Collapse>
        <div className={b('addBtn')}>
          <Button type="primary">
            <Link to="/corporations/add">Добавить новую компанию</Link>
          </Button>
        </div>
      </div>
    );
  }
}

export default CorporationsList;
