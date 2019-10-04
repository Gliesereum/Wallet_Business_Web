import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Upload,
  Spin,
  notification,
  Icon,
  Modal,
  Row,
  Col,
  Input,
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
    loading: false,
    error: false,
    viewImageUrl: null,
  };

  uploadCover = (uploadType, galleryIndex) => async ({ file, onSuccess }) => {
    const {
      maxSize = 2,
      onLoadCover,
      onLoadLogo,
      onLoadGallery,
    } = this.props;

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
      }

      if (uploadType === 'logo') {
        onLoadLogo(uploadedImageUrl);
      }

      if (uploadType === 'gallery') {
        onLoadGallery(uploadedImageUrl, galleryIndex);
      }
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    }
  };

  deleteImage = id => (e) => {
    e.stopPropagation();
    const { deleteGalleryImage } = this.props;

    deleteGalleryImage(id);
  };

  finishImgLoading = () => this.setState({ loading: false });

  viewImageChanger = (media, forReadOnly = false) => (e) => {
    if (forReadOnly && !this.props.readOnlyMode) return;
    e.stopPropagation();
    this.setState({ viewImageUrl: media ? media.url : null });
  };

  videoUrlHandler = (e) => {
    const { value } = e.target;
    const { changeVideoUrl } = this.props;

    changeVideoUrl(value);
  };

  render() {
    const {
      cover,
      logo,
      video,
      withCoverUploader = false,
      readOnlyMode,
      withGallery,
      businessMedia,
    } = this.props;
    const {
      loading,
      error,
      viewImageUrl,
    } = this.state;

    const cellsForBusinessMedia = [...businessMedia];
    for (let i = 0; cellsForBusinessMedia.length < 6; i += 1) {
      cellsForBusinessMedia.push(null);
    }

    return (
      <div className={b({ withGallery })}>
        <div className={b('mainUploadWrapper')}>
          {
            loading && (
              <Spin
                className={b('spinner')}
                size="large"
              />
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
                    cover && (
                      <img
                        onLoad={this.finishImgLoading}
                        className={b('cover-image')}
                        src={cover}
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
                logo && (
                  <img
                    onLoad={this.finishImgLoading}
                    className={b('logo-image')}
                    src={logo}
                    alt="logo_image"
                  />
                )
              }
            </div>
          </UploadDragger>
        </div>
        <Row
          className={b('gallery')}
          gutter={16}
        >
          {
            withGallery && cellsForBusinessMedia.map((item, index) => (
              <Col
                key={`${index + 1}`}
                span={12}
              >
                <UploadDragger
                  disabled={readOnlyMode}
                  className={b('gallery-item')}
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  customRequest={this.uploadCover('gallery', index)}
                >
                  <div
                    className={b('gallery-item-container')}
                    onClick={this.viewImageChanger(item, true)}
                  >
                    {
                      !readOnlyMode && (
                        <div className={b('gallery-item-uploadBtn')}>
                          <UploadBtn />
                        </div>
                      )
                    }
                    {/* delete icon (with handler) */}
                    {
                      (!readOnlyMode && item) && (
                        <div
                          className={b('gallery-item-deleteBtn')}
                          onClick={this.deleteImage(item.id)}
                        >
                          <Icon type="delete" />
                        </div>
                      )
                    }
                    {/* view modal trigger */}
                    {
                      (!readOnlyMode && item) && (
                        <div
                          className={b('gallery-item-viewerTrigger')}
                          onClick={this.viewImageChanger(item)}
                        >
                          <Icon type="eye" />
                        </div>
                      )
                    }
                    {
                      item && (
                        <img
                          onLoad={this.finishImgLoading}
                          className={b('gallery-item-image')}
                          src={item.url}
                          alt="cover_image"
                        />
                      )
                    }
                  </div>
                </UploadDragger>
              </Col>
            ))
          }
        </Row>
        <div className={b('errorBox', { error })}>
          <span>Файл не должен превышать 2 МБ и должен быть у формате PNG | JPG | JPEG</span>
        </div>
        <div className={b('video')}>
          <span className={b('video-label')}>Ссылка на видео</span>
          <Input
            readOnly={readOnlyMode}
            className={b('video-input')}
            value={video}
            onChange={this.videoUrlHandler}
          />
        </div>
        {
          !!viewImageUrl && (
            <Modal
              visible={!!viewImageUrl}
              className={b('viewer')}
              footer={null}
              centered
              onCancel={this.viewImageChanger(null)}
            >
              <img
                className={b('viewer-image')}
                src={viewImageUrl}
                alt=""
              />
            </Modal>
          )
        }
      </div>
    );
  }
}

export default AvatarAndCoverUploader;
