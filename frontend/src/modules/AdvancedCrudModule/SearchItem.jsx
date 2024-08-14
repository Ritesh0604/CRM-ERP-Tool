import { useEffect, useState, useRef } from "react";

import { AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { advancedCrud } from "@/redux/advancedCrud/actions";

import { useAdvancedCrudContext } from "@/context/advancedCrud";
import { selectSearchedItems } from "@/redux/advancedCrud/selectors";

import { Empty } from "antd";

export default function Search({ config }) {
	const { entity, searchConfig } = config;

	const { displayLabels, searchFields, outputValue = "_id" } = searchConfig;
	const dispatch = useDispatch();
	const [value, setValue] = useState("");
	const [options, setOptions] = useState([]);

	const { advancedCrudContextAction } = useAdvancedCrudContext();
	const { panel, collapsedBox, readBox } = advancedCrudContextAction;

	const { result, isLoading, isSuccess } = useSelector(selectSearchedItems);

	const isTyping = useRef(false);

	let delayTimer = null;
	useEffect(() => {
		isLoading && setOptions([{ label: "... Searching" }]);
	}, [isLoading]);
	const onSearch = (searchText) => {
		isTyping.current = true;

		clearTimeout(delayTimer);
		delayTimer = setTimeout(() => {
			if (isTyping.current && searchText !== "") {
				dispatch(
					advancedCrud.search(entity, {
						question: searchText,
						fields: searchFields,
					}),
				);
			}
			isTyping.current = false;
		}, 500);
	};

	const onSelect = (data) => {
		const currentItem = result.find((item) => {
			return item[outputValue] === data;
		});

		dispatch(advancedCrud.currentItem({ data: currentItem }));
		panel.open();
		collapsedBox.open();
		readBox.open();
	};

	const onChange = (data) => {
		const currentItem = options.find((item) => {
			return item.value === data;
		});
		const currentValue = currentItem ? currentItem.label : data;
		setValue(currentValue);
	};

	useEffect(() => {
		const optionResults = [];

		result.map((item) => {
			const labels = displayLabels.map((x) => item[x]).join(" ");
			optionResults.push({ label: labels, value: item[outputValue] });
		});

		setOptions(optionResults);
	}, [result, outputValue, displayLabels]);

	return (
		<AutoComplete
			value={value}
			options={options}
			style={{
				width: "100%",
			}}
			onSelect={onSelect}
			onSearch={onSearch}
			onChange={onChange}
			notFoundContent={!isSuccess ? <Empty /> : ""}
			allowClear={true}
			placeholder="Your Search here"
		>
			<Input suffix={<SearchOutlined />} />
		</AutoComplete>
	);
}
