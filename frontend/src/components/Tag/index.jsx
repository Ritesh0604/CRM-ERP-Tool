import { Tag } from "antd";
import useLanguage from "@/locale/useLanguage";

export function StatusTag({ status = "draft" }) {
	const translate = useLanguage();
	const color = () => {
		return status === "draft"
			? "cyan"
			: status === "sent"
				? "blue"
				: status === "accepted"
					? "green"
					: status === "expired"
						? "orange"
						: "red";
	};

	return <Tag color={color()}>{translate(status)}</Tag>;
}
