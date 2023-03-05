import { styled } from '@stitches/react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'

export const root = styled(NavigationMenu.Root, {
	variants: {
		theme: {
			light: {
				backgroundColor: 'rgb(160, 160, 160)',
				borderBottomColor: 'rgb(50, 50, 50)'
			},
			dark: {
				backgroundColor: 'rgb(30, 30, 30)',
				borderBottomColor: 'rgb(40, 40, 40)'
			}
		}
	},
	defaultVariants: {
		color: 'light'
	},
	position: 'sticky',
	top: '0',
	display: 'flex',
	borderBottomStyle: 'solid',
})

export const list = styled(NavigationMenu.List, {
	display: 'flex',
	listStyle: 'none',
	padding: 0,
	margin: 0,
})

export const item = styled(NavigationMenu.Item, {
})

export const link = styled(NavigationMenu.Link, {
	variants: {
		theme: {
			light: {
				color: 'rgb(0,0,0)',
				'&:hover': {
					color: 'rgb(0,0,225)'
				}
			},
			dark: {
				color: 'rgb(255,255,255)',
				'&:hover': {
					color: 'rgb(100,100,220)'
				}
			}
		}
	},
	defaultVariants: {
		color: 'light'
	},
})

export const button = styled('button', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0,0,0)',
				'&:hover': {
					color: 'rgb(0,0,225)'
				}
			},
			dark: {
				color: 'rgb(255,255,255)',
				'&:hover': {
					color: 'rgb(100,100,220)'
				}
			}
		}
	},
	defaultVariants: {
		color: 'light'
	},
	fontWeight: 'bold',
	textDecoration: 'none',
	border: 'none',
	background: 'none'
})
