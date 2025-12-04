import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "./slice/memberSlice";
import sabhaReducer from "./slice/sabhaSlice";

export const store = configureStore({
  reducer: {
    members: memberReducer,
    sabha: sabhaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
