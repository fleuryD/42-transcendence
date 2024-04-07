// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import { Link } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { User } from "types"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

/*
 *	ChannelsList
 *
 *	(menu des Channels)
 *
 *	FETCH et AFFICHE la liste des channels
 *
 */

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	user: User | null
}

export default function UserLink({ user }: Props) {
	if (!user) return null

	return (
		<>
			<small>
				<img className="imgMsg" src={user.avatarLink ? user.avatarLink : process.env.REACT_APP_FRONTENDAPI + "/default-avatar.jpg" }/>{" "}
			</small>
			<Link to={"/user/" + user.id} title="Click to see user's profile.">
				{user.name + " "}
			</Link>
		</>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
