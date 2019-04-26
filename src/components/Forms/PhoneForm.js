import React, { Component } from "react";

import { Input, Form, Button } from "antd";

class PhoneForm extends Component {

	onSubmit = e => {
		e.preventDefault();

		const { getCodeHandler, form } = this.props;

		form.validateFields((error, values) => {
			if (!error) {
				getCodeHandler(values.phoneInput);
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Item>
					{getFieldDecorator("phoneInput", {
						rules: [
							{ required: true, message: "Please enter your phone number!" },
							{ pattern: new RegExp(/^[\d ]{12}$/), message: "Invalid phone number!" },
						],
						validateTrigger: "onBlur",
					})(
						<Input
							size="large"
							placeholder="380501234567"
							className="lg-app-input"
						/>
					)}
				</Form.Item>
				<Form.Item>
					<Button
						onClick={this.onSubmit}
						size="large"
					>
						Получить код
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

export default Form.create({})(PhoneForm);
