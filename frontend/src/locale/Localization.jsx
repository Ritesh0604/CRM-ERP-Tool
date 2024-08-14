import { useSelector } from "react-redux";

import { selectLangState } from "@/redux/translate/selectors";
import PageLoader from "@/components/PageLoader";

import antdLocale from "./antdLocale";

export default function Localization({ children }) {
	const { langCode, langDirection } = useSelector(selectLangState);

	const [locale, setLocal] = useState();

	useEffect(() => {
		const lang = antdLocale[langCode];
		setLocal(lang);
	}, [langCode]);

	if (locale) {
		return (
			<ConfigProvider
				locale={locale}
				theme={{
					// algorithm: theme.darkAlgorithm,
					token: {
						colorPrimary: "#1640D6",
						colorLink: "#1640D6",
						borderRadius: 8,
					},
				}}
			>
				{children}
			</ConfigProvider>
		);
	}
	return <PageLoader />;
}
