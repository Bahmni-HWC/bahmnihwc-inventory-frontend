import {
	Accordion,
	AccordionItem,
	ClickableTile,
	Column,
	ComposedModal,
	DataTable,
	Grid,
	Modal,
	ModalBody,
	RadioTile,
	Row,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableSelectAll,
	TableSelectRow,
	TextInput,
	TileGroup,
} from "carbon-components-react";
import React, { useEffect, useState } from "react";
import { useItemStockContext } from "../../context/item-stock-context";
import styles from "./dispense.module.scss";
import { Layer } from "@carbon/react";
import { Tile } from "carbon-components";

const DrugItemDetails = ({ data }) => {
	const [drugItems, setDrugItems] = useState([]);
	const { itemStock } = useItemStockContext();
	const [totalQuantity, setTotalQuantity] = useState(new Map());
	const [selectedBatch, setSelectedBatch] = useState(new Map());
	const [bacthches, setBatches] = useState(new Map());

	useEffect(() => {
		if (data.dispense_drugs && data.dispense_drugs.length > 0) {
			if (JSON.stringify(drugItems) !== JSON.stringify(data.dispense_drugs)) {
				setDrugItems(data.dispense_drugs);
			}
		}
	}, [data]);

	useEffect(() => {
		if (drugItems && Array.isArray(drugItems) && drugItems.length > 0) {
			drugItems.forEach((drug) => {
				setTotalQuantity(
					(map) =>
						new Map(
							map.set(drug.drugName, {
								quantity: drug.quantity,
							})
						)
				);
			});
		}
	}, [drugItems]);

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
					if (drugItem.drugName === item.item.name) {
						for (let detail of item.details) {
							rowObj.push({
								name: item.item.name,
								itemUuid: item.item.uuid,
								batchNo: detail.batchNumber,
								expiration: getFormattedDate(detail.expiration),
								quantity: detail.quantity,
							});
						}
						setBatches((map) => new Map(map.set(drugItem.drugName, rowObj)));
					}
				}
			}
		}
	}, [drugItems, itemStock]);

	console.log("selectedBatch", selectedBatch);

	const headers = [
		{ key: "batchNo", header: "Batch No" },
		{ key: "expiration", header: "Expiration" },
		{ key: "quantity", header: "Qty" },
	];

	const getFormattedDate = (date) => {
		return new Date(date).toLocaleDateString();
	};

	const find = (drug) => {
		const rowObj = [];
		const flattenedArray = itemStock.filter(
			(itemStock) => drug.drugName === itemStock.item.name
		);
		if (flattenedArray.length > 0) {
			flattenedArray.forEach((item) => {
				item.details.forEach((detail) => {
					rowObj.push({
						id: detail.uuid,
						itemUuid: item.item.uuid,
						batchNo: detail.batchNumber,
						expiration: getFormattedDate(detail.expiration),
						quantity: detail.quantity,
						name: item.item.name,
					});
				});
			});
		}
		return rowObj;
	};

	const getQuantity = (drug) => {
		const itemDetails = find(drug);
		let totalQuantity = 0;
		itemDetails.forEach((item) => {
			totalQuantity += item.quantity;
		});
		return totalQuantity;
	};

	const handleRowSelect = (row, itemDetails) => {
		console.log("row", row);
		const selectedRow = itemDetails.filter((item) => item.id === row.id);
		if (selectedRow) {
			if (selectedBatch.get(selectedRow[0].itemUuid)) {
				const batch = selectedBatch.get(selectedRow[0].itemUuid);
				setSelectedBatch(
					(map) =>
						new Map(
							map.set(selectedRow[0].itemUuid, [...batch, ...selectedRow])
						)
				);
			} else
				setSelectedBatch(
					(map) => new Map(map.set(selectedRow[0].itemUuid, selectedRow))
				);
		}
	};

	const renderTable = (drug) => {
		const itemDetails = find(drug);
		return (
			<DataTable
				rows={itemDetails}
				headers={headers}
				className={styles.accordionItem}
				style={{ padding: 0 }}
			>
				{({
					rows,
					headers,
					getTableProps,
					getHeaderProps,
					getRowProps,
					getSelectionProps,
				}) => (
					<>
						<Table {...getTableProps()}>
							<TableHead>
								<TableRow>
									<TableSelectAll {...getSelectionProps()} />
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
											<TableSelectRow
												{...getSelectionProps({ row })}
												// checked={()=>selectedBatch.get(row.id)? true : false}
												onChange={() => handleRowSelect(row, itemDetails)}
											/>
											{row.cells.map((cell) => (
												<TableCell key={cell.id}>{cell.value}</TableCell>
											))}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</>
				)}
			</DataTable>
		);
	};

	const getTitle = (drug) => {
		return `${drug.drugName}/${drug.quantity}${drug.doseUnits}/${drug.frequency}/${drug.duration}${drug.durationUnits}`;
	};

	return (
		<div>
			<div className={styles.modalList}>
				<div>Qty.</div>
			</div>
			{drugItems &&
				Array.isArray(drugItems) &&
				drugItems.map((drug, index) => (
					// <div style={{ display: "flex" }}>
					<Grid>
						<Row>
							<Column
								lg={8}
								sm={2}
								style={{
									paddingTop: "1rem",
									wordWrap: "break-word",
								}}
								className={styles.itemDrugs}
							>
								<h6>{getTitle(drug)}</h6>
							</Column>
							<Column lg={4} sm={2} style={{ paddingTop: "0.5rem" }}>
								<TextInput
									style={
										getQuantity(drug) - drug.quantity < 0
											? { color: "red" }
											: {}
									}
									onChange={(e) =>
										setTotalQuantity(
											(map) =>
												new Map(
													map.set(drug.drugName, { quantity: e.target.value })
												)
										)
									}
									disabled={
										getQuantity(drug) - drug.quantity < 0 ? true : false
									}
									value={totalQuantity.get(drug.drugName)?.quantity}
								/>
							</Column>
						</Row>
					</Grid>
				))}
			{/* <Accordion align="start">
							{" "}
								<AccordionItem
									key={index}
									title={getTitle(drug)}
									disabled={
										getQuantity(drug) - drug.quantity < 0 ? true : false
									}
								>
									{renderTable(drug)}
								</AccordionItem>
						</Accordion>
						<TextInput
							// style={
							// 	getQuantity(drug) - drug.quantity < 0 ? { color: "red" } : {}
							// } */}
			{/* onChange={(e) =>
								setTotalQuantity(
									(map) =>
										new Map(
											map.set(drug.drugName, { quantity: e.target.value })
										)
								)
							}
							disabled={getQuantity(drug) - drug.quantity < 0 ? true : false}
							value={totalQuantity.get(drug.drugName)?.quantity} */}
			{/* /> */}
			{/* </div> */}
			{/* ))} */}
		</div>
	);
};

export default DrugItemDetails;
