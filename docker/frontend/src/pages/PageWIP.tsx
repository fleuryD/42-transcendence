// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useEffect } from "react"
import ZPage from "ui/ZPage"
import { FaBan } from "react-icons/fa"
import { sendNavigate } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function PagWIP() {
	useEffect(() => {
		sendNavigate("PageWip", null)
	}, [])
	return (
		<ZPage documentTitle="WIP">
			<div className="zPageHeader">
				<h1>
					<FaBan /> Work In Progress
				</h1>
			</div>

			<p>Coming soon...</p>
		</ZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
