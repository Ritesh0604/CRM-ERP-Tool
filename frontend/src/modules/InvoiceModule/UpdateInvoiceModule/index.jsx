import NotFound from "@/components/NotFound";

import { ErpLayout } from "@/layout";
import UpdateItem from "@/modules/ErpPanelModule/UpdateItem";
import InvoiceForm from "@/modules/InvoiceModule/Forms/InvoiceForm";

import PageLoader from "@/components/PageLoader";

import { erp } from "@/redux/erp/actions";

import { selectReadItem } from "@/redux/erp/selectors";
import { useCallback, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { settingsAction } from "@/redux/settings/actions";

export default function UpdateInvoiceModule({ config }) {
	const dispatch = useDispatch();

	const { id } = useParams();

	useLayoutEffect(() => {
		dispatch(erp.read({ entity: config.entity, id }));
	}, [id, config, dispatch]);

	const updateCurrency = useCallback((value) => {
		console.log("🚀 ~ updateCurrency ~ value:", value);
		dispatch(
			settingsAction.updateCurrency({
				data: { default_currency_code: value },
			}),
		);
	});

	const {
		result: currentResult,
		isSuccess,
		isLoading = true,
	} = useSelector(selectReadItem);

	useLayoutEffect(() => {
		if (currentResult) {
			const data = { ...currentResult };
			dispatch(erp.currentAction({ actionType: "update", data }));
			updateCurrency(currentResult.currency);
		}
	}, [currentResult, dispatch, updateCurrency]);

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
				<UpdateItem config={config} UpdateForm={InvoiceForm} />
			) : (
				<NotFound entity={config.entity} />
			)}
		</ErpLayout>
	);
}
