// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
import styled from "styled-components"
import { Queue } from "types"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	myid: number
	queues: Queue[] | null
	queuesEndRef: any
}

export default function QueuesContainer({ myid, queues, queuesEndRef }: Props) {
	return (
		<StyledChatContainer>
			{queues &&
				queues.map((msg) => (
					<StyledQueue key={msg.id}>
						{ myid == msg.userId && <div className="msg-creatorId">{msg.userName ? msg.userName : "noname"} #{msg.userId} MOI</div> }
						{ myid != msg.userId && <div className="msg-creatorId">{msg.userName ? msg.userName : "noname"} #{msg.userId}</div> }
					</StyledQueue>
				))}
			<div ref={queuesEndRef}></div>
		</StyledChatContainer>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledQueue = styled.div`

	border: 1px solid #666;
	border-radius: 5px;
	background-color: #ffffffee !important;

	box-shadow: 1px 1px 10px 0px rgba(255, 255, 255, 0.2);
	font-family: "customFont1", sans-serif;
	backdrop-filter: blur(3px);

	border-bottom: 1px solid black;
	background-color: white;
	padding: 5px;
	margin: 2px;

	color: black;

	div {
		display: inline-block;
		margin-right: 5px;
	}
	.msg-id {

	}
	.msg-createdAt {

		font-size: 0.8em;
	}
	.msg-creatorId {

	}
	.msg-content {
		color: black;
	}
`

const StyledChatContainer = styled.div`
	border: 1px solid black;
	height: 25vh !important;
	padding: 2px;
	margin: 20px;
	overflow: scroll;

	margin-bottom: 10px;
	border: 1px solid #ffffff;
	border-radius: 5px;

	background-color: #ddddff11;
	color: #ffffff;

	box-shadow: 3px 3px 15px 0px rgba(255, 255, 255, 0.25);
	font-family: "customFont1", sans-serif;
	backdrop-filter: blur(3px);
`
