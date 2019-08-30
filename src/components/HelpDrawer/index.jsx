import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Drawer,
  Collapse,
  Icon,
} from 'antd';

import ScreenLoading from '../ScreenLoading';

import { fetchDecorator } from '../../utils';
import { fetchAction } from '../../fetches';

const b = bem('helpDrawer');
const { Panel } = Collapse;

class HelpDrawer extends Component {
  state = {
    activeKey: undefined,
    frameLoad: false,
  };

  triggerPanel = activeKey => this.setState({ activeKey, frameLoad: true });

  frameLoad = bool => () => this.setState({ frameLoad: bool });

  render() {
    const {
      visible,
      helpPoints,
      loading,
      onClose,
    } = this.props;
    const { activeKey, frameLoad } = this.state;

    return (
      <Drawer
        title="Центр помощи"
        visible={visible}
        className={b()}
        width={344}
        mask
        onClose={onClose}
      >
        {
          loading ? (
            <ScreenLoading />
          ) : (
            <Collapse
              activeKey={activeKey}
              accordion
              bordered={false}
              expandIcon={({ isActive }) => <Icon type={isActive ? 'minus' : 'plus'} />}
              expandIconPosition="right"
              onChange={this.triggerPanel}
            >
              {
                helpPoints.map(item => (
                  <Panel
                    header={item.title}
                    key={item.id}
                    className={b('collapse-panel')}
                  >
                    {frameLoad && <ScreenLoading />}
                    <iframe
                      onLoad={this.frameLoad(false)}
                      onError={this.frameLoad(false)}
                      allowFullScreen
                      title="videoFrame"
                      src="https://www.youtube.com/embed/JDBoAmPvStA"
                      width={280}
                      height={175}
                    />
                    {item.description}
                  </Panel>
                ))
              }
            </Collapse>
          )
        }
      </Drawer>
    );
  }
}

export default fetchDecorator({
  actions: [
    fetchAction({ url: 'information?tag=helper', fieldName: 'helpPoints' }),
  ],
  config: { loader: false },
})(HelpDrawer);
