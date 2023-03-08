import { styled } from '@stitches/react'

export const p = styled('p', {
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

export const h1 = styled('h1', {
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

export const h2 = styled('h2', {
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

export const h3 = styled('h3', {
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

export const h4 = styled('h4', {
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

export const a = styled('a', {
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
	}
})

export const button = styled('button', {
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
	fontWeight: 'bold',
	textDecoration: 'none',
	border: 'none',
	background: 'none',
})
