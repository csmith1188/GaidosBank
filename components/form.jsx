import { styled } from '@stitches/react'

export const root = styled('form', {
	variants: {
		color: {
			light: {
				backgroundColor: 'rgb(160, 160, 160)',
			},
			dark: {
				backgroundColor: 'rgb(30, 30, 30)',
			}
		}
	},
	defaultVariants: {
		color: 'light'
	}
})

export const input = styled('input', {
	variants: {
		color: {
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
		}
	},
	defaultVariants: {
		color: 'light'
	},
	borderStyle: 'solid',
})

export const label = styled('label', {
	variants: {
		color: {
			light: {
				background: 'none',
				color: 'rgb(0, 0, 0)',
			},
			dark: {
				background: 'none',
				color: 'rgb(255, 255, 255)',
			}
		}
	},
	defaultVariants: {
		color: 'light'
	},
	fontWeight: 'bold'
})