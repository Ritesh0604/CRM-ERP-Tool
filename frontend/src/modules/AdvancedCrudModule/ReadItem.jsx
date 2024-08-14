import { useState, useEffect } from "react";
import { Divider } from "antd";

import { Button, Row, Col, Descriptions, Statistic, Tag } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import {
	EditOutlined,
	FilePdfOutlined,
	CloseCircleOutlined,
	RetweetOutlined,
	MailOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import { advancedCrud } from "@/redux/advancedCrud/actions";

import { generate as uniqueId } from "shortid";

import { selectCurrentItem } from "@/redux/advancedCrud/selectors";

import { DOWNLOAD_BASE_URL } from "@/config/serverApiConfig";
import { useMoney, useDate } from "@/settings";
import useMail from "@/hooks/useMail";
import { useNavigate } from "react-router-dom";
import { tagColor } from "@/utils/statusTagColor";

const Item = ({ item }) => {
	const { moneyFormatter } = useMoney();
	return (
		<Row gutter={[12, 0]} key={item._id}>
			<Col className="gutter-row" span={11}>
				<p style={{ marginBottom: 5 }}>
					<strong>{item.itemName}</strong>
				</p>
				<p>{item.description}</p>
			</Col>
			<Col className="gutter-row" span={4}>
				<p
					style={{
						textAlign: "right",
					}}
				>
					{moneyFormatter({ amount: item.price })}
				</p>
			</Col>
			<Col className="gutter-row" span={4}>
				<p
					style={{
						textAlign: "right",
					}}
				>
					{item.quantity}
				</p>
			</Col>
			<Col className="gutter-row" span={5}>
				<p
					style={{
						textAlign: "right",
						fontWeight: "700",
					}}
				>
					{moneyFormatter({ amount: item.total })}
				</p>
			</Col>
			<Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
		</Row>
	);
};

export default function ReadItem({ config, selectedItem }) {
	const translate = useLanguage();
	const { entity, ENTITY_NAME } = config;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { moneyFormatter } = useMoney();
	const { send, isLoading: mailInProgress } = useMail({ entity });

	const { result: currentResult } = useSelector(selectCurrentItem);

	const resetAdvancedCrud = {
		status: "",
		client: {
			name: "",
			email: "",
			phone: "",
			address: "",
		},
		subTotal: 0,
		taxTotal: 0,
		taxRate: 0,
		total: 0,
		credit: 0,
		number: 0,
		year: 0,
	};

	const [itemslist, setItemsList] = useState([]);
	const [currentAdvancedCrud, setCurrentAdvancedCrud] = useState(
		selectedItem ?? resetAdvancedCrud,
	);
	const [client, setClient] = useState({});

	useEffect(() => {
		if (currentResult) {
			const { items, invoice, ...others } = currentResult;

			if (items) {
				setItemsList(items);
				setCurrentAdvancedCrud(currentResult);
			} else if (invoice.items) {
				setItemsList(invoice.items);
				setCurrentAdvancedCrud({ ...invoice.items, ...others, ...invoice });
			}
		}
		return () => {
			setItemsList([]);
			setCurrentAdvancedCrud(resetAdvancedCrud);
		};
	}, [currentResult]);

	useEffect(() => {
		if (currentAdvancedCrud?.client) {
			setClient(currentAdvancedCrud.client[currentAdvancedCrud.client.type]);
		}
	}, [currentAdvancedCrud]);

	return (
		<>
			<PageHeader
				onBack={() => {
					navigate(`/${entity.toLowerCase()}`);
				}}
				title={`${ENTITY_NAME} # ${currentAdvancedCrud.number}/${currentAdvancedCrud.year || ""}`}
				ghost={false}
				tags={[
					<Tag color={tagColor(currentAdvancedCrud.status)?.color} key="status">
						{currentAdvancedCrud.status &&
							translate(currentAdvancedCrud.status)}
					</Tag>,
					currentAdvancedCrud.paymentStatus && (
						<Tag
							color={tagColor(currentAdvancedCrud.paymentStatus)?.color}
							key="paymentStatus"
						>
							{currentAdvancedCrud.paymentStatus &&
								translate(currentAdvancedCrud.paymentStatus)}
						</Tag>
					),
				]}
				extra={[
					<Button
						key={`${uniqueId()}`}
						onClick={() => {
							navigate(`/${entity.toLowerCase()}`);
						}}
						icon={<CloseCircleOutlined />}
					>
						{translate("Close")}
					</Button>,
					<Button
						key={`${uniqueId()}`}
						onClick={() => {
							window.open(
								`${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentAdvancedCrud._id}.pdf`,
								"_blank",
							);
						}}
						icon={<FilePdfOutlined />}
					>
						{translate("Download PDF")}
					</Button>,
					<Button
						key={`${uniqueId()}`}
						loading={mailInProgress}
						onClick={() => {
							send(currentAdvancedCrud._id);
						}}
						icon={<MailOutlined />}
					>
						{translate("Send by Email")}
					</Button>,
					<Button
						key={`${uniqueId()}`}
						onClick={() => {
							dispatch(
								advancedCrud.convert({ entity, id: currentAdvancedCrud._id }),
							);
						}}
						icon={<RetweetOutlined />}
						style={{ display: entity === "quote" ? "inline-block" : "none" }}
					>
						{translate("Convert to Invoice")}
					</Button>,

					<Button
						key={`${uniqueId()}`}
						onClick={() => {
							dispatch(
								advancedCrud.currentAction({
									actionType: "update",
									data: currentAdvancedCrud,
								}),
							);
							navigate(
								`/${entity.toLowerCase()}/update/${currentAdvancedCrud._id}`,
							);
						}}
						type="primary"
						icon={<EditOutlined />}
					>
						{translate("Edit")}
					</Button>,
				]}
				style={{
					padding: "20px 0px",
				}}
			>
				<Row>
					<Statistic title="Status" value={currentAdvancedCrud.status} />
					<Statistic
						title={translate("SubTotal")}
						value={moneyFormatter({ amount: currentAdvancedCrud.subTotal })}
						style={{
							margin: "0 32px",
						}}
					/>
					<Statistic
						title={translate("Total")}
						value={moneyFormatter({ amount: currentAdvancedCrud.total })}
						style={{
							margin: "0 32px",
						}}
					/>
					<Statistic
						title={translate("Paid")}
						value={moneyFormatter({ amount: currentAdvancedCrud.credit })}
						style={{
							margin: "0 32px",
						}}
					/>
				</Row>
			</PageHeader>
			<Divider dashed />
			<Descriptions title={`Client : ${currentAdvancedCrud.client.name}`}>
				<Descriptions.Item label={translate("Address")}>
					{client.address}
				</Descriptions.Item>
				<Descriptions.Item label={translate("email")}>
					{client.email}
				</Descriptions.Item>
				<Descriptions.Item label={translate("Phone")}>
					{client.phone}
				</Descriptions.Item>
			</Descriptions>
			<Divider />
			<Row gutter={[12, 0]}>
				<Col className="gutter-row" span={11}>
					<p>
						<strong>{translate("Product")}</strong>
					</p>
				</Col>
				<Col className="gutter-row" span={4}>
					<p
						style={{
							textAlign: "right",
						}}
					>
						<strong>{translate("Price")}</strong>
					</p>
				</Col>
				<Col className="gutter-row" span={4}>
					<p
						style={{
							textAlign: "right",
						}}
					>
						<strong>{translate("Quantity")}</strong>
					</p>
				</Col>
				<Col className="gutter-row" span={5}>
					<p
						style={{
							textAlign: "right",
						}}
					>
						<strong>{translate("Total")}</strong>
					</p>
				</Col>
				<Divider />
			</Row>
			{itemslist.map((item) => (
				<Item key={item._id} item={item} />
			))}
			<div
				style={{
					width: "300px",
					float: "right",
					textAlign: "right",
					fontWeight: "700",
				}}
			>
				<Row gutter={[12, -5]}>
					<Col className="gutter-row" span={12}>
						<p>{translate("Sub Total")} :</p>
					</Col>

					<Col className="gutter-row" span={12}>
						<p>{moneyFormatter({ amount: currentAdvancedCrud.subTotal })}</p>
					</Col>
					<Col className="gutter-row" span={12}>
						<p>
							{translate("Tax Total")} ({currentAdvancedCrud.taxRate} %) :
						</p>
					</Col>
					<Col className="gutter-row" span={12}>
						<p>{moneyFormatter({ amount: currentAdvancedCrud.taxTotal })}</p>
					</Col>
					<Col className="gutter-row" span={12}>
						<p>{translate("Total")} :</p>
					</Col>
					<Col className="gutter-row" span={12}>
						<p>{moneyFormatter({ amount: currentAdvancedCrud.total })}</p>
					</Col>
				</Row>
			</div>
		</>
	);
}
