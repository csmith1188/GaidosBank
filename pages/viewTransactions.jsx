import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'
import Router from 'next/router'
// import { Table } from '../components/table'
import { useEffect, useMemo } from 'react'

import { useTable } from 'react-table'
import fakeData from "../MOCK_DATA.json";

export default function ViewTransations() {
	var currentUser = useAtomValue(currentUserAtom)
	var transactions = []

	useEffect(() => {
		if (!currentUser.isAuthenticated) {
			Router.push('/login')
		}
	}, [currentUser])

	// useEffect(() => {
	// 	fetch('/api/getTransactions')
	// 		.then(response => response.json())
	// 		.then(data => {
	// 			transactions = data
	// 			document.getElementById('test').innerText = JSON.stringify(transactions)
	// 		})
	// }, [])

	const data = useMemo(() => fakeData, []);
	const columns = useMemo(
		() => [
			{
				Header: "ID",
				accessor: "id",
			},
			{
				Header: "First Name",
				accessor: "first_name",
			},
			{
				Header: "Last Name",
				accessor: "last_name",
			},
			{
				Header: "Email",
				accessor: "email",
			},
			{
				Header: "Gender",
				accessor: "gender",
			},
			{
				Header: "University",
				accessor: "university",
			},
		],
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} =
		useTable({ columns, data })

	return (
		<>
			<table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps()}>
									{column.render("Header")}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell) => (
									<td {...cell.getCellProps()}> {cell.render("Cell")} </td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
			<p id='test' style={{ color: 'white', fontSize: 40 }}></p>
		</>
	)
}