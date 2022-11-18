import React from "react";

export const CurrentUserContext = React.createContext(
	{ theme: 'dark', isAuthenticated: false, transactions: {}, permissions: 'admin' },
)

export const leaderBoardContext = React.createContext([])
export const biggerSideContext = React.createContext('width')