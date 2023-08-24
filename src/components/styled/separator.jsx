import { styled } from '@stitches/react'
import * as StyledSeparator from '@radix-ui/react-separator'

export const Separator = styled(StyledSeparator.Root, {
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