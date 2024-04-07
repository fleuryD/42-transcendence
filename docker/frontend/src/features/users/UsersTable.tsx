// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import { Link } from "react-router-dom"

import ZTable from "ui/zTable/ZTable"
import { useAppSelector } from "store/store"

import { User } from "types"
import { Button } from "react-bootstrap"
import { setRelation } from "utils/socketio.service"
import ButtonUserFriend from "./ButtonUserFriend"
import ButtonUserBlock from "./ButtonUserBlock"

import styled from "styled-components"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function UsersTable({ users, allRelations }: { users: User[]; allRelations: any[] }) {
	const auth = useAppSelector((state) => state.auth)
	const tableColumns = [
		{
			name: "avatar",
			text: "",
			cellHtml: (user: User) => (
				<img
					src={user.avatarLink ? user.avatarLink : process.env.REACT_APP_FRONTENDAPI + "/default-avatar.jpg"}
					alt="avatar"
					style={{ objectFit: "cover", width: "30px", height: "30px", borderRadius: "2px", marginRight: "10px" }}
				/>
			),
			cellClassName: (user: User) => (user.id === auth.id ? "bg-warning" : ""),

		},
		{
			name: "name",
			text: "name (a changer en username)",
			cellHtml: (user: User) => <Link to={"/user/" + user.id}>{user.name}</Link>,
			cellClassName: (user: User) => (user.id === auth.id ? "bg-warning" : ""),
		},
		{
			name: "email",
			text: "email",
			cellClassName: (user: User) => (user.id === auth.id ? "bg-warning" : ""),
		},
		{
			name: "isMyFriend",
			text: "isMyFriend",
			cellClassName: (user: User) => (user.id === auth.id ? "bg-warning" : ""),
			cellHtml: (user: User) => {
				return <ButtonUserFriend user={user} allRelations={allRelations} />
			},
		},
		{
			name: "isBlocked",
			text: "isBlocked",
			cellClassName: (user: User) => (user.id === auth.id ? "bg-warning" : ""),
			cellHtml: (user: User) => {
				return <ButtonUserBlock user={user} allRelations={allRelations} />
			},
		},
		{
			name: "status",
			text: "status",
			cellHtml: (user: User) => {
				if (
					auth.id !== user.id &&
					allRelations.filter(
						(rel) =>
							rel.userId === auth.id &&
							rel.otherUserId === user.id &&
							rel.type === "FRIEND" &&
							rel.accepted
					).length === 0
				)
					return <span className="text-danger">Not Friend</span>

				if (user.status === "ONLINE" || user.id === auth.id)
					return <span className="text-success">🟢 Online</span>
				else if (user.status === "OFFLINE") return <span className="text-secondary">⚫ Offline</span>
				else if (user.status === "PLAYING") return <span className="text-danger">🔴 Playing</span>
				else if (user.status === "AFK") return <span className="text-warning">🟠 AFK</span>
				else return <span className="text-secondary">{user.status}</span>
			},
			cellClassName: (user: User) => (user.id === auth.id ? "bg-warning" : ""),
		},
	]

	return (
		<StyledUsersZTable
			columns={tableColumns}
			data={users}
			className="table table-bordered table-sm table-striped table-hover bg-light "
		/>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledUsersZTable = styled(ZTable)`
	padding: 10px;
	border: 3px solid #dddddd;
	background-color: #22223377 !important;
	backdrop-filter: blur(3px);
	color: white;

	margin: 0px 10px;
	width: calc(100% - 20px);
	border-radius: 10px;
	overflow: hidden;
	display: inline-block;

	tbody {
		margin-top: 10px;
		display: table;
		width: 100%;

		tr {
			td {
				vertical-align: middle;
			}
		}

		tr:not(:first-child) {
			border-top: 1px solid #dddddd !important;
		}

		button {
			text-decoration: underline;
			font-size: 1em;
		}
	}

	thead {
		display: none !important;
		vertical-align: bottom;
	}

	tr {
		padding: 0px 10px;
	}

	* {
		color: white !important;
		background-color: #22222200 !important;
		border-style: none !important;
	}
`
