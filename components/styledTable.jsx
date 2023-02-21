import { styled } from '@stitches/react'

export const root = styled('table', {
	variants: {
		color: {
			light: {
			},
			dark: {
			}
		},
		border: {
			true: {
				width: '90%',
				marginLeft: '5%',
				borderColor: 'rgb(75, 75, 75)',
				borderStyle: 'solid'
			},
			false: {
				width: '100%',
			}
		}
	},
	defaultVariants: {
		color: 'light',
		border: 'false'
	},
	textAlign: 'center',
	overflow: 'hidden',
	backgroundColor: 'rgb(0, 0, 0)',
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
	},
	backgroundColor: 'rgb(0, 0, 0)'
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