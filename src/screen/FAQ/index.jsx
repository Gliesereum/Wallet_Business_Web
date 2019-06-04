import React, { PureComponent } from 'react';
import bem from 'bem-join';
import { scroller, Element } from 'react-scroll';

import { Collapse, Icon } from 'antd';

import './index.scss';

const b = bem('help');
const { Panel } = Collapse;
const a = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a20', 'a30', 'a40', 'a50', 'a60', 'a70', 'a80', 'a90', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

class FAQ extends PureComponent {
  state = {
    activeKey: a[0],
  };

  changeActivePanel = activeKey => () => {
    scroller.scrollTo(activeKey, {
      duration: 500,
      delay: 0,
      smooth: true,
      containerId: 'containerElement',
      offset: a.indexOf(activeKey) > a.indexOf(this.state.activeKey) ? -114 : -68, // header.height + panel header
      isDynamic: true,
    });
    this.setState({ activeKey });
  };

  triggerPanel = activeKey => this.setState({ activeKey });

  render() {
    const { activeKey } = this.state;

    return (
      <div className={b()}>
        <div className={b('mainInfo')}>
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
              a.map(item => (
                <Panel
                  header={<Element name={item}>{item}</Element>}
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
          {
            a.map(item => (
              <div
                key={item}
                className={b('summary-list-item')}
                onClick={this.changeActivePanel(item)}
              >
                {item}
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default FAQ;
