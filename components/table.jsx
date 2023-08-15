// React imports
import { useMemo, useState, useEffect } from 'react'

// Component imports
import { Select } from './select'

// Styled component imports
import * as styledTable from './styled/table'
import * as scrollArea from './styled/scrollArea'
import * as form from './styled/Form'

// Library imports
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	getFilteredRowModel
} from '@tanstack/react-table'
import { TriangleUpIcon, TriangleDownIcon } from "@radix-ui/react-icons"
import { } from "@tabler/icons"

// Atom imports
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '../atoms'


export function Table({
	data,
	columns,
	enableFilters = false,
	enableSorting = false,
	limit,
	editableColumns,
	updateData,
	leaderboard
}) {
	const currentUser = useAtomValue(currentUserAtom)
	const [initialData, setInitialData] = useState(data)
	const [currentData, setCurrentData] = useState(data)
	const [changedData, setChangedData] = useState({})
	const [sorting, setSorting] = useState([])
	const [filters, setFilters] = useState([])

	useEffect(() => {
		setInitialData(data)
		// setCurrentData(currentData.map((item, index) => {
		// 	return { ...item, ...changedData[index] }
		// }))
	}, [data])


	function resetData() {
		setCurrentData(initialData)
	}

	async function saveData() {
		updateData(changedData)
	}

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting: sorting,
			columnFilters: filters,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		sortDescFirst: false,
		enableSorting: enableSorting,
		enableFilters: enableFilters
	})

	if (limit) table.getRowModel().rows = table.getRowModel().rows.slice(0, limit)

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
							{updateData ? <form.Button theme={currentUser.theme} onClick={resetData} className='editButton'> Reset</form.Button> : ''}
							{updateData ? <form.Button theme={currentUser.theme} onClick={saveData} className='editButton'>Save</form.Button> : ''}
						</div>
						<styledTable.root theme={currentUser.theme}>
							<styledTable.thead theme={currentUser.theme}>
								{table.getHeaderGroups().map(headerGroup => (
									<styledTable.tr key={headerGroup.id} theme={currentUser.theme} leaderboard={leaderboard}>
										{headerGroup.headers.map(header => (
											<styledTable.th
												key={header.id}
												theme={currentUser.theme}
											>
												{header.column.getCanSort() ?
													<div
														onClick={header.column.getToggleSortingHandler()}
														style={{ cursor: 'pointer' }}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{{
															asc: <TriangleUpIcon style={{
																scale: '300%',
																marginLeft: '5%'
															}} />,
															desc: <TriangleDownIcon style={{
																scale: '300%',
																marginLeft: '5%'
															}} />,
														}[header.column.getIsSorted()] ?? null}
													</div>
													:
													flexRender(
														header.column.columnDef.header,
														header.getContext()
													)
												}
												{header.column.getCanFilter() ? (
													<Filter
														theme={currentUser.theme}
														column={header.column}
														table={table}
													/>
												) : null}
											</styledTable.th>
										))}
									</styledTable.tr>
								))}
							</styledTable.thead>
							<styledTable.tbody theme={currentUser.theme}>
								{table.getRowModel().rows.map(row => (
									<styledTable.tr
										key={row.id}
										theme={currentUser.theme}
										leaderboard={leaderboard ?? false}
									>
										{row.getVisibleCells().map(cell => (
											<styledTable.td key={cell.id} theme={currentUser.theme}>
												<Cell
													theme={currentUser.theme}
													cell={cell}
													editableColumns={editableColumns}
													onValueChange={(value) => {
														if (!changedData[row.id]) changedData[row.id] = {}

														changedData[row.id][cell.column.id] = value
													}}
												/>
											</styledTable.td>
										))}
									</styledTable.tr>
								))}
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

function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}) {
	const [value, setValue] = useState(initialValue)

	useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value)
		}, debounce)

		return () => clearTimeout(timeout)
	}, [value])

	return (
		<form.input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	)
}

function Filter({ theme, column, table }) {
	const firstValue = table
		.getPreFilteredRowModel()
		.flatRows[0]?.getValue(column.id)

	const columnFilterValue = column.getFilterValue()

	const sortedUniqueValues = useMemo(
		() =>
			typeof firstValue === "number"
				? []
				: Array.from(column.getFacetedUniqueValues().keys()).sort(),
		[column.getFacetedUniqueValues()]
	)

	return typeof firstValue === "number" ? (
		<div>
			<DebouncedInput
				type='number'
				theme={theme}
				value={columnFilterValue?.[0] ?? ""}
				onChange={(value) => {
					column.setFilterValue((old) => [value, old?.[1]])
				}}
				placeholder='Min'
			/>
			<DebouncedInput
				type='number'
				theme={theme}
				value={columnFilterValue?.[1] ?? ""}
				onChange={(value) => {
					column.setFilterValue((old) => [old?.[0], value])
				}}
				placeholder='Max'
			/>
		</div>
	) : (
		<>
			<DebouncedInput
				theme={theme}
				type="text"
				value={columnFilterValue ?? ""}
				onChange={(value) => {
					column.setFilterValue(value)
				}}
				placeholder={`Search... `}
			/>
		</>
	)
}

function Cell({ editableColumns, cell, theme, onValueChange }) {
	if (editableColumns && Object.keys(editableColumns).includes(cell.column.id)) {
		let editableColumn = editableColumns[cell.column.id]

		if (!editableColumn.type) return `Error Type is Undefined`

		if (Array.isArray(editableColumn.type)) {
			return <Select
				theme={theme}
				pop={true}
				name={cell.column.id}
				items={editableColumn.type}
				defaultValue={cell.getContext().row.original[cell.column.id]}
				onValueChange={(value) => {
					onValueChange(value)
				}}
			/>
		} else if (typeof editableColumn.type === 'string') {
			return <form.input
				theme={theme}
				pop={true}
				type={editableColumn.type}
				min={editableColumn.min}
				max={editableColumn.max}
				defaultValue={cell.getValue()}
				onChange={(event) => {
					if (editableColumn.type === 'number') onValueChange(Number(event.target.value))
					else onValueChange(event.target.value)
				}}
			/>
		} else return `Error Type: ${JSON.stringify(editableColumn.type)} is invalid`
	} else return (
		flexRender(
			cell.column.columnDef.cell,
			cell.getContext()
		)
	)
}