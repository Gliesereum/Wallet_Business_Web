import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Upload,
  Spin,
  notification,
} from 'antd';

import { UploadBtn } from '../../assets/iconComponents';

import {
  asyncUploadFile,
  withToken,
} from '../../utils';

const { Dragger: UploadDragger } = Upload;
const b = bem('avatarAndCoverUploader');

const sizeChecker = (size, maxSize) => size && (size / 1024 / 1024) < maxSize; // image should be equal or less than 2MB;
const typeChecker = fileType => fileType && (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg'); // img should be one of next types: 'jpeg', 'jpg', 'png'

class AvatarAndCoverUploader extends Component {
  state = {
    uploadedCoverUrl: null,
    uploadedLogoUrl: null,
    loading: false,
    error: false,
  };

  uploadCover = uploadType => async ({ file, onSuccess }) => {
    const { onLoadCover, onLoadLogo, maxSize = 2 } = this.props;

    this.setState({ loading: true, error: false });

    if (!sizeChecker(file.size, maxSize) || !typeChecker(file.type)) {
      this.setState({ loading: false, error: true });
      return;
    }

    const body = new FormData();
    await body.append('file', file);
    await body.append('open', true);

    try {
      const { url: uploadedImageUrl } = await withToken(asyncUploadFile)({ url: 'upload', body, onSuccess });

      if (uploadType === 'cover') {
        onLoadCover(uploadedImageUrl);
        this.setState({ uploadedCoverUrl: uploadedImageUrl });
      }

      if (uploadType === 'logo') {
        onLoadLogo(uploadedImageUrl);
        this.setState({ uploadedLogoUrl: uploadedImageUrl });
      }
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    }
  };

  finishImgLoading = () => this.setState({ loading: false });

  render() {
    const {
      cover,
      logo,
      withCoverUploader = false,
      readOnlyMode,
    } = this.props;
    const {
      loading,
      error,
      uploadedCoverUrl,
      uploadedLogoUrl,
    } = this.state;

    let coverUrl;
    let logoUrl;
    if (uploadedCoverUrl) {
      coverUrl = uploadedCoverUrl;
    } else if (cover) {
      coverUrl = cover;
    } else {
      coverUrl = null;
    }

    if (uploadedLogoUrl) {
      logoUrl = uploadedLogoUrl;
    } else if (logo) {
      logoUrl = logo;
    } else {
      logoUrl = null;
    }

    return (
      <div className={b()}>
        {
          loading && (
            <Spin
              className={b('spinner')}
              size="large"
            />
          )
        }
        {
          error && (
            <div className={b('errorBox')}>
              <span>Файл не должен превышать 2 МБ и должен быть у формате PNG | JPG | JPEG</span>
            </div>
          )
        }
        {
          withCoverUploader && (
            <UploadDragger
              disabled={readOnlyMode}
              className={b('cover')}
              name="file"
              listType="picture-card"
              showUploadList={false}
              customRequest={this.uploadCover('cover')}
            >
              <div className={b('cover-container')}>
                {
                  !readOnlyMode && (
                    <div className={b('cover-uploadBtn')}>
                      <UploadBtn />
                    </div>
                  )
                }
                {
                  coverUrl && (
                    <img
                      onLoad={this.finishImgLoading}
                      className={b('cover-image')}
                      src={coverUrl}
                      alt="cover_image"
                    />
                  )
                }
              </div>
            </UploadDragger>
          )
        }
        <UploadDragger
          disabled={readOnlyMode}
          className={b('logo')}
          name="file"
          listType="picture-card"
          showUploadList={false}
          customRequest={this.uploadCover('logo')}
        >
          <div className={b('logo-container')}>
            {
              !readOnlyMode && (
                <div className={b('logo-uploadBtn')}>
                  <UploadBtn />
                </div>
              )
            }
            {
              logoUrl && (
                <img
                  onLoad={this.finishImgLoading}
                  className={b('logo-image')}
                  src={logoUrl}
                  alt="logo_image"
                />
              )
            }
          </div>
        </UploadDragger>
      </div>
    );
  }
}

export default AvatarAndCoverUploader;
