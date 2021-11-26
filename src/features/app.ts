import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type choiceForm = "login" | "register";
interface appSliceInterface {
	choiceFormLoginOrRegister: choiceForm;
	showFormLoginOrRegister: boolean;
}
const initialState: appSliceInterface = {
	choiceFormLoginOrRegister: "register",
	showFormLoginOrRegister: false,
};
const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setChoiceFormLoginOrRegister(state, action: PayloadAction<choiceForm>) {
			state.choiceFormLoginOrRegister = action.payload;
		},
		setShowFormLoginOrRegister(state, action: PayloadAction<boolean>) {
			state.showFormLoginOrRegister = action.payload;
		},
	},
});
export const appReducerActions = appSlice.actions;
export default appSlice.reducer;
