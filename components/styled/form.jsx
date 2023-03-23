import { styled } from '@stitches/react'

export const root = styled('form', {
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

export const input = styled('input', {
	variants: {
		theme: {
			light: {
				background: 'none',
				color: 'rgb(0, 0, 0)',
				borderColor: 'rgb(0, 0, 0)',
			},
			dark: {
				background: 'none',
				color: 'rgb(255, 255, 255)',
				borderColor: 'rgb(255, 255, 255)',
			}
		},
		border: {
			true: {
				borderStyle: 'solid',
			},
			false: {
				borderStyle: 'hidden',
			}
		}
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
				color: 'rgb(130, 0, 255)',
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
				color: 'rgb(100, 100, 255)',
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
		border: 'true'
	},
})

export const label = styled('label', {
	variants: {
		theme: {
			light: {
				background: 'none',
				color: 'rgb(0, 0, 0)',
				borderColor: 'rgb(0, 0, 0)'
			},
			dark: {
				background: 'none',
				color: 'rgb(255, 255, 255)',
				borderColor: 'rgb(255, 255, 255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	},
	fontWeight: 'bold'
})