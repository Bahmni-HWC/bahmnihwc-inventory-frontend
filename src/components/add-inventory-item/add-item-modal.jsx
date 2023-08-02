import React, { useEffect, useState } from "react";
import {
	Button,
	ComposedModal,
	ModalBody,
	ModalFooter,
	ModalHeader,
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
    DatePicker,
    DatePickerInput,
    ComboBox,
    NumberInput,
    TextInput,
    currentDate,


} from "carbon-components-react";

import { Add16, Subtract16 } from "@carbon/icons-react";
import { getDatePattern } from "../../utils/date-utils";
import styles from "../CustomModal/customModal.module.scss";

const AddItemModal = (props) => {
	const {
		showModal,
		showModalForAdditionalDispense,
		subTitle,
		primaryButton,
		secondaryButton,
		handleSubmit,
		closeModal,
		children,
		invalid,
	} = props;
const handleAddRow = () => {
        setRows((prevRows) => [
        ...prevRows,
        { id: prevRows.length + 1, drugName: "", AvlQty:"", PresQty:"", Actions:"" },

        ]);
    };
     const [rows, setRows] = useState([
      		{ id: 1, drugName: "", AvlQty:"", PresQty:"", Actions:"" },
      	]);
const handleDeleteRow = (id) => {
	setRows((prevRows) => prevRows.filter((row) => row.id !== id));
	};

let dropdownItems=["superman","hoskote"];


    return (
    <>
    <ComboBox items={dropdownItems} selectedItem={dropdownItems}
        													style={{ width: "270px" }}
        												/>

    								    <DataTable
    									rows={rows}
    									headers={["S.No", "Drug Name", "AvlQty", "PresQty", "Actions"]}
    									render={({ rows, headers, getHeaderProps }) => (
    									<TableContainer title="Add New Drug">
    									<Table className={styles.addStocktable}>
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
    											<TableRow key={row.id}>
    											<TableCell>{row.id}</TableCell>
    											<TableCell>
    												<ComboBox
    													items={dropdownItems}
    													//shouldFilterItem={filterItems}
    													selectedItem={row.drugName}
    													onChange={(selectedItem) => handleComboBoxChange(row.id, selectedItem)}
    													style={{ width: "270px" }}
    												/>
    											</TableCell>
    											<TableCell>
    												<TextInput
    												id={`batchNo-${row.id}`}
    												value={row.batchNo}
    												onChange={(e) =>
    													handleInputChange(row.id, "batchNo", e.target.value)
    												}
    												/>
    											</TableCell>
    											<TableCell>
                                                <TextInput
    												id={`batchNo-${row.id}`}
    												value={row.batchNo}
    												onChange={(e) =>
    													handleInputChange(row.id, "batchNo", e.target.value)
    												}
    												/>
    											</TableCell>

    											<TableCell>
    											<Button kind="danger--tertiary" renderIcon={Subtract16} className={styles.iconButton} onClick={() => handleDeleteRow(row.id)}/>
    											</TableCell>
    											</TableRow>
    										))}
    										</TableBody>
    									</Table>
    									<Button kind="tertiary" renderIcon={Add16} className={`${styles.iconButton} ${styles.plusButton}`}onClick={handleAddRow}/>
    									</TableContainer>
    									)}
    									/>
</>
    							);
                                };
                      export default AddItemModal;