import React, { Component } from 'react';

import { AdminPanelPhrasesForm } from '../Forms';
import AdminPanelPhrasesList from '../AdminPanelPhrasesList';

import { fetchAction } from '../../fetches';

class AdminPanelPhrases extends Component {
  state = {
    chosenPhrase: null,
    isAddPhraseMode: false,
  };

  changeChosenPhrase = (phrase, isAddPhraseMode = false) => () => this.setState({
    chosenPhrase: phrase,
    isAddPhraseMode,
  });

  savePhrase = async (e) => {
    e.preventDefault();

    const { chosenPhrase } = this.state;
    const {
      languageData = { packages: [], phrases: {} },
      updatePhrases,
    } = this.props;
    const { packages, phrases } = languageData;

    await this.adminPanelPhrasesForm.props.form.validateFields(async (err, values) => {
      if (!err) {
        const languages = ['en', 'ua', 'ru'];

        const bodies = languages.map((lang) => {
          const { id: packageId } = packages.find(packageItem => packageItem.isoKey === lang);
          const phrasesList = [];
          for (const key in phrases) {
            if (Object.prototype.hasOwnProperty.call(phrases, key)) {
              if (chosenPhrase === key) continue;
              phrasesList.push({ key, label: phrases[key][lang] });
            }
          }

          return ({
            id: packageId || null,
            module: values.module,
            direction: values.direction,
            isoKey: values[`${lang}-isoKey`],
            label: values[`${lang}-label`],
            phrases: [
              ...phrasesList,
              {
                key: values.code,
                label: values[`${lang}-text`],
              },
            ],
          });
        });

        await bodies.forEach(async (body) => {
          await fetchAction({
            url: 'package',
            method: 'PUT',
            moduleUrl: 'language',
            body,
            reduxAction: await updatePhrases(values.code, body.isoKey, values[`${body.isoKey}-text`]),
          })();
        });

        this.changeChosenPhrase(null, false)();
      }
    });
  };

  render() {
    const { chosenPhrase, isAddPhraseMode } = this.state;
    const { phrases = {}, packages = [] } = this.props.languageData;

    return (
      <div style={{ flex: 1 }}>
        {
          (isAddPhraseMode || chosenPhrase) ? (
            <AdminPanelPhrasesForm
              chosenPhraseLocalisation={phrases[chosenPhrase]}
              chosenPhrase={chosenPhrase}
              wrappedComponentRef={form => this.adminPanelPhrasesForm = form}
              savePhrase={this.savePhrase}
              changeChosenPhrase={this.changeChosenPhrase}
            />
          ) : (
            <AdminPanelPhrasesList
              changeChosenPhrase={this.changeChosenPhrase}
              phrases={phrases}
              packages={packages}
            />
          )
        }
      </div>
    );
  }
}

export default AdminPanelPhrases;
