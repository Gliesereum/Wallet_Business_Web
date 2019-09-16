import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Select,
  // Button,
  Avatar as CorpAvatar,
} from 'antd';

const { Option } = Select;
const b = bem('corporationsList');

class CorporationsList extends PureComponent {
  state = {
    chosenCorporationId: undefined,
  };

  handleChooseCorporation = (chosenCorporationId) => {
    const { changeCorporation } = this.props;

    changeCorporation(chosenCorporationId, false)();
    this.setState({ chosenCorporationId });
  };

  render() {
    const {
      chosenCorporationId,
    } = this.state;
    const {
      corporations,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <div className={b()}>
        <Select
          className={b('selector')}
          dropdownClassName={b('selector-listContainer')}
          value={chosenCorporationId}
          placeholder={phrases['core.selector.placeholder.choseCompany'][defaultLanguage.isoKey]}
          optionLabelProp="label"
          onChange={this.handleChooseCorporation}
        >
          {
            corporations.map(corporation => (
              <Option
                label={corporation.name}
                value={corporation.id}
                key={corporation.id}
                className={b('selector-corporation')}
              >
                <CorpAvatar
                  className={b('selector-corporation-logo')}
                  src={corporation.logoUrl}
                />
                <div className={b('selector-corporation-textContent')}>
                  <div className={b('selector-corporation-name')}>{corporation.name}</div>
                  <div className={b('selector-corporation-descr')}>{corporation.description}</div>
                </div>
              </Option>
            ))
          }
        </Select>
      </div>
    );
  }
}

export default CorporationsList;
