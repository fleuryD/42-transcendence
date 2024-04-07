// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useState } from "react"
import { useAppSelector } from "store/store"
import { sendMessageToChannel } from "utils/socketio.service"
import { useEffect } from "react"

import { FaPaperPlane } from "react-icons/fa"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = { channelId: number }
export default function MessageForm({ channelId }: Props) {
	const auth = useAppSelector((state) => state.auth)

	function sendNewMessage(newMessage: string) {
		sendMessageToChannel({ creatorId: auth.id, channelId: channelId, content: newMessage })
	}

	function sendInvitationToPlay() {
		sendMessageToChannel({ creatorId: auth.id, channelId: channelId, content: "INVITATION_TO_PLAY" })
	}

	useEffect(() => {

		let elem = document.getElementById("sendMessageInput") as HTMLTextAreaElement;

		if (!elem) return;

		elem.addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode === 13) {
				if (!event.shiftKey) {
					//console.log(elem.value);

					sendNewMessage(elem.value);
					if (elem)
						elem.value = "";
				}
			}
		});

	}, []);

	return (
		<div className="p-2">
			<textarea id="sendMessageInput" className="inputChannelSend" placeholder="message" />
			<button onClick={() => sendInvitationToPlay()}>
				<FaPaperPlane /> Send play invitation
			</button>
		</div>
	)
}
