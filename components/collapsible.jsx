import { styled } from '@stitches/react'
import * as Collapsible from '@radix-ui/react-collapsible';

export const root = styled(Collapsible.Root, {
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

export const trigger = styled(Collapsible.Trigger, {
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
	},
})

export const content = styled(Collapsible.Content, {
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
	},
})