import { useMemo, useState, useEffect } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import * as styledTable from './styled/table'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import { GlobalFilter } from './GlobalFilter'
import * as scrollArea from './styled/scrollArea'
import { useIsMounted } from '../hooks/useIsMounted'
import * as form from '../components/styled/form'
import * as text from '../components/styled/text'

export const Table = (props) => {
	const mounted = useIsMounted()
	const columns = useMemo(() => props.columns, [props.columns])
	const [data, setData] = useState(props.data)
	const skipPageReset = props.skipPageReset
	const updateData = props.updateData
	const sortBy = props.sortBy
	const sortable = props.sortable
	const canFilter = props.canFilter
	const editableCols = props.editableCols
	const currentUser = useAtomValue(currentUserAtom)
	const initialData = props.data

	function resetData() {
		setData(initialData)
		let tbody = document.getElementsByTagName('tbody')[0]
		let thead = document.getElementsByTagName('thead')[0]
		console.log(data)
		for (let trIndex = 0; trIndex < tbody.children.length; trIndex++) {
			let tr = tbody.children[trIndex]
			for (let tdIndex = 0; tdIndex < tr.children.length; tdIndex++) {
				let td = tr.children[tdIndex]
				if (td.children[0]) {
					let input = td.children[0]
					if (input) {
						let property = thead.children[0].children[tdIndex].innerText.toLowerCase()
						property = property.split(' ')
						for (let word in property) {
							if (word > 0)
								property[word] = property[word][0].toUpperCase() + property[word].substring(1)
						}
						property = property.join(' ')
						console.log(data[(trIndex)][property], input.value)
						// input.value = data[trIndex][property]
						if (currentUser.theme == 'dark') {
							input.style.color = 'rgb(130, 0, 255)'
						}
						else {
							input.style.color = 'rgb(100, 100, 255)'
						}
					}
				}
			}
		}
	}


	function EditableCell({
		value: initialValue,
		row: { index },
		column: { id },
		updateData,
		data,
	}) {
		const [value, setValue] = useState(initialValue)
		function onChange(event) {
			setValue(event.target.value)
			data[index][id] = event.target.value
			setData(data)

			if (data[index][id] != initialData[index][id]) {
				if (currentUser.theme == 'dark') {
					event.target.style.color = 'rgb(0,0,255)'
				}
				else {
					event.target.style.color = 'rgb(255,255,255)'
				}
			} else {
				if (currentUser.theme == 'dark') {
					event.target.style.color = 'rgb(130, 0, 255)'
				}
				else {
					event.target.style.color = 'rgb(100, 100, 255)'
				}
			}
		}

		useEffect(() => {
			setValue(initialValue)
		}, [initialValue])

		if (updateData) {
			for (let column of editableCols) {
				if (column == id) {
					return <form.input border={false} theme={currentUser.theme} pop={true} value={value} onChange={onChange} />
				}
			}
			return initialValue
		}
		else return initialValue
	}
	const defaultColumn = {
		Cell: EditableCell
	}

	const {
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
			defaultColumn,
			initialState: (sortBy ? { sortBy: sortBy } : ''),
			autoResetPage: (skipPageReset ? !skipPageReset : ''),
			updateData: (updateData ? updateData : '')
		},
		useGlobalFilter,
		(sortable ? useSortBy : ''),
	)

	const { globalFilter } = state

	function saveData() {
		console.log('save')
		for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
			let row = data[rowIndex]
			let initialRow = initialData[rowIndex]

			if (row != initialRow) {
				for (let columnIndex in row) {
					let column = row[columnIndex]
					let initialColumn = initialRow[columnIndex]

					if (column != initialColumn) {
						console.log(row)
						console.log(row.id, columnIndex, column)
					}
				}
			}
		}
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
							{updateData ? <text.button theme={currentUser.theme} onClick={resetData} > Reset</text.button> : ''}
							{canFilter ?
								<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
								: ''
							}
							{updateData ? <text.button theme={currentUser.theme} onClick={saveData}>Save</text.button> : ''}
						</div>
						<styledTable.root {...getTableProps()} theme={currentUser.theme} border={!props.canFilter} id={props.id}>
							<styledTable.thead theme={currentUser.theme}>
								{headerGroups.map(headerGroup => (
									<styledTable.tr key={headerGroup.index} {...headerGroup.getHeaderGroupProps()} theme={currentUser.theme}>
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
										<styledTable.tr key={row.index} {...row.getRowProps()} theme={currentUser.theme}>
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