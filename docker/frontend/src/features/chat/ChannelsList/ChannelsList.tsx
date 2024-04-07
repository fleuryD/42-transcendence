// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import { Link } from "react-router-dom"
import ZCadre from "ui/ZCadre"
import { Channel } from "types"
import { useAppSelector } from "store/store"
import { ChannelUser } from "types/chat.types"
import { ButtonChannelCreate } from "features/chat/ButtonsChannel"
import { FaLock } from "react-icons/fa"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	className: string
	selectedChanId: number
	channels: Channel[] | null
	isLoadingChannels: boolean
	errorStrChannels: string | null
	setShowChannelForm: (v: boolean) => any
}

export default function ChannelsList({
	className,
	selectedChanId,
	channels,
	isLoadingChannels,
	errorStrChannels,
	setShowChannelForm,
}: Props) {
	const auth = useAppSelector((state) => state.auth)

	const myChannels = channels?.filter(
		(chan) => chan.channelUsers?.filter((cu: any) => !chan.isPrivateDiscussion && cu.user.id === auth.id).length > 0
	)
	const otherChannels = channels
		?.filter((chan) => chan.channelUsers?.filter((cu: any) => cu.user.id === auth.id).length === 0)
		.filter((chan) => !chan.isPrivateDiscussion)
	const myPrivateDiscussions = channels?.filter(
		(chan) => chan.isPrivateDiscussion && chan.channelUsers.filter((cu: any) => cu.user.id === auth.id).length > 0
	)

	if (isLoadingChannels) {
		return <ZCadre className={className}>Loading channels...</ZCadre>
	}

	if (errorStrChannels) {
		return <ZCadre className={className}>ERROR : {errorStrChannels}</ZCadre>
	}

	return (
		<ZCadre className={className}>
			{myChannels?.length === 0 && otherChannels?.length === 0 && myPrivateDiscussions?.length === 0 && (
				<div className="cadreTitle">No channels yet.</div>
			)}

			{myChannels?.length != 0 && <div className="cadreTitle">Channels I joined:</div>}
			<ChannelsListContent chans={myChannels} />

			{myPrivateDiscussions?.length != 0 && <div className="cadreTitle">Private Discussions:</div>}
			<PrivateDiscussionsListContent chans={myPrivateDiscussions} />

			{otherChannels?.length != 0 && <div className="cadreTitle">Other channels:</div>}
			<ChannelsListContent chans={otherChannels} />
			<ButtonChannelCreate setShowChannelForm={setShowChannelForm} />
		</ZCadre>
	)

	function ChannelsListContent({ chans }: { chans: any[] | null | undefined }) {
		return (
			<ul>
				{chans &&
					chans.map((chan) => (
						<Link to={"/chat/channel/" + chan.id}>
							<li
								className={`channelListElem ${selectedChanId === chan.id && "selectedChannel"}`}
								key={chan.id}
							>
								<span>{chan.name}</span>
								&nbsp;({chan.isPrivate ? "Private" : "Public"})&nbsp;
								{chan.isPasswordProtected && (
									<>
										{""}
										(<FaLock />
										Pass)
									</>
								)}
							</li>
						</Link>
					))}
			</ul>
		)
	}

	function PrivateDiscussionsListContent({ chans }: { chans: Channel[] | null | undefined }) {
		return (
			<ul>
				{chans &&
					chans.map((chan) => {
						const otherChannelUser = chan.channelUsers.find((cu: ChannelUser) => cu.user.id !== auth.id)
						return (
							<Link to={"/chat/channel/" + chan.id}>
								<li
									className={`channelListElem ${selectedChanId === chan.id && "selectedChannel"}`}
									key={chan.id}
								>
									{otherChannelUser?.user.name}
								</li>
							</Link>
						)
					})}
			</ul>
		)
	}
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
