import { styled } from '@stitches/react'
import * as Select from "@radix-ui/react-select"
import { BorderStyleIcon } from '@radix-ui/react-icons'

export const Root = styled(Select.Root, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})

export const Trigger = styled(Select.Trigger, {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)',
				borderColor: 'rgb(0, 0, 0)',
			},
			dark: {
				color: 'rgb(255, 255, 255)',
				borderColor: 'rgb(255, 255, 255)',
			},
		},
		pop: {
			true: {
				fontWeight: 'bold'
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
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
				color: 'rgb(50, 50, 255)',
				borderColor: 'rgb(50, 50, 255)',
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	},
	borderStyle: 'solid',
	background: 'none',
	width: 'fit-content',
	// backgroundColor: 'transparent',
	// width: '100%',
	// display: 'grid',
	borderWidth: '0.3cqh'
	// gridTemplateColumns: '1fr auto',
})

export const Value = styled(Select.Value, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	},
	gridColum: 1,
})

export const Icon = styled(Select.Icon, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	},
	width: 'fit-content',
	gridColum: 2
})

export const Portal = styled(Select.Portal, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	},
})

export const Content = styled(Select.Content, {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)',
				borderColor: 'rgb(0, 0, 0)',
			},
			dark: {
				color: 'rgb(255, 255, 255)',
				borderColor: 'rgb(255, 255, 255)',
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	},
	background: 'none',
	borderStyle: 'solid',
	borderWidth: '0.3cqmin',
})

export const Viewport = styled(Select.Viewport, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	},
	minWidth: 'var(--radix-select-trigger-width)'
})

export const Item = styled(Select.Item, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})

export const ItemText = styled(Select.ItemText, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})

export const ItemIndicator = styled(Select.ItemIndicator, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})

export const ScrollUpButton = styled(Select.ScrollUpButton, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})

export const ScrollDownButton = styled(Select.ScrollDownButton, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})

export const Group = styled(Select.Group, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})

export const Label = styled(Select.Label, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})

export const Separator = styled(Select.Separator, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})

export const Arrow = styled(Select.Arrow, {
	variants: {
		theme: {
			light: {
			},
			dark: {
			}
		},
	},
	compoundVariants: [
		{
			pop: 'true',
			theme: 'dark',
			css: {
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	}
})
















export const select = styled('select', {
	variants: {
		theme: {
			light: {
				color: 'rgb(0, 0, 0)',
				borderColor: 'rgb(0, 0, 0)',
			},
			dark: {
				color: 'rgb(255, 255, 255)',
				borderColor: 'rgb(255, 255, 255)',
			},
		},
		pop: {
			true: {
				fontWeight: 'bold'
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
			}
		},
		{
			pop: 'true',
			theme: 'light',
			css: {
				color: 'rgb(50, 50, 255)',
				borderColor: 'rgb(50, 50, 255)',
			}
		}
	],
	defaultVariants: {
		theme: 'light',
		pop: 'false',
	},
	borderStyle: 'solid',
	background: 'none',
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