// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
//import ZCadre from "ui/ZCadre"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function TodoUser() {
	return (
		<div className="row col-12 todo">
			<h2>Notes</h2>

			<div>
				<h3 className="d-inline-block">API endpoint:</h3>
				<p className="d-inline-block">
					(POST) "/user/:id" &nbsp;&nbsp;&nbsp;&nbsp; OU &nbsp;&nbsp;&nbsp;&nbsp; "/users/:id" ???
				</p>
			</div>
		</div>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
