import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import { styled } from '@stitches/react'

const Root = styled(table, {
	variants: {
		color: {
			light: {
				backgroundColor: 'rgb(160, 160, 160)',
				borderBottomColor: 'rgb(50, 50, 50)'
			},
			dark: {
				backgroundColor: 'rgb(30, 30, 30)',
				borderBottomColor: 'rgb(40, 40, 40)'
			}
		}
	},
	defaultVariants: {
		color: 'light'
	}
})

export const Table = (props) => {
	const columns = useMemo(() => props.columns, [props.columns])
	const data = useMemo(() => props.data, [props.data])

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
	})

	return (
		<>
			<table {...getTableProps()}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()}>{column.render('Header')}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map(row => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map(cell => {
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
				</tbody>
				<tfoot>
					{footerGroups.map(footerGroup => (
						<tr {...footerGroup.getFooterGroupProps()}>
							{footerGroup.headers.map(column => (
								<td {...column.getFooterProps()}>{column.render('Footer')}</td>
							))}
						</tr>
					))}
				</tfoot>
			</table>
		</>
	)
}