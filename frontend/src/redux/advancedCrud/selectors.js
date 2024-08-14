import { createSelector } from "reselect";

const selectAdvancedCrud = (state) => state.advancedCrud;

export const selectCurrentItem = createSelector(
	[selectAdvancedCrud],
	(advancedCrud) => advancedCrud.current,
);

export const selectListItems = createSelector(
	[selectAdvancedCrud],
	(advancedCrud) => advancedCrud.list,
);
export const selectItemById = (itemId) =>
	createSelector(selectListItems, (list) =>
		list.result.items.find((item) => item._id === itemId),
	);

export const selectCreatedItem = createSelector(
	[selectAdvancedCrud],
	(advancedCrud) => advancedCrud.create,
);

export const selectUpdatedItem = createSelector(
	[selectAdvancedCrud],
	(advancedCrud) => advancedCrud.update,
);

export const selectReadItem = createSelector(
	[selectAdvancedCrud],
	(advancedCrud) => advancedCrud.read,
);

export const selectDeletedItem = createSelector(
	[selectAdvancedCrud],
	(advancedCrud) => advancedCrud.delete,
);

export const selectSearchedItems = createSelector(
	[selectAdvancedCrud],
	(advancedCrud) => advancedCrud.search,
);
export const selectMailItem = createSelector(
	[selectAdvancedCrud],
	(advancedCrud) => advancedCrud.mail,
);
