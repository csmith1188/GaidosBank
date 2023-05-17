import React from 'react'
import * as form from './styled/form'

export const Select = ({
	id,
	className,
	name,
	items,
	defaultValue,
	pop,
	onChange,
	theme
}) => {
	return <form.select
		id={id}
		className={className}
		onChange={onChange}
		pop={pop}
		theme={theme}
		value={defaultValue}
	>
		{!defaultValue ?
			<form.option
				value=""
				pop={pop}
				theme={theme}
			>
				{name}
			</form.option> : ''}
		{items ?
			items.map((item) => {
				return (
					<form.option
						pop={pop}
						theme={theme}
						key={item}
						value={item}
					>
						{item}
					</form.option>
				)
			}) : ''
		}
	</form.select>
}