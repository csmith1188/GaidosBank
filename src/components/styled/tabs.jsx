import { styled } from '@stitches/react'
import * as Tabs from '@radix-ui/react-tabs'

export const Root = styled(Tabs.Root, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const List = styled(Tabs.List, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const Trigger = styled(Tabs.Trigger, {
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
		theme: 'light'
	},
	fontWeight: 'bold',
	textDecoration: 'none',
	borderStyle: 'hidden',
	background: 'none',
})

export const Content = styled(Tabs.Content, {
	variants: {
		theme: {
			light: {
				borderColor: 'rgb(0, 0, 0)'
			},
			dark: {
				backgroundColor: 'rgb(0, 0, 0)',
				borderColor: 'rgb(75, 75, 75)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	},
	borderStyle: 'solid'
})