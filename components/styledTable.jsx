import { styled } from '@stitches/react'

export const root = styled('table', {
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
	width: '90%',
	marginLeft: '5%',
	textAlign: 'center',
	backgroundColor: 'rgb(25,25,25)',
	// borderColor: 'rgb(150,150,150)',
	borderColor: 'rgb(255,0,0)',
	borderStyle: 'solid'
})

export const thead = styled('thead', {
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

export const tbody = styled('tbody', {
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

export const tfoot = styled('tfoot', {
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

export const tr = styled('tr', {
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

export const th = styled('th', {
	variants: {
		color: {
			light: {
				color: 'rgb(0, 0, 0)'
			},
			dark: {
				color: 'rgb(255, 255, 255)'
			}
		}
	},
	defaultVariants: {
		color: 'light'
	}
})

export const td = styled('td', {
	variants: {
		color: {
			light: {
				color: 'rgb(0, 0, 0)'
			},
			dark: {
				color: 'rgb(255, 255, 255)'
			}
		}
	},
	defaultVariants: {
		color: 'light'
	}
})