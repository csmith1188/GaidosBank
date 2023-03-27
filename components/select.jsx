import * as select from "./styled/select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import React from 'react'

export const Select = ({ name, items, defaultValue, pop, onChange, theme }) => {
	return <select.root defaultValue={defaultValue} onValueChange={onChange}>
		<select.trigger pop={pop} theme={theme} className='selectTrigger'>
			<select.value placeholder={`Select ${name}`} />
			<select.icon>
				<ChevronDownIcon />
			</select.icon>
		</select.trigger>
		<select.content pop={pop} theme={theme} position='popper' className="selectContent">
			<select.scrollUpButton>
				<ChevronUpIcon />
			</select.scrollUpButton>
			<select.viewport>
				{items ?
					items.map((item) => {
						return (<select.item key={item} value={item} className='selectItem'>
							<select.itemText>
								{item}
							</select.itemText>
							<select.itemIndicator>
								<CheckIcon />
							</select.itemIndicator>
						</select.item>)
					}) : ''
				}
			</select.viewport>
		</select.content>
	</select.root >
}