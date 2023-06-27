import React, { useState } from "react";
import {
	DataTable,
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

export const InventoryLandingPage = () => {
	let rows = [];

	const headers = [
		{
			key: "productName",
			header: "Product Name",
		},
		{
			key: "actualQuantity",
			header: "Actual Quantity",
		},
	];

	const { data: items, error: inventoryItemError } = useSWR(
		invItemURL,
		fetcher
	);
	const [searchText, setSearchText] = useState("");
	// add fetcher function to get data from api from invItemURL

	console.log("results--", items, inventoryItemError);
	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};

	if (items?.results?.length > 0) {
		for (let index = 0; index < items.results.length; index++) {
			const newObj = {
				id: `${index}`,
				productName: items.results[index].name,
				actualQuantity: items.results[index].minimumQuantity,
			};
			rows.push(newObj);
		}
		rows= [...rows, ...rows, ...rows];
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

	return (
		<div className={styles.table}>
			<DataTable rows={filteredRows} headers={headers} stickyHeader="true">
				{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
					<>
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
								<TableRow>
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
									<TableRow {...getRowProps({ row })}>
										{row.cells.map((cell) => (
											<TableCell key={cell.id}>{cell.value}</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</>
				)}
			</DataTable>
		</div>
	);
};
