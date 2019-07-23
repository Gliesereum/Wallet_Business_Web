import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import bem from 'bem-join';

import { Collapse, Button, Avatar as CorpAvatar } from 'antd';

import DefaultLightCorporationLogo from '../../assets/corporationWhiteLogo.svg';

const { Panel } = Collapse;
const b = bem('corporationsList');

class CorporationsList extends PureComponent {
  state = {
    activeKey: this.props.corporations[0] ? this.props.corporations[0].id : undefined,
  };

  chooseCorporationHandle = (corpId) => {
    const { chooseCorporation } = this.props;

    if (!corpId || this.state.activeKey === corpId) return;

    this.setState({ activeKey: corpId });
    chooseCorporation(corpId);
  };

  render() {
    const { corporations } = this.props;

    return (
      <div className={b()}>
        <Collapse
          activeKey={this.state.activeKey}
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
                  <Link to={`/corporations/${id}`}>Редактировать информацию</Link>
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
