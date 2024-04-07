// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import { useAppSelector } from "store/store"
import { User } from "types"
import { Button } from "react-bootstrap"
import { setRelation } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function ButtonUserFriend({ user, allRelations }: { user: User; allRelations: any[] }) {
	const auth = useAppSelector((state) => state.auth)

	if (auth.id === user.id) return <>ME</>
	if (
		allRelations.filter(
			(rel) => rel.otherUserId === auth.id && rel.userId === user.id && rel.type === "FRIEND" && !rel.accepted
		).length > 0
	)
		return (
			<>
				<Button className="btn-primary btn-xs" onClick={() => setRelation(user.id, "ACCEPT_FRIEND", true)}>
					Accept
				</Button>
				<Button className="btn-danger btn-xs" onClick={() => setRelation(user.id, "DECLINE_FRIEND", true)}>
					Decline
				</Button>
				friend
			</>
		)
	if (
		allRelations.filter(
			(rel) => rel.userId === auth.id && rel.otherUserId === user.id && rel.type === "FRIEND" && rel.accepted
		).length > 0
	)
		return (
			<Button className="btn-success btn-xs" onClick={() => setRelation(user.id, "UNFRIEND", true)}>
				Remove friend
			</Button>
		)
	if (
		allRelations.filter(
			(rel) => rel.userId === auth.id && rel.otherUserId === user.id && rel.type === "FRIEND" && !rel.accepted
		).length > 0
	)
		return <></>
	return (
		<Button className="btn-secondary btn-xs" onClick={() => setRelation(user.id, "FRIEND", true)}>
			Add friend
		</Button>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
