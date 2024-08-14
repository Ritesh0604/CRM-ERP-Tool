import { useSelector } from "react-redux";
import { selectAppSettings } from "@/redux/settings/selectors";

const useDate = () => {
	const { dateFormat = "DD/MM/YYYY" } = useSelector(selectAppSettings) || {};
	return {
		dateFormat,
	};
};

export default useDate;
