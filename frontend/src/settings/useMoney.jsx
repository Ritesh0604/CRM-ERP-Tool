import currency from "currency.js";
import { useSelector } from "react-redux";
import storePersist from "@/redux/storePersist";
import { selectMoneyFormat } from "@/redux/settings/selectors";

const useMoney = () => {
	// Get the money format settings from Redux or local storage
	const money_format_settings = useSelector(selectMoneyFormat);
	const money_format_state =
		money_format_settings ||
		storePersist.get("settings")?.money_format_settings ||
		{};

	// Destructure variables with defaults
	const {
		currency_code = "USD",
		currency_symbol = "$",
		currency_position = "before",
		decimal_sep = ".",
		thousand_sep = ",",
		cent_precision = 2,
		zero_format = false,
	} = money_format_state;

	// Function to format currency
	function currencyFormat({ amount }) {
		return currency(amount, {
			separator: thousand_sep,
			decimal: decimal_sep,
			symbol: "",
			precision: cent_precision,
		}).format();
	}

	// Function to format money with currency symbol
	function moneyFormatter({ amount = 0 }) {
		return currency_position === "before"
			? `${currency_symbol} ${currencyFormat({ amount })}`
			: `${currencyFormat({ amount })} ${currency_symbol}`;
	}

	// Function to format amount without currency symbol
	function amountFormatter({ amount = 0 }) {
		return currencyFormat({ amount });
	}

	// Function to format money for table rows
	function moneyRowFormatter({ amount = 0 }) {
		return {
			props: {
				style: {
					textAlign: "right",
					whiteSpace: "nowrap",
					direction: "ltr",
				},
			},
			children: (
				<>
					{currency_position === "before"
						? `${currency_symbol} ${currencyFormat({ amount })}`
						: `${currencyFormat({ amount })} ${currency_symbol}`}
				</>
			),
		};
	}

	return {
		moneyRowFormatter,
		moneyFormatter,
		amountFormatter,
		currency_symbol,
		currency_code,
		currency_position,
		decimal_sep,
		thousand_sep,
		cent_precision,
		zero_format,
	};
};

export default useMoney;
