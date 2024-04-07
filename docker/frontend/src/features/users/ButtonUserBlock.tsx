// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import { useAppSelector } from "store/store"
import { User } from "types"
import { Button } from "react-bootstrap"
import { setRelation } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function ButtonUserBlock({ user, allRelations }: { user: User; allRelations: any[] }) {
	const auth = useAppSelector((state) => state.auth)

	if (auth.id === user.id) return <>ME</>
	if (
		allRelations.filter((rel) => rel.userId === auth.id && rel.otherUserId === user.id && rel.type === "BLOCKED")
			.length > 0
	)
		return (
			<Button className="btn-danger btn-xs" onClick={() => setRelation(user.id, "UNBLOCK", false)}>
				unBlock
			</Button>
		)
	return (
		<Button className="btn-secondary btn-xs" onClick={() => setRelation(user.id, "BLOCK", true)}>
			Block
		</Button>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
