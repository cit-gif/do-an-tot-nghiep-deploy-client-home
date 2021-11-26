import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductItemInterface } from "@src/interfaceGlobal";
interface productSliceInterface {
	productsViewed: ProductItemInterface[];
}
const initialState: productSliceInterface = {
	productsViewed: [],
};
const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {
		setProductViewed(state, action: PayloadAction<ProductItemInterface[]>) {
			state.productsViewed = action.payload;
		},
	},
});
export const productReducerActions = productSlice.actions;
export default productSlice.reducer;
