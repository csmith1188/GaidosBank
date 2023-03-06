import { styled } from '@stitches/react'
import * as scrollArea from '@radix-ui/react-scroll-area';

export const root = styled(scrollArea.Root, {
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

export const viewport = styled(scrollArea.Viewport, {
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

export const scrollbar = styled(scrollArea.Scrollbar, {
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

export const thumb = styled(scrollArea.Thumb, {
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

export const corner = styled(scrollArea.Corner, {
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