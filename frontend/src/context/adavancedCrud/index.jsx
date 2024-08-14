import { useMemo, useReducer, createContext, useContext } from "react";
import { initialState, contextReducer } from "./reducer";
import contextActions from "./actions";
import contextSelectors from "./selectors";

const AdvancedCrudContext = createContext();

function AdvancedCrudContextProvider({ children }) {
	const [state, dispatch] = useReducer(contextReducer, initialState);
	const value = useMemo(() => [state, dispatch], [state]);

	return (
		<AdvancedCrudContext.Provider value={value}>
			{children}
		</AdvancedCrudContext.Provider>
	);
}

function useAdvancedCrudContext() {
	const context = useContext(AdvancedCrudContext);
	if (context === undefined) {
		throw new Error(
			"useAdvancedCrudContext must be used within a AdvancedCrudContextProvider",
		);
	}
	const [state, dispatch] = context;
	const advancedCrudContextAction = contextActions(dispatch);
	const advancedCrudContextSelector = contextSelectors(state);
	return {
		state,
		advancedCrudContextAction: advancedCrudContextAction,
		advancedCrudContextSelector: advancedCrudContextSelector,
	};
}

export { AdvancedCrudContextProvider, useAdvancedCrudContext };
