import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Form,
  Row,
  Col,
  Input,
  AutoComplete,
  Select,
} from 'antd';

import Map from '../../Map';
import PhoneInput from '../../PhoneInput';
import AvatarAndCoverUploader from '../../AvatarAndCoverUploader';

import config from '../../../config';
import { defaultGeoPosition } from '../../Map/mapConfig';
import { translateBusinessType } from '../../../mocks';

const FormItem = Form.Item;
const { Option } = Select;
const b = bem('businessMainForm');

const initialFieldValues = chosenCorpId => ({
  corporationId: chosenCorpId,
  name: '',
  description: '',
  phone: '',
  businessType: undefined,
  businessCategory: undefined,
  currentAddressValue: '',
  currentLocationValue: defaultGeoPosition,
  businessTags: undefined,
});

class BusinessMainInfoForm extends Component {
  state = {
    disabled: false,
    addressNodes: [],
    currentAddress: null,
    currentLocation: null,
    mapLoading: false,
  };

  reset = () => {
    this.setState({
      currentAddress: null,
      currentLocation: null,
    });
  };

  searchAddressHandler = (value) => {
    if (value.length >= 2) {
      const autoCompleteUrl = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${value}&key=${config.googleAPIKey}`;
      fetch(config.corsUrl + autoCompleteUrl)
        .then(data => data.json())
        .then(({ predictions }) => {
          const addressNodes = predictions.map(item => (
            <AutoComplete.Option
              key={item.description}
              value={item.description}
              address={item}
            >
              {item.description}
            </AutoComplete.Option>
          ));
          this.setState(prevState => ({
            ...prevState,
            addressNodes,
          }));
        });
    }
  };

  getPlaceInfo = async (id) => {
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&fields=geometry&key=${config.googleAPIKey}`;
    const request = await fetch(config.corsUrl + placeDetailsUrl);
    return request.json();
  };

  getTimeZoneInfo = async (location) => {
    // get timestamp in seconds for knowing if Daylight Savings Time offset is exist;
    const timestamp = new Date().getTime() / 1000;
    const timeZoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat},${location.lng}&timestamp=${timestamp}&key=${config.googleAPIKey}`;
    const request = await fetch(config.corsUrl + timeZoneUrl);
    const { dstOffset, rawOffset } = await request.json();
    return (rawOffset + dstOffset) / 60; // get timezone in hours;
  };

  selectAddressByInputHandler = async (value, addressObj) => {
    this.setState({ mapLoading: true });
    const { changeCurrentLocation, changeCurrentTimeZone } = this.props;
    const { result } = await this.getPlaceInfo(addressObj.props.address.place_id);
    const timezone = await this.getTimeZoneInfo(result.geometry.location);

    this.setState((prevState) => {
      changeCurrentLocation(result.geometry.location);
      changeCurrentTimeZone(timezone);
      return {
        ...prevState,
        currentAddress: value,
        currentLocation: result.geometry.location,
        mapLoading: false,
      };
    });
  };

  selectAddressByMarkerHandler = async ({ latLng }) => {
    const { form, changeCurrentLocation } = this.props;
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };

    const addressUrl = `${config.corsUrl}https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&sensor=true&key=${config.googleAPIKey}`;
    const request = await fetch(addressUrl);
    const { results } = await request.json();
    const address = results[0].formatted_address;
    this.setState((prevState) => {
      changeCurrentLocation(location);
      return {
        ...prevState,
        currentAddress: address,
        currentLocation: location,
      };
    });
    form.setFieldsValue({ address });
  };

  render() {
    const {
      chosenBusiness,
      businessTypes = [],
      businessCategories = [],
      form,
      corporations = [],
      isAddBusinessMode,
      chosenCorpId,
      defaultLanguage,
      phrases,
      readOnlyMode,
      uploadedCoverUrl,
      uploadedLogoUrl,
      uploadedVideoUrl,
      businessMedia,
      hasAdminRights,
      businessTags,
      tags,
      changeBusinessType,
      onLoadCover,
      onLoadLogo,
      onLoadGallery,
      deleteGalleryImage,
      changeVideoUrl,
    } = this.props;
    const {
      addressNodes,
      currentLocation,
      currentAddress,
      mapLoading,
    } = this.state;

    const formInitValues = chosenBusiness ? {
      corporationId: corporations.filter(corp => corp.id === chosenBusiness.corporationId)[0].id,
      name: chosenBusiness.name,
      description: chosenBusiness.description,
      phone: chosenBusiness.phone.replace(/[()\s+]/g, ''),
      businessType: chosenBusiness.businessCategory.businessType,
      businessCategory: chosenBusiness.businessCategory.id,
      currentAddressValue: chosenBusiness.address,
      currentLocationValue: {
        lat: chosenBusiness.latitude,
        lng: chosenBusiness.longitude,
      },
      businessTags: businessTags.map(item => item.id),
    } : initialFieldValues(chosenCorpId);

    let businessCategoriesList = [];
    if (chosenBusiness && chosenBusiness.id) {
      businessCategoriesList = [chosenBusiness.businessCategory];
    } else if (businessCategories && businessCategories.length) {
      businessCategoriesList = businessCategories;
    }

    let cover;
    let logo;
    let video;
    if (uploadedCoverUrl) {
      cover = uploadedCoverUrl;
    } else if (chosenBusiness) {
      cover = chosenBusiness.coverUrl;
    } else {
      cover = null;
    }

    if (uploadedLogoUrl) {
      logo = uploadedLogoUrl;
    } else if (chosenBusiness) {
      logo = chosenBusiness.logoUrl;
    } else {
      logo = null;
    }

    if (uploadedVideoUrl) {
      video = uploadedVideoUrl;
    } else if (chosenBusiness) {
      video = chosenBusiness.videoUrl;
    } else {
      video = null;
    }

    return (
      <Form className={b()}>
        <Row
          type="flex"
          gutter={32}
        >
          <Col
            xs={{ span: 24, order: 1 }}
            md={{ span: 24, order: 1 }}
            xl={{ span: 16, order: 1 }}
          >
            <Row gutter={32}>
              <Col
                xs={24}
                md={12}
                xl={12}
              >
                <FormItem style={{ display: 'none' }} label="Компания">
                  {form.getFieldDecorator('corporationId', {
                    initialValue: formInitValues.corporationId,
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                    ],
                  })(
                    <Select
                      className={readOnlyMode ? 'readOnly' : ''}
                      placeholder="Выбрать компанию..."
                    >
                      {corporations.length && corporations.map(corporation => (
                        <Select.Option
                          key={corporation.id}
                          value={corporation.id}
                        >
                          {corporation.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="Название филиала">
                  {form.getFieldDecorator('name', {
                    initialValue: formInitValues.name,
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                    ],
                  })(<Input
                    readOnly={readOnlyMode}
                    placeholder="Название филиала"
                  />)}
                </FormItem>
              </Col>
              <Col
                xs={24}
                md={12}
                xl={12}
              >
                <FormItem label={phrases['core.form.inputPhone.label'][defaultLanguage.isoKey]}>
                  {form.getFieldDecorator('phone', {
                    initialValue: formInitValues.phone,
                    rules: [
                      { required: true, message: 'Пожалуйста, введите ваш номер телефона' },
                      { pattern: new RegExp(/^[\d ]{5,13}$/), message: 'Номер введен неверно. Повторите попытку' },
                    ],
                  })(
                    <PhoneInput readOnly={readOnlyMode} />
                  )}
                </FormItem>
              </Col>
              <Col
                xs={24}
                md={24}
                xl={24}
              >
                <AvatarAndCoverUploader
                  cover={cover}
                  logo={logo}
                  video={video}
                  onLoadCover={onLoadCover}
                  onLoadLogo={onLoadLogo}
                  onLoadGallery={onLoadGallery}
                  deleteGalleryImage={deleteGalleryImage}
                  changeVideoUrl={changeVideoUrl}
                  withCoverUploader
                  maxSize={2}
                  readOnlyMode={readOnlyMode}
                  withGallery
                  businessMedia={businessMedia}
                />
              </Col>
            </Row>
          </Col>
          <Col
            xs={{ span: 24, order: 3 }}
            md={{ span: 12, order: 3 }}
            xl={{ span: 8, order: 2 }}
          >
            <FormItem label="Адрес">
              {form.getFieldDecorator('address', {
                initialValue: currentAddress || formInitValues.currentAddressValue,
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                ],
              })(
                <AutoComplete
                  disabled={readOnlyMode}
                  placeholder="Адрес"
                  onSearch={this.searchAddressHandler}
                  dataSource={addressNodes}
                  onSelect={this.selectAddressByInputHandler}
                />
              )}
            </FormItem>
            <Map
              loading={mapLoading}
              containerElement={<div className={b('map-containerElement')} />}
              mapElement={<div className={b('map-mapElement')} />}
              loadingElement={<div className={b('map-loadingElement')} />}
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleAPIKey}&libraries=geometry,drawing,places`}
              currentLocation={currentLocation || formInitValues.currentLocationValue}
              onSelect={this.selectAddressByMarkerHandler}
              singlePin
              draggable={!readOnlyMode}
            />
          </Col>
          <Col
            xs={{ span: 24, order: 2 }}
            md={{ span: 12, order: 2 }}
            xl={{ span: 24, order: 3 }}
          >
            <Row gutter={32}>
              <Col
                xs={24}
                md={24}
                xl={8}
              >
                <FormItem label="Сфера деятельности компании">
                  {form.getFieldDecorator('serviceType', {
                    initialValue: formInitValues.businessType,
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                    ],
                    onChange: changeBusinessType,
                  })(
                    <Select
                      placeholder="Выбрать..."
                      className={(!isAddBusinessMode || readOnlyMode) ? 'readOnly' : ''}
                    >
                      {businessTypes.length && businessTypes.map(businessType => (
                        <Select.Option
                          key={businessType}
                          value={businessType}
                        >
                          {translateBusinessType[businessType]}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                xs={24}
                md={24}
                xl={8}
              >
                <FormItem label="Категория">
                  {form.getFieldDecorator('businessCategoryId', {
                    initialValue: formInitValues.businessCategory,
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                    ],
                  })(
                    <Select
                      placeholder="Выбрать..."
                      className={(!isAddBusinessMode || readOnlyMode) ? 'readOnly' : ''}
                    >
                      {businessCategoriesList.map(corporation => (
                        <Option
                          key={corporation.name}
                          value={corporation.id}
                        >
                          {corporation.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                xs={24}
                md={24}
                xl={8}
              >
                <FormItem label={phrases['core.form.inputDetails.label'][defaultLanguage.isoKey]}>
                  {form.getFieldDecorator('description', {
                    initialValue: formInitValues.description,
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                    ],
                  })(<Input.TextArea
                    autosize
                    readOnly={readOnlyMode}
                    placeholder={phrases['core.form.inputDetails.label'][defaultLanguage.isoKey]}
                  />)}
                </FormItem>
              </Col>
              {
                hasAdminRights && (
                  <Col
                    xs={24}
                    md={24}
                    xl={24}
                  >
                    <FormItem label="Теги">
                      {form.getFieldDecorator('businessTags', {
                        initialValue: formInitValues.businessTags,
                      })(
                        <Select
                          mode="multiple"
                          className={readOnlyMode ? 'readOnly' : ''}
                        >
                          {tags.map(tag => (
                            <Option
                              key={tag.id}
                              value={tag.id}
                            >
                              {tag.name}
                            </Option>
                          ))}

                        </Select>
                      )}
                    </FormItem>
                  </Col>
                )
              }
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({})(BusinessMainInfoForm);
