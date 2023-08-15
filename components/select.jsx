import { useState, useRef, useEffect } from 'react'
import * as styledSelect from './styled/Select'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

export function Select({ items, name, theme, pop, defaultValue, onValueChange }) {
	let [open, setOpen] = useState(false)
	let [value, setValue] = useState(defaultValue || undefined)

	const propOnValueChange = onValueChange
	const propDefaultValue = defaultValue

	return (
		<styledSelect.Root
			onValueChange={onValueChange ? (value) => {
				propOnValueChange(value)
			} : null}
			defaultValue={propDefaultValue}
			theme={theme}
			pop={pop}
		>
			<styledSelect.Trigger
				theme={theme}
				pop={pop}
			>
				<styledSelect.Value placeholder={name}
					theme={theme}
					pop={pop}
				/>
				<styledSelect.Icon>
					{open ?
						<ChevronUpIcon />
						: <ChevronDownIcon />
					}
				</styledSelect.Icon>
			</styledSelect.Trigger>
			<styledSelect.Portal>
				<styledSelect.Content
					position='popper'
					theme={theme}
					pop={pop}
				>
					<styledSelect.Viewport>
						{typeof items !== 'undefined' ?
							items.map((item) => {
								return (
									<styledSelect.Item
										key={item.value ?? item}
										value={item.value ?? item}
									>
										<styledSelect.ItemText>
											{item.displayValue ?? item}
										</styledSelect.ItemText>
									</styledSelect.Item>
								)
							}) : ''
						}
					</styledSelect.Viewport>
				</styledSelect.Content>
			</styledSelect.Portal>
		</styledSelect.Root>
	)
}