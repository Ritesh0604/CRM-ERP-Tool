import { useCallback, useEffect } from "react";
import {
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	FilePdfOutlined,
	RedoOutlined,
	PlusOutlined,
	EllipsisOutlined,
} from "@ant-design/icons";
import { Dropdown, Table, Button } from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import { advancedCrud } from "@/redux/advancedCrud/actions";
import { selectListItems } from "@/redux/advancedCrud/selectors";
import { useAdvancedCrudContext } from "@/context/advancedCrud";
import { generate as uniqueId } from "shortid";
import { useNavigate } from "react-router-dom";

import { DOWNLOAD_BASE_URL } from "@/config/serverApiConfig";

function AddNewItem({ config }) {
	const navigate = useNavigate();
	const { ADD_NEW_ENTITY, entity } = config;

	const handleClick = () => {
		navigate(`/${entity.toLowerCase()}/create`);
	};

	return (
		<Button onClick={handleClick} type="primary" icon={<PlusOutlined />}>
			{ADD_NEW_ENTITY}
		</Button>
	);
}

export default function DataTable({ config, extra = [] }) {
	const translate = useLanguage();
	let { entity, dataTableColumns, disableAdd = false } = config;

	const { DATATABLE_TITLE } = config;

	const { result: listResult, isLoading: listIsLoading } =
		useSelector(selectListItems);

	const { pagination, items: dataSource } = listResult;

	const { advancedCrudContextAction } = useAdvancedCrudContext();
	const { modal } = advancedCrudContextAction;

	const items = [
		{
			label: translate("Show"),
			key: "read",
			icon: <EyeOutlined />,
		},
		{
			label: translate("Edit"),
			key: "edit",
			icon: <EditOutlined />,
		},
		{
			label: translate("Download"),
			key: "download",
			icon: <FilePdfOutlined />,
		},
		...extra,
		{
			type: "divider",
		},

		{
			label: translate("Delete"),
			key: "delete",
			icon: <DeleteOutlined />,
		},
	];

	const navigate = useNavigate();

	const handleRead = (record) => {
		dispatch(advancedCrud.currentItem({ data: record }));
		navigate(`/${entity}/read/${record._id}`);
	};
	const handleEdit = (record) => {
		const data = { ...record };
		dispatch(advancedCrud.currentAction({ actionType: "update", data }));
		navigate(`/${entity}/update/${record._id}`);
	};
	const handleDownload = (record) => {
		window.open(
			`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`,
			"_blank",
		);
	};

	const handleDelete = (record) => {
		dispatch(
			advancedCrud.currentAction({ actionType: "delete", data: record }),
		);
		modal.open();
	};

	const handleRecordPayment = (record) => {
		dispatch(advancedCrud.currentItem({ data: record }));
		navigate(`/invoice/pay/${record.invoice._id}`);
	};

	dataTableColumns = [
		...dataTableColumns,
		{
			title: "",
			key: "action",
			fixed: "right",
			render: (_, record) => (
				<Dropdown
					menu={{
						items,
						onClick: ({ key }) => {
							switch (key) {
								case "read":
									handleRead(record);
									break;
								case "edit":
									handleEdit(record);
									break;
								case "download":
									handleDownload(record);
									break;
								case "delete":
									handleDelete(record);
									break;
								case "recordPayment":
									handleRecordPayment(record);
									break;
								default:
									break;
							}
						},
					}}
					trigger={["click"]}
				>
					<EllipsisOutlined
						style={{ cursor: "pointer", fontSize: "24px" }}
						onClick={(e) => e.preventDefault()}
					/>
				</Dropdown>
			),
		},
	];

	const dispatch = useDispatch();

	const handelDataTableLoad = (pagination) => {
		const options = {
			page: pagination.current || 1,
			items: pagination.pageSize || 10,
		};
		dispatch(advancedCrud.list({ entity, options }));
	};

	const dispatcher = useCallback(() => {
		dispatch(advancedCrud.list({ entity }));
	}, [dispatch, entity]);

	useEffect(() => {
		const controller = new AbortController();
		dispatcher();
		return () => {
			controller.abort();
		};
	}, [dispatcher]);

	return (
		<>
			<PageHeader
				title={DATATABLE_TITLE}
				ghost={true}
				extra={[
					<Button
						onClick={handelDataTableLoad}
						key={`${uniqueId()}`}
						icon={<RedoOutlined />}
					>
						{translate("Refresh")}
					</Button>,
					!disableAdd && <AddNewItem config={config} key={`${uniqueId()}`} />,
				]}
				style={{
					padding: "20px 0px",
				}}
			/>

			<Table
				columns={dataTableColumns}
				rowKey={(item) => item._id}
				dataSource={dataSource}
				pagination={pagination}
				loading={listIsLoading}
				onChange={handelDataTableLoad}
				scroll={{ x: true }}
			/>
		</>
	);
}
