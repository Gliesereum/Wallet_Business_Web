import React, { Component } from 'react';
import compose from 'recompose/compose';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import bem from 'bem-join';

import { Avatar as CorpAvatar, notification } from 'antd';

import { EmptyState } from '../../components';
import { CorporationForm } from '../../components/Forms';

import { asyncRequest, withToken } from '../../utils';
import DefaultBlueCorporationLogo from '../../assets/corporationBlueLogo.svg';
import { actions } from '../../state';

import './index.scss';

const b = bem('corporation');

class Corporation extends Component {
  // handleChangeCorpLogo = async (info) => {
  //   const body = new FormData();
  //   await body.append('file', info.file);
  //   await body.append('open', true);
  //
  //   const imageUrl = await fetchImageByUpload(body);
  //
  //   this.setState({
  //     imageUrl,
  //     loading: false,
  //   });
  // };

  // renderUploadButton = () => (
  //   <div>
  //     <Icon type={this.state.loading ? 'loading' : 'plus'} />
  //     <div className={b()}>Добавить фотографию</div>
  //   </div>
  // );

  handleUpdateCorporation = async (newCorp) => {
    const { updateCorporation, history } = this.props;

    const url = 'corporation';
    const body = newCorp;
    const method = 'PUT';
    try {
      const updatedCorporation = await withToken(asyncRequest)({ url, method, body });
      await updateCorporation(updatedCorporation);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    } finally {
      history.replace('/corporations');
    }
  };

  handleAddCorporation = async (newCorp) => {
    const { addCorporation, history } = this.props;

    const url = 'corporation';
    const body = newCorp;
    const method = 'POST';

    try {
      const newCorporation = await withToken(asyncRequest)({ url, method, body });
      await addCorporation(newCorporation);
      history.replace('/corporations');
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  handleRemoveCorporation = async () => {
    const { match, history, removeCorporation } = this.props;
    const { id: corporationId } = match.params;
    const removeCorporationUrl = `corporation/${corporationId}`;

    try {
      await withToken(asyncRequest)({ url: removeCorporationUrl, method: 'DELETE' });
      history.replace('/corporations');
      await removeCorporation(corporationId);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  render() {
    const { corporations, match } = this.props;
    const [singleCorporation] = corporations.filter(item => item.id === match.params.id);

    return (
      <div className={b()}>
        <div className={b('formBox')}>
          <h1 className={b('formBox-header')}>Добавить компанию</h1>
          <CorporationForm
            isEditMod={Boolean(match.params.id)}
            singleCorporation={singleCorporation}
            onSubmit={match.params && match.params.id ? this.handleUpdateCorporation : this.handleAddCorporation}
            onRemove={this.handleRemoveCorporation}
          />
        </div>

        <div className={b('otherCorpBox')}>
          <h1 className={b('otherCorpBox-header')}>Мои другие компании</h1>
          {
            corporations.length ? (
              corporations.map(({ name, logoUrl, id }) => (
                <Link
                  to={`/corporations/${id}`}
                  key={id}
                  className={b('otherCorpBox-list-item')}
                >
                  <CorpAvatar className={b('otherCorpBox-list-item-logo')} src={logoUrl || DefaultBlueCorporationLogo} />
                  <span>{name}</span>
                </Link>
              ))) : (
                <div className={b('emptyState-wrapper')}>
                  <EmptyState
                    title="У вас нету компаний"
                    descrText="Создайте компанию, чтобы начать создать Ваши бизнесы"
                    withoutBtn
                  />
                </div>
            )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

const mapDispatchToProps = dispatch => ({
  addCorporation: corporation => dispatch(actions.corporations.$addCorporation(corporation)),
  updateCorporation: corporation => dispatch(actions.corporations.$updateCorporation(corporation)),
  removeCorporation: corporationId => dispatch(actions.corporations.$deleteCorporation(corporationId)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(Corporation);
