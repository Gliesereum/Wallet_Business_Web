import React, { PureComponent } from 'react';
import bem from 'bem-join';

import { Collapse, Button, Avatar as CorpAvatar } from 'antd';

import DefaultCorporationLogo from '../../assets/corporationLogo.svg';

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
                    <CorpAvatar className={b('panel-logo')} src={logoUrl || DefaultCorporationLogo} />
                    <span>{name}</span>
                  </div>
                )}
                key={id}
                className={b('panel')}
              >
                <p className={b('panel-name')}>{name}</p>
                <p className={b('panel-descr')}>{description}</p>
                <Button className={b('panel-editBtn')}>Редактировать информацию</Button>
              </Panel>
            ))
          }
        </Collapse>
        <Button className={b('addBtn')} type="primary">Добавить новую компанию</Button>
      </div>
    );
  }
}

export default CorporationsList;
