// React imports
import { useMemo, useState, useEffect } from 'react'

// Component imports
import { Select } from './select'

// Styled component imports
import * as StyledTable from './styled/table'
import * as ScrollArea from './styled/scroll-area'
import * as Form from './styled/form'

// Library imports
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	getFilteredRowModel
} from '@tanstack/react-table'
import { TriangleUpIcon, TriangleDownIcon } from "@radix-ui/react-icons"

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
			<ScrollArea.Root className='ScrollAreaRoot' theme={currentUser.theme} type="auto">
				<ScrollArea.Viewport className='ScrollAreaViewport' theme={currentUser.theme}>
					<div id='table'>
						<div id='input'>
							{updateData ? <Form.Button theme={currentUser.theme} onClick={resetData} className='editButton'> Reset</Form.Button> : ''}
							{updateData ? <Form.Button theme={currentUser.theme} onClick={saveData} className='editButton'>Save</Form.Button> : ''}
						</div>
						<StyledTable.Root theme={currentUser.theme}>
							<StyledTable.Thead theme={currentUser.theme}>
								{table.getHeaderGroups().map(headerGroup => (
									<StyledTable.Tr key={headerGroup.id} theme={currentUser.theme} leaderboard={leaderboard}>
										{headerGroup.headers.map(header => (
											<StyledTable.Th
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
											</StyledTable.Th>
										))}
									</StyledTable.Tr>
								))}
							</StyledTable.Thead>
							<StyledTable.Tbody theme={currentUser.theme}>
								{table.getRowModel().rows.map(row => (
									<StyledTable.Tr
										key={row.id}
										theme={currentUser.theme}
										leaderboard={leaderboard ?? false}
									>
										{row.getVisibleCells().map(cell => (
											<StyledTable.Td key={cell.id} theme={currentUser.theme}>
												<Cell
													theme={currentUser.theme}
													cell={cell}
													editableColumns={editableColumns}
													onValueChange={(value) => {
														if (!changedData[row.id]) changedData[row.id] = {}

														changedData[row.id][cell.column.id] = value
													}}
												/>
											</StyledTable.Td>
										))}
									</StyledTable.Tr>
								))}
							</StyledTable.Tbody>
						</StyledTable.Root>
					</div>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical" theme={currentUser.theme}>
					<ScrollArea.Thumb className='ScrollAreaThumb' theme={currentUser.theme} />
				</ScrollArea.Scrollbar>
				<ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal" theme={currentUser.theme}>
					<ScrollArea.Thumb className='ScrollAreaThumb' theme={currentUser.theme} />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner className='ScrollAreaCorner' theme={currentUser.theme} />
			</ScrollArea.Root>
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
		<Form.Input
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
					column.setFilterValue(previousFilter => [value, previousFilter?.[1]])
				}}
				placeholder='Min'
			/>
			<DebouncedInput
				type='number'
				theme={theme}
				value={columnFilterValue?.[1] ?? ""}
				onChange={(value) => {
					column.setFilterValue(previousFilter => [previousFilter?.[0], value])
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
			return <Form.Input
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