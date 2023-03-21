import { useMemo, useState, useEffect } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import * as styledTable from './styled/table'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import { GlobalFilter } from './GlobalFilter'
import * as scrollArea from './styled/scrollArea'
import { useIsMounted } from '../hooks/useIsMounted'
import * as form from '../components/styled/form'

export const Table = (props) => {
	const mounted = useIsMounted()
	const columns = useMemo(() => props.columns, [props.columns])
	const data = useMemo(() => props.data, [props.data])
	const skipPageReset = props.skipPageReset
	const updateData = props.updateData
	const currentUser = useAtomValue(currentUserAtom)

	// Create an editable cell renderer
	const EditableCell = ({
		value: initialValue,
		row: { index },
		column: { id },
		updateData, // This is a custom function that we supplied to our table instance
	}) => {
		// We need to keep and update the state of the cell normally
		const [value, setValue] = useState(initialValue)

		const onChange = e => {
			setValue(e.target.value)
		}

		// We'll only update the external data when the input is blurred
		const onBlur = () => {
			updateData(index, id, value)
		}

		// If the initialValue is changed external, sync it up with our state
		useEffect(() => {
			setValue(initialValue)
		}, [initialValue])

		return (updateData ?
			<form.input theme={currentUser.theme} value={value} onChange={onChange} onBlur={onBlur} />
			: initialValue)
	}

	// Set our editable cell renderer as the default Cell renderer
	const defaultColumn = {
		Cell: EditableCell
	}

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		footerGroups,
		rows,
		prepareRow,
		state,
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			initialState: (props.sortBy ? { sortBy: props.sortBy } : ''),
			autoResetPage: (skipPageReset ? !skipPageReset : ''),
			updateData: (updateData ? updateData : '')
		},
		useGlobalFilter,
		(props.sortable ? useSortBy : ''),
	)

	const { globalFilter } = state

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
						{props.canFilter ?
							<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
							: null
						}
						<styledTable.root {...getTableProps()} theme={currentUser.theme} border={!props.canFilter} id={props.id}>
							<styledTable.thead theme={currentUser.theme}>
								{headerGroups.map(headerGroup => (
									<styledTable.tr key={headerGroup.index} {...headerGroup.getHeaderGroupProps()} theme={currentUser.theme}>
										{headerGroup.headers.map(column => (
											<styledTable.th key={column.id} {...column.getHeaderProps(props.sortable ? column.getSortByToggleProps() : '')} theme={currentUser.theme}>
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
		</div>
	)
}
