import { styled } from '@stitches/react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { BorderWidthIcon } from '@radix-ui/react-icons'

export const Root = styled(Checkbox.Root, {
	variants: {
		theme: {
			light: {
				borderColor: 'rgb(0, 0, 0)',
				color: 'rgb(0, 0, 0)'
			},
			dark: {
				borderColor: 'rgb(255, 255, 255)',
				color: 'rgb(255, 255, 255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	},
	background: 'none',
	borderStyle: 'solid',
	borderWidth: '5%',
	borderRadius: '25%',
	height: '2rem',
	width: '2rem'
})

export const Indicator = styled(Checkbox.Indicator, {
	variants: {
		theme: {
			light: {
				//css for light theme
			},
			dark: {
				//css for dark theme
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	},
	height: '100%',
	width: '100%'
})