import {
	Button,
	ComboBox,
	DataTable,
	Grid,
	Row,
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

import { Add16, Subtract16 } from "@carbon/icons-react";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import { locationCookieName } from "../../../constants";
import { useItemStockContext } from "../../context/item-stock-context";
import { fetcher, getAllPatient } from "../../utils/api-utils";
import styles from "./add-item-modal.module.scss";

const AddItemModal = (props) => {
	const { itemStock } = useItemStockContext();
	const [cookies] = useCookies();

	const locationUuid = cookies[locationCookieName].uuid;

	const [inventoryItem, setInventoryItem] = useState([]);


	const { data: allPatientList, error: allPatientListError } = useSWR(
		getAllPatient(locationUuid),
		fetcher
	);

	const [rows, setRows] = useState([
		{ id: 1, drugName: "", avlQty: 0, presQty: 0 },
	]);

	useEffect(() => {
		if (itemStock) {
			const invItemArray = itemStock.map((itemStock) => {
				return {
					id: itemStock.item.uuid,
					drugName: itemStock.item.name,
					avlQty: itemStock.quantity,
					presQty: 0,
					invalid: false,
					uuid: itemStock.item.uuid,
				};
			});
			setInventoryItem(invItemArray);
		}
	}, [itemStock]);

	useEffect(() => {
		const hasEmptyFields = rows.some(
			(row) =>
				!row.drugName || !row.presQty || row.invalid
		);
	    props.setModifiedData(rows);

		props.setIsInvalid(hasEmptyFields || !props.patient);
	}, [rows, props.patient]);



	const handleAddRow = () => {
		setRows((prevRows) => [
			...prevRows,
			{
				id: prevRows.length + 1,
				drugName: "",
				avlQty: 0,
				presQty: 0,
				actions: "",
			},
		]);
	};

	const filterItems = (menu) =>
		menu?.item?.drugName
			?.toLowerCase()
			.includes(menu?.inputValue?.toLowerCase());

	const handleDeleteRow = (id) => {
		setRows((prevRows) => prevRows.filter((row) => row.id !== id));
	};

	const handleComboBoxChange = (rowId, selectedValue) => {
		setRows((prevRows) => {
			return prevRows.map((row) => {
				if (row.id === rowId) {
					return {
						...row,
						drugName: selectedValue?.selectedItem?.drugName ?? "",
						avlQty: selectedValue.selectedItem?.avlQty ?? 0,
						invalid: false,
						uuid: selectedValue.selectedItem?.uuid ?? "",
					};
				}
				return row;
			});
		});
	};

	const handleInputChange = (id, value) => {
		if (isInvalid(value) ) {
			setRows((prevRows) =>
				prevRows.map((row) => (row.id === id ? { ...row,presQty: value, invalid: true } : row))
			);
		}
		else{
            setRows((prevRows) =>
                prevRows.map((row) => (row.id === id ? { ...row, presQty: value, invalid: (parseInt(value)>row.avlQty) } : row))
            );
        }

	};

	const isSufficient = (value, row) => {
		const findRow = rows.find((row) => row.id === row.id);
		console.log('row', findRow, value)
		if (findRow) {
			return findRow.avlQty >= parseInt(value);
		}
		return false;
	};

	const isInvalid = (value) => {
		if (value !== "") {
			return isNaN(value);
		}
		return false;
	};

	const filterPatient = (patient) =>
		getPatientName(patient.item)
			.toLowerCase()
			.includes(patient.inputValue.toLowerCase());

	const getPatientName = (patient) => {
		if (patient) {
			const givenName =
				patient.givenName.charAt(0).toUpperCase() + patient.givenName.slice(1);
			const middleName = patient.middleName
				? patient.middleName.charAt(0).toUpperCase() +
				  patient.middleName.slice(1)
				: "";
			const familyName =
				patient.familyName.charAt(0).toUpperCase() +
				patient.familyName.slice(1);
				const identifier = patient.identifier;


			return `${givenName} ${middleName} ${familyName} (${identifier})`;
		}
	};

	return (
		<Grid columns={12}>
			<Row sm={60}>
				<ComboBox
					id="combo-box-select-patient"
					items={allPatientList?.pageOfResults ?? []}
					placeholder="Select Patient"
					shouldFilterItem={filterPatient}
					itemToString={(item) => getPatientName(item) ?? ""}
					onChange={(selectedItem) =>
						props.setPatient(selectedItem?.selectedItem)
					}
                invalid={!props.patient}
               invalidText="Please select a patient"
					style={{ fontWeight: "bolder" }}
				/>
			</Row>
			<DataTable
				rows={rows}
				headers={[
					{ key: "id", header: "S.No" },
					{ key: "drugName", header: "Drug Name" },
					{ key: "avlQty", header: "AvlQty" },
					{ key: "presQty", header: "PresQty" },
					{ key: "action", header: "Actions" },
				]}
				render={({ rows, headers, getHeaderProps }) => (
					<TableContainer title="Add New Drug">
						<Table className={styles.addStocktable}>
							<TableHead>
								<TableRow>
									{headers.map((header, index) => (
										<TableHeader key={index} {...getHeaderProps({ header })}>
											{header.header}
										</TableHeader>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.id}>
										<TableCell>{row.id}</TableCell>
										<TableCell>
											<ComboBox
												id="combo-box-1"
												items={inventoryItem}
												itemToString={(item) => item?.drugName ?? ""}
												placeholder="Select Drug"
												shouldFilterItem={filterItems}
												selectedItem={row.drugName}
												onChange={(selectedItem) =>
													handleComboBoxChange(row.id, selectedItem)
												}
											/>
										</TableCell>
										<TableCell>{row.cells[2].value}</TableCell>
										<TableCell>
											<TextInput
												id={`presQty-${row.id}`}
												value={row.cells[3].value }
												onChange={(e) =>
													handleInputChange(row.id, e.target.value)
												}
												invalid={ !isSufficient(row.cells[3].value, row) || row.invalid}
												invalidText="Please enter a valid number"
											/>
										</TableCell>
										<Button
											kind="danger--tertiary"
											renderIcon={Subtract16}
											className={styles.iconButton}
											onClick={() => handleDeleteRow(row.id)}
										/>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Button
							kind="tertiary"
							renderIcon={Add16}
							className={`${styles.iconButton} ${styles.plusButton}`}
							onClick={handleAddRow}
						/>
					</TableContainer>
				)}
			/>
		</Grid>
	);
};
export default AddItemModal;
