// *** slice : “a collection of Redux reducer logic and actions for a single feature in your app.”

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { createSlice } from "@reduxjs/toolkit"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// Type for our state
interface AuthState {
	isConnected: boolean
	id: number | null
	jwt: string | null
	name: string | null
	email: string | null
}

// Initial state
const initialState: AuthState = {
	isConnected: localStorage.getItem("jwt") !== null,
	id: localStorage.getItem("id") ? Number(localStorage.getItem("id")) : null,
	jwt: localStorage.getItem("jwt") || null,
	name: localStorage.getItem("name") || null,
	email: localStorage.getItem("email") || null,
}

// Actual Slice
export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		authLoginSuccess(state, action) {
			state.isConnected = true
			state.id = action.payload.id
			state.jwt = action.payload.jwt
			state.name = action.payload.name
			state.email = action.payload.email
			//console.log("action.payload.roles", action.payload.roles)

			localStorage.setItem("id", action.payload.id)
			localStorage.setItem("jwt", action.payload.jwt)
			localStorage.setItem("name", action.payload.name)
			localStorage.setItem("email", action.payload.email)
		},
		authLogoutSuccessX(state) {
			state.isConnected = false
			state.id = null
			state.jwt = null
			state.name = null
			state.email = null
			localStorage.removeItem("id")
			localStorage.removeItem("jwt")
			localStorage.removeItem("name")
			localStorage.removeItem("email")
		},
	},
})

export const { authLoginSuccess } = authSlice.actions

export default authSlice.reducer

const { authLogoutSuccessX } = authSlice.actions

export const authLogoutSuccess = () => (dispatch: any) => {
	//console.log("'aaaaaaaaaaaaaa")
	dispatch(authLogoutSuccessX())
}
