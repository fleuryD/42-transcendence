// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
import Dropdown from "react-bootstrap/Dropdown"
import { useAppSelector } from "store/store"
import { Channel, ChannelUser } from "types"
import { adminEditChannelUser } from "utils/socketio.service"

import { GiHighKick } from "react-icons/gi"
import { FaBan, FaVolumeOff, FaCheck } from "react-icons/fa"
import styled from "styled-components"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	channel: Channel
	channelUser: ChannelUser
	isAdmin: boolean
}

export default function ChannelUserAdminContextMenu({ channel, channelUser, isAdmin }: Props) {
	const auth = useAppSelector((state) => state.auth)
	if (!isAdmin) return null
	if (channelUser.user.id === auth.id) return null
	if (channelUser.isOwner) return null
	const isPendingJoinPrivateChannel = channel?.isPrivate && !channelUser.accepted

	return (
		<Dropdown className="d-inline ms-2 me-2">
			<Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn-xs">
				Handle User
			</Dropdown.Toggle>
			{isPendingJoinPrivateChannel ? <Menu2 /> : <Menu1 />}
		</Dropdown>
	)

	function Menu2() {
		return (
			<StyledDropdownMenu>
				<StyledDropdownItemText>
					<i>
						<b>{channelUser.user.name}</b> wants to join this chan:
					</i>
				</StyledDropdownItemText>
				<Dropdown.Divider />
				{/*■■■■■■■■■■	ACCEPT		■■■■■■■*/}
				<StyledDropdownItem
					as="button"
					onClick={() => {
						adminEditChannelUser(channel.id, channelUser.id, "ACCEPT_IN_PRIVATE_CHAN", true, null)
					}}
				>
					<span className="text-success">
						<FaCheck /> Accept
					</span>
				</StyledDropdownItem>
				{/*■■■■■■■■■■	DENIED		■■■■■■■*/}
				<StyledDropdownItem
					as="button"
					onClick={() => {
						adminEditChannelUser(channel.id, channelUser.id, "REFUSED_IN_PRIVATE_CHAN", true, null)
					}}
				>
					<span className="text-red">
						<FaBan /> Deneid
					</span>
				</StyledDropdownItem>
				{/*■■■■■■■■■■	xxxxxxxxxx		■■■■■■■*/}
			</StyledDropdownMenu>
		)
	}

	function Menu1() {
		return (
			<StyledDropdownMenu>
				<StyledDropdownItemText>
					<i>
						Edit <b>{channelUser.user.name}</b>'s privileges':
					</i>
				</StyledDropdownItemText>
				<Dropdown.Divider />
				{/*■■■■■■■■■■	BAN		■■■■■■■*/}
				<StyledDropdownItem
					as="button"
					onClick={() => {
						adminEditChannelUser(channel.id, channelUser.id, "BAN", !channelUser.isBanned, null)
					}}
				>
					<FaBan /> {channelUser.isBanned ? <span className="text-danger">UnBan</span> : "Ban"}
				</StyledDropdownItem>
				{/*■■■■■■■■■■	KICK		■■■■■■■*/}
				<StyledDropdownItem
					as="button"
					onClick={() => {
						adminEditChannelUser(channel.id, channelUser.id, "KICK", true, null)
					}}
				>
					<GiHighKick /> Kick
				</StyledDropdownItem>
				{/*■■■■■■■■■■	unMUTE		■■■■■■■*/}
				{channelUser.endMutedAt && (
					<>
						<StyledDropdownItem
							as="button"
							onClick={() => {
								adminEditChannelUser(channel.id, channelUser.id, "MUTE", false, 0)
							}}
						>
							<span className="text-danger">
								<FaVolumeOff /> UnMute
							</span>
						</StyledDropdownItem>
					</>
				)}
				{/*■■■■■■■■■■	MUTE		■■■■■■■*/}
				{!channelUser.endMutedAt && (
					<>
						<StyledDropdownItem
							as="button"
							onClick={() => {
								adminEditChannelUser(channel.id, channelUser.id, "MUTE", true, 1)
							}}
						>
							<FaVolumeOff /> Mute (1 min)
						</StyledDropdownItem>
						<StyledDropdownItem
							as="button"
							onClick={() => {
								adminEditChannelUser(channel.id, channelUser.id, "MUTE", true, 5)
							}}
						>
							<FaVolumeOff /> Mute (5 mins)
						</StyledDropdownItem>
					</>
				)}
				{/*■■■■■■■■■■	set ADMIN		■■■■■■■*/}
				<StyledDropdownItem
					as="button"
					onClick={() => {
						adminEditChannelUser(channel.id, channelUser.id, "ADMIN", !channelUser.isAdmin, null)
					}}
				>
					{channelUser.isAdmin ? <span className="text-primary">Remove Admin</span> : "Give Admin"}
				</StyledDropdownItem>
			</StyledDropdownMenu>
		)
	}

	// ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■
}

const StyledDropdownItemText = styled(Dropdown.ItemText)`
	color: white;
`

const StyledDropdownMenu = styled(Dropdown.Menu)`
	background-color: #00000048;
	backdrop-filter: blur(5px);
	border: solid 1px #ffffff44;
	color: white !important;
	width: 200px;

	z-index: 1002;
`

const StyledDropdownItem = styled(Dropdown.Item)`
	border: none !important;
	border-radius: 0 !important;
	height: 100% !important;
	margin: 0 !important;

	background-color: #00000000 !important;
	color: while !important;
	cursor: pointer;
	overflow: hidden;

	box-shadow: none !important;
	font-family: "customFont1", sans-serif;
	backdrop-filter: none !important;

	text-decoration: none;
	text-align: center;
	text-transform: uppercase;
	overflow: hidden;

	transition: all 0.05s ease-in-out !important;

	&:hover {
		background-color: #ffffff44 !important;
		transform: scale(1) !important;
	}

	&:child-first {
		margin-top: 10px !important;
	}

	width: 100%;
`
