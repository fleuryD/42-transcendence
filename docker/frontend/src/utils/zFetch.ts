// ### DOCUMENTATION ############################################################

// ### IMPORTS ##################################################################

import { API_BASE_URL, getUserToken } from "utils/constants" // ?????????????????
//import errorManager from "./errorManager"

// ### TYPES ####################################################################

type Props = {
	shortUrl: string // ***************** sans la base (ex: "/users/42")
	method: "GET" | "POST" | "DELETE"
	requierdFields: string[] // ********* Les champs qui doivent être retournés
	body?: any // *********************** A envoyer dans la requete
	publicAccess?: boolean // *********** si false, on n'envoi pas de userToken
}

// ### FUNCTIONS ################################################################

// 🟥🟧🟨🟩🟦🟪⬛️⬜️🟫

export default async function zFetch({ shortUrl, method, requierdFields, body, publicAccess }: Props) {
	const url = API_BASE_URL + shortUrl
	console.group("🟨 zFetch")
	//console.log("➤➤ url:", url)

	const requestOptions = {
		method,
		headers: publicAccess ? requestOptionsHeadersPublic() : requestOptionsHeaders(),
		body: body ? JSON.stringify(body) : null,
	}

	try {
		//console.log("requestOptions:", requestOptions)
		const response = await fetch(url, requestOptions)
		//console.log("🟩 response:", response)

		const rep = await response.json()

		const missingElements = [] as string[]

		if (rep?.statusCode >= 400) {
			let returnErrorMessage = "Erreur: "
			//console.log("❌ statusCode:", rep.statusCode)
			//console.log("❌ message:", rep.message)
			return { error: returnErrorMessage }
		}

		requierdFields.forEach((elem) => {
			if (!rep[elem]) {
				missingElements.push(elem)
			}
		})

		if (missingElements.length === 0) {
			//console.log("✔️ SUCCESS")
			//console.log("✔️ zedFetch.rep:", rep)
			console.groupEnd()
			return rep
		}

		//console.log("❌ missingElements", missingElements)
		console.groupEnd()

		return { error: rep }
	} catch (err) {
		console.groupEnd()
		return { error: err }
	}
}
// ### PRIVATE ################################################################

function requestOptionsHeaders() {
	return {
		"Content-Type": "application/json",
		Accept: "application/json",
		Authorization: "Bearer " + localStorage.getItem("jwt"), // TODO : A modifier
		//Authorization: localStorage.getItem("jwt"), // TODO : A modifier
	}
}
function requestOptionsHeadersPublic() {
	return {
		"Content-Type": "application/json",
		Accept: "application/json",
	}
}
