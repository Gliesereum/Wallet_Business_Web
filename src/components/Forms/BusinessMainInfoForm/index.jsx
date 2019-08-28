import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Form,
  Row,
  Col,
  Input,
  AutoComplete,
  Select,
  Upload,
  Spin,
} from 'antd';

import Map from '../../Map';
import PhoneInput from '../../PhoneInput';
import { AddIcon } from '../../../assets/iconComponents';

import config from '../../../config';
import { defaultGeoPosition } from '../../Map/mapConfig';
import { translateBusinessType } from '../../../mocks';

const FormItem = Form.Item;
const { Dragger: UploadDragger } = Upload;
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
});

class BusinessMainInfoForm extends Component {
  state = {
    disabled: false,
    addressNodes: [],
    currentAddress: null,
    currentLocation: null,
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
      logoUrl,
      loading,
      isError,
      onChange,
      uploadBusinessImage,
      changeBusinessType,
    } = this.props;
    const {
      addressNodes, currentLocation, currentAddress,
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
    } : initialFieldValues(chosenCorpId);

    let businessCategoriesList = [];
    if (chosenBusiness && chosenBusiness.id) {
      businessCategoriesList = [chosenBusiness.businessCategory];
    } else if (businessCategories && businessCategories.length) {
      businessCategoriesList = businessCategories;
    }

    return (
      <Form
        className={b()}
      >
        <div className={b('content')}>
          <Row gutter={31}>
            <Col lg={16}>
              <Row gutter={31}>
                <Col lg={12}>
                  <UploadDragger
                    className={b('uploader')}
                    name="file"
                    listType="picture-card"
                    showUploadList={false}
                    onChange={onChange}
                    customRequest={uploadBusinessImage}
                  >
                    <div className={b('uploader-container')}>
                      {
                        loading ? (
                          <Spin size="large" />
                        ) : (
                          <>
                            {
                              logoUrl && (
                                <img
                                  className={b('uploader-image')}
                                  src={logoUrl}
                                  alt="uploaded_image"
                                />
                              )
                            }
                            <div className={b('uploader-inside')}>
                              <AddIcon
                                className={b('uploader-inside-icon', { errorView: isError })}
                                size={{
                                  x: isError ? 32 : 48,
                                  y: isError ? 32 : 48,
                                }}
                              />
                              <h1 className={b('uploader-inside-header')}>
                                {
                                  chosenBusiness && chosenBusiness.logoUrl
                                    ? 'загрузить новый логотип'
                                    : 'добавить логотип'
                                }
                              </h1>
                              {
                                isError && (
                                  <p className={b('uploader-inside-error')}>
                                   Файл не должен превышать 2 МБ и должен быть у формате PNG | JPG | JPEG
                                  </p>
                                )
                              }
                            </div>
                          </>
                        )
                      }
                    </div>
                  </UploadDragger>
                </Col>
                <Col lg={12}>
                  <FormItem
                    label="Компания"
                  >
                    {form.getFieldDecorator('corporationId', {
                      initialValue: formInitValues.corporationId,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select placeholder="Выбрать компанию...">
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
                  <FormItem
                    label="Название филиала"
                  >
                    {form.getFieldDecorator('name', {
                      initialValue: formInitValues.name,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                        { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                      ],
                    })(<Input placeholder="Название филиала" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={31}>
                <Col lg={12}>
                  <FormItem
                    label="Сфера деятельности компании"
                  >
                    {form.getFieldDecorator('serviceType', {
                      initialValue: formInitValues.businessType,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                      onChange: changeBusinessType,
                    })(
                      <Select
                        placeholder="Выбрать..."
                        className={!isAddBusinessMode ? 'readOnly' : ''}
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
                <Col lg={12}>
                  <FormItem
                    label="Категория"
                  >
                    {form.getFieldDecorator('businessCategoryId', {
                      initialValue: formInitValues.businessCategory,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select
                        placeholder="Выбрать..."
                        className={!isAddBusinessMode ? 'readOnly' : ''}
                      >
                        {businessCategoriesList.map(corporation => (
                          <Select.Option
                            key={corporation.name}
                            value={corporation.id}
                          >
                            {corporation.name}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={31}>
                <Col lg={12}>
                  <FormItem
                    label="Описание филиала"
                  >
                    {form.getFieldDecorator('description', {
                      initialValue: formInitValues.description,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                        { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                      ],
                    })(<Input placeholder="Описание филиала" />)}
                  </FormItem>
                </Col>
                <Col lg={12}>
                  <FormItem
                    label="Номер телефона"
                  >
                    {form.getFieldDecorator('phone', {
                      initialValue: formInitValues.phone,
                      rules: [
                        { required: true, message: 'Пожалуйста, введите ваш номер телефона' },
                        { pattern: new RegExp(/^[\d ]{5,13}$/), message: 'Номер введен неверно. Повторите попытку' },
                      ],
                    })(
                      <PhoneInput />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col lg={8}>
              <FormItem
                label="Адрес"
              >
                {form.getFieldDecorator('address', {
                  initialValue: currentAddress || formInitValues.currentAddressValue,
                  rules: [
                    { required: true, message: 'Поле обязательное для заполнения' },
                  ],
                })(
                  <AutoComplete
                    placeholder="Адрес"
                    onSearch={this.searchAddressHandler}
                    dataSource={addressNodes}
                    onSelect={this.selectAddressByInputHandler}
                  />
                )}
              </FormItem>
              <Map
                containerElement={<div style={{ height: '272px', marginTop: '24px' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                loadingElement={<div style={{ height: '100%' }} />}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleAPIKey}&libraries=geometry,drawing,places`}
                currentLocation={currentLocation || formInitValues.currentLocationValue}
                onSelect={this.selectAddressByMarkerHandler}
                singlePin
                draggable
              />
            </Col>
          </Row>
        </div>
      </Form>
    );
  }
}

export default Form.create({})(BusinessMainInfoForm);
