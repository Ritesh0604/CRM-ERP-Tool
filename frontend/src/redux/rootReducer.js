import { combineReducers } from "redux";

import { reducer as authReducer } from "./auth";
import { reducer as crudReducer } from "./crud";
import { reducer as erpReducer } from "./erp";
import { reducer as advancedCrudReducer } from "./advancedCrud";
import { reducer as settingsReducer } from "./settings";
import { reducer as translateReducer } from "./translate";
import { reducer as currencyReducer } from "./currency";

// Combine all reducers.

const rootReducer = combineReducers({
	auth: authReducer,
	crud: crudReducer,
	erp: erpReducer,
	advancedCrud: advancedCrudReducer,
	settings: settingsReducer,
	translate: translateReducer,
	currency: currencyReducer,
});

export default rootReducer;
