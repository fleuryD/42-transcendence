/* eslint-disable no-restricted-globals */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { io } from "socket.io-client"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

let socket

// ****	CONNEXION/DECONNEXION:

export const initiateSocketConnection = (jwtToken) => {
	socket = io(process.env.REACT_APP_BACKENDAPI, {
		extraHeaders: {
			authorization: jwtToken,
		},
	})
	//console.log(`Connecting socket...`)
	return socket
}

export const disconnectSocket = () => {
	//console.log("Disconnecting socket...")
	if (socket) socket.disconnect()
}

// ****	CHAT:

/*
export const subscribeToChat = (cb) => {
	//console.log("subscribeToChat cb::::::::", cb)
	//socket.emit("receiveMessage", "Hello there from React.")
	socket.on("receiveMessage", (msg) => {
		//console.log("receiveMessage XXXXXXXXXXXXXX", cb)
		return cb(null, msg)
	})
}
*/

export const joinChannel = (chanId, password) => {
	//console.log("joinChannel chanId:", chanId)
	socket.emit("joinChannel", { channelId: chanId, password: password })
}

export const quitChannel = (chanId) => {
	//console.log("quitChannel quitChannel:", chanId)
	socket.emit("quitChannel", { channelId: chanId })
}

/*
 *	OK
 */
export const sendMessageToChannel = (message) => {
	socket.emit("sendMessageToChannel", message)
}

// ****	QUEU:

export const subscribeToQueue = (cb) => {
	////console.log("receiveMessage", cb)
	//socket.emit("receiveMessage", "Hello there from React.")
	socket.on("receiveQueue", (msg) => {
		////console.log("receiveQueue XXXXXXXXXXXXXX", cb)
		return cb(null, msg)
	})
}

export const joinQueue = (userId) => {
	////console.log("sendMessageToChat", message)
	socket.emit("joinQueue", { userId: userId })
	/*
	socket.on("my broadcast", (msg) => {
		return cb(null, msg)
	})
	*/
}

export const quitQueue = (userId) => {
	////console.log("sendMessageToChat", message)
	socket.emit("quitQueue", { userId: userId })
	/*
	socket.on("my broadcast", (msg) => {
		return cb(null, msg)
	})
	*/
}

export const pingUser = (data) => {
	////console.log("sendMessageToChat", message)
	socket.emit("pingUser", data)
}

export const sendMyInGameData = (data) => {
	////console.log("sendMessageToChat", message)
	socket.emit("sendMyInGameData", data)
	/*
	socket.on("my broadcast", (msg) => {
		return cb(null, msg)
	})
	*/
}

export const subscribeToQueueInGame = (cb, id) => {
	////console.log("receiveMessage", cb)
	//socket.emit("receiveMessage", "Hello there from React.")
	socket.on(`receivesInGameData_${id}`, (msg) => {
		////console.log("receivesInGameData XXXXXXXXXXXXXX", cb)
		return cb(null, msg)
	})
}

export const subscribeToPingInGame = (cb) => {
	////console.log("receiveMessage", cb)
	//socket.emit("receiveMessage", "Hello there from React.")
	socket.on("recvPong", (msg) => {
		////console.log("receivesInGameData XXXXXXXXXXXXXX", cb)
		return cb(null, msg)
	})
}

export const receivesInGameData = (data) => {
	//console.log("receivesInGameData", data)
	socket.emit("receivesInGameData", data)
	/*
	socket.on("my broadcast", (msg) => {
		return cb(null, msg)
	})
	*/
}

export const subscribeToUsersStatus = (cb) => {
	socket.on("USERS_STATUS", (msg) => {
		return cb(null, msg)
	})
}

// ###                             NEW - OK                                #

export const subscribeToChannel = (chanId, cb) => {
	//console.log("subscribeToChannel chanId:", chanId)
	socket.on("infoChannel_" + chanId, (data) => {
		//console.log("🧩 infoChannel_" + chanId, data)
		return cb(null, data)
	})
}

export const subscribeToChat = (cb) => {
	//console.log("subscribeToChat")
	socket.on("infoChat", (data) => {
		//console.log("📀 infoChat", data)
		return cb(null, data)
	})
}

/*
 *
 *	channelUserId,
 *	type:"BAN"|"UNBAN"|"KICK"|"MUTE"|"ADMIN,
 *	value: bolean,
 *	duration: number | null | 0 | undefined ????????????????/
 *
 */
export const adminEditChannelUser = (channelId, channelUserId, type, value, duration) => {
	////console.log("adminEditChannelUser :: channelUserId #"+channelUserId + ", type #" + type)
	socket.emit("adminEditChannelUser", { channelId, channelUserId, type, value, duration })
}

export const createChannel = (ownerId, name, isPrivate, password) => {
	socket.emit("createChannel", { ownerId, name, isPrivate, password })
}

export const editChannel = (ownerId, channelId, name, isPrivate, password) => {
	socket.emit("editChannel", { ownerId, channelId, name, isPrivate, password })
}

export const createPrivateDiscussion = (otherUserId) => {
	socket.emit("createPrivateDiscussion", { otherUserId })
}

export const deleteChannel = (channelId) => {
	if (confirm("Are you absolutely sur certain that you want to definitly and irremediatly delete the channel ?"))
		socket.emit("deleteChannel", { channelId })
}

export const updateChannel = (channel) => {
	socket.emit("updateChannel", { channel })
}

export const blockUser = (blockedUserId, value) => {
	socket.emit("blockUser", { blockedUserId, value })
}

export const setRelation = (userId, type, value) => {
	socket.emit("setRelation", { userId, type, value })
}

export const acceptInvitationToPlay = (otherUserId, channelId) => {
	socket.emit("acceptInvitationToPlay", { otherUserId, channelId })
}

export const sendNavigate = (name, id) => {
	socket.emit("naviguate", { name: name, id: id })
}
