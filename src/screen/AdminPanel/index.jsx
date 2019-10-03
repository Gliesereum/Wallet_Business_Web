import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';

import {
  AdminPanelPhrases,
  AdminPanelTags,
} from '../../components';

import { actions } from '../../state';
import { fetchDecorator } from '../../utils';
import { fetchAction } from '../../fetches';

const b = bem('adminPanel');

const tabs = [
  'LOCALIZE',
  'TAGS',
];

class AdminPanel extends Component {
  state = {
    activeTab: 'LOCALIZE',
  };

  handleTabChange = tab => () => this.setState({ activeTab: tab });

  render() {
    const {
      languageData,
      tags,
      updatePhrases,
      addTag,
      updateTag,
      deleteTag,
    } = this.props;
    const { activeTab } = this.state;

    let TabComponent;
    switch (activeTab) {
      case 'LOCALIZE':
        TabComponent = (
          <AdminPanelPhrases
            languageData={languageData}
            updatePhrases={updatePhrases}
          />
        );
        break;
      case 'TAGS':
        TabComponent = (
          <AdminPanelTags
            tags={tags}
            addTag={addTag}
            updateTag={updateTag}
            deleteTag={deleteTag}
          />
        );
        break;
      default: TabComponent = (
        <AdminPanelPhrases
          languageData={languageData}
          updatePhrases={updatePhrases}
        />
      );
    }

    return (
      <div className={b()}>
        <div className={b('tabs')}>
          {
            tabs.map(tab => (
              <div
                key={tab}
                className={b('tabs-tab', { active: activeTab === tab })}
                onClick={this.handleTabChange(tab)}
              >
                {tab}
              </div>
            ))
          }
        </div>
        {TabComponent}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  languageData: state.admin.languageData,
  tags: state.admin.tags,
});

const mapDispatchToProps = dispatch => ({
  getPhrases: phrases => dispatch(actions.admin.$getPhrases(phrases)),
  updatePhrases: (code, isoKey, phrase) => dispatch(actions.admin.$updatePhrase(code, isoKey, phrase)),
  getTags: tags => dispatch(actions.admin.$getTags(tags)),
  addTag: tag => dispatch(actions.admin.$addTag(tag)),
  updateTag: tag => dispatch(actions.admin.$updateTag(tag)),
  deleteTag: tag => dispatch(actions.admin.$deleteTag(tag)),
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
      ({ getTags }) => fetchAction({
        url: 'tag',
        fieldName: 'tags',
        reduxAction: getTags,
      })(),
    ],
    config: { loader: true },
  }),
)(AdminPanel);
