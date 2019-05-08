import React, { Component } from "react";

import {
  Form,
  Input,
  AutoComplete,
  Select,
  Button,
  notification,
} from "antd";

import { Map } from "../../components";

import {
  asyncRequest,
  withToken,
} from "../../utils";
import config from '../../config';

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
        .then(({ predictions }) => {
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
    const { result } = await this.getPlaceInfo(addressObj.props.address.place_id);
    this.setState(state => ({
      ...state,
      currentAddress: value,
      currentLocation: result.geometry.location,
    }))
  };

  selectAddressByMarkerHandler = async ({ latLng }) => {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };

    const addressUrl = `${config.corsUrl}https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&sensor=true&key=${config.googleAPIKey}`;
    const request = await fetch(addressUrl);
    const { results } = await request.json();
    const address = results[0].formatted_address;
    this.setState(state => ({
      ...state,
      currentAddress: address,
      currentLocation: location,
    }));
    this.props.form.setFieldsValue({ address });
  };

  updateBusiness = (e) => {
    e.preventDefault();

    const { form, dataLoading, updateBusiness, singleBusiness } = this.props;

    form.validateFields(async (err, values) => {
      if (!err) {
        await dataLoading(true);
        const businessUrl = "business";
        const method = "PUT";
        const moduleUrl = "karma";
        const body = {
          ...singleBusiness,
          ...values,
        };

        try {
          const newBusiness = await withToken(asyncRequest)({ url: businessUrl, method, moduleUrl, body });
          await updateBusiness(newBusiness)
        } catch (error) {
          notification.error(error.message || "Ошибка");
        } finally {
          await dataLoading(false);
        }
      }
    })

  };

  render() {
    const {
      singleBusiness,
      form,
      corporations,
    } = this.props;
    const {
      name,
      description,
      //spaces,
      corporationId,
      address,
      businessCategory: currentBusinessCategory,
      latitude,
      longitude,
    } = singleBusiness;
    const { addressNodes, currentLocation, currentAddress } = this.state;

    return (
      <Form onSubmit={this.updateBusiness}>
        <Form.Item
          label="Компания"
        >
          {form.getFieldDecorator("corporationId", {
            initialValue: corporations.filter(corp => corp.id === corporationId)[0].id,
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
          {form.getFieldDecorator("name", {
            initialValue: name,
            rules: [
              { required: true,  message: "Поле обязательное для заполнения" },
              { whitespace: true, message: "Поле не может содержать только пустые пробелы" },
            ],
          })(<Input placeholder="Название бизнесса"/>)}
        </Form.Item>
        <Form.Item
          label="Описание"
        >
          {form.getFieldDecorator("description", {
            initialValue: description,
            rules: [
              { required: true,  message: "Поле обязательное для заполнения" },
              { whitespace: true, message: "Поле не может содержать только пустые пробелы" },
            ]
          })(<Input placeholder="Описание бизнесса"/>)}
        </Form.Item>
        <div>
          <span>Деловая активность</span>
          <span>{currentBusinessCategory.businessType}</span>
        </div>
        <div>
          <span>Категория бизнесса</span>
          <span>{currentBusinessCategory.description}</span>
        </div>
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
          {form.getFieldDecorator("address", {
            initialValue: currentAddress ? currentAddress : address,
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
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          loadingElement={<div style={{ height: `100%` }} />}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleAPIKey}&libraries=geometry,drawing,places`}
          location={currentLocation ? currentLocation : { lat: latitude, lng: longitude }}
          onSelect={this.selectAddressByMarkerHandler}
        />

        <Button
          htmlType="submit"
          type="primary"
        >
          Сохранить изменения
        </Button>
      </Form>
    )
  }
}

export default Form.create({})(BusinessMainInfo);
