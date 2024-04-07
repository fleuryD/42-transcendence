/* eslint-disable import/no-extraneous-dependencies */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { combineReducers } from "redux"
import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import authSlice from "./authSlice"
import appSlice from "./appSlice"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

const reducer = combineReducers({
	auth: authSlice,
	app: appSlice,
})

const store = configureStore({ reducer })

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export default store

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// Anciennement dans "storeHooks.ts"
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
