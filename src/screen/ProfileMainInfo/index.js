import React, { Component } from "react";
import { connect } from "react-redux";

import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Icon,
  notification,
} from "antd";

import {
  asyncUploadFile,
  asyncRequest,
  withToken,
  getFirstLetterName,
} from "../../utils";
import defaultCoverImg from "../../assets/drawer-cover.png";
import { actions } from "../../state";

import "./index.scss";

const fieldsList = [
  {
    name: "firstName",
    label: "Имя",
    rules: [
      { required: true,  message: "Поле обязательное для заполнения" },
      { min: 2, message: "Минимальное количество символов: 2" },
      { whitespace: true, message: "Поле не может содержать только пустые пробелы" },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: "lastName",
    label: "Фамилия",
    rules: [
      { required: true,  message: "Поле обязательное для заполнения" },
      { min: 2, message: "Минимальное количество символов: 2" },
      { whitespace: true, message: "Поле не может содержать только пустые пробелы" },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: "middleName",
    label: "Отчество",
    rules: [
      { required: true,  message: "Поле обязательное для заполнения" },
      { min: 3, message: "Минимальное количество символов: 3" },
      { whitespace: true, message: "Поле не может содержать только пустые пробелы" },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: "country",
    label: "Страна проживания",
    rules: [
      { required: true,  message: "Поле обязательное для заполнения" },
      { min: 3, message: "Минимальное количество символов: 3" },
      { whitespace: true, message: "Поле не может содержать только пустые пробелы" },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: "city",
    label: "Город проживания",
    rules: [
      { required: true,  message: "Поле обязательное для заполнения" },
      { min: 3, message: "Минимальное количество символов: 3" },
      { whitespace: true, message: "Поле не может содержать только пустые пробелы" },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: "address",
    label: "Адресс",
    rules: [
      { required: true,  message: "Поле обязательное для заполнения" },
      { min: 6, message: "Минимальное количество символов: 6" },
      { whitespace: true, message: "Поле не может содержать только пустые пробелы" },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: "addAddress",
    label: "Дополнительный адресс",
    rules: [
      { whitespace: true, message: "Поле не может содержать только пустые пробелы" },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
];

class ProfileMainInfo extends Component {
  state = {
    avatarImageUrl: this.props.user ? this.props.user.avatarUrl : "",
    coverImageUrl: this.props.user ? this.props.user.coverUrl : "",
  };

  saveChangeHandler = (e) => {
    e.preventDefault();

    const { form, updateUserData, dataLoading } = this.props;

    form.validateFields( async (err, values) => {
      if (!err) {
        await dataLoading(true);
        const { avatarImageUrl, coverImageUrl } = this.state;
        const url = "user";
        const body = {
          avatarUrl: avatarImageUrl,
          coverUrl: coverImageUrl,
          ...values,
        };
        const method = "PUT";
        try {
          const updatedUser = await withToken(asyncRequest)({ url, method, body });
          await updateUserData(updatedUser);
        } catch (error) {
          notification.error(error.message || "Ошибка");
        } finally {
          await dataLoading(false);
        }
      }
    });
  };

  updateImageHandler = async (info, imageType) => {
    const { dataLoading } = this.props;
    await dataLoading(true);

    const url = "upload";
    const body = new FormData();
    await body.append('file', info.file);
    await body.append('open', true);
    const { url: imageUrl } = await withToken(asyncUploadFile)({ url, body });

    this.setState(
      { [`${imageType}ImageUrl`]: imageUrl },
      async () => await dataLoading(false),
    );
  };

  render() {
    const {
      avatarImageUrl,
      coverImageUrl,
    } = this.state;
    const {
      firstName,
      lastName,
      gender,
    } = this.props.user;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        lg: { span: 10 }
      },
      wrapperCol: {
        lg: { span: 10 }
      }
    };

    return (
      <Form
        className="profile-main-info-form"
        onSubmit={this.saveChangeHandler}
        { ...formItemLayout }
      >
        <div className="profile-main-info-form-upload">
          <Upload.Dragger
            wrapperCol={{ span: 14, offset: 11 }}
            className="profile-main-info-form-upload-avatarImg"
            name="file"
            beforeUpload={() => false}
            listType="picture-card"
            onChange={(info) => this.updateImageHandler(info, "avatar")}
            showUploadList={false}
          >
            <div>
              {avatarImageUrl ? <img src={avatarImageUrl} alt=""/> : <span>{getFirstLetterName(firstName, lastName)}</span>}
              <p className="profile-main-info-form-upload-avatarImg-content">
                <Icon type="plus" size="large"/>
              </p>
            </div>
          </Upload.Dragger>
          <Upload.Dragger
            className="profile-main-info-form-upload-coverImg"
            name="file"
            beforeUpload={() => false}
            listType="picture-card"
            onChange={(info) => this.updateImageHandler(info, "cover")}
            showUploadList={false}
          >
            <div>
              <img src={coverImageUrl ? coverImageUrl : defaultCoverImg} alt=""/>
              <p className="profile-main-info-form-upload-coverImg-content">
                <Icon type="plus" size="large"/>
              </p>
            </div>
          </Upload.Dragger>
        </div>

        {
          fieldsList.map(field => {
            const { label, rules, name, component } = field;
            return (
              <Form.Item
                key={name}
                label={label}
              >
                {getFieldDecorator(name, {
                  initialValue: this.props.user[name] || "",
                  rules,
                })(component)}
              </Form.Item>
            );
          })
        }
        <Form.Item
          key="gender"
          label="Пол"
        >
          {getFieldDecorator("gender", {
            initialValue: gender || "UNKNOWN",
          })(
            <Select size="large">
              <Select.Option value="UNKNOWN" key="UNKNOWN">Не указано</Select.Option>
              <Select.Option value="MALE" key="MALE">Мужской</Select.Option>
              <Select.Option value="FEMALE" key="FEMALE">Женский</Select.Option>
            </Select>
          )}
        </Form.Item>

        <Button htmlType="submit" type="primary" className="profile-main-info-form-save">
          Сохранить
        </Button>
      </Form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateUserData: user => dispatch(actions.auth.$updateUserData(user)),
  dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
});

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ProfileMainInfo));
