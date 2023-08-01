import {
	DataTable,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	TableToolbar,
	TableToolbarContent,
	TableToolbarSearch,
} from "carbon-components-react";
import useSWR from "swr";
import { fetcher, invItemURLByStockroom, stockRoomURL } from "../utils/api-utils";
import React, { useState } from "react";
import { headers, locationCookieName } from "../../constants";
import { useItemStockContext } from "../context/item-stock-context";
import styles from "./inventory.module.scss";
import { Button } from "carbon-components-react";
import { exportToExcel } from "./export-to-excel";
import { getFormattedDate } from '../utils/date-utils';
import { useCookies } from "react-cookie";

export const InventoryLandingPage = () => {
	let rows = [];
	const [cookies] = useCookies();

	const { data: stockRoom, error: stockRoomError } = useSWR(
		stockRoomURL(cookies[locationCookieName]?.name.trim()),
		fetcher
	);

	const { data: items, error: inventoryItemError } = useSWR(
		stockRoom ? invItemURLByStockroom(stockRoom.results[0].uuid) : '',
		fetcher
	);
	const { itemStock } = useItemStockContext();

	const [searchText, setSearchText] = useState("");

	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};
	const handleExportToExcel = () => exportToExcel(filteredRows);

	if (itemStock?.length > 0) {
		for (let index = 0; index < itemStock.length; index++) {
			const item = itemStock[index];
			const expiration = item.details[0]?.expiration;
			const formattedExpirationDate = getFormattedDate;
			const newObj = {
				id: `${index}`,
				productName: itemStock[index].item.name,
				quantity: item.details[0]?.quantity ?? 0,
				expiration: expiration ? formattedExpirationDate : "No Expiration Date",
				batchNumber: item.details[0]?.batchNumber ?? "No Batch Number",
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

	return (
		<div className={styles.inventoryContainer}>
			<DataTable rows={filteredRows} headers={headers}>
				{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
					<>
						<TableContainer>
							<TableToolbarContent className={styles.tableToolbarContent}>
								<TableToolbarSearch
									value={searchText}
									onChange={handleSearch}
								/>
								{rows.length > 0 && (
									<Button
										onClick={handleExportToExcel}
										kind="tertiary"
										size="sm"
									>
										Export To Excel
									</Button>
								)}
							</TableToolbarContent>
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
												className={
													header.key === "productName"
														? styles.stickyColumn
														: ""
												}
											>
												{header.header}
											</TableHeader>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.length === 0 ? (
										<TableRow style={{ fontSize: "20px" }}>
											<TableCell colSpan={headers.length}>
												Currently there are no stocks available
											</TableCell>
										</TableRow>
									) : (
										rows.map((row) => (
											<TableRow {...getRowProps({ row })}>
												{row.cells.map((cell) => (
													<TableCell
														key={cell.id}
														className={`${
															cell.id.includes("productName")
																? styles.stickyColumn
																: ""
														} 
												}`}
													>
														{cell.value}
													</TableCell>
												))}
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</>
				)}
			</DataTable>
		</div>
	);
};
