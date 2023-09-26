import { Add16, Subtract16 } from "@carbon/icons-react";
import {
	Button,
	Column,
	ComboBox,
	DataTable,
	DatePicker,
	DatePickerInput,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	TextInput,
} from "carbon-components-react";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import { failureMessage, locationCookieName, successMessage } from "../../../constants";
import "../../../index.scss";
import { getLoadStockObj } from "../../inventory/aushada/eaushadha-response-mapper";
import saveStockInitial from "../../service/save-initial";
import { fetcher, invItemURL, inventoryItemURL, stockRoomURL } from "../../utils/api-utils";
import { getDatePattern } from "../../utils/date-utils";
import { ResponseNotification } from "../notifications/response-notification";
import styles from "./loadStock.module.scss";

export const LoadStock = (props) => {
	const [addDrugItems, setAddDrugItems] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);
	const [rows, setRows] = useState([{ id: 1, drugName: "", batchNo: "", expiryDate: "", quantity: 0, totalQuantity: 0 }]);
	const [onSuccessful, setOnSuccessful] = useState(false);
	const [onFailure, setOnFailure] = useState(false);
	const [cookies] = useCookies();
	const { setReloadData } = props;
	let dropdownItems = [];

	const { data: inventoryItems, error: inventoryItemsError } = useSWR(inventoryItemURL(), fetcher);
	let totalInventoryItems = inventoryItems?.length;
	const { data: stockRoom, error: stockRoomError } = useSWR(stockRoomURL(cookies[locationCookieName]?.name.trim()), fetcher);
	const { data: invItems, error: inventoryItemError } = useSWR(totalInventoryItems !== undefined ? invItemURL(totalInventoryItems) : "", fetcher);

	if (invItems?.results?.length > 0) {
		for (let index = 0; index < invItems.results.length; index++) {
			dropdownItems.push(invItems.results[index].name);
		}
	}

	useEffect(() => {
		if (onSuccessful) {
			setAddDrugItems([]);
			setReloadData(false);
		}
	}, [onSuccessful]);

	useEffect(() => {
		if (!showModal) {
			setAddDrugItems([]);
			setRows([
				{
					id: 1,
					drugName: "",
					batchNo: "",
					expiryDate: "",
					quantity: 0,
					totalQuantity: 0,
					invalid: false,
				},
			]);
		}
	}, [showModal]);

	useEffect(() => {
		const hasEmptyOrNegativeFields = rows.some((row) => !row.drugName || !row.batchNo || !row.expiryDate || !row.totalQuantity || row.totalQuantity <= 0);
		setSaveButtonDisabled(hasEmptyOrNegativeFields);
	}, [rows]);

	useEffect(() => {
		const saveData = async () => {
			try {
				const response = await saveStockInitial(addDrugItems, "", stockRoom.results[0]?.uuid);
				if (response && response.ok) {
					setReloadData(true);
					setOnSuccessful(true);
				} else {
					setOnFailure(true);
				}
			} catch (error) {
				console.error("An error occurred during save:", error);
			}
		};

		if (addDrugItems.length > 0) {
			saveData();
		}
	}, [addDrugItems]);

	const setOnSuccessAndFailure = (status) => {
		setOnSuccessful(status);
		setOnFailure(status);
	};

	const handleSaveDrugButtonClick = async () => {
		try {
			setAddDrugItems(getLoadStockObj(rows));
			setShowModal(false);
		} catch (error) {
			console.error("An error occurred:", error);
			return;
		}
	};

	const handleAddRow = () => {
		setRows((prevRows) => [
			...prevRows,
			{
				id: prevRows.length + 1,
				drugName: "",
				batchNo: "",
				expiryDate: "",
				totalQuantity: 0,
				invalid: false,
			},
		]);
	};

	const handleDeleteRow = (id) => {
		setRows((prevRows) => prevRows.filter((row) => row.id !== id));
	};

	const handleComboBoxChange = (rowId, selectedValue) => {
		setRows((prevRows) =>
			prevRows.map((row) => {
				if (row.id === rowId) {
					return { ...row, drugName: selectedValue };
				}
				return row;
			})
		);
	};

	const isInvalid = (id) => {
		const row = rows.find((row) => row.id === id);
		return row ? row.invalid : false;
	};

	const handleInputChange = (id, field, value) => {
		if (field === "totalQuantity") {
			setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, totalQuantity: value, invalid: value <= 0 } : row)));
		} else if (field === "expiryDate") {
			setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, expiryDate: value } : row)));
		} else {
			setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const filterItems = (menu) => menu?.item?.toLowerCase().includes(menu?.inputValue?.toLowerCase());

	return (
		<Column sm={8}>
			<Column lg={3}>
				{onSuccessful && ResponseNotification("success", "Success", successMessage, setOnSuccessAndFailure)}
				{onFailure && ResponseNotification("error", "Error", failureMessage, setOnSuccessAndFailure)}
			</Column>
			<Button
				onClick={() => {
					setShowModal(true);
				}}
				size={"md"}
				kind="primary"
				className={styles.primaryButton}
			>
				Load Stock
			</Button>
			{showModal && (
				<Modal
					id={isSaveButtonDisabled ? "" : "primaryButton"}
					className="add-drug-modal"
					open={showModal}
					onRequestClose={handleCloseModal}
					size="lg"
					primaryButtonText="Save"
					secondaryButtonText="Cancel"
					onRequestSubmit={handleSaveDrugButtonClick}
					primaryButtonDisabled={isSaveButtonDisabled}
					modalHeading="Add New Drug"
				>
					<DataTable
						rows={rows}
						headers={["S.No", "Drug Name", "Batch No", "Expiry Date", "Total Quantity", "Actions"]}
						render={({ rows, headers, getHeaderProps }) => (
							<TableContainer id="stock-table-container">
								<Table>
									<TableHead>
										<TableRow>
											{headers.map((header, index) => (
												<TableHeader key={index} {...getHeaderProps({ header })}>
													{header}
												</TableHeader>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row) => (
											<>
												<TableRow key={row.id}>
													<TableCell>{row.id}</TableCell>
													<TableCell>
														<ComboBox
															items={dropdownItems}
															shouldFilterItem={filterItems}
															selectedItem={row.drugName}
															onChange={(selectedItem) => handleComboBoxChange(row.id, selectedItem)}
															style={{ width: "270px" }}
														/>
													</TableCell>
													<TableCell>
														<TextInput
															id={`batchNo-${row.id}`}
															className={styles.batchNumberInput}
															value={row.batchNo}
															onChange={(e) => handleInputChange(row.id, "batchNo", e.target.value)}
														/>
													</TableCell>
													<TableCell>
														<DatePicker
															datePickerType="single"
															id={`expiryDate-${row.id}`}
															dateFormat="d/m/Y"
															value={row.expiryDate}
															minDate={new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString("en-GB")}
															onChange={(date) => handleInputChange(row.id, "expiryDate", date[0])}
														>
															<DatePickerInput value={row.expiryDate} onChange={(e) => handleInputChange(row.id, "expiryDate", e.target.value)} pattern={getDatePattern} />
														</DatePicker>
													</TableCell>
													<TableCell>
														<TextInput
															type="number"
															id={`totalQuantity-${row.id}`}
															min={0}
															className={styles.totalQuantityInput}
															value={row.totalQuantity}
															invalid={isInvalid(row.id)}
															onChange={(e) => handleInputChange(row.id, "totalQuantity", e.target.valueAsNumber)}
														/>
													</TableCell>
													<TableCell>
														<Button kind="danger--tertiary" renderIcon={Subtract16} className={styles.iconButton} onClick={() => handleDeleteRow(row.id)} />
													</TableCell>
												</TableRow>
												{isInvalid(row.id) && (
													<TableRow id="errorMessageWrapper">
														<TableCell colSpan={headers.length} className="errorMessage">
															Please enter value &lt;= to available quantity
														</TableCell>
													</TableRow>
												)}
											</>
										))}
									</TableBody>
								</Table>
								<Button kind="tertiary" renderIcon={Add16} className={`${styles.iconButton} ${styles.plusButton}`} onClick={handleAddRow} />
							</TableContainer>
						)}
					/>
				</Modal>
			)}
		</Column>
	);
};
