import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import trellifySlice from "./trellify/trellifySlice";

export const Store = configureStore({
    reducer: {
        auth: authSlice,
        trellify: trellifySlice
    }
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch