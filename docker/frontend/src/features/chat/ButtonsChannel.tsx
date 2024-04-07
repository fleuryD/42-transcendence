// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
import { Button } from "react-bootstrap"
import { FaQuestion, FaTrash, FaEdit, FaPlus } from "react-icons/fa"

import { deleteChannel, joinChannel, quitChannel } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export function ButtonChannelJoin({ channelId, password }: { channelId: number; password: string | null }) {
	return (
		<Button variant="primary" onClick={() => joinChannel(channelId, password)}>
			<FaQuestion /> Join this chan
		</Button>
	)
}

export function ButtonChannelCreate({ setShowChannelForm }: { setShowChannelForm: any }) {
	return (
		<Button className="btn-sm btn-warning" onClick={() => setShowChannelForm(true)}>
			<FaPlus /> Create Channel
		</Button>
	)
}

export function ButtonChannelEdit({
	channelId,
	setShowChannelEditForm,
}: {
	channelId: number
	setShowChannelEditForm: any
}) {
	// !!!!!! 			TODO
	return (
		<Button className="btn-xs btn-warning ms-1" onClick={() => setShowChannelEditForm(true)}>
			<FaEdit /> Edit Channel (TODO)
		</Button>
	)
}

export function ButtonChannelDelete({ channelId }: { channelId: number }) {
	return (
		<Button className="btn-xs btn-danger ms-1" onClick={() => deleteChannel(channelId)}>
			<FaTrash /> Delete Channel
		</Button>
	)
}

export function ButtonChannelQuit({ channelId }: { channelId: number }) {
	return (
		<Button className="btn-xs btn-danger ms-1" onClick={() => quitChannel(channelId)}>
			<FaQuestion /> Quit this chan
		</Button>
	)
}
