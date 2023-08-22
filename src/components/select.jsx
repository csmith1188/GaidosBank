import { useState, useRef, useEffect } from 'react'
import * as StyledSelect from './styled/select'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

export function Select({
	items,
	name,
	theme,
	pop,
	defaultValue,
	onValueChange
}) {
	let [open, setOpen] = useState(false)
	let [value, setValue] = useState(defaultValue || undefined)

	const propOnValueChange = onValueChange
	const propDefaultValue = defaultValue

	return (
		<StyledSelect.Root
			onValueChange={onValueChange ? (value) => {
				propOnValueChange(value)
			} : null}
			defaultValue={propDefaultValue}
			theme={theme}
			pop={pop}
		>
			<StyledSelect.Trigger
				theme={theme}
				pop={pop}
			>
				<StyledSelect.Value placeholder={name}
					theme={theme}
					pop={pop}
				/>
				<StyledSelect.Icon>
					{open ?
						<ChevronUpIcon />
						: <ChevronDownIcon />
					}
				</StyledSelect.Icon>
			</StyledSelect.Trigger>
			<StyledSelect.Portal>
				<StyledSelect.Content
					position='popper'
					theme={theme}
					pop={pop}
				>
					<StyledSelect.Viewport>
						{typeof items !== 'undefined' ?
							items.map((item) => {
								return (
									<StyledSelect.Item
										theme={theme}
										key={item.value ?? item}
										value={item.value ?? item}
									>
										<StyledSelect.ItemText theme={theme}>
											{item.displayValue ?? item}
										</StyledSelect.ItemText>
									</StyledSelect.Item>
								)
							}) : ''
						}
					</StyledSelect.Viewport>
				</StyledSelect.Content>
			</StyledSelect.Portal>
		</StyledSelect.Root>
	)
}