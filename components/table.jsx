import { useMemo, useState, useEffect } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import * as styledTable from './styled/table'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import { GlobalFilter } from './GlobalFilter'
import * as scrollArea from './styled/scrollArea'
import { useIsMounted } from '../hooks/useIsMounted'
import * as form from '../components/styled/form'
import { Select } from '../components/select'

export const Table = (props) => {
	const mounted = useIsMounted()
	const columns = useMemo(() => props.columns, [props.columns])
	const [initialData, setInitialData] = useState(props.data)
	const [data, setData] = useState(props.data)
	const [changedData, setChangedData] = useState([])
	const skipPageReset = props.skipPageReset
	const updateData = props.updateData
	const sortBy = props.sortBy
	const limit = props.limit
	const sortable = props.sortable
	const canFilter = props.canFilter
	const leaderboard = props.leaderboard
	const editableColumns = props.editableColumns
	const currentUser = useAtomValue(currentUserAtom)

	useEffect(() => {
		setInitialData(props.data)
		setData(props.data)
	}, [props.data])

	function resetData() {
		// console.log(initialData)
		setData(initialData)
	}

	// useEffect(() => {
	// 	console.log(changedData)
	// }, [changedData])


	function EditableCell({
		value: initialValue,
		row: { index },
		column: { id },
		data,
	}) {
		let [value, setValue] = useState(initialValue)
		let row = data[index]

		function onChange(event) {
			value = Number(event.target.value)
				? Number(event.target.value)
				: event.target.value
			if (value !== initialValue) {
				console.log('1')
				console.log({
					data: row,
					index: index,
					property: id,
					value: value
				})
				setChangedData(previousChangedData => {
					return [
						...previousChangedData,
						{
							data: row,
							index: index,
							property: id,
							value: value
						}
					]
				})

				if (currentUser.theme == 'dark') {
					event.target.style.color = 'rgb(0,0,255)'
					event.target.style.borderColor = 'rgb(0,0,255)'
				} else {
					event.target.style.color = 'rgb(255,255,255)'
					event.target.style.borderColor = 'rgb(255,255,255)'
				}
			} else {
				console.log('2')
				console.log(changedData, index, id)

				let hasProperty = changedData.some(changedRow => {
					changedRow.index === index && changedRow.property === id
				})
				console.log(hasProperty)
				if (currentUser.theme == 'dark') {
					event.target.style.color = 'rgb(130, 0, 255)'
					event.target.style.borderColor = 'rgb(130, 0, 255)'
				} else {
					event.target.style.color = 'rgb(100, 100, 255)'
					event.target.style.borderColor = 'rgb(100, 100, 255)'
				}
			}
			setValue(value)
			row[id] = value
			console.log('_________________________________________________________________')
		}

		useEffect(() => {
			setValue(initialValue)
		}, [initialValue])

		if (editableColumns) {
			for (let column of editableColumns) {
				if (column.column == id) {
					if (Array.isArray(column.type)) {
						return <Select onChange={onChange} name={column.column} items={column.type} defaultValue={value} pop={true} theme={currentUser.theme} />
					} else {
						return <form.input
							type={
								column.type == 'int' || column.type == 'number'
									? 'number'
									: ''
							}
							min={column.type == 'int' ? 0 : ''}
							step={column.type == 'int' ? 1 : ''}
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
											(event.key >= 0 && event.key <= 9)
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
							value={value}
							onChange={onChange}
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
			data,
			defaultColumn: (updateData ? { Cell: EditableCell } : {}),
			initialState: (sortable && sortBy ? { sortBy: sortBy } : ''),
			autoResetPage: (updateData ? !skipPageReset : ''),
			updateData: (updateData ? updateData : '')
		},
		useGlobalFilter,
		(sortable ? useSortBy : ''),
	)
	if (limit) rows = rows.slice(0, limit)

	const { globalFilter } = state

	async function saveData() {
		// for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
		// 	let row = data[rowIndex]
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
		// 							 const data = await response.json()
		// 							 try {
		// 							 	if (data.error) throw data.error
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
				mounted ?
					currentUser.theme === 'dark' ? {
						backgroundColor: 'rgb(0, 0, 0)',
						borderColor: 'rgb(75, 75, 75)'
					}
						: {
							borderColor: 'rgb(0, 0, 0)'
						}
					: {}
			}
		>
			<scrollArea.root className='scrollAreaRoot' theme={currentUser.theme} type="auto">
				<scrollArea.viewport className='scrollAreaViewport' theme={currentUser.theme}>
					<div id='table'>
						<div id='input'>
							{updateData ? <form.button theme={currentUser.theme} onClick={resetData} className='editButton'> Reset</form.button> : ''}
							{canFilter ?
								<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
								: ''
							}
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