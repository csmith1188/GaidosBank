import { styled } from '@stitches/react'
import * as select from '@radix-ui/react-select'

export const root = styled(select.Root, {
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
	outlineStyle: 'none'
})

export const trigger = styled(select.Trigger, {
	variants: {
		theme: {
			light: {
				backgroundColor: 'rgb(255, 255, 255)',
				color: 'rgb(0, 0, 0)',
				borderColor: 'rgb(0, 0, 0)'
			},
			dark: {
				backgroundColor: 'rgb(0, 0, 0)',
				color: 'rgb(255, 255, 255)',
				borderColor: 'rgb(255, 255, 255)',
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
				color: 'rgb(100, 100, 255)',
				borderColor: 'rgb(50, 50, 255)',
				fontWeight: 'bold'
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	},
	borderStyle: 'solid',
	outlineStyle: 'none'
})

export const value = styled(select.Value, {
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

export const icon = styled(select.Icon, {
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

export const content = styled(select.Content, {
	variants: {
		theme: {
			light: {
				backgroundColor: 'rgb(255, 255, 255)',
				color: 'rgb(0, 0, 0)',
				borderColor: 'rgb(0, 0, 0)'
			},
			dark: {
				backgroundColor: 'rgb(0, 0, 0)',
				color: 'rgb(255, 255, 255)',
				borderColor: 'rgb(255, 255, 255)'
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
				color: 'rgb(100, 100, 255)',
				borderColor: 'rgb(50, 50, 255)',
				fontWeight: 'bold'
			}
		}
	],
	defaultVariants: {
		theme: 'dark',
		pop: 'false',
	},
	borderStyle: 'solid',
	overflow: 'hidden'
})

export const viewport = styled(select.Viewport, {
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

export const item = styled(select.Item, {
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
	outlineStyle: 'none',
	cursor: 'pointer',
	'&:hover': {
		filter: 'invert(100%)'
	}
})

export const itemText = styled(select.ItemText, {
	variants: {
		theme: {
			light: {
			},
			dark: {
				color: 'rgb(255,255,255)'
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const itemIndicator = styled(select.ItemIndicator, {
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

export const scrollUpButton = styled(select.ScrollUpButton, {
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

export const scrollDownButton = styled(select.ScrollDownButton, {
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