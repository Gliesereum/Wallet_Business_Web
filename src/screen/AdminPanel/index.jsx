import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';

import { AdminPanelPhrases } from '../../components';

import { actions } from '../../state';
import { fetchDecorator } from '../../utils';
import { fetchAction } from '../../fetches';

const b = bem('adminPanel');

class AdminPanel extends Component {
  state = {

  };

  render() {
    const {
      languageData,
      updatePhrases,
    } = this.props;

    return (
      <div className={b()}>
        <AdminPanelPhrases
          languageData={languageData}
          updatePhrases={updatePhrases}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  languageData: state.admin.languageData,
});

const mapDispatchToProps = dispatch => ({
  getPhrases: phrases => dispatch(actions.admin.$getPhrases(phrases)),
  updatePhrases: (code, isoKey, phrase) => dispatch(actions.admin.$updatePhrase(code, isoKey, phrase)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchDecorator({
    actions: [
      ({ getPhrases }) => fetchAction({
        url: 'package/map/by-module?module=coupler-web',
        fieldName: 'languageData',
        fieldType: {},
        moduleUrl: 'language',
        reduxAction: getPhrases,
      })(),
    ],
    config: { loader: true },
  }),
)(AdminPanel);
