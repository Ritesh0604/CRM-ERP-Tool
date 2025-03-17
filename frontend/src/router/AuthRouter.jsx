import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { langCode } from "@/locale/languages";

import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import ForgetPassword from "@/pages/ForgetPassword";
import ResetPassword from "@/pages/ResetPassword";

import storePersist from "@/redux/storePersist";
import { translateAction } from "@/redux/translate/actions";
import { useDispatch } from "react-redux";

export default function AuthRouter() {
	const dispatch = useDispatch();

	useEffect(() => {
		const { loadDefaultLang } = storePersist.get("firstVisit");

		if (!loadDefaultLang) {
			dispatch(translateAction.translate(langCode()));
		}
	}, [dispatch]);

	return (
		<Routes>
			<Route element={<Login />} path="/" />
			<Route element={<Login />} path="/login" />
			<Route element={<Navigate to="/login" replace />} path="/logout" />
			<Route element={<Register />} path="/register" />
			<Route element={<ForgetPassword />} path="/forgetpassword" />
			<Route element={<Verify />} path="/verify/:userId/:emailToken" />
			<Route
				element={<ResetPassword />}
				path="/resetpassword/:userId/:resetToken"
			/>
		</Routes>
	);
}
