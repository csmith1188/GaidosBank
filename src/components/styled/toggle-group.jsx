import { styled } from '@stitches/react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

export const Root = styled(ToggleGroup.Root, {
	variants: {
		theme: {
			light: {
				backgroundColor: 'rgb(0,0,0)',
			},
			dark: {
				backgroundColor: 'rgb(255,255,255)',
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	},
	display: 'inline-flex',
	borderRadius: '1rem',
})

export const Item = styled(ToggleGroup.Item, {
	variants: {
		theme: {
			light: {
				backgroundColor: 'rgb(0,0,0)',
				'&:hover': { backgroundColor: 'rgb(0,0,0)' },
				'&[data-state=on]': { backgroundColor: 'rgb(0,0,0)' },
			},
			dark: {
				backgroundColor: 'rgb(255,255,255)',
				'&:hover': { backgroundColor: 'rgb(150,200,150)' },
				'&[data-state=on]': { backgroundColor: 'rgb(0,150,0)' },
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	},
	all: 'unset',
	height: '2.5rem',
	width: '2.5rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	'&:first-child': { marginLeft: 0, borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' },
	'&:last-child': { borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem' },
})
