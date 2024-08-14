import { useCallback, useLayoutEffect } from "react";

import DataTable from "./DataTable";

import Delete from "./DeleteItem";

import { useDispatch } from "react-redux";
import { advancedCrud } from "@/redux/advancedCrud/actions";

import { useAdvancedCrudContext } from "@/context/advancedCrud";

export default function AdvancedCrudPanel({ config, extra }) {
	const dispatch = useDispatch();
	const { state } = useAdvancedCrudContext();
	const { deleteModal } = state;

	const dispatcher = useCallback(() => {
		dispatch(advancedCrud.resetState());
	}, [dispatch]);

	useLayoutEffect(() => {
		const controller = new AbortController();
		dispatcher();
		return () => {
			controller.abort();
		};
	}, [dispatcher]);

	return (
		<>
			<DataTable config={config} extra={extra} />
			<Delete config={config} isOpen={deleteModal.isOpen} />
		</>
	);
}
