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
	Loading,
} from "carbon-components-react";
import useSWR from "swr";
import { fetcher, invItemURL, stockRoomURL } from "../utils/api-utils";
import styles from "./inventory.module.scss";
import { headers, locationCookieName } from "../../constants";
import { useCookies } from "react-cookie";
import { utils as XLSXUtils, writeFile as XLSXWriteFile } from "xlsx";

export const InventoryLandingPage = () => {
	let rows = [];
	const [cookies] = useCookies();

	const { data: stockRoom, error: stockRoomError } = useSWR(
		stockRoomURL(cookies[locationCookieName]?.name.trim()),
		fetcher
	);

	const { data: items, error: inventoryItemError } = useSWR(
		stockRoom ? invItemURL(stockRoom.results[0].uuid) : '',
		fetcher
	);

	const [searchText, setSearchText] = useState('');

	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};

	const exportToExcel = () => {
		const currentDate = new Date().toLocaleDateString().replace(/\//g, "-");
 		const fileName = `inv_${currentDate}.xlsx`; 
		const exportData = rows.map(({ id, ...rest }) => ({
		  "Product Name": rest.productName,
		  "Quantity": rest.quantity,
		  "Expiration": rest.expiration,
		  "Batch Number": rest.batchNumber,
		}));
	  
		const headerRow = {
		  "Exported Date": currentDate,
		};
	  
		const worksheet = XLSXUtils.json_to_sheet([headerRow, ...exportData]);
		const workbook = XLSXUtils.book_new();
		XLSXUtils.book_append_sheet(workbook, worksheet, "Inventory Data");
	  
		XLSXWriteFile(workbook, fileName);
	  };
	  
	if (items?.results?.length > 0) {
		for (let index = 0; index < items.results.length; index++) {
			const item = items.results[index];
			const expiration = item.details[0]?.expiration;
			const expirationDate = new Date(expiration);
			const formattedExpirationDate = `${expirationDate.getDate().toString().padStart(2, '0')}-${
				(expirationDate.getMonth() + 1).toString().padStart(2, '0')
			  }-${expirationDate.getFullYear()}`;
			const newObj = {
				id: `${index}`,
				productName: items.results[index].item.name,
				quantity: item.details[0]?.quantity ?? 0,
        		expiration: expiration ? formattedExpirationDate : "No Expiration Date",
        		batchNumber: item.details[0]?.batchNumber ?? "No Batch Number",
			};
			rows.push(newObj);
		}
	}
	const filteredRows = rows.filter((row) =>
		searchText !== ''
			? row?.productName?.toLowerCase().includes(searchText?.toLowerCase())
			: row
	);

	const isSortable = (key) => key === "productName";

	if (
		(items == undefined && inventoryItemError == undefined) ||
		(!stockRoom && !stockRoomError)
	)
		return <Loading />;

	return inventoryItemError ? (
		<div>Something went wrong while fetching items</div>
	) : (
		<div className="inv-datatable" style={{ width: "50%" }}>
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
								<TableToolbarContent style={{ justifyContent: "flex-end" }}>
        							{rows.length > 0 && (
          								<button onClick={exportToExcel}>Export to Excel</button>
        							)}
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
												className={
													header.key === "productName"
														? styles.stickyColumn
														: ""
												}
												style={
													header.key === "quantity" ||
													header.key === "expiration" ||
													header.key === "batchNumber"
													  ? { justifyContent: "center" }
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
													className={
														cell.id.includes("productName")
															? styles.stickyColumn
															: ""
													}
													style={
														cell.info.header === "quantity" ||
														cell.info.header === "expiration" ||
														cell.info.header === "batchNumber"
														  ? { justifyContent: "center" }
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
