
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
import { useEffect } from "react"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function MatchHistory({userId}: {userId: number}) {
	const [history, setHistory] = React.useState<any[]>([<div key={"history_key_loading"} className="loadingMatchHistory">Get matchHistory...</div>])
	const [stats, setStats] = React.useState<any[]>([])

	useEffect(() => {
		getMatchHistory()
	}, [userId])

	const getMatchHistory = async () => {
		//console.log("getMatchHistory")

		const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/game/parties/matchHistory", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ id: userId }),
		})
		const data = await response.json()

		if (data.error)
			return ;

		let newhistory = [];

		for (let i = 0; i < data.history.length; i++) {
			newhistory.push(<div key={"history_key_" + i} className={`matchHistoryElem ${data.history[i].scoreMe >
				data.history[i].scoreHim ? "matchWin" : ""} ${data.history[i].scoreMe < data.history[i].scoreHim ? "matchLose" : ""}`}>
					{data.history[i].me} vs {data.history[i].vs} | {(data.history[i].scoreMe >= 10 || data.history[i].scoreHim >= 10) ?
					<>{data.history[i].scoreMe ? data.history[i].scoreMe : "0"} - {data.history[i].scoreHim ? data.history[i].scoreHim : "0"}</> : <>Partie en cours</>}</div>);
		}

		newhistory =  newhistory.reverse();

		if (data.history.length === 0)
			newhistory.push(<div key={"history_key_no"} className="matchHistoryElem">Aucun historique</div>);

		let newStats = [];

		newStats.push(<div key={"history_key_title"} className="matchHistoryStats">Victoires: {data.win} Defaites: {data.lose}</div>);

		setStats(newStats)
		setHistory(newhistory)
	}

	return (
		<div className="matchHistory">
			{stats}
			{history}
		</div>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS






