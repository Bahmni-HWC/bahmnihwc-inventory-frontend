import React, { useState } from "react";
import {
	DataTable,
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableToolbar,
	TableToolbarContent,
	TableToolbarSearch,
} from "carbon-components-react";
import useSWR from "swr";
import { fetcher, invItemURL } from "../../utils/api-utils";
import { headers } from "./dispense-page-datamodel"

export const DispensePage = () => {
	let rows = [];

	const { data: items, error: inventoryItemError } = useSWR(
		invItemURL,
		fetcher
	);
	const [searchText, setSearchText] = useState("");

	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};

    if(Array.isArray(items?.results)) {
        rows = items?.results.map((item) => {
            return {
                item,
                id:item.uuid,
                productName: item.name,
                actualQuantity: item.minimumQuantity
            }
        })

    }
	const filteredRows = rows.filter((row) => {
		console.log(
			"first",
			row?.productName,
			searchText,
			row?.productName?.toLowerCase().includes(searchText?.toLowerCase())
		);
		return searchText !== ""
			? row?.productName?.toLowerCase().includes(searchText?.toLowerCase())
			: row;
	});

	const isSortable = (key) => key === "productName";

    const handleRowClick = (row) => {
        console.log("row ", row);
    }

	if (items == undefined && inventoryItemError == undefined)
		return <div>Loading...</div>;

	return inventoryItemError ? (
		<div>Something went wrong while fetching items</div>
	) : (
		<div className="inv-datatable">
			<DataTable rows={filteredRows} headers={headers} stickyHeader={true}>
				{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
					<>
						<TableContainer >
						<TableToolbar style={{ width: "200px"}}  >
							<TableToolbarContent >
								<TableToolbarSearch
									value={searchText}
									onChange={handleSearch}
								/>
							</TableToolbarContent>
						</TableToolbar>
						<Table {...getTableProps()} >
							<TableHead>
								<TableRow >
									{headers.map((header) => (
										<TableHeader
											{...getHeaderProps({
												header,
												isSortable: isSortable(header.key),
											})}
										>
											{header.header}
										</TableHeader>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow {...getRowProps({ row })} onClick={()=>handleRowClick(row)}>
										{row.cells.map((cell) => (
											<TableCell key={cell.id}>{cell.value}</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
						</TableContainer>
					</>
				)}
			</DataTable>
		</div>
	);
};
