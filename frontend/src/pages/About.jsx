import { Button, Result } from "antd";

import useLanguage from "@/locale/useLanguage";

const About = () => {
	const translate = useLanguage();
	return (
		<Result
			status="info"
			title={"IDURAR"}
			subTitle={translate(
				"The ERP & CRM application is built on the **MERN stack**, which includes Node.js, React.js, Redux, Express.js, MongoDB, and Ant Design(AntD).",
			)}
			extra={
				<>
					<p>
						Website :{" "}
						<a href="http://localhost:3000/">http://localhost:3000/</a>{" "}
					</p>
					<p>
						GitHub :{" "}
						<a href="https://github.com/Ritesh0604/CRM-ERP-Tool/">
							https://github.com/Ritesh0604/CRM-ERP-Tool/
						</a>
					</p>
					<Button
						type="primary"
						onClick={() => {
							window.open("http://localhost:3000/");
						}}
					>
						{translate("Contact us")}
					</Button>
				</>
			}
		/>
	);
};

export default About;
