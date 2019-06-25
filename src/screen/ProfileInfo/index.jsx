import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  Row,
  Col,
  Button, notification, Icon,
} from 'antd';

import { ProfileForm } from '../../components/Forms';

import { asyncRequest, asyncUploadFile, withToken } from '../../utils';

import { actions } from '../../state';

import './index.scss';

const b = bem('profileInfo');

class ProfileInfo extends Component {
  state = {
    avatarImageUrl: this.props.user ? this.props.user.avatarUrl : '',
    isError: false,
  };

  uploadAvatarImage = async (info) => {
    if ((info.file.size / 1024 / 1024) > 2) {
      this.setState({ isError: true });
      return;
    }
    const url = 'upload';
    const body = new FormData();
    await body.append('file', info.file);
    await body.append('open', true);
    const { url: imageUrl } = await withToken(asyncUploadFile)({ url, body });

    this.setState({ avatarImageUrl: imageUrl, isError: false });
  };

  handleUpdateUserData = () => {
    const { updateUserData } = this.props;

    this.profileForm.props.form.validateFields(async (error, values) => {
      if (!error) {
        const url = 'user';
        const body = {
          avatarUrl: this.state.avatarImageUrl,
          ...values,
        };
        const method = 'PUT';

        try {
          const updatedUser = await withToken(asyncRequest)({ url, method, body });
          await updateUserData(updatedUser);
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.message || 'Ошибка',
            description: 'Возникла ошибка',
          });
        }
      }
    });
  };

  render() {
    const { avatarImageUrl, isError } = this.state;
    const { user } = this.props;

    return (
      <div className={b()}>
        <div>
          <div className={b('header')}>
            <h1 className={b('header-title')}>
              Мой профиль
            </h1>
          </div>
          <ProfileForm
            wrappedComponentRef={form => this.profileForm = form}
            user={user}
            uploadAvatarImage={this.uploadAvatarImage}
            avatarImageUrl={avatarImageUrl}
            isError={isError}
          />
        </div>

        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          {
            user && user.name ? (
              <>
                <Col lg={12}>
                  <Link to="/corporations">
                    <Button
                      className={b('controlBtns-btn backBtn')}
                    >
                      <Icon type="left" />
                      Компании
                    </Button>
                  </Link>
                </Col>
                <Col lg={12}>
                  <Button
                    className={b('controlBtns-btn')}
                    type="primary"
                  >
                    Сохранить
                  </Button>
                </Col>
              </>
            ) : (
              <Col lg={24}>
                <Button
                  className={b('controlBtns-btn')}
                  type="primary"
                  onClick={this.handleUpdateUserData}
                >
                  Обновить профиль
                </Button>
              </Col>
            )
          }
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  updateUserData: user => dispatch(actions.auth.$updateUserData(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);
