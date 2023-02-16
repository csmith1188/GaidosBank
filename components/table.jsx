import React, { useMemo } from 'react'
import { useTable, useFilters, useSortBy } from 'react-table'
import * as styledTable from './styledTable'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'

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
		prepareRow
	} = useTable({
		columns,
		data
	},
		useSortBy
	)

	return (
		<>
			<styledTable.root {...getTableProps()} id={props.id} color={currentUser.theme}>
				<styledTable.thead color={currentUser.theme}>
					{headerGroups.map(headerGroup => (
						<styledTable.tr key={headerGroup.index} {...headerGroup.getHeaderGroupProps()} color={currentUser.theme}>
							{headerGroup.headers.map(column => (
								<styledTable.th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} color={currentUser.theme}>
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
				<styledTable.tbody {...getTableBodyProps()} color={currentUser.theme}>
					{rows.map(row => {
						prepareRow(row)
						return (
							<styledTable.tr key={row.index} {...row.getRowProps()} color={currentUser.theme}>
								{row.cells.map(cell => {
									return (
										<styledTable.td key={cell.column.id} {...cell.getCellProps()} color={currentUser.theme}>
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