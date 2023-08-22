import { styled } from '@stitches/react'

export const Root = styled('table', {
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
		border: 'false'
	},
	textAlign: 'center',
	overflow: 'hidden',
})

export const Thead = styled('thead', {
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

export const Tbody = styled('tbody', {
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

export const Tfoot = styled('tfoot', {
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

export const Tr = styled('tr', {
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
	compoundVariants: [
		{
			leaderboard: false,
			theme: 'light',
			css: {
				'&:nth-child(even)': {
					backgroundColor: 'rgb(100, 100, 100)'
				},
				'&:nth-child(odd)': {
					backgroundColor: 'rgb(150, 150, 150)'
				}
			}
		},
		{
			leaderboard: false,
			theme: 'dark',
			css: {
				'&:nth-child(even)': {
					backgroundColor: 'rgb(30, 30, 30)'
				},
				'&:nth-child(odd)': {
					backgroundColor: 'rgb(50, 50, 50)'
				}
			}
		},
		{
			leaderboard: true,
			theme: 'light',
			css: {
				'&:nth-child(even)': {
					backgroundColor: 'rgb(150, 150, 150)'
				},
				'&:nth-child(odd)': {
					backgroundColor: 'rgb(100, 100, 100)'
				},
				'&:nth-child(-n+3)': {
					color: 'rgb(255, 255, 255)',
				},
				'&:nth-child(1)': {
					backgroundColor: 'rgb(255, 215, 0)'
				},
				'&:nth-child(2)': {
					backgroundColor: 'rgb(192, 192, 192)'
				},
				'&:nth-child(3)': {
					backgroundColor: 'rgb(205, 127, 50)'
				}
			}
		},
		{
			leaderboard: true,
			theme: 'dark',
			css: {
				'&:nth-child(even)': {
					backgroundColor: 'rgb(50, 50, 50)'
				},
				'&:nth-child(odd)': {
					backgroundColor: 'rgb(30, 30, 30)'
				},
				'&:nth-child(-n+3)': {
					color: 'rgb(0, 0, 0)',
				},
				'&:nth-child(1)': {
					backgroundColor: 'rgb(255, 215, 0)'
				},
				'&:nth-child(2)': {
					backgroundColor: 'rgb(192, 192, 192)'
				},
				'&:nth-child(3)': {
					backgroundColor: 'rgb(205, 127, 50)'
				}
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		leaderboard: false
	}
})

export const Th = styled('th', {
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
	}
})

export const Td = styled('td', {
	variants: {
		theme: {
			// light: {
			// 	color: 'rgb(0, 0, 0)'
			// },
			// dark: {
			// 	color: 'rgb(255, 255, 255)'
			// }
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})