import { useDispatch, useSelector } from "react-redux";

import { Select, Form } from "antd";

import { currencyOptions } from "@/utils/currencyList";

import { selectMoneyFormat } from "@/redux/settings/selectors";

import { useState, useEffect } from "react";
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import useLanguage from "@/locale/useLanguage";
import useResponsive from "@/hooks/useResponsive";

export const ChooseCurrency = () => {
	const dispatch = useDispatch();

	const { isMobile } = useResponsive();
	const [selectOptions, setOptions] = useState([]);

	const navigate = useNavigate();

	const asyncList = () => {
		return request.listAll({ entity: "currency", options: { enabled: true } });
	};
	const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
	useEffect(() => {
		if (isSuccess) {
			setOptions(result);
		}
	}, [isSuccess, result]);

	const money_format_settings = useSelector(selectMoneyFormat);

	const handleSelectChange = (newValue) => {
		if (newValue === "redirectURL") {
			navigate("/settings/currency");
		}
	};

	const optionsList = () => {
		const list = [];

		const value = "redirectURL";
		const label = "+ Add New Currency";

		list.push(...currencyOptions(selectOptions));
		list.push({ value, label });

		return list;
	};

	if (money_format_settings.default_currency_code)
		return (
			<Select
				showSearch
				defaultValue={money_format_settings.default_currency_code}
				loading={fetchIsLoading}
				filterOption={(input, option) =>
					(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
				}
				filterSort={(optionA, optionB) =>
					(optionA?.label ?? "")
						.toLowerCase()
						.startsWith((optionB?.label ?? "").toLowerCase())
				}
				options={optionsList()}
				onChange={handleSelectChange}
				style={{
					width: isMobile ? "90px" : "130px",
					float: "right",
					marginTop: "5px",
					cursor: "pointer",
					direction: "ltr",
				}}
			/>
		);

	<Select
		loading={fetchIsLoading}
		style={{
			width: "130px",
			float: "right",
			marginTop: "5px",
			cursor: "pointer",
			direction: "ltr",
		}}
		defaultValue={"Loading .."}
	/>;
};

export default ChooseCurrency;