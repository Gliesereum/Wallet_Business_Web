import React, { PureComponent } from 'react';
import bem from 'bem-join';

import { Collapse, Icon, Anchor } from 'antd';

import './index.scss';

const b = bem('help');
const { Panel } = Collapse;
const { Link } = Anchor;
const links = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a20', 'a30', 'a40', 'a50', 'a60', 'a70', 'a80', 'a90', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

class FAQ extends PureComponent {
  state = {
    activeKey: links[0],
  };

  changeActivePanel = (e, { title: activeKey }) => {
    e.preventDefault();

    this.setState({ activeKey });
  };

  triggerPanel = activeKey => this.setState({ activeKey });

  render() {
    const { activeKey } = this.state;

    return (
      <div className={b()}>
        <div className={b('mainInfo')} id="scrollContainer">
          <h1 className={b('mainInfo-header')}>Вопросы и ответы</h1>
          <Collapse
            activeKey={activeKey}
            accordion
            bordered={false}
            expandIcon={({ isActive }) => <Icon type={isActive ? 'minus' : 'plus'} />}
            expandIconPosition="right"
            onChange={this.triggerPanel}
          >
            {
              links.map(item => (
                <Panel
                  id={item}
                  header={item}
                  key={item}
                >
                  {item}
                </Panel>
              ))
            }
          </Collapse>
        </div>
        <div className={b('summary')}>
          <h1 className={b('summary-header')}>Другая информация</h1>
          <Anchor
            offsetTop={41}
            onClick={this.changeActivePanel}
            affix={false}
            getContainer={() => document.getElementById('scrollContainer')}
          >
            {
              links.map(item => (
                <Link
                  title={item}
                  href={`#${item}`}
                  key={item}
                  className={b('summary-list-item')}
                />
              ))
            }
          </Anchor>
        </div>
      </div>
    );
  }
}

export default FAQ;
