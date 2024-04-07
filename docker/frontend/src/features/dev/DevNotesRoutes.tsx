// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
import { styled } from "styled-components"
import ZTable from "ui/zTable/ZTable"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function DevNotesRoutes() {
	const arr = [
		{ url: "/", name: "Home" },
		{
			url: "/login",
			name: "Auth: Login",
			apiCallMethode: "POST",
			apiCallRoute: "api/login",
			apiCallBody: "{email OU username ??, password}",
			ApiReturnType: "json",
			ApiReturnContent: "connected User (avec token) {jwt, id, name, email, ...}",
		},
		{
			url: "/register",
			name: "Auth: Register",
			apiCallMethode: "POST",
			apiCallRoute: "api/register",
			apiCallBody: "{email, username, password}",
			ApiReturnType: "json",
			ApiReturnContent: "SUCCESS | FAIL  - OU - infos user avec token pour connexion auto",
		},
		{
			url: "/api/user/:id",
			name: "User Show",
			apiCallMethode: "GET",
			apiCallRoute: "api/user/:id",
			ApiReturnType: "json",
			ApiReturnContent: "un user {id, name, email, ...}",
		},
		{
			url: "/api/users",
			name: "Users Index",
			apiCallMethode: "GET",
			apiCallRoute: "api/users",
			apiCallBody: null,
			ApiReturnType: "json",
			ApiReturnContent: "tous les users [{id, name, email, ...}, ...]",
		},
		{
			url: "/chat",
			/*
			name: "xxxx",
			apiCallMethode: "xxxx",
			apiCallRoute: "api/xxxx",
			apiCallBody: "xxxx",
			ApiReturnType: "xxxx",
			ApiReturnContent: "xxxx",
			*/
		},
		{
			url: "/chat/salon/:id",
		},
		/*
		{
			url: "/Xxxxxx",
			name: "xxxx",
			apiCallMethode: "xxxx",
			apiCallRoute: "api/xxxx",
			apiCallBody: "xxxx",
			ApiReturnType: "xxxx",
			ApiReturnContent: "xxxx",
		},
		{
			url: "/Xxxxxx",
			name: "xxxx",
			apiCallMethode: "xxxx",
			apiCallRoute: "api/xxxx",
			apiCallBody: "xxxx",
			ApiReturnType: "xxxx",
			ApiReturnContent: "xxxx",
		},
		{
			url: "/Xxxxxx",
			name: "xxxx",
			apiCallMethode: "xxxx",
			apiCallRoute: "api/xxxx",
			apiCallBody: "xxxx",
			ApiReturnType: "xxxx",
			ApiReturnContent: "xxxx",
		},
		*/
		{ url: "/dev/subject", name: "Dev: Subject" },
	]

	const tableColumns = [
		{
			name: "url",
			text: "url",
		},
		{
			name: "name",
			text: "name",
		},
		{
			name: "apiCall",
			text: "apiCall",
			cellHtml: (route: any) => (
				<>
					{route.apiCallMethode && <>({route.apiCallMethode}) </>}
					{route.apiCallRoute && <span className="text-primary">{route.apiCallRoute}</span>}
					{route.apiCallBody && (
						<div>
							<u>body:</u> {route.apiCallBody}
						</div>
					)}
				</>
			),
		},
		{
			name: "apiReturn",
			text: "apiReturn",
			cellHtml: (route: any) => (
				<>
					{route.ApiReturnType && <>({route.ApiReturnType}) </>}
					{route.ApiReturnContent && <span className="text-success">{route.ApiReturnContent}</span>}
				</>
			),
		},
	]

	return (
		<div>
			<ZTable
				columns={tableColumns}
				data={arr}
				className="table table-bordered table-sm table-striped table-hover bg-light "
			/>
			<div className="row  col-12">
				<p className="border border-success col-6">
					<b>POST</b>, c'est quand le client envoie des infos (email, password) dans le body de la requette.
					(exemple : login, register, validation d'un formulaire, ...)
					<br />
					<b>GET</b>: Rien dans le body. l'adresse suffit. (exemple: "/article/4")
				</p>
				<p className="border border-success col-6">
					Pour l'instant, on envoi le token dans le body de la requette (donc en POST)
					<br />
					Donc pour l'instant, toutes les routes sont en POST.
					<br />
					Il faudra mettre le token dans le header
				</p>
				<p className="border border-success col-6">
					Toutes les routes doivent envoyer le token dans le header SAUF Login et Register
				</p>
			</div>
		</div>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledDevNotesRoutes = styled.div``
