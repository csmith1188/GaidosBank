import { useMemo } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import * as styledTable from './styledTable'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import { GlobalFilter } from './GlobalFilter'
import { ColumnFilter } from './ColumnFilter'

export const Table = (props) => {
	const columns = useMemo(() => props.columns, [props.columns])
	const data = useMemo(() => props.data, [props.data])
	var currentUser = useAtomValue(currentUserAtom);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		footerGroups,
		rows,
		prepareRow,
		state,
		setGlobalFilter
	} = useTable({
		columns,
		data,
		initialState: {
			sortBy: props.sortBy
		}
	},
		useGlobalFilter,
		useSortBy,
	)

	const { globalFilter } = state

	return (
		<>
			{props.canFilter ?
				<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
				: null}
			<styledTable.root {...getTableProps()} theme={currentUser.theme} border={props.border}>
				<styledTable.thead theme={currentUser.theme}>
					{headerGroups.map(headerGroup => (
						<styledTable.tr key={headerGroup.index} {...headerGroup.getHeaderGroupProps()} theme={currentUser.theme}>
							{headerGroup.headers.map(column => (
								<styledTable.th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} theme={currentUser.theme}>
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
		</>
	)
}
