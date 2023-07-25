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
	Link,
} from "carbon-components-react";
import useSWR from "swr";
import {
	fetcher,
	invItemURL,
	activePatientWithDrugOrders,
	prescribedDrugOrders,
} from "../../utils/api-utils";
import {
	locationCookieName,
	dispenseHeaders,
	activePatients,
} from "../../../constants";
import { useCookies } from "react-cookie";
import CustomModal from "../../components/CustomModal";
import styles from "./dispense.module.scss";
import { errorNotification } from "../../components/notifications/errorNotification";

export const DispensePage = () => {
	let rows = [];
	const [cookies] = useCookies();
	const { data: items, error: inventoryItemError } = useSWR(
		activePatientWithDrugOrders(cookies[locationCookieName]?.uuid),
		fetcher
	);

	const [searchText, setSearchText] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [prescribedDrugs, setPrescribedDrugs] = useState([]);
	const [patientUuid, setPatientUuid] = useState("");

	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};

	if (Array.isArray(items)) {
		rows = items.map((item) => {
			return {
				item,
				id: item.uuid,
				patientName: item.name,
				patientId: item.identifier,
			};
		});
	}
	console.log("item...", items);
	const filteredRows = rows.filter((row) => {
		console.log(
			"first",
			row?.patientName,
			searchText,
			row?.patientName?.toLowerCase().includes(searchText?.toLowerCase())
		);
		return searchText !== ""
			? row?.patientName?.toLowerCase().includes(searchText?.toLowerCase())
			: row;
	});
	console.log("showModal", showModal);
	const { data: prescibedDrugs, error: prescribedDrugsError } = useSWR(
		showModal ? prescribedDrugOrders(patientUuid) : [],
		fetcher
	);
	console.log("prescibedDrugs", prescibedDrugs);

	const handleOnLinkClick = (patientDetails) => {
		setShowModal(true);
		setPatientUuid(patientDetails.id);
	};
	const isSortable = (key) => key === "patientName";

	const handleRowClick = (row) => {};

	if (items == undefined && inventoryItemError == undefined)
		return <div>Loading...</div>;

	return inventoryItemError ? (
		<div>
			{errorNotification("Something went wrong while fetching URL")}
		</div>
	) : (
		<div className="inv-datatable" style={{ width: "50%" }}>
			<h5 style={{ paddingBottom: "1rem" }}>{activePatients}</h5>
			<DataTable
				rows={filteredRows}
				headers={dispenseHeaders}
				stickyHeader={true}
			>
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
							<Table {...getTableProps()}>
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
								{rows.length === 0 && (
									<TableRow>
										<div style={{fontSize: "20px"}}>
										Currently there are no active drug orders
										</div>
									</TableRow>
								)}
									{rows.map((row) => (
										<TableRow
											{...getRowProps({ row })}
											// onClick={() => handleRowClick(row)}
										>
											{row.cells.map((cell) => (
												<TableCell key={cell.id}>
													{" "}
													{cell.info.header === "patientName" ? (
														<Link
															href="#"
															onClick={() => handleOnLinkClick(row)}
														>
															{cell.value}
														</Link>
													) : (
														cell.value
													)}
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
			{showModal && (
				<CustomModal
					data={{
						id: 1,
						name: "Patty O'Furniture",
						dispense_drugs: [
							{
								id: "d1",
								name: "H (Tab(s)) 750 Tabs, Once/Day, 4 day(s)",
								quantity: 750,
							},
						],
					}}
					showModal={true}
					rootClass={styles.modal}
					modalListClass={styles.modalList}
					subTitle="Dispense drug for"
					primaryButton="Dispense"
					secondaryButton="Cancel"
					tabs={["", "Qty."]}
					handleSubmit={(val) => console.log(val)}
					closeModal={() => console.log("closer")}
				/>
			)}
		</div>
	);
};
