import React, { useEffect, useState } from "react";
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
	Column,
} from "carbon-components-react";
import useSWR from "swr";
import {
	fetcher,
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
	const [patient, setPatient] = useState();

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

	const filteredRows = rows.filter((row) => {
		return searchText !== ""
			? row?.patientName?.toLowerCase().includes(searchText?.toLowerCase())
			: row;
	});

	const { data: drugItems, error: drugItemsError } = useSWR(
		showModal && prescribedDrugs.length == 0
			? prescribedDrugOrders(patient.id)
			: [],
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);

	useEffect(() => {
		if (drugItems) {
			console.log("Inside useEffect", drugItems);
			const visitDrugOrders = drugItems.visitDrugOrders;
			const drugOrders = [];
			visitDrugOrders.forEach((visitDrugOrder) => {
				const obj = {
					id: visitDrugOrder.uuid,
					drugName: visitDrugOrder.concept.name,
					drugUuid: visitDrugOrder.concept.uuid,
					quantity: visitDrugOrder.dosingInstructions.quantity,
					dose: visitDrugOrder.dosingInstructions.dose,
					doseUnits: visitDrugOrder.dosingInstructions.doseUnits,
					frequency: visitDrugOrder.dosingInstructions.frequency,
					duration: visitDrugOrder.duration,
					durationUnits: visitDrugOrder.durationUnits,
				};
				drugOrders.push(obj);
			});
			if (JSON.stringify(prescribedDrugs) !== JSON.stringify(drugOrders)) {
				console.log('Inside if')
				setPrescribedDrugs(drugOrders);
			}
		}
	}, [drugItems]);

	const handleOnLinkClick = (patientDetails) => {
		setShowModal(true);
		setPatient({
			id: patientDetails.id,
			name: patientDetails.cells[1].value,
		});
	};

	const isSortable = (key) => key === "patientName";

	if (items == undefined && inventoryItemError == undefined)
		return <div>Loading...</div>;

	return inventoryItemError ? (
		<div>Something went wrong while fetching items</div>
	) : (
		<div className={styles.dispenseContainer}>
			<h5 style={{ paddingBottom: "1rem" }}>{activePatients}</h5>
			<DataTable
				rows={filteredRows}
				headers={dispenseHeaders}
				stickyHeader={true}
			>
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
									{rows.map((row) => (
										<TableRow {...getRowProps({ row })}>
											{row.cells.map((cell) => (
												<TableCell key={cell.id}>
													<Link href="#" onClick={() => handleOnLinkClick(row)}>
														{cell.value}
													</Link>
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
						id: patient.id,
						name: patient.name,
						dispense_drugs: [...prescribedDrugs],
					}}
					showModal={showModal}
					rootClass={styles.modal}
					modalListClass={styles.modalList}
					subTitle="Dispense drug for"
					primaryButton="Dispense"
					secondaryButton="Cancel"
					tabs={["", "Qty."]}
					handleSubmit={(val) => console.log(val)}
					closeModal={setShowModal}
					patientDetails={patient}
				/>
			)}
		</div>
	);
};
