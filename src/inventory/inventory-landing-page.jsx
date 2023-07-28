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
import { errorNotification } from "../components/notifications/errorNotification";

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

	if (items?.results?.length > 0) {
		for (let index = 0; index < items.results.length; index++) {
			const newObj = {
				id: `${index}`,
				productName: items.results[index].item.name,
				currentQuantity: items.results[index].quantity ?? 0,
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
		<div>
			{errorNotification("Something went wrong while fetching URL")}
	  </div>
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
									{rows.length === 0 && (
										<TableRow>
											<div style={{ fontSize: "20px"}}>
											Currently there are no stocks available
											</div>
										</TableRow>
									)}
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
