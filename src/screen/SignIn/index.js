import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactCodeInput from "react-code-input";

import InputPhone from "../../components/Forms/PhoneForm";

import { notification } from "antd";

import { asyncRequest } from "../../utils";
import authActions from "../../state/auth/action";


import "./index.scss";

const inputStyle = {
	backgroundColor: '#fff',
	border: "1px solid #DCDCDC",
	padding: '16px',
	fontSize: '24px',
	textAlign: 'center'
};

class SignIn extends Component {
	state = {
		phone: '',
		gotCode: false,
	};

	getCodeHandler = async (value) => {
		const url = `phone/code?phone=${value}`;

		try {
			await asyncRequest({ url });
			this.setState({ gotCode: true, phone: value });
		} catch (error) {
			notification.error(error.message || "Ошибка");
		}
	};

	sendCodeHandler = async (code) => {
		if (code.length === 6) {
			const { phone } = this.state;
			const body = { value: phone, type: 'PHONE', code };
			const url = 'auth/signin';

			try {
				const data = await asyncRequest({ url, body, method: 'POST' });
				this.props.$authUser(data);
			} catch (error) {
				notification.error(error.message || "Ошибка");
			}
		}
	};

	changeContactHandler = () => {
		this.setState({ gotCode: false });
	};

	render() {
		const { gotCode } = this.state;

		return (
			<div className="lg-app-auth-form">
				<div className="lg-app-auth-form-header">
					<h2>Вход</h2>
				</div>
				{
					gotCode ?
						<div className="auth-code-form-container">
							<div className="auth-code-form-header">
								<p className="lg-paragraph">
									Мы отправили 6 значный пароль на указаный номер телефона. Пожалуйста, введите его
								</p>
							</div>
							<div className="auth-code-form-inputs">
								<ReactCodeInput
									fields={6}
									type="number"
									autoFocus={true}
									className="lg-code-input-container"
									inputStyle={inputStyle}
									onChange={int => this.sendCodeHandler(int)}
								/>
							</div>
							<div className={"auth-code-form-footer"}>
								<span className="lg-link" onClick={this.changeContactHandler}>Ввести еще раз</span>
							</div>
						</div>
						: <div className="auth-phone-container">
							<div className="auth-form-phone-input-header">
								<p className="lg-paragraph">Введите ваш номер телефона для входа</p>
							</div>
							<div className="auth-form-phone-input">
								<InputPhone
									getCodeHandler={this.getCodeHandler}
								/>
							</div>
						</div>
				}
			</div>
		);
	}
}

export default withRouter(connect(state => state, { ...authActions })(SignIn));
