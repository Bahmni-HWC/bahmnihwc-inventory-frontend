import {
	Button,
	Column,
	ComboBox,
	DataTable,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	TextInput,
} from 'carbon-components-react';
import React, { useEffect, useState } from 'react';

import { Add16, Subtract16 } from '@carbon/icons-react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';
import { drugItemheaderDispense, locationCookieName } from '../../../../constants';
import { useItemStockContext } from '../../../context/item-stock-context';
import { fetcher, getAllPatient } from '../../../utils/api-utils';
import styles from './add-item-modal.module.scss';

const AddItemModal = (props) => {
	const { itemStock } = useItemStockContext();
	const [cookies] = useCookies();

	const locationUuid = cookies[locationCookieName].uuid;

	const [inventoryItem, setInventoryItem] = useState([]);

	const { data: allPatientList, error: allPatientListError } = useSWR(
		getAllPatient(locationUuid),
		fetcher
	);

	const [rows, setRows] = useState([{ id: 1, drugName: '', avlQty: 0, dispQty: 0 }]);

	useEffect(() => {
		if (itemStock) {
			const invItemArray = itemStock.map((itemStock) => {
				return {
					id: itemStock.item.uuid,
					drugName: itemStock.item.name,
					avlQty: itemStock.quantity,
					dispQty: 0,
					invalid: false,
					uuid: itemStock.item.uuid,
				};
			});
			setInventoryItem(invItemArray);
		}
	}, [itemStock]);

	useEffect(() => {
		const hasEmptyFields = rows.some((row) => !row.drugName || !row.dispQty || row.invalid);
		props.setModifiedData(rows);

		props.setIsInvalid(hasEmptyFields || !props.patient || JSON.stringify(props.patient) === '{}');
	}, [rows, props.patient]);

	const handleAddRow = () => {
		setRows((prevRows) => [
			...prevRows,
			{
				id: prevRows.length + 1,
				drugName: '',
				avlQty: 0,
				dispQty: 0,
				actions: '',
			},
		]);
	};

	const filterItems = (menu) =>
		menu?.item?.drugName?.toLowerCase().includes(menu?.inputValue?.toLowerCase());

	const handleDeleteRow = (id) => {
		setRows((prevRows) => prevRows.filter((row) => row.id !== id));
	};

	const handleComboBoxChange = (rowId, selectedValue) => {
		setRows((prevRows) =>
			prevRows.map((row) => {
				if (row.id === rowId) {
					return {
						...row,
						drugName: selectedValue?.selectedItem?.drugName ?? '',
						avlQty: selectedValue.selectedItem?.avlQty ?? 0,
						invalid: false,
						uuid: selectedValue.selectedItem?.uuid ?? '',
					};
				}
				return row;
			})
		);
	};

	const handleInputChange = (id, value) => {
		if (isInvalid(value)) {
			setRows((prevRows) =>
				prevRows.map((row) =>
					row.id === id ? { ...row, dispQty: parseInt(value), invalid: true } : row
				)
			);
		} else {
			setRows((prevRows) =>
				prevRows.map((row) =>
					row.id === id
						? {
								...row,
								dispQty: parseInt(value),
								invalid: parseInt(value) > row.avlQty || parseInt(value) <= 0,
						  }
						: row
				)
			);
		}
	};

	const isSufficient = (value, row) => {
		const findRow = rows.find((oneRow) => oneRow.id === row.id);
		if (findRow) {
			return findRow.avlQty > 0
				? findRow.avlQty >= parseInt(value, 10) && parseInt(value, 10) !== 0
				: true;
		}
		return false;
	};

	const isInvalid = (value) => {
		if (value !== '') {
			return isNaN(value);
		}
		return false;
	};

	const filterPatient = (patient) =>
		getPatientName(patient.item).toLowerCase().includes(patient.inputValue.toLowerCase());

	const getPatientName = (patient) => {
		if (patient) {
			const givenName = patient.givenName.charAt(0).toUpperCase() + patient.givenName.slice(1);
			const middleName = patient.middleName
				? patient.middleName.charAt(0).toUpperCase() + patient.middleName.slice(1)
				: '';
			const familyName = patient.familyName.charAt(0).toUpperCase() + patient.familyName.slice(1);
			const identifier = patient.identifier;

			return `${givenName} ${middleName} ${familyName} (${identifier})`.replace(/\s+/g, ' ');
		}
	};

	return (
		<Grid className={styles.grid}>
			<Column sm={16} lg={4} className={styles.comboBox}>
				<ComboBox
					id='combo-box-select-patient'
					items={allPatientList?.pageOfResults ?? []}
					placeholder='Select Patient'
					shouldFilterItem={filterPatient}
					itemToString={(item) => getPatientName(item) ?? ''}
					onChange={(selectedItem) => props.setPatient(selectedItem?.selectedItem)}
					invalid={!props.patient}
					invalidText='Please select a patient'
					style={{ fontWeight: 'bolder' }}
				/>
			</Column>
			<DataTable
				rows={rows}
				headers={drugItemheaderDispense}
				render={({ rows, headers, getHeaderProps }) => (
					<TableContainer id='stock-table-container'>
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
										<TableCell id='combo-box-drug-item'>
											<ComboBox
												id='combo-box-1'
												items={inventoryItem}
												itemToString={(item) => item?.drugName ?? ''}
												placeholder='Select Drug'
												shouldFilterItem={filterItems}
												selectedItem={row.drugName}
												onChange={(selectedItem) => handleComboBoxChange(row.id, selectedItem)}
												className={styles.drugItem}
											/>
										</TableCell>
										<TableCell>{row.cells[2].value}</TableCell>
										<TableCell>
											<TextInput
												id={`dispQty-${row.id}`}
												value={isInvalid(row.cells[3].value) ? '' : row.cells[3].value}
												onChange={(e) => handleInputChange(row.id, e.target.value)}
												invalid={!isSufficient(row.cells[3].value, row) || row.invalid}
												invalidText='Please enter value <= to available quantity'
												labelText=''
												className={styles.dispQtyInput}
											/>
										</TableCell>
										<Button
											kind='danger--tertiary'
											renderIcon={Subtract16}
											iconDescription='Delete'
											className={styles.iconButton}
											onClick={() => handleDeleteRow(row.id)}
										/>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Button
							kind='tertiary'
							renderIcon={Add16}
							iconDescription='Add'
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
