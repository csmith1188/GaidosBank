import { styled } from '@stitches/react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'

const Root = styled(NavigationMenu.Root, {
	variants: {
		color: {
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

const List = styled(NavigationMenu.List, {
	display: 'flex',
	listStyle: 'none',
	padding: 0,
	margin: 0,
})

const Item = styled(NavigationMenu.Item, {
})

const Link = styled(NavigationMenu.Link, {
	variants: {
		color: {
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
	textDecoration: 'none'
})

const Button = styled('button', {
	variants: {
		color: {
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

export { Root, Item, List, Link, Button }
