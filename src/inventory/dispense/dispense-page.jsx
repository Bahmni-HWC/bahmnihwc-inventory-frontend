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
	Loading,
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
import { getDrugItems, getMappedDrugs } from "./drug-mapper";
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
	const [patient, setPatient] = useState({});
	const [modifiedData, setModifiedData] = useState([]);
	const [isInvalid, setIsInvalid] = useState(false);

	useEffect(() => {
		if (!showModal) {
			setIsInvalid(false);
			setModifiedData([]);
			setPrescribedDrugs([]);
			setPatient({});
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

	const filteredRows = rows.filter((row) => {
		return searchText !== ""
			? row?.patientName?.toLowerCase().includes(searchText?.toLowerCase())
			: row;
	});

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
					drugOrders.push(getMappedDrugs(visitDrugOrder));
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
		}
	};

	if (items == undefined && inventoryItemError == undefined) return <Loading />;

	return inventoryItemError ? (
		<div>{errorNotification("Something went wrong while fetching URL")}</div>
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
									{rows.length === 0 && (
										<TableRow style={{ fontSize: "20px" }}>
											<TableCell colSpan={headers.length}>
												No active patients with drug orders
											</TableCell>
										</TableRow>
									)}
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
						data={getDrugItems(patient, prescribedDrugs)}
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
