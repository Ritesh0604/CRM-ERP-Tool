import { Avatar, Popover, Button, Badge, Col, List } from "antd";

// import Notifications from '@/components/Notification';

import { RocketOutlined } from "@ant-design/icons";

import useLanguage from "@/locale/useLanguage";

const SelfHostedPlan = () => {
	const features = [
		"Self-Hosted Premium Version",
		"unlimited Users",
		"Multi-Currency - unlimited currency",
		"Multi-Branch - unlimited branch",
		"Free 1 year update",
		"24/7 priority support",
	];

	return (
		<List
			size="large"
			footer={
				<Button
					type="primary"
					size="large"
					block
					onClick={() => {
						window.open("http://localhost:3000/");
					}}
				>
					Purchase Now
				</Button>
			}
			// bordered
			dataSource={features}
			renderItem={(item) => (
				<List.Item style={{ textAlign: "center" }}>{item}</List.Item>
			)}
		/>
	);
};

export default function UpgradeButton() {
	const translate = useLanguage();
	const Content = () => {
		return (
			<SelfHostedPlan />
		);
	};

	return (
		<Popover content={<Content />} trigger="click">
			<Badge count={1} size="small">
				<Avatar
					icon={<RocketOutlined />}
					style={{
						color: "#f56a00",
						backgroundColor: "#FFF",
						float: "right",
						marginTop: "5px",
						cursor: "pointer",
					}}
				/>
			</Badge>
		</Popover>
	);
}
