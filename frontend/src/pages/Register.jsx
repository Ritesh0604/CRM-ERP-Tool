import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useLanguage from "@/locale/useLanguage";

import { Form, Button, Result } from "antd";

import { selectAuth } from "@/redux/auth/selectors";
import RegisterForm from "@/forms/RegisterForm";
import Loading from "@/components/Loading";
import AuthModule from "@/modules/AuthModule";
import { register } from "@/redux/auth/actions";
const RegisterPage = () => {
	const translate = useLanguage();
	const { isLoading, isSuccess } = useSelector(selectAuth);
	const navigate = useNavigate();
	// const size = useSize();
    console.log(`In Register.jsx: isLoading:${isLoading} isSuccess:${isSuccess}`)
    
	const dispatch = useDispatch();
	const onFinish = (values) => {
		dispatch(register({ registerData: values }));
		navigate("/");
	};

	const FormContainer = () => {
		return (
			<Loading isLoading={isLoading}>
				<Form
					layout="vertical"
					name="normal_login"
					className="login-form"
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
				>
					<RegisterForm />
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="login-form-button"
							loading={isLoading}
							size="large"
						>
							{translate("Register")}
						</Button>
						{translate("Or")}{" "}
						<a href="/login"> {translate("already have account Login")} </a>
					</Form.Item>
				</Form>
			</Loading>
		);
	};
	if (!isSuccess) {
		return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign up" />;
	}
	return (
		<Result
			status="info"
			title={translate("Verify your account")}
			subTitle={translate("Check your email address to verify your account")}
			extra={
				<Button
					type="primary"
					onClick={() => {
						navigate("/login");
					}}
				>
					{translate("Login")}
				</Button>
			}
		/>
	);
};

export default RegisterPage;
