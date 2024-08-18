import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useCrudContext } from "@/context/crud";
import { selectUpdatedItem } from "@/redux/crud/selectors";
import AdminForm from "@/forms/AdminForm";
import useLanguage from "@/locale/useLanguage";

import { Button, Form } from "antd";
import Loading from "@/components/Loading";

export default function UpdateForm({
	config,
	formElements,
	withUpload = false,
}) {
	const { entity } = config;
	const translate = useLanguage();
	const dispatch = useDispatch();
	const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);

	const { state, crudContextAction } = useCrudContext();

	const { panel, collapsedBox, readBox } = crudContextAction;

	const showCurrentRecord = () => {
		readBox.open();
	};

	const [isForAdminOwner, setAdminOwner] = useState(false);
	const [form] = Form.useForm();

	const onSubmit = (fieldsValue) => {
		const id = current._id;

		if (fieldsValue.file && withUpload) {
			fieldsValue.file = fieldsValue.file[0].originFileObj;
		}
		// const trimmedValues = Object.keys(fieldsValue).reduce((acc, key) => {
		//   acc[key] = typeof fieldsValue[key] === 'string' ? fieldsValue[key].trim() : fieldsValue[key];
		//   return acc;
		// }, {});
		dispatch(crud.update({ entity, id, jsonData: fieldsValue, withUpload }));
	};
	useEffect(() => {
		if (current) {
			let newValues = { ...current };
			if (newValues.birthday) {
				newValues = {
					...newValues,
					birthday: dayjs(newValues.birthday).format(
						"YYYY-MM-DDTHH:mm:ss.SSSZ",
					),
				};
			}
			if (newValues.date) {
				newValues = {
					...newValues,
					date: dayjs(newValues.date).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
				};
			}
			if (newValues.expiredDate) {
				newValues = {
					...newValues,
					expiredDate: dayjs(newValues.expiredDate).format(
						"YYYY-MM-DDTHH:mm:ss.SSSZ",
					),
				};
			}
			if (newValues.created) {
				newValues = {
					...newValues,
					created: dayjs(newValues.created).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
				};
			}
			if (newValues.updated) {
				newValues = {
					...newValues,
					updated: dayjs(newValues.updated).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
				};
			}
			const isOwner = current.role === "owner";
			setAdminOwner(isOwner);
			form.resetFields();
			form.setFieldsValue(newValues);
		}
	}, [current, form]);

	useEffect(() => {
		if (isSuccess) {
			readBox.open();
			collapsedBox.open();
			panel.open();
			form.resetFields();
			dispatch(crud.resetAction({ actionType: "update" }));
			dispatch(crud.list({ entity }));
		}
	}, [isSuccess, collapsedBox, entity, readBox, dispatch, form, panel]);

	const { isEditBoxOpen } = state;

	const show = isEditBoxOpen
		? { display: "block", opacity: 1 }
		: { display: "none", opacity: 0 };
	return (
		<div style={show}>
			<Loading isLoading={isLoading}>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<AdminForm isUpdateForm={true} isForAdminOwner={isForAdminOwner} />
					<Form.Item
						style={{
							display: "inline-block",
							paddingRight: "5px",
						}}
					>
						<Button type="primary" htmlType="submit">
							{translate("Save")}
						</Button>
					</Form.Item>
					<Form.Item
						style={{
							display: "inline-block",
							paddingLeft: "5px",
						}}
					>
						<Button onClick={showCurrentRecord}>{translate("Cancel")}</Button>
					</Form.Item>
				</Form>
			</Loading>
		</div>
	);
}