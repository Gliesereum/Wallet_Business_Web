import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactCodeInput from "react-code-input";

import { PhoneForm, Timer } from "../../components";

import { notification } from "antd";

import { asyncRequest } from "../../utils";
import { actions } from "../../state";

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
			const { updateUserData, addUserEmail, checkAuthenticate } = this.props;
			const body = { value: phone, type: 'PHONE', code };
			const userDataUrl = "auth/signin";
			const userEmailUrl = "email/by-user";

			try {
				const {user, tokenInfo} = await asyncRequest({ url: userDataUrl, body, method: 'POST' });
				const userEmail = await asyncRequest({ url: userEmailUrl });

				await updateUserData(user);
				await addUserEmail(userEmail);

				await checkAuthenticate(tokenInfo);
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
							<div>
								<Timer time={180000} />
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
								<PhoneForm
									getCodeHandler={this.getCodeHandler}
								/>
							</div>
						</div>
				}
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	updateUserData: user => dispatch(actions.auth.$updateUserData(user)),
	addUserEmail: email => dispatch(actions.auth.$addUserEmail(email)),
	checkAuthenticate: (tokenInfo) => dispatch(actions.auth.$checkAuthenticate(tokenInfo)),
	dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
});

export default withRouter(connect(null, mapDispatchToProps)(SignIn));
