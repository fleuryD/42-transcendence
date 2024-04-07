// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React, { useEffect } from "react"
import ZPage from "ui/ZPage"
import { FaBan } from "react-icons/fa"
import ZCadre from "ui/ZCadre"
import { sendNavigate } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function PageDevNotes() {
	useEffect(() => {
		sendNavigate("PageDevNotes", null)
	}, [])
	return (
		<ZPage documentTitle="Dev-Notes">
			<div className="zPageHeader">
				<h1>
					<FaBan /> Dev: Notes
				</h1>
			</div>

			<h2>Notes React: </h2>
			<ZCadre>
				<p>
					Si tu as ta page qui se charge 2 fois
					<br />
					Quand tu as un console log sur ta page, tu le vois 2 fois
					<br />
					Il faut supprimer les balises <b>React.StrictMode</b> dans src/index.js
				</p>
			</ZCadre>
			<ZCadre className={null}>
				<h2>Chat</h2>
				<h3 className="mt-5">les entites</h3>
				<p className="text-danger">
					Regardez les "s" à la fin des {"{"}proriétés{"}"}.
					<br />
					exemples : un channel a DES messageS et un message a UN SEUL channel
				</p>
				<p>
					<b>user</b> : {"{"}name, isPrivate, password, channelUsers, ...{"}"}
				</p>
				<p>
					<b>channel</b> : {"{"}message, channelUsers,...{"}"}
				</p>
				<p>
					<b>channelUser</b> : {"{"}channel, user, isOwner, isAdmin, isBan,... {"}"}
					<br />
					Quand un user rejoint un channel, on crée un channelUser, avec les infos de cet user sur ce channel
					(isOwner, admin....)
				</p>
				<p>
					<b>message</b> : {"{"}channel, user, date, content{"}"}
				</p>
				<h3 className="mt-5">pages/chat/PageChat</h3>
				<p>
					<b>subscribeToChat</b> (socket.on("infoChat", (data)...)
					<br />
					On ecoute si un channel est crée, supprimé (ou modifié: TODO)
					<br />
					la liste des channels est mise à jour avec data.channels
				</p>
				<p>
					si l'url est <b>/chat/channel/:id</b> (au lieu de <b>/chat</b>)
					<br />
					On definit selectedChanId avec le paramètre id de l'url
					<br />
					et on charge le composant features/chat/<b>Channel</b> avec ce selectedChanId
				</p>
				<h3 className="mt-5">features/chat/Channel</h3>
				<p>
					<b>subscribeToChannel</b> (socket.on("infoChannel_" + chanId, (data)...)
					<br />
					On ecoute si il se passe quelquechose sur CE CHANNEL (nouveaux messages, user
					kiked/admined/banned...)
					<br />
					setChannel(data.channel)
					<br />
					setMessages(data.channel.messages)
				</p>
			</ZCadre>
		</ZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
