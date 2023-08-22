import { styled } from '@stitches/react'

export const P = styled('p', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)'
			},
			dark: {
				color: 'rgb(255 ,255 ,255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const H1 = styled('h1', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)'
			},
			dark: {
				color: 'rgb(255 ,255 ,255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const H2 = styled('h2', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)'
			},
			dark: {
				color: 'rgb(255 ,255 ,255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const H3 = styled('h3', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)'
			},
			dark: {
				color: 'rgb(255 ,255 ,255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const H4 = styled('h4', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)'
			},
			dark: {
				color: 'rgb(255 ,255 ,255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const A = styled('a', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0,0,0)',
				borderColor: 'rgb(0, 0, 0)',
				'&:hover': {
					color: 'rgb(0,0,225)'
				}
			},
			dark: {
				color: 'rgb(255,255,255)',
				borderColor: 'rgb(255, 255, 255)',
				'&:hover': {
					color: 'rgb(100,100,220)'
				}
			}
		}
	},
	defaultVariants: {
		color: 'light'
	},
	cursor: 'pointer'
})