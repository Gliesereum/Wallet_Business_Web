import React, { PureComponent } from 'react';
import bem from 'bem-join';

import { Collapse, Button, Avatar as CorpAvatar } from 'antd';

const { Panel } = Collapse;
const b = bem('corporationsList');

class CorporationsList extends PureComponent {
  state = {
    activeKey: this.props.viewCorp ? this.props.viewCorp.id : undefined,
  };

  chooseCorporationForView = (corpId) => {
    const { chooseCorporationForView } = this.props;

    if (!corpId || this.state.activeKey === corpId) return;

    this.setState({ activeKey: corpId });
    chooseCorporationForView(corpId);
  };

  render() {
    const { corporations, changeActiveCorporation } = this.props;

    return (
      <div className={b()}>
        <Collapse
          activeKey={this.state.activeKey}
          accordion
          onChange={this.chooseCorporationForView}
        >
          {
            corporations.map(corp => (
              <Panel
                showArrow={false}
                header={(
                  <div>
                    <CorpAvatar className={b('panel-logo')} src={corp.logoUrl} />
                    <span>{corp.name}</span>
                  </div>
                )}
                key={corp.id}
                className={b('panel')}
              >
                <p className={b('panel-name')}>{corp.name}</p>
                <p className={b('panel-descr')}>{corp.description}</p>
                <Button
                  className={b('panel-editBtn')}
                  onClick={changeActiveCorporation(corp, false)}
                >
                  Информация
                </Button>
              </Panel>
            ))
          }
        </Collapse>
        <div className={b('addBtn')}>
          <Button
            type="primary"
            onClick={changeActiveCorporation(null, true)}
          >
            Добавить новую компанию
          </Button>
        </div>
      </div>
    );
  }
}

export default CorporationsList;
