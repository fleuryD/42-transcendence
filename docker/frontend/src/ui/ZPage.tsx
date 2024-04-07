// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React, { useEffect } from "react"
import styled from "styled-components"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	documentTitle: string
	children?: React.ReactNode
	className?: String | null
	// * pour le menu::
	edt?: any | null
	etab?: any | null
	navHeaderVariant?: string // "light" | "primary"
	// * option 1:
	fetchFunction?: (() => any) | null
	fetchSuccessFunction?: ((_result: any) => any) | null
	// * option 2:
	isLoading?: boolean
	error?: String | null
}

ZPage.defaultProps = {
	edt: null,
	etab: null,
	children: null,
	className: "",
	fetchFunction: null,
	fetchSuccessFunction: null,
	isLoading: false,
	error: null,
	navHeaderVariant: "primary",
}

export default function ZPage({
	children,
	className,
	documentTitle,
	fetchFunction,
	fetchSuccessFunction,
	isLoading,
	error,
	navHeaderVariant,
}: Props) {
	useEffect(() => {
		document.title = documentTitle === "" ? "TsdtL" : "TsdtL: " + documentTitle
	}, [documentTitle])

	return (
		<StyledZPage className={className + " col-12 bg-light mt-1 "}>
			{/*
			{isFetching && <Loading />}
			{isLoading && <Loading />}
			{fetchError && <h3>Erreur: {fetchError}</h3>}
			{zError && <ZError zError={zError} />}
			{error && <h3>Erreur: {error}</h3>}
			{!isFetching &&
				!isLoading &&
				!fetchError &&
				!zError &&
				!error &&
				children}
			*/}
			{children}
		</StyledZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledZPage = styled.div`
	// background-color: $ {theme.colors.c1l4};
	// background-color: lime;
	height: 100%;
	min-height: 100%;
	//display: flex;
	//flex-direction: column;
	width: 100% !important;
	.btn {
		cursor: pointer;
	}
	.row {
		margin: 0px !important;
	}
	//padding-top: 270px;
	padding: 5px;
`
