import { useMemo, useState, useEffect } from 'react'
import { useTable, useSortBy, useGlobalFilter } from '@tanstack/react-table'
import * as styledTable from './styled/table'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import * as scrollArea from './styled/scroll-area'
import * as form from './styled/form'
import { Select } from './select'

export function Table({
	skipPageReset,
	updateData,
	sortBy,
	limit,
	sortable,
	canFilter,
	leaderboard,
	editableColumns,
	data,
	columns
}) {
	const currentUser = useAtomValue(currentUserAtom)
	console.log(columns)
	const [initialData, setInitialData] = useState(data)
	const [currentData, setCurrentData] = useState(data)
	const [changedData, setChangedData] = useState([])

	useEffect(() => {
		setInitialData(data)
		// setCurrentData(data)
	}, [data])

	function resetData() {
		// console.log(initialData)
		setCurrentData(initialData)
	}

	// useEffect(() => {
	// 	console.log(changedData)
	// }, [changedData])


	function EditableCell({
		value: initialValue,
		row: { index },
		column: { id },
		currentData,
	}) {
		let [value, setValue] = useState(initialValue)
		let row = currentData[index]

		useEffect(() => {
			setValue(initialValue)
		}, [initialValue])

		if (editableColumns) {
			for (let column of editableColumns) {
				if (column.column == id) {
					if (Array.isArray(column.type)) {
						return <Select
							name={column.column}
							items={column.type}
							defaultValue={value}
							onValueChange={(value) => {
								console.log(value)
							}}
							pop={true}
							theme={currentUser.theme}
						/>
					} else {
						column.min = -1
						return <form.input
							type={
								column.type == 'int' || column.type == 'number'
									? 'number'
									: ''
							}
							step={column.step}
							min={column.min}
							max={column.max}
							onKeyDown={
								column.type == 'int' ?
									(event) => {
										if (
											event.key === "Backspace" ||
											event.key === "Delete" ||
											event.key === "ArrowUp" ||
											event.key === "ArrowDown" ||
											event.key === "ArrowLeft" ||
											event.key === "ArrowRight" ||
											event.key === 'Home' ||
											event.key === 'End' ||
											(event.key >= 0 && event.key <= 9) ||
											(column.min < 0 && event.key === '-')
										) {
											return true
										} else {
											event.preventDefault()
											return false
										}
									}
									: ''
							}
							border={false}
							theme={currentUser.theme}
							pop={true}
							defaultValue={value}
							onChange={(event) => {
								console.log(/^[0-9]+$/.test(event.target.value))
							}}
						/>
					}
				}
			}
		}
		return initialValue
	}

	let {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state,
		setGlobalFilter,
	} = useTable(
		{
			columns,
			currentData,
			defaultColumn: (updateData ? { Cell: EditableCell } : {}),
			initialState: (sortable && sortBy ? { sortBy: sortBy } : ''),
			autoResetPage: (updateData ? !skipPageReset : ''),
			updateData: (updateData ? updateData : '')
		},
		useGlobalFilter,
		(sortable ? useSortBy : ''),
	)
	if (limit) rows = rows.slice(0, limit)

	async function saveData() {
		console.log(initialData)
		console.log(currentData)
		// for (let rowIndex = 0; rowIndex < currentData.length; rowIndex++) {
		// 	let row = currentData[rowIndex]
		// 	let initialRow = initialData[rowIndex]

		// 	if (rowIndex == 0)
		// 		if (row != initialRow) {
		// 			for (let columnIndex in row) {
		// 				let column = row[columnIndex]
		// 				let initialColumn = initialRow[columnIndex]

		// 				if (rowIndex == 0 && columnIndex == 'theme')
		// 					if (column !== initialColumn) {
		// 						initialColumn = column
		// 						if (window !== 'undefined') {
		// 							 console.log(
		// 							 	row.username,
		// 							 	columnIndex,
		// 							 	column,
		// 							 	`/api/updateUser?user=${row.username}&property=${columnIndex}&value=${column}`
		// 							 )
		// 							 const response = await fetch(`/api/updateUser?user=${row.username}&property=${columnIndex}&value=${column}`)
		// 							 const currentData = await response.json()
		// 							 try {
		// 							 	if (currentData.error) throw currentData.error
		// 							 } catch (error) {
		// 							 	throw error
		// 							 }
		// 						}
		// 					}
		// 			}
		// 		}
		// }
		updateData()
	}

	return (
		<div id='tableContainer'
			style={
				currentUser.theme === 'dark' ? {
					backgroundColor: 'rgb(0, 0, 0)',
					borderColor: 'rgb(75, 75, 75)'
				}
					: {
						borderColor: 'rgb(0, 0, 0)'
					}
			}
		>
			<scrollArea.root className='scrollAreaRoot' theme={currentUser.theme} type="auto">
				<scrollArea.viewport className='scrollAreaViewport' theme={currentUser.theme}>
					<div id='table'>
						<div id='input'>
							{updateData ? <form.button theme={currentUser.theme} onClick={resetData} className='editButton'> Reset</form.button> : ''}
							{updateData ? <form.button theme={currentUser.theme} onClick={saveData} className='editButton'>Save</form.button> : ''}
						</div>
						<styledTable.root {...getTableProps()} theme={currentUser.theme} border={!props.canFilter} id={props.id}>
							<styledTable.thead theme={currentUser.theme}>
								{headerGroups.map(headerGroup => (
									<styledTable.tr key={headerGroup.index} {...headerGroup.getHeaderGroupProps()} theme={currentUser.theme} leaderboard={leaderboard}>
										{headerGroup.headers.map(column => (
											<styledTable.th key={column.id} {...column.getHeaderProps(sortable ? column.getSortByToggleProps() : '')} theme={currentUser.theme}>
												{column.render('Header')}
												<span>
													{column.isSorted
														? column.isSortedDesc
															? ' 🔽'
															: ' 🔼'
														: ''}
												</span>
											</styledTable.th>
										))}
									</styledTable.tr>
								))}
							</styledTable.thead>
							<styledTable.tbody {...getTableBodyProps()} theme={currentUser.theme}>
								{rows.map(row => {
									prepareRow(row)
									return (
										<styledTable.tr key={row.index} {...row.getRowProps()} theme={currentUser.theme} leaderboard={leaderboard}>
											{row.cells.map(cell => {
												return (
													<styledTable.td key={cell.column.id} {...cell.getCellProps()} theme={currentUser.theme}>
														{cell.render('Cell')}
													</styledTable.td>
												)
											})}
										</styledTable.tr>
									)
								})}
							</styledTable.tbody>
						</styledTable.root>
					</div>
				</scrollArea.viewport>
				<scrollArea.scrollbar className="scrollAreaScrollbar" orientation="vertical" theme={currentUser.theme}>
					<scrollArea.thumb className='scrollAreaThumb' theme={currentUser.theme} />
				</scrollArea.scrollbar>
				<scrollArea.scrollbar className="scrollAreaScrollbar" orientation="horizontal" theme={currentUser.theme}>
					<scrollArea.thumb className='scrollAreaThumb' theme={currentUser.theme} />
				</scrollArea.scrollbar>
				<scrollArea.corner className='scrollAreaCorner' theme={currentUser.theme} />
			</scrollArea.root>
		</div >
	)
}