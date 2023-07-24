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
	TableToolbarSearch
} from "carbon-components-react";
import React, { useState } from "react";
import { headers } from "../../constants";
import {
	useItemStockContext
} from "../context/item-stock-context";
import styles from "./inventory.module.scss";

export const InventoryLandingPage = () => {
	let rows = [];
	const { itemStock } = useItemStockContext();

	const [searchText, setSearchText] = useState("");

	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};

	if (itemStock?.length > 0) {
		for (let index = 0; index < itemStock.length; index++) {
			const newObj = {
				id: `${index}`,
				productName: itemStock[index].item.name,
				currentQuantity: itemStock[index].quantity ?? 0,
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
			<DataTable rows={filteredRows} headers={headers} stickyHeader={true}>
				{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
					<>
						<TableContainer>
							<TableToolbar style={{ width: "14.5rem" }}>
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
