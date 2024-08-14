import NotFound from "@/components/NotFound";
import { ErpLayout } from "@/layout";
import ReadItem from "@/modules/AdvancedCrudModule/ReadItem";

import PageLoader from "@/components/PageLoader";
import { advancedCrud } from "@/redux/advancedCrud/actions";
import { selectReadItem } from "@/redux/advancedCrud/selectors";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

export default function ReadInvoiceModule({ config }) {
	const dispatch = useDispatch();
	const { id } = useParams();

	useLayoutEffect(() => {
		dispatch(advancedCrud.read({ entity: config.entity, id }));
	}, [id, config, dispatch]);

	const {
		result: currentResult,
		isSuccess,
		isLoading = true,
	} = useSelector(selectReadItem);

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
				<ReadItem config={config} selectedItem={currentResult} />
			) : (
				<NotFound entity={config.entity} />
			)}
		</ErpLayout>
	);
}
