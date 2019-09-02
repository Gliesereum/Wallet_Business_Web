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
    const { data, phrases } = this.props;

    return (
      <div className={b()}>
        <AdminPanelPhrases data={data} phrases={phrases} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  phrases: state.admin.phrases,
});

const mapDispatchToProps = dispatch => ({
  getPhrases: phrases => dispatch(actions.admin.$getPhrases(phrases)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchDecorator({
    actions: [
      ({ getPhrases }) => fetchAction({
        url: 'package/map/by-module?module=coupler-web',
        fieldName: 'data',
        fieldType: {},
        moduleUrl: 'language',
        reduxAction: getPhrases,
      })(),
    ],
    config: { loader: true },
  }),
)(AdminPanel);
