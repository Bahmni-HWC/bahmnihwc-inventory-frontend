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
import { saveDispense } from "../../service/save-dispense";
import DrugItemDetails from "./drug-item-details";

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
	const [patient, setPatient] = useState([]);
	const [modifiedData, setModifiedData] = useState([]);
	const [isInvalid, setIsInvalid] = useState(false);

	useEffect(() => {
		if (!showModal) {
			setIsInvalid(false);
			setModifiedData([]);
		}
	}, [showModal]);

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

	const { data: drugItems, error: drugItemsError } = useSWR(
		showModal && patient.id ? prescribedDrugOrders(patient.id) : "",
		fetcher
	);

	useEffect(() => {
		if (drugItems) {
			const visitDrugOrders = drugItems.visitDrugOrders;
			const drugOrders = [];
			visitDrugOrders.forEach((visitDrugOrder) => {
				if (isValid(visitDrugOrder)) {
					const obj = {
						id: visitDrugOrder.uuid,
						drugName: visitDrugOrder.drug.name,
						drugUuid: visitDrugOrder.drug.uuid,
						quantity: visitDrugOrder.dosingInstructions.quantity,
						dosingInstructions: visitDrugOrder.dosingInstructions,
						duration: visitDrugOrder.duration,
						durationUnits: visitDrugOrder.durationUnits,
					};
					drugOrders.push(obj);
				}
			});
			if (JSON.stringify(prescribedDrugs) !== JSON.stringify(drugOrders)) {
				setPrescribedDrugs(drugOrders);
			}
		}
	}, [drugItems]);

	const isValid = (visitDrugOrder) => {
		if (visitDrugOrder && !visitDrugOrder.dateStopped) {
			return true;
		}
		return false;
	};
	const isSortable = (key) => key === "patientName";

	const handleOnLinkClick = (patientDetails) => {
		setShowModal(true);
		setPatient({
			id: patientDetails.id,
			name: patientDetails.cells[1].value,
		});
	};

	const handleSave = async () => {
		const data = {
			patientUuid: patient.id,
			dispense_drugs: modifiedData,
		};
		const response = await saveDispense(data);
		if (response.status === 201) {
			setShowModal(false);
			setModifiedData([]);
			setPrescribedDrugs([]);
		}
	};

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
					showModal={showModal}
					subTitle={`Dispense drug for ${patient.name}`}
					primaryButton="Dispense"
					secondaryButton="Cancel"
					handleSubmit={handleSave}
					closeModal={() => setShowModal(false)}
					invalid={isInvalid}
				>
					<DrugItemDetails
						data={{
							id: patient.id,
							name: patient.name,
							dispense_drugs: [...prescribedDrugs],
						}}
						modifiedData={modifiedData}
						setModifiedData={setModifiedData}
						isInvalid={isInvalid}
						setIsInvalid={setIsInvalid}
					/>
				</CustomModal>
			)}
		</div>
	);
};
