import { configureStore } from "@reduxjs/toolkit";
import appReducer from "@src/features/app";
import productReducer from "@src/features/product";
export const store = configureStore({
	reducer: {
		app: appReducer,
		product: productReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
