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

const b = bem('profileInfo');

class ProfileInfo extends Component {
  state = {
    logoUrl: this.props.user ? this.props.user.avatarUrl : '',
    isError: false,
    fileLoader: false,
  };

  onUploaderChange = ({ file }) => {
    switch (file.status) {
      case 'uploading':
        this.setState({ fileLoader: true });
        break;
      case 'done':
        this.setState({ fileLoader: false });
        break;

      default:
        console.error('Error');
    }
  };

  uploadAvatarImage = async ({ file, onSuccess }) => {
    if ((file.size / 1024 / 1024) > 2) {
      this.setState({ isError: true });
      return;
    }
    const url = 'upload';
    const body = new FormData();
    await body.append('file', file);
    await body.append('open', true);
    const { url: imageUrl } = await withToken(asyncUploadFile)({ url, body, onSuccess });
    this.setState({ logoUrl: imageUrl, isError: false });
  };

  handleUpdateUserData = () => {
    const { updateUserData } = this.props;

    this.profileForm.props.form.validateFields(async (error, values) => {
      if (!error) {
        const url = 'user';
        const body = {
          avatarUrl: this.state.logoUrl,
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
    const { logoUrl, isError, fileLoader } = this.state;
    const { user, email, verifyUserEmail } = this.props;

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
            onChange={this.onUploaderChange}
            uploadAvatarImage={this.uploadAvatarImage}
            logoUrl={logoUrl}
            loading={fileLoader}
            isError={isError}
            email={email}
            verifyUserEmail={verifyUserEmail}
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
                  Обновить
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
  email: state.auth.email.email,
});

const mapDispatchToProps = dispatch => ({
  updateUserData: user => dispatch(actions.auth.$updateUserData(user)),
  verifyUserEmail: email => dispatch(actions.auth.$verifyUserEmail(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);
