import { useState, useEffect } from "react";

import { Button, Tag, Form, Divider } from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import { useSelector, useDispatch } from "react-redux";

import useLanguage from "@/locale/useLanguage";

import { settingsAction } from "@/redux/settings/actions";
import { currencyAction } from "@/redux/currency/actions";
import { erp } from "@/redux/erp/actions";
import { selectCreatedItem } from "@/redux/erp/selectors";

import calculate from "@/utils/calculate";
import { generate as uniqueId } from "shortid";

import Loading from "@/components/Loading";
import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CloseCircleOutlined,
	PlusOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { selectLangDirection } from "@/redux/translate/selectors";

function SaveForm({ form }) {
	const translate = useLanguage();
	const handelClick = () => {
		form.submit();
	};

	return (
		<Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
			{translate("Save")}
		</Button>
	);
}

export default function CreateItem({ config, CreateForm }) {
	const translate = useLanguage();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(settingsAction.list({ entity: "setting" }));
		dispatch(currencyAction.list());
	}, [dispatch]);

	const { entity } = config;

	const { isLoading, isSuccess, result } = useSelector(selectCreatedItem);
	const [form] = Form.useForm();
	const [subTotal, setSubTotal] = useState(0);
	const [offerSubTotal, setOfferSubTotal] = useState(0);
	const handelValuesChange = (changedValues, values) => {
		const items = values.items;
		let subTotal = 0;
		let subOfferTotal = 0;

		if (items) {
			items.map((item) => {
				if (item) {
					if (item.offerPrice && item.quantity) {
						const offerTotal = calculate.multiply(
							item.quantity,
							item.offerPrice,
						);
						subOfferTotal = calculate.add(subOfferTotal, offerTotal);
					}
					if (item.quantity && item.price) {
						const total = calculate.multiply(item.quantity, item.price);
						//sub total
						subTotal = calculate.add(subTotal, total);
					}
				}
			});
			setSubTotal(subTotal);
			setOfferSubTotal(subOfferTotal);
		}
	};

	useEffect(() => {
		if (isSuccess) {
			form.resetFields();
			dispatch(erp.resetAction({ actionType: "create" }));
			setSubTotal(0);
			setOfferSubTotal(0);
			navigate(`/${entity.toLowerCase()}/read/${result._id}`);
		}
		return () => {};
	}, [isSuccess, dispatch, form, result, entity, navigate]);

	const onSubmit = (fieldsValue) => {
		console.log("🚀 ~ onSubmit ~ fieldsValue:", fieldsValue);
		let updatedFieldsValue = { ...fieldsValue };

		if (updatedFieldsValue.items) {
			const newList = updatedFieldsValue.items.map((item) => {
				return {
					...item,
					total: calculate.multiply(item.quantity, item.price),
				};
			});
			updatedFieldsValue = {
				...updatedFieldsValue,
				items: newList,
			};
		}
		dispatch(erp.create({ entity, jsonData: updatedFieldsValue }));
	};

	const langDirection = useSelector(selectLangDirection);
	return (
		<>
			<PageHeader
				onBack={() => {
					navigate(`/${entity.toLowerCase()}`);
				}}
				backIcon={
					langDirection === "rtl" ? (
						<ArrowRightOutlined />
					) : (
						<ArrowLeftOutlined />
					)
				}
				title={translate("New")}
				ghost={false}
				tags={<Tag>{translate("Draft")}</Tag>}
				// subTitle="This is create page"
				extra={[
					<Button
						key={`${uniqueId()}`}
						onClick={() => navigate(`/${entity.toLowerCase()}`)}
						icon={<CloseCircleOutlined />}
					>
						{translate("Cancel")}
					</Button>,
					<SaveForm form={form} key={`${uniqueId()}`} />,
				]}
				style={{
					padding: "20px 0px",
				}}
			/>
			<Divider dashed />
			<Loading isLoading={isLoading}>
				<Form
					form={form}
					layout="vertical"
					onFinish={onSubmit}
					onValuesChange={handelValuesChange}
				>
					<CreateForm subTotal={subTotal} offerTotal={offerSubTotal} />
				</Form>
			</Loading>
		</>
	);
}
