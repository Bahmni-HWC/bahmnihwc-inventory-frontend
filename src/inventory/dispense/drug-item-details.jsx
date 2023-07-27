import {
	Column,
	DataTable,
	Grid,
	Row,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TextInput,
} from "carbon-components-react";
import React, { useEffect, useState } from "react";
import { useItemStockContext } from "../../context/item-stock-context";
import styles from "./dispense.module.scss";

const DrugItemDetails = (props) => {
	const [drugItems, setDrugItems] = useState([]);
	const [drugInfo, setDrugInfo] = useState([]);
	const { itemStock } = useItemStockContext();

	useEffect(() => {
		if (props.data.dispense_drugs && props.data.dispense_drugs.length > 0) {
			if (
				JSON.stringify(drugItems) !== JSON.stringify(props.data.dispense_drugs)
			) {
				setDrugItems(props.data.dispense_drugs);
			}
		}
	}, [props.data]);

	useEffect(() => {
		if (drugInfo && drugInfo.length > 0) {
			let invalid = false;
			drugInfo.forEach((item) => {
				if (item.invalidQty && invalid === false) invalid = true;
			});
			props.setIsInvalid(invalid);
			props.setModifiedData(drugInfo);
		}
	}, [drugInfo]);

	useEffect(() => {
		if (
			drugItems &&
			itemStock &&
			drugItems.length > 0 &&
			itemStock.length > 0
		) {
			const rowObj = [];
			for (let drugItem of drugItems) {
				for (let item of itemStock) {
					if (item.item.name.includes(drugItem.drugName)) {
						rowObj.push({
							id: drugItem.id,
							itemUuid: item.item.uuid,
							drugName: getTitle(drugItem),
							name: drugItem.drugName,
							avlQty: item.quantity,
							prescribedQty: drugItem.quantity,
							invalidQty: item.quantity < drugItem.quantity,
						});
					}
				}
			}
			setDrugInfo(rowObj);
		}
	}, [drugItems, itemStock]);

	const getTitle = (drug) => {
		let title = "";
		const dosingInstructions = drug.dosingInstructions;
		if (drug.dosingInstructions.frequency !== null) {
			title = `${drug.drugName} - ${dosingInstructions.dose} ${dosingInstructions.doseUnits} | ${dosingInstructions.frequency} | ${drug.duration} ${drug.durationUnits}`;
		} else {
			const administrationInstructions = drug.dosingInstructions.administrationInstructions
			const parsedobj = JSON.parse(administrationInstructions);
			title = `${drug.drugName} - ${parsedobj.morningDose}-${parsedobj.afternoonDose}-${parsedobj.eveningDose} ${dosingInstructions.doseUnits} | ${drug.duration} ${drug.durationUnits}`
		}

		return title;
	};

	const handleOnchange = (value, row) => {
		const updatedRow = drugInfo.map((item) => {
			if (item.id === row.id) {
				return {
					...item,
					prescribedQty: parseInt(value),
					invalidQty: !isSufficient(value, row),
				};
			}
			return item;
		});
		setDrugInfo(updatedRow);
	};

	const isInvalid = (value) => {
		if (value !== "") {
			return isNaN(value);
		}
		return false;
	};

	const isSufficient = (value, row) => {
		const item = drugInfo.find((item) => item.id === row.id);
		if (item) {
			return item.avlQty >= parseInt(value);
		}
		return false;
	};

	const drugItemheader = [
		{ key: "drugName", header: "Drug Name" },
		{ key: "avlQty", header: "Avl.Qty" },
		{ key: "prescribedQty", header: "Pres.Qty" },
	];

	return (
		<Grid>
			<Row>
				<Column
					lg={12}
					sm={6}
					style={{
						paddingTop: "1rem",
						wordWrap: "break-word",
					}}
					className={styles.itemDrugs}
				>
					<DataTable
						rows={drugInfo}
						headers={drugItemheader}
						className={styles.accordionItem}
						style={{ padding: 0 }}
					>
						{({
							rows,
							headers,
							getTableProps,
							getHeaderProps,
							getRowProps,
						}) => (
							<>
								<Table {...getTableProps()}>
									<TableHead>
										<TableRow>
											{headers.map((header) => (
												<TableHeader
													{...getHeaderProps({
														header,
													})}
													disabled={true}
												>
													{header.header}
												</TableHeader>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row) => {
											return (
												<TableRow {...getRowProps({ row })}>
													{row.cells.map((cell) => {
														if (cell.id.includes("prescribedQty"))
															return (
																<TableCell key={cell.id}>
																	<TextInput
																		size="sm"
																		value={
																			isInvalid(cell.value) ? "" : cell.value
																		}
																		id={cell.id}
																		labelText=""
																		style={
																			!isSufficient(cell.value, row)
																				? { color: "red" }
																				: {}
																		}
																		invalid={!isSufficient(cell.value, row)}
																		invalidText={
																			"Please enter value <= to available quantity"
																		}
																		onChange={(e) =>
																			handleOnchange(e.target.value, row)
																		}
																	/>
																</TableCell>
															);
														return (
															<TableCell key={cell.id}>{cell.value}</TableCell>
														);
													})}
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</>
						)}
					</DataTable>
				</Column>
			</Row>
		</Grid>
	);
};

export default DrugItemDetails;
