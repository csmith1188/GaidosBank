import {styled} from '@stitches/react'
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
	height: '3.5rem',
	justifyContent: 'space-between',
	position: 'sticky',
	top: '0',
	display: 'flex',
	borderBottomStyle: 'solid',
	borderBottomWidth: '0.6rem'
})

const List = styled(NavigationMenu.List, {
	display: 'flex',
	listStyle: 'none',
	paddingLeft: '2rem',
	paddingRight: '2rem'
})

const Item = styled(NavigationMenu.Item, {
	marginRight: '2.5rem'
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
	fontSize: '1.5rem',
	fontWeight: '900',
	textDecoration: 'none'
})

export {Root, Item, List, Link}
