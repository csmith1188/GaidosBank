import { styled } from '@stitches/react'
import * as tabs from '@radix-ui/react-tabs'

export const root = styled(tabs.Root, {
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

export const list = styled(tabs.List, {
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

export const trigger = styled(tabs.Trigger, {
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

export const content = styled(tabs.Content, {
	variants: {
		theme: {
			light: {
				borderColor: 'rgb(0, 0, 0)'
			},
			dark: {
				borderColor: 'rgb(75, 75, 75)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	},
	borderStyle: 'solid'
})