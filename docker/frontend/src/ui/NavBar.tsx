// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
//import styled from "styled-components"
import { Link } from "react-router-dom"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import styled from "styled-components"

import { useAppSelector, useAppDispatch } from "../store/store"
import { authLogoutSuccess } from "../store/authSlice"

import {
	FaHome,
	FaUserFriends,
	FaUser,
	FaCat,
	FaAddressCard,
	//FaQuestion,
	FaGamepad,
	FaBan,
	FaSignInAlt,
	FaSignOutAlt,
	FaArrowRight,
} from "react-icons/fa"

import { useNavigate } from "react-router-dom"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function NavBar() {
	const dispatch = useAppDispatch()
	const auth = useAppSelector((state) => state.auth)

	const navigate = useNavigate()

	return (
		<StyledNavbar expand="sm">
			<StyledContainer>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						{auth.isConnected ? <NavBarDropdownLinksLogged /> : ""}
					</Nav>
				</Navbar.Collapse>
			</StyledContainer>
		</StyledNavbar>
	)

	function btLogoutClick() {
		dispatch(authLogoutSuccess())
		localStorage.removeItem("jwt")
		//localStorage.removeItem("...") // TODO : remove all localstorage
		navigate("/")
	}

	function NavBarDropdownDev() {
		const navDropdownTitle = (
			<White>
				<FaBan /> dev
			</White>
		)
		return (
			<StyledNavDropdown title={navDropdownTitle}>
				<StyledNavDropdownItem as={Link} to="/dev/subject">
					<FaBan /> Subject
				</StyledNavDropdownItem>
				<NavDropdown.Divider />
				<StyledNavDropdownItem as={Link} to="/dev/notes">
					<FaBan /> Notes
				</StyledNavDropdownItem>
			</StyledNavDropdown>
		)
	}

	function NavBarDropdownConnectedUser() {
		const navDropdownTitle = (
			<White>
				<FaUser /> {auth.name}
			</White>
		)
		return (
			<StyledNavDropdown title={navDropdownTitle} id="basic-nav-dropdown">
				<StyledNavDropdownItem as={Link} to={"/user/" + auth.id}>
					<FaAddressCard /> Mon profil
				</StyledNavDropdownItem>
				<NavDropdown.Divider />
				<StyledNavDropdownItem onClick={() => btLogoutClick()}>
					<FaSignOutAlt /> Déconnexion
				</StyledNavDropdownItem>
			</StyledNavDropdown>
		)
	}

	// * Links du menu pour un utilisateur connecté
	function NavBarDropdownLinksLogged() {
		return (
			<>
				<StyledNavLink as={Link} to="/">
					<FaHome /> Home
				</StyledNavLink>
				<StyledNavLink as={Link} to="/users">
					<FaUserFriends /> Users
				</StyledNavLink>
				<StyledNavLink as={Link} to="/chat">
					<FaCat /> Chat
				</StyledNavLink>
				<StyledNavLink as={Link} to="/game/join">
					<FaGamepad /> Game
				</StyledNavLink>
				<NavBarDropdownConnectedUser />
			</>
		)
	}
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledNavbar = styled(Navbar)`
	background-color: #ffffff00;
	padding-left: 10px;
	z-index: 1000;
`

const StyledNavDropdownItem = styled(NavDropdown.Item)`
	background-color: #00000000 !important;
	color: #ffffff !important;
	text-decoration: none;

	&:first-child {
		margin-top: 10px !important;
	}
`

const StyledNavLink = styled(Nav.Link)`
	padding: 5px 10px;
	padding-top: 7px;
	margin: 10px 10px;
	border: 2px solid #ffffff;
	border-radius: 5px;
	height: 40px;

	background-color: #ffffff11;
	color: #ffffff;
	cursor: pointer;

	box-shadow: 3px 3px 15px 0px rgba(255, 255, 255, 0.25);
	font-family: "customFont1", sans-serif;
	backdrop-filter: blur(3px);

	text-decoration: none;
	text-align: center;
	text-transform: uppercase;
	overflow: hidden;

	transform:scale(1);
	transition: all 0.05s ease-in-out;

	&:hover {
		background-color: #ffffff22;
		transform:scale(1.1);
	}

	&:child-first {
		margin-top: 10px !important;
	}
`
const StyledNavBrand = styled(Navbar.Brand)`
	padding: 5px 10px;
	padding-top: 7px;
	margin: 10px 10px;
	border: 2px solid #ffffff;
	border-radius: 5px;
	height: 40px;

	background-color: #ffffff11;
	color: #ffffff;
	cursor: pointer;

	box-shadow: 3px 3px 15px 0px rgba(255, 255, 255, 0.25);
	font-family: "customFont1", sans-serif;
	backdrop-filter: blur(3px);
	text-decoration: none;
	text-align: center;
	text-transform: uppercase;
	overflow: hidden;
`
const StyledNavDropdown = styled(NavDropdown)`
	padding: 5px 10px;
	padding-top: 7px;
	margin: 10px 10px;

	border: 2px solid #ffffff;
	border-radius: 5px;
	height: 40px;

	z-index: 1001;

	background-color: #ffffff11;
	color: #ffffff;
	cursor: pointer;

	box-shadow: 3px 3px 15px 0px rgba(255, 255, 255, 0.25);
	font-family: "customFont1", sans-serif;
	backdrop-filter: blur(3px);
	text-decoration: none;
	text-align: center;
	text-transform: uppercase;

	div {
		color: #ffffff !important;
		background-color: #333344BB !important;
		backdrop-filter: blur(5px);
		text-align: center;
		margin-top: 10px !important;
	}
`

const White = styled.span`
	color: #ffffff;
`
const StyledContainer = styled(Container)`
	margin: 0 auto !important;

	div:not(.nav-item) {
		text-align: center;
		margin: 0 auto !important;
	}

	div.nav-item a {
		margin-top: 0px !important;
		padding-top: 0px !important;
	}
`
