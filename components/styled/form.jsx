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
				borderColor: 'rgb(130, 0, 255)',
				fontWeight: 'bold'
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
				color: 'rgb(50, 50, 255)',
				borderColor: 'rgb(50, 50, 255)',
				fontWeight: 'bold'
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
		border: 'true'
	}
})

export const select = styled('select', {
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
				borderColor: 'rgb(130, 0, 255)',
				fontWeight: 'bold'
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
				color: 'rgb(50, 50, 255)',
				borderColor: 'rgb(50, 50, 255)',
				fontWeight: 'bold'
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
		border: 'true'
	}
})

export const option = styled('option', {
	variants: {
		theme: {
			light: {
				backgroundColor: 'rgb(255, 255, 255)',
				color: 'rgb(0, 0, 0)',
				borderColor: 'rgb(0, 0, 0)',
			},
			dark: {
				background: 'rgb(0, 0, 0)',
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
				fontWeight: 'bold'
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
				color: 'rgb(50, 50, 255)',
				fontWeight: 'bold'
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
		border: 'true'
	}
})

export const button = styled('button', {
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
		color: 'light'
	},
	fontWeight: 'bold',
	textDecoration: 'none',
	border: 'none',
	background: 'none'
})