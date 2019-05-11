import React, {Component} from 'react';

import {
  Form,
  Input,
  AutoComplete,
  Select,
  Button,
  notification,
} from 'antd';

import {Map} from '../index';

import {
  asyncRequest,
  withToken,
} from '../../utils';
import config from '../../config';

const initialFieldValues = {
  corporationId: '',
  name: '',
  description: '',
  businessType: '',
  businessCategory: '',
  currentAddressValue: '',
  currentLocationValue: {
    lat: 50.4220293,
    lng: 30.4747438,
  }
};

class BusinessMainInfo extends Component {
  state = {
    addressNodes: [],
    currentAddress: null,
    currentLocation: null,
  };

  searchAddressHandler = (value) => {
    if (value.length >= 2) {
      const autoCompleteUrl = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${value}&key=${config.googleAPIKey}`;
      fetch(config.corsUrl + autoCompleteUrl)
        .then(data => data.json())
        .then(({predictions}) => {
            const addressNodes = predictions.map(item => (
                <AutoComplete.Option
                  key={item.description}
                  value={item.description}
                  address={item}
                >
                  {item.description}
                </AutoComplete.Option>
              )
            );
            this.setState(state => ({
              ...state,
              addressNodes,
            }));
          }
        );
    }
  };

  getPlaceInfo = async id => {
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&fields=geometry&key=${config.googleAPIKey}`;
    const request = await fetch(config.corsUrl + placeDetailsUrl);
    return await request.json();
  };

  selectAddressByInputHandler = async (value, addressObj) => {
    const {result} = await this.getPlaceInfo(addressObj.props.address.place_id);
    this.setState(state => ({
      ...state,
      currentAddress: value,
      currentLocation: result.geometry.location,
    }))
  };

  selectAddressByMarkerHandler = async ({latLng}) => {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };

    const addressUrl = `${config.corsUrl}https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&sensor=true&key=${config.googleAPIKey}`;
    const request = await fetch(addressUrl);
    const {results} = await request.json();
    const address = results[0].formatted_address;
    this.setState(state => ({
      ...state,
      currentAddress: address,
      currentLocation: location,
    }));
    this.props.form.setFieldsValue({address});
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const {form, dataLoading, updateBusiness, isAddMode, addNewBusiness, singleBusiness} = this.props;
    const {currentLocation} = this.state;
    const businessHandler = isAddMode ? addNewBusiness : updateBusiness;

    form.validateFields(async (err, values) => {
      if (!err) {
        await dataLoading(true);
        const businessUrl = 'business';
        const method = isAddMode ? 'POST' : 'PUT';
        const moduleUrl = 'karma';
        const body = {
          ...singleBusiness,
          ...values,
          latitude: currentLocation ? currentLocation.lat : singleBusiness.latitude,
          longitude: currentLocation ? currentLocation.lng : singleBusiness.longitude,
        };

        try {
          const newBusiness = await withToken(asyncRequest)({url: businessUrl, method, moduleUrl, body});
          await businessHandler(newBusiness)
        } catch (error) {
          notification.error(error.message || 'Ошибка');
        } finally {
          await dataLoading(false);
        }
      }
    })
  };

  render() {
    const {
      singleBusiness,
      businessTypes,
      businessCategories,
      form,
      corporations,
      isAddMode = false,
      onToggleModal,
    } = this.props;

    const {addressNodes, currentLocation, currentAddress} = this.state;

    const formInitValues = singleBusiness ? {
      corporationId: corporations.filter(corp => corp.id === singleBusiness.corporationId)[0].id,
      name: singleBusiness.name,
      description: singleBusiness.description,
      businessType: singleBusiness.businessCategory.businessType,
      businessCategory: singleBusiness.businessCategory.description,
      currentAddressValue: singleBusiness.address,
      currentLocationValue: {
        lat: singleBusiness.latitude,
        lng: singleBusiness.longitude,
      },
    } : initialFieldValues;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label="Компания"
        >
          {form.getFieldDecorator('corporationId', {
            initialValue: formInitValues.corporationId,
          })(<Select placeholder="Компания">
            {corporations && corporations.map(corporation => (
              <Select.Option
                key={corporation.name}
                value={corporation.id}
              >
                {corporation.name}
              </Select.Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item
          label="Название"
        >
          {form.getFieldDecorator('name', {
            initialValue: formInitValues.name,
            rules: [
              {required: true, message: 'Поле обязательное для заполнения'},
              {whitespace: true, message: 'Поле не может содержать только пустые пробелы'},
            ],
          })(<Input placeholder="Название бизнесса"/>)}
        </Form.Item>
        <Form.Item
          label="Описание"
        >
          {form.getFieldDecorator('description', {
            initialValue: formInitValues.description,
            rules: [
              {required: true, message: 'Поле обязательное для заполнения'},
              {whitespace: true, message: 'Поле не может содержать только пустые пробелы'},
            ]
          })(<Input placeholder="Описание бизнесса"/>)}
        </Form.Item>

        {
          isAddMode ? (
            <>
              <Form.Item>
                {form.getFieldDecorator('phone', {
                  rules: [
                    {required: true, message: 'Please enter your phone number!'},
                    {pattern: new RegExp(/^[\d ]{12}$/), message: 'Invalid phone number!'},
                  ],
                })(
                  <Input
                    size="large"
                    placeholder="380501234567"
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Деловая активность"
              >
                {form.getFieldDecorator('serviceType', {
                  initialValue: '',
                })(<Select placeholder="Деловая активность">
                  {businessTypes && businessTypes.map(businessType => (
                    <Select.Option
                      key={businessType}
                      value={businessType}
                    >
                      {businessType}
                    </Select.Option>
                  ))}
                </Select>)}
              </Form.Item>
              <Form.Item
                label="Категория бизнесса"
              >
                {form.getFieldDecorator('businessCategoryId', {
                  initialValue: '',
                })(<Select placeholder="Категория бизнесса">
                  {businessCategories && businessCategories.map(corporation => (
                    <Select.Option
                      key={corporation.name}
                      value={corporation.id}
                    >
                      {corporation.name}
                    </Select.Option>
                  ))}
                </Select>)}
              </Form.Item>
            </>
          ) : (
            <>
              <div>
                <span>Деловая активность</span>
                <span>{formInitValues.businessType}</span>
              </div>
              <div>
                <span>Категория бизнесса</span>
                <span>{formInitValues.businessCategory}</span>
              </div>
            </>
          )
        }
        {/*<Form.Item*/}
        {/*  label="Количество боксов"*/}
        {/*>*/}
        {/*  {form.getFieldDecorator("spaces", {*/}
        {/*    initialValue: spaces ? spaces.length : 0,*/}
        {/*  })(<InputNumber placeholder="Количество боксов"/>)}*/}
        {/*</Form.Item>*/}
        <Form.Item
          label="Адрес"
        >
          {form.getFieldDecorator('address', {
            initialValue: currentAddress ? currentAddress : formInitValues.currentAddressValue,
          })(
            <AutoComplete
              placeholder="Адрес"
              onSearch={this.searchAddressHandler}
              dataSource={addressNodes}
              onSelect={this.selectAddressByInputHandler}
            />
          )}
        </Form.Item>
        <Map
          containerElement={<div style={{height: '400px'}}/>}
          mapElement={<div style={{height: '100%'}}/>}
          loadingElement={<div style={{height: '100%'}}/>}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleAPIKey}&libraries=geometry,drawing,places`}
          location={currentLocation ? currentLocation : formInitValues.currentLocationValue}
          onSelect={this.selectAddressByMarkerHandler}
        />

        <Button
          htmlType="submit"
          type="primary"
        >
          {isAddMode ? 'Создать бизнесс' : 'Сохранить изменения'}
        </Button>
        {
          isAddMode && (
            <Button onClick={onToggleModal}>Отмена</Button>
          )
        }
      </Form>
    )
  }
}

export default Form.create({})(BusinessMainInfo);
