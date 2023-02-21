import { styled } from '@stitches/react'
import * as Collapsible from '@radix-ui/react-collapsible';

export const root = styled(Collapsible.Root, {
	variants: {
		color: {
			light: {
			},
			dark: {
			}
		}
	},
	defaultVariants: {
		color: 'light'
	}
})

export const trigger = styled(Collapsible.Trigger, {
	variants: {
		color: {
			light: {
			},
			dark: {
			}
		}
	},
	defaultVariants: {
		color: 'light'
	},
})

export const content = styled(Collapsible.Content, {
	variants: {
		color: {
			light: {
			},
			dark: {
			}
		}
	},
	defaultVariants: {
		color: 'light'
	},
})