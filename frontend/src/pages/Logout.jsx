import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/redux/auth/actions";
import { crud } from "@/redux/crud/actions";
import { erp } from "@/redux/erp/actions";
import PageLoader from "@/components/PageLoader";

const Logout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
    
	const asyncLogout = useCallback(() => {
		dispatch(logoutAction());
	}, [dispatch]);

	useLayoutEffect(() => {
		dispatch(crud.resetState());
		dispatch(erp.resetState());
	}, [dispatch]);

	useEffect(() => {
		asyncLogout();
		navigate("/login");
	}, [navigate, asyncLogout]);

	return <PageLoader />;
};
export default Logout;
