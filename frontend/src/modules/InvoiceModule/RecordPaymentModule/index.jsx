import { ErpLayout } from "@/layout";

import PageLoader from "@/components/PageLoader";
import { erp } from "@/redux/erp/actions";
import {
	selectItemById,
	selectCurrentItem,
	selectRecordPaymentItem,
} from "@/redux/erp/selectors";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Payment from "./components/Payment";
import { settingsAction } from "@/redux/settings/actions";

export default function RecordPaymentModule({ config }) {
	const dispatch = useDispatch();
	const { id } = useParams();

	let item = useSelector(selectItemById(id));

	const updateCurrency = useCallback((value) => {
		dispatch(
			settingsAction.updateCurrency({
				data: { default_currency_code: value },
			}),
		);
	});

	useEffect(() => {
		if (item) {
			dispatch(erp.currentItem({ data: item }));
		} else {
			dispatch(erp.read({ entity: config.entity, id }));
		}
	}, [item, id, config, dispatch]);

	const { result: currentResult } = useSelector(selectCurrentItem);
	item = currentResult;

	useEffect(() => {
		dispatch(erp.currentAction({ actionType: "recordPayment", data: item }));
		updateCurrency(item.currency);
	}, [item, dispatch, updateCurrency]);

	return (
		<ErpLayout>
			{item ? (
				<Payment config={config} currentItem={currentResult} />
			) : (
				<PageLoader />
			)}
		</ErpLayout>
	);
}
