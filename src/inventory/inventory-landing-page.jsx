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
import { fetcher, invItemURL } from "../utils/api-utils";
import styles from "./inventory.module.scss";
import { headers } from "../../constants";

export const InventoryLandingPage = () => {
	let rows = [];

	const { data: items, error: inventoryItemError } = useSWR(
		invItemURL,
		fetcher
	);
	const [searchText, setSearchText] = useState("");

	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};

	if (items?.results?.length > 0) {
		for (let index = 0; index < items.results.length; index++) {
			const newObj = {
				id: `${index}`,
				productName: items.results[index].name,
				currentQuantity: items.results[index].minimumQuantity ?? 0,
			};
			rows.push(newObj);
		}
	}
	const filteredRows = rows.filter((row) =>
		searchText !== ""
			? row?.productName?.toLowerCase().includes(searchText?.toLowerCase())
			: row
	);

	const isSortable = (key) => key === "productName";

	if (items == undefined && inventoryItemError == undefined)
		return <div>Loading...</div>;

	return inventoryItemError ? (
		<div>Something went wrong while fetching items</div>
	) : (
		<div className="inv-datatable" 
		style={{width:'50%'}}
		>
			<DataTable rows={filteredRows} headers={headers} stickyHeader={true}>
				{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
					<>
						<TableContainer>
							<TableToolbar style={{ width: "15rem" }}>
								<TableToolbarContent style={{ justifyContent: "flex-start" }}>
									<TableToolbarSearch
										value={searchText}
										onChange={handleSearch}
									/>
								</TableToolbarContent>
							</TableToolbar>
							<Table
								{...getTableProps()}
								useZebraStyles={true}
								className={styles.table}
							>
								<TableHead>
									<TableRow>
										{headers.map((header) => (
											<TableHeader
												{...getHeaderProps({
													header,
													isSortable: isSortable(header.key),
												})}
												style={
													header.key === "currentQuantity"
														? { justifyContent: "flex-end" }
														: {}
												}
											>
												{header.header}
											</TableHeader>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map((row) => (
										<TableRow {...getRowProps({ row })}>
											{row.cells.map((cell) => (
												<TableCell
													key={cell.id}
													style={
														cell.info.header === "currentQuantity"
															? { justifyContent: "flex-end" }
															: {}
													}
												>
													{cell.value}
												</TableCell>
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
