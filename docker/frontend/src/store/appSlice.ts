// *** slice : “a collection of Redux reducer logic and actions for a single feature in your app.”

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { createSlice } from "@reduxjs/toolkit"
import { User } from "types"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// Type for our state
interface AppState {
	socket: any | null
	socketIsConnected: boolean
	users: User[] | null
}

// Initial state
const initialState: AppState = {
	socket: null,
	socketIsConnected: false,
	users: null,
}

// Actual Slice
export const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setSocket(state, action) {
			//console.log("action.payload", action.payload)
			//state.socket = action.payload
		},
		setAppSocketConnectionSuccess(state) {
			//console.log("socketIsConnected = true")
			state.socketIsConnected = true
		},
	},
})

const { setSocket } = appSlice.actions
export const { setAppSocketConnectionSuccess } = appSlice.actions

export default appSlice.reducer

//const { setSocket } = appSlice.actions

export const setAppSocket = (sock: any) => (dispatch: any) => {
	dispatch(setSocket(sock))
}
