import { ErpLayout } from "@/layout";

import PageLoader from "@/components/PageLoader";
import { erp } from "@/redux/erp/actions";
import NotFound from "@/components/NotFound";
import { useLayoutEffect, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Payment from "./components/Payment";
import { selectReadItem } from "@/redux/erp/selectors";
import { settingsAction } from "@/redux/settings/actions";

export default function UpdatePaymentModule({ config }) {
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

	const updateCurrency = useCallback((value) => {
		dispatch(
			settingsAction.updateCurrency({
				data: { default_currency_code: value },
			}),
		);
	});

	useLayoutEffect(() => {
		if (currentResult) {
			dispatch(
				erp.currentAction({ actionType: "update", id, data: currentResult }),
			);
			updateCurrency(currentResult.currency);
		}
	}, [currentResult, dispatch, id, updateCurrency]);

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
				<Payment config={config} currentItem={currentResult} />
			) : (
				<NotFound entity={config.entity} />
			)}
		</ErpLayout>
	);
}
