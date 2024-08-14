import NotFound from "@/components/NotFound";

import { ErpLayout } from "@/layout";
import UpdateItem from "@/modules/ErpPanelModule/UpdateItem";
import EmailForm from "./components/components";

import PageLoader from "@/components/PageLoader";

import { erp } from "@/redux/erp/actions";
import { selectReadItem } from "@/redux/erp/selectors";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

export default function UpdateEmailModule({ config }) {
	const dispatch = useDispatch();

	const { id } = useParams();

	useLayoutEffect(() => {
		dispatch(erp.read({ entity: config.entity, id }));
	}, [id, config, dispatch]);

	const {
		result: currentResult,
		isSuccess,
		isLoading = true,
	} = useSelector(selectReadItem);

	useLayoutEffect(() => {
		if (currentResult) {
			dispatch(
				erp.currentAction({ actionType: "update", data: currentResult }),
			);
		}
	}, [currentResult, dispatch]);

	if (isLoading) {
		return (
			<ErpLayout>
				<PageLoader />
			</ErpLayout>
		);
	}
	return (
		<ErpLayout>
			{isSuccess ? (
				<UpdateItem config={config} UpdateForm={EmailForm} />
			) : (
				<NotFound entity={config.entity} />
			)}
		</ErpLayout>
	);
}
