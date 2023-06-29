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
import CustomModal from '../components/CustomModal';

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
				'id': `${index}`,
				'productName': items.results[index].name,
				'actualQuantity': items.results[index].minimumQuantity,
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
	const patientObj = {
		"id": 1,
		"name": "Patty O'Furniture",
		"dispense_drugs": [{
			"id":"d1",
			"name": 'H (Tab(s)) 750 Tabs, Once/Day, 4 day(s)',
			"quantity": 750
		},
		{
			"id":"d2",
			"name": 'R (Tab(s)) 12 Tabs, Once/Day, 23 day(s)',
			"quantity": 12
		},
		{
			"id":"d3",
			"name": 'R (Tab(s)) 251 Capsule, Once/Day, 10 day(s)',
			"quantity": 251
		},
		{
			"id":"d4",
			"name": 'Z (Tab(s)) 250mg, twice/Day, 4 day(s)',
			"quantity": 8
		},
		{
			"id":"d5",
			"name": 'P (Tab(s)) 10 Tabs, twice/Day, 5 day(s)',
			"quantity": 10
		},
		{
			"id":"d3",
			"name": 'R (Tab(s)) 251 Capsule, Once/Day, 10 day(s)',
			"quantity": 251
		},
		{
			"id":"d4",
			"name": 'Z (Tab(s)) 250mg, twice/Day, 4 day(s)',
			"quantity": 8
		},
		{
			"id":"d5",
			"name": 'P (Tab(s)) 10 Tabs, twice/Day, 5 day(s)',
			"quantity": 10
		}]
	}
	const tabs = ['', 'Qty.']
	console.log('parent')

	return (
		<div className={styles.table}>
			{/* {Init Inventory modal with dummy data by default it is open status for testing purpose only} */}
			<CustomModal
				data={patientObj}
				showModal={true}
				rootClass={styles.modal}
				modalListClass={styles.modalList}
				subTitle="Dispense drug for"
				primaryButton="Dispense"
				secondaryButton='Cancel'
				tabs={tabs}
				handleSubmit={(val) => console.log(val)}
				closeModal={() => console.log('closer')}
				/>

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
