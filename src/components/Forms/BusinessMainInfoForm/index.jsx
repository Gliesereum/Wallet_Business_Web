// @flow // TODO: DELETE flow from project and packages

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
import ProneInput from '../../ProneInput';

import config from '../../../config';
import { defaultGeoPosition } from '../../Map/mapConfig';

const FormItem = Form.Item;
const b = bem('businessMainForm');

const translateBusinessType = {
  CAR: 'Машины',
};

type Prop = {
  singleBusiness: {},
  businessTypes: string[],
  businessCategories: {}[],
  form: Form,
  corporations: {}[],
  isAddBusinessMode: boolean,
}

type State = {
  addressNodes: React.Node[],
  currentAddress: {},
  currentLocation: {},
}

const initialFieldValues = (chosenCorpId: {} = undefined): {} => ({
  corporationId: chosenCorpId,
  name: '',
  description: '',
  phone: '',
  businessType: undefined,
  businessCategory: undefined,
  currentAddressValue: '',
  currentLocationValue: defaultGeoPosition,
});

class BusinessMainInfoForm extends Component<Prop, State> {
  state = {
    disabled: false,
    addressNodes: [],
    currentAddress: null,
    currentLocation: defaultGeoPosition,
  };

  searchAddressHandler = (value: string) => {
    if (value.length >= 2) {
      const autoCompleteUrl = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${value}&key=${config.googleAPIKey}`;
      fetch(config.corsUrl + autoCompleteUrl)
        .then((data: Response): object => data.json())
        .then(({ predictions }: { predictions: {}[] }) => {
          const addressNodes = predictions.map((item: object): React.Node => (
            <AutoComplete.Option
              key={item.description}
              value={item.description}
              address={item}
            >
              {item.description}
            </AutoComplete.Option>
          ));
          this.setState((prevState: State): {} => ({
            ...prevState,
            addressNodes,
          }));
        });
    }
  };

  getPlaceInfo = async (id: string): {} => {
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&fields=geometry&key=${config.googleAPIKey}`;
    const request = await fetch(config.corsUrl + placeDetailsUrl);
    return request.json();
  };

  getTimeZoneInfo = async (location: {}): {} => {
    // get timestamp in seconds for knowing if Daylight Savings Time offset is exist;
    const timestamp = new Date().getTime() / 1000;
    const timeZoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat},${location.lng}&timestamp=${timestamp}&key=${config.googleAPIKey}`;
    const request = await fetch(config.corsUrl + timeZoneUrl);
    const { dstOffset, rawOffset } = await request.json();
    return (rawOffset + dstOffset) / 60; // get timezone in hours;
  };

  selectAddressByInputHandler = async (value: string, addressObj: {}) => {
    const { changeCurrentLocation, changeCurrentTimeZone } = this.props;
    const { result } = await this.getPlaceInfo(addressObj.props.address.place_id);
    const timezone = await this.getTimeZoneInfo(result.geometry.location);

    this.setState((prevState: State): {} => {
      changeCurrentLocation(result.geometry.location);
      changeCurrentTimeZone(timezone);
      return {
        ...prevState,
        currentAddress: value,
        currentLocation: result.geometry.location,
      };
    });
  };

  selectAddressByMarkerHandler = async ({ latLng }: { latLng: {} }): any => {
    const { form, changeCurrentLocation } = this.props;
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };

    const addressUrl = `${config.corsUrl}https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&sensor=true&key=${config.googleAPIKey}`;
    const request = await fetch(addressUrl);
    const { results } = await request.json();
    const address = results[0].formatted_address;
    this.setState((prevState: State): {} => {
      changeCurrentLocation(location);
      return {
        ...prevState,
        currentAddress: address,
        currentLocation: location,
      };
    });
    form.setFieldsValue({ address });
  };

  render(): React.Node {
    const {
      singleBusiness,
      businessTypes,
      businessCategories,
      form,
      corporations = [],
      isAddBusinessMode,
      chosenCorpId,
    } = this.props;
    const {
      addressNodes, currentLocation, currentAddress,
    } = this.state;

    const formInitValues = singleBusiness ? {
      corporationId: corporations.filter((corp: {}): {} => corp.id === singleBusiness.corporationId)[0].id,
      name: singleBusiness.name,
      description: singleBusiness.description,
      phone: singleBusiness.phone.replace(/[()\s+]/g, ''),
      businessType: singleBusiness.businessCategory.businessType,
      businessCategory: singleBusiness.businessCategory.id,
      currentAddressValue: singleBusiness.address,
      currentLocationValue: {
        lat: singleBusiness.latitude,
        lng: singleBusiness.longitude,
      },
    } : initialFieldValues(chosenCorpId);

    return (
      <Form
        className={b()}
      >
        <div className={b('content')}>
          <Row
            gutter={40}
            className={b('outerRow')}
          >
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
                    {corporations.length && corporations.map((corporation: {}): React.Node => (
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
            </Col>
            <Col lg={12}>
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
            </Col>
          </Row>
          <Row
            gutter={40}
            className={b('outerRow')}
          >
            <Col lg={12}>
              <Row gutter={20}>
                <Col lg={12}>
                  <FormItem
                    label="Название бизнеса"
                  >
                    {form.getFieldDecorator('name', {
                      initialValue: formInitValues.name,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                        { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                      ],
                    })(<Input placeholder="Название бизнесса" />)}
                  </FormItem>
                </Col>
                <Col lg={12}>
                  <FormItem
                    label="Номер телефона"
                  >
                    {form.getFieldDecorator('phone', {
                      initialValue: formInitValues.phone,
                      rules: [
                        { required: true, message: 'Please enter your phone number!' },
                        { pattern: new RegExp(/^[\d ]{5,13}$/), message: 'Не верный номер телефона' },
                      ],
                    })(
                      <ProneInput />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col lg={12}>
                  <FormItem
                    label="Категория бизнесса"
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
                        {businessCategories && businessCategories.map((corporation: {}): React.Node => (
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
                <Col lg={12}>
                  <FormItem
                    label="Деловая активность"
                  >
                    {form.getFieldDecorator('serviceType', {
                      initialValue: formInitValues.businessType,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select
                        placeholder="Выбрать..."
                        className={!isAddBusinessMode ? 'readOnly' : ''}
                      >
                        {businessTypes && businessTypes.map((businessType: string): React.Node => (
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
              </Row>
              <Row gutter={40}>
                <Col lg={24}>
                  <FormItem
                    label="Оприделение бизнеса (описание)"
                  >
                    {form.getFieldDecorator('description', {
                      initialValue: formInitValues.description,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                        { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                      ],
                    })(<Input placeholder="Описание бизнесса" />)}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col lg={12}>
              <Map
                containerElement={<div style={{ height: '272px', marginTop: '24px' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                loadingElement={<div style={{ height: '100%' }} />}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleAPIKey}&libraries=geometry,drawing,places`}
                currentLocation={currentLocation || formInitValues.currentLocationValue}
                onSelect={this.selectAddressByMarkerHandler}
                singlePin
              />
            </Col>
          </Row>
        </div>
      </Form>
    );
  }
}

export default Form.create({})(BusinessMainInfoForm);
