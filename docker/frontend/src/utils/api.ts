// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import zFetch from "utils/zFetch"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// * ■■■■■■■■■■■■■■■■■■■■■ USERS

export async function apiFetchUsers() {
	return zFetch({
		shortUrl: "/api/users",
		method: "GET",
		requierdFields: [],
	})
}

export async function apiFetchUser(userId: number) {
	return zFetch({
		shortUrl: "/api/user/" + userId,
		method: "GET",
		requierdFields: [],
	})
}

// * ■■■■■■■■■■■■■■■■■■■■■ Chat: CHANNELS

export async function apiFetchChannelCreate(ownerIdTemp: number, name: string, isPrivate: boolean, password: string) {
	return zFetch({
		shortUrl: "/chat/channels/new",
		method: "POST",
		body: { jwt: localStorage.getItem("jwt"), ownerIdTemp, name, isPrivate, password }, // TODO: jwt devrait etre dans headers
		requierdFields: [],
	})
}

export async function apiFetchChannel(chanId: number) {
	return zFetch({
		shortUrl: "/chat/channels/" + chanId,
		method: "GET",
		requierdFields: [],
	})
}

export async function apiFetchChatIndex() {
	return zFetch({
		shortUrl: "/chat",
		method: "GET",
		requierdFields: [],
		publicAccess: false,
	})
}

// * ■■■■■■■■■■■■■■■■■■■■■

// * ■■■■■■■■■■■■■■■■■■■■■
