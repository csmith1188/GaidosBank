import { styled } from '@stitches/react'
import { Table } from '../table'

export const root = styled('table', {
	variants: {
		theme: {
			light: {
				borderColor: 'rgb(200, 200, 200)'
			},
			dark: {
				backgroundColor: 'rgb(0, 0, 0)',
				borderColor: 'rgb(75, 75, 75)'
			}
		},
		border: {
			true: {
				width: '90%',
				marginLeft: '5%',
				borderStyle: 'solid'
			},
			false: {
				width: '100%',
			}
		}
	},
	defaultVariants: {
		theme: 'light',
		border: 'true'
	},
	textAlign: 'center',
	overflow: 'hidden',
})

export const thead = styled('thead', {
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

export const tbody = styled('tbody', {
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

export const tfoot = styled('tfoot', {
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

export const tr = styled('tr', {
	variants: {
		theme: {
			light: {
				'&:nth-child(even)': {
					backgroundColor: 'rgb(100, 100, 100)'
				},
				'&:nth-child(odd)': {
					backgroundColor: 'rgb(150, 150, 150)'
				}
			},
			dark: {
				'&:nth-child(even)': {
					backgroundColor: 'rgb(30, 30, 30)'
				},
				'&:nth-child(odd)': {
					backgroundColor: 'rgb(50, 50, 50)'
				}
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const th = styled('th', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)',
				backgroundColor: 'rgb(255, 255, 255)',
				borderColor: 'rgb(0, 0, 0)'
			},
			dark: {
				color: 'rgb(255, 255, 255)',
				backgroundColor: 'rgb(0, 0, 0)',
				borderColor: 'rgb(75, 75, 75)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	},
})

export const td = styled('td', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)'
			},
			dark: {
				color: 'rgb(255, 255, 255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})