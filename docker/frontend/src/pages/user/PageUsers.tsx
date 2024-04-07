// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useState, useEffect } from "react"
import ZPage from "ui/ZPage"
import { FaUserFriends } from "react-icons/fa"
import TodoUsers from "features/users/TodoUsers"
import UsersTable from "features/users/UsersTable"
import { User } from "types"
import { apiFetchUsers } from "utils/api"
import ZCadre from "ui/ZCadre"
import { useAppSelector } from "store/store"
import { sendNavigate, subscribeToUsersStatus } from "utils/socketio.service"
import styled from "styled-components"

import "./PageUsers.scss"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function PageUsers() {
	useEffect(() => {
		sendNavigate("PageUsers", null)
	}, [])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [users, setUsers] = useState<User[] | null>(null)
	const [allRelations, setAllRelations] = useState<any[] | null>(null)

	const { socketIsConnected } = useAppSelector((state) => state.app)
	useEffect(() => {
		apiFetchUsers().then((response: any) => {
			if (response.error) {
				//console.log(response)
				setError("Le serveur est indisponible.")
			} else {
				setUsers(response.users)
				setAllRelations(response.allRelations)
			}
			setIsLoading(false)
		})
	}, [])

	useEffect(() => {
		if (!socketIsConnected) return

		subscribeToUsersStatus((err: any, data: any) => {
			xXxxx(data)
		})
		return () => {
			///	//console.log("PageChatV2 - useEffect return - !!!!!!!!!!disconnectSocket")
			////	disconnectSocket()
		}

		function xXxxx(receivedData: any) {
			//console.log("subscribeToUsersStatus", receivedData)
			if (receivedData.allRelations) setAllRelations(receivedData.allRelations)

			if (users && receivedData.user) {
				let newUsers = users?.map((user) => {
					if (user.id === receivedData.user.id) {
						return { ...user, status: receivedData.user.status }
					} else {
						return user
					}
				})
				setUsers(newUsers)
			}
		}
	}, [socketIsConnected, users]) // ! si je rajoutes [messages] aux dependances, ca fait des doubles dans les loos du serveurs

	return (
		<StyledUsersZPage documentTitle="Users">
			{!error && (
				<div className="zPageHeader">
					<h1>
						<FaUserFriends /> Liste des utilisateurs
					</h1>
				</div>
			)}

			{!error && isLoading && <h5>Fetching users...</h5>}
			{error && (
				<div className="text-danger">
					<h5>Error:</h5>
					{error}
				</div>
			)}

			{!error && (
				<StyledUsersZCadre>
					{users && allRelations && <StyledUsersTable users={users} allRelations={allRelations} />}
				</StyledUsersZCadre>
			)}
		</StyledUsersZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledUsersZPage = styled(ZPage)`
	background-color: transparent !important;
	color: white;
	text-align: center;
	font-family: "customFont1", sans-serif;
	border: none !important;
`
const StyledUsersZCadre = styled(ZCadre)`
	padding: 0 0;
	border: none !important;

	p {
		font-size: 1em;
		margin-top: 10px;
	}
`

const StyledUsersTable = styled(UsersTable)`
	border: none !important;
	padding: 0 0;
`
