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
	const [initialData] = useState(data)
	console.log(initialData)
	const [changes, setChanges] = useState([])

	function resetData() {
		setData(initialData)
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
			data[index][id] = Number(event.target.value)
			setData(data)

			if (currentUser.theme == 'dark') {
				event.target.style.color = 'rgb(0,0,255)'
			}
			else {
				event.target.style.color = 'rgb(255,255,255)'
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
		for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
			let row = data[rowIndex]
			let initialRow = initialData[rowIndex]

			if (row !== initialRow) {
				console.log(`Object at index ${rowIndex} has changed:`)
				console.log(`Before: ${JSON.stringify(initialRow)}`)
				console.log(`After: ${JSON.stringify(row)}`)
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