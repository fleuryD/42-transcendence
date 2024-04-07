// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { useState } from "react"
import { Button } from "react-bootstrap"
//import styled from "styled-components"
// import * as io from "socket.io-client"

import { useAppSelector } from "store/store"
import ZxModal from "ui/ZModal"
import { createChannel } from "utils/socketio.service"
import { Channel } from "types"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function ChannelFormCreate({ setShowForm }: { setShowForm: any }) {
	const auth = useAppSelector((state) => state.auth)
	const [name, setName] = useState("")
	const [access, setAccess] = useState<"PUBLIC" | "PRIVATE">("PUBLIC")
	const [password, sePassword] = useState<string>("")
	const [isLoading, setIsLoading] = useState(false)
	// const [error, setError] = useState<string | null>(null)

	function handleClickCreate(): void {
		setIsLoading(true)
		if (auth.id) {
			createChannel(auth.id, name, access === "PRIVATE", password)
		}
	}

	return (
		<ZxModal styles={{}} closeForm={() => setShowForm(false)}>
			<h2>Create Channel</h2>
			<form className="border p-2 mb-3 formChannel">
				<fieldset>
					<label htmlFor="access">Name: </label>
					<input
						className="formChannelInput"
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</fieldset>
				<fieldset>
					<label htmlFor="access">Password: </label>
					<input
						className="formChannelInput"
						type="text"
						placeholder="Password (Facultatif)"
						value={password}
						onChange={(e) => sePassword(e.target.value)}
					/>
				</fieldset>
				<fieldset>
					<label htmlFor="access">Access: </label>
					<select name="access" id="access" value={access} onChange={(e) => setAccess(e.target.value as any)}>
						<option value="PUBLIC">Public</option>
						<option value="PRIVATE">Private</option>
					</select>
				</fieldset>

				<Button
					variant="success"
					className="formChannelApply"
					onClick={() => handleClickCreate()}
					disabled={isLoading || name.length === 0}
				>
					Create New Channel
				</Button>
			</form>
		</ZxModal>
	)
}
