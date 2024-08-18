// import { useState, useEffect } from "react";
// import currency from "currency.js";

// import { useSelector } from "react-redux";
// import storePersist from "@/redux/storePersist";

// import { selectMoneyFormat } from "@/redux/settings/selectors";
// import { selectCurrencyList } from "@/redux/currency/selectors";

// const useMoney = () => {
// 	const money_format_settings = useSelector(selectMoneyFormat);
// 	const currency_list = useSelector(selectCurrencyList);

// 	const money_format_state = money_format_settings
// 		? money_format_settings
// 		: storePersist.get("settings")?.money_format_settings;

// 	const [moneyFormatState, setMoneyFormatState] = useState(
// 		money_format_settings,
// 	);

// 	const thisCurrency = (currency_code) => {
// 		return currency_list.find((x) => x.currency_code === currency_code);
// 	};

// 	useEffect(() => {
// 		const currentCurrency = currency_list.find(
// 			(x) => x.currency_code === money_format_settings.default_currency_code,
// 		);
// 		setMoneyFormatState(currentCurrency);
// 	}, [currency_list, money_format_settings]);

// 	function currencyFormat({
// 		amount,
// 		currency_code = moneyFormatState?.currency_code,
// 	}) {
// 		return currency(amount).dollars() > 0 ||
// 			!thisCurrency(currency_code)?.zero_format
// 			? currency(amount, {
// 					separator: thisCurrency(currency_code)?.thousand_sep,
// 					decimal: thisCurrency(currency_code)?.decimal_sep,
// 					symbol: "",
// 					precision: thisCurrency(currency_code)?.cent_precision,
// 				}).format()
// 			: 0 +
// 					currency(amount, {
// 						separator: thisCurrency(currency_code)?.thousand_sep,
// 						decimal: thisCurrency(currency_code)?.decimal_sep,
// 						symbol: "",
// 						precision: thisCurrency(currency_code)?.cent_precision,
// 					}).format();
// 	}

// 	function moneyFormatter({
// 		amount = 0,
// 		currency_code = moneyFormatState?.currency_code,
// 	}) {
// 		return moneyFormatState?.currency_position === "before"
// 			? `${thisCurrency(currency_code)?.currency_symbol} ${currencyFormat({ amount, currency_code })}`
// 			: `${currencyFormat({ amount, currency_code })} ${thisCurrency(currency_code)?.currency_symbol}`;
// 	}

// 	function amountFormatter({
// 		amount = 0,
// 		currency_code = moneyFormatState?.currency_code,
// 	}) {
// 		return currencyFormat({ amount: amount, currency_code });
// 	}

// 	function moneyRowFormatter({
// 		amount = 0,
// 		currency_code = moneyFormatState?.currency_code,
// 	}) {
// 		return {
// 			props: {
// 				style: {
// 					textAlign: "right",
// 					whiteSpace: "nowrap",
// 					direction: "ltr",
// 				},
// 			},
// 			children: (
// 				<>
// 					{moneyFormatState?.currency_position === "before"
// 						? `${thisCurrency(currency_code)?.currency_symbol} ${currencyFormat({ amount, currency_code })}`
// 						: `${currencyFormat({ amount, currency_code })} ${thisCurrency(currency_code)?.currency_symbol}`}
// 				</>
// 			),
// 		};
// 	}
// 	return {
// 		moneyRowFormatter,
// 		moneyFormatter,
// 		amountFormatter,
// 		currency_symbol: moneyFormatState?.currency_symbol,
// 		currency_code: moneyFormatState?.currency_code,
// 		currency_position: moneyFormatState?.currency_position,
// 		decimal_sep: moneyFormatState?.decimal_sep,
// 		thousand_sep: moneyFormatState?.thousand_sep,
// 		cent_precision: moneyFormatState?.cent_precision,
// 		zero_format: moneyFormatState?.zero_format,
// 	};
// };
// export default useMoney;

import { useState, useEffect, useMemo, useCallback } from "react";
import currency from "currency.js";
import { useSelector } from "react-redux";
import storePersist from "@/redux/storePersist";
import { selectMoneyFormat } from "@/redux/settings/selectors";
import { selectCurrencyList } from "@/redux/currency/selectors";

const useMoney = () => {
	const money_format_settings = useSelector(selectMoneyFormat);
	const currency_list = useSelector(selectCurrencyList);

	const persistedMoneyFormat =
		storePersist.get("settings")?.money_format_settings;
	const moneyFormatState = useMemo(
		() => money_format_settings || persistedMoneyFormat,
		[money_format_settings, persistedMoneyFormat],
	);

	const [currentMoneyFormat, setCurrentMoneyFormat] =
		useState(moneyFormatState);

	const thisCurrency = useCallback((currency_code) =>
		currency_list.find((x) => x.currency_code === currency_code),
	);

	useEffect(() => {
		if (currency_list.length && money_format_settings) {
			const currentCurrency = thisCurrency(
				money_format_settings.default_currency_code,
			);
			setCurrentMoneyFormat(currentCurrency);
		}
	}, [currency_list, money_format_settings, thisCurrency]);

	const currencyFormat = ({
		amount,
		currency_code = currentMoneyFormat?.currency_code,
	}) => {
		const currencySettings = thisCurrency(currency_code);

		if (!currencySettings) return amount;

		const formattedCurrency = currency(amount, {
			separator: currencySettings.thousand_sep,
			decimal: currencySettings.decimal_sep,
			symbol: "",
			precision: currencySettings.cent_precision,
		}).format();

		return currency(amount).dollars() > 0 || !currencySettings.zero_format
			? formattedCurrency
			: `0${formattedCurrency}`;
	};

	const formatMoney = ({ amount = 0, currency_code } = {}) => {
		const currencySettings = thisCurrency(
			currency_code || currentMoneyFormat.currency_code,
		);
		const formattedAmount = currencyFormat({
			amount,
			currency_code: currencySettings.currency_code,
		});

		return currentMoneyFormat.currency_position === "before"
			? `${currencySettings.currency_symbol} ${formattedAmount}`
			: `${formattedAmount} ${currencySettings.currency_symbol}`;
	};

	const moneyRowFormatter = ({ amount = 0, currency_code } = {}) => ({
		props: {
			style: {
				textAlign: "right",
				whiteSpace: "nowrap",
				direction: "ltr",
			},
		},
		children: formatMoney({ amount, currency_code }),
	});

	return {
		moneyRowFormatter,
		moneyFormatter: formatMoney,
		amountFormatter: currencyFormat,
		...currentMoneyFormat,
	};
};

export default useMoney;
