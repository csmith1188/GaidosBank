import { styled } from '@stitches/react'
import * as ScrollArea from '@radix-ui/react-scroll-area';

export const Root = styled(ScrollArea.Root, {
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

export const Viewport = styled(ScrollArea.Viewport, {
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

export const Scrollbar = styled(ScrollArea.Scrollbar, {
	variants: {
		theme: {
			light: {
				backgroundColor: 'rgb(160, 160, 160)',
				'&:hover': {
					backgroundColor: 'rgb(140, 140, 140)'
				}
			},
			dark: {
				backgroundColor: 'rgb(255, 255, 255)',
				'&:hover': {
					backgroundColor: 'rgb(160, 160, 160)'
				}
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	},
})

export const Thumb = styled(ScrollArea.Thumb, {
	variants: {
		theme: {
			light: {
				backgroundColor: 'rgb(60, 60, 60)'
			},
			dark: {
				backgroundColor: 'rgb(30, 30, 30)',
			}
		}
	},
	defaultVariants: {
		theme: 'light'
	}
})

export const Corner = styled(ScrollArea.Corner, {
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