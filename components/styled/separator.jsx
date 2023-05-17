import { styled } from '@stitches/react'
import * as styledSeparator from '@radix-ui/react-separator'

export const Separator = styled(styledSeparator.Root, {
	variants: {
		theme: {
			light: {
				backgroundColor: 'rgb(0, 0, 0)'
			},
			dark: {
				backgroundColor: 'rgb(255, 255, 255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})