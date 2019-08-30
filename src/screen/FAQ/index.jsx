import React, { PureComponent } from 'react';
import bem from 'bem-join';

import { Collapse, Icon, Anchor } from 'antd';

import { fetchDecorator } from '../../utils';
import { fetchAction } from '../../fetches';

import './index.scss';

const b = bem('help');
const { Panel } = Collapse;
const { Link } = Anchor;

class FAQ extends PureComponent {
  state = {
    activeKey: undefined,
  };

  changeActivePanel = (e, { href: activeKey }) => {
    e.preventDefault();

    this.setState(prevState => ({
      activeKey: prevState.activeKey !== activeKey.slice(1) ? activeKey.slice(1) : undefined,
    }));
  };

  triggerPanel = activeKey => this.setState({ activeKey });

  render() {
    const { activeKey } = this.state;
    const { faQuestions } = this.props;

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
              faQuestions.map(item => (
                <Panel
                  id={item.id}
                  header={item.title}
                  key={item.id}
                >
                  {item.description}
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
              faQuestions.map(item => (
                <Link
                  title={item.title}
                  href={`#${item.id}`}
                  key={item.id}
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

export default fetchDecorator({
  actions: [fetchAction({ url: 'information?tag=faq', fieldName: 'faQuestions' })],
  config: { loader: true },
})(FAQ);
