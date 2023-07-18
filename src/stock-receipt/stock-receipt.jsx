import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcherPost } from "../utils/api-utils";
import { saveReceipt } from "../service/save-receipt";
import {
	DataTable,
	TextInput,
	Table,
	TableHead,
	TableRow,
	TableHeader,
	TableCell,
	TableBody,
	Button,
	NumberInput,
	Loading,
	ButtonSet,
} from "carbon-components-react";

const StockReceipt = () => {
	const [value, setValue] = useState([]);
	const [outwardNumber, setOutwardNumber] = useState("");
	const [stockIntakeButtonClick, setStockIntakeButtonClick] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);

	const { data: eaushdhaResponse, error } = useSWR(
		stockIntakeButtonClick ? "/openmrs/ws/rest/v1/eaushadha/stock-receipt" : "",
		(url) => fetcherPost(url, { ouid: outwardNumber })
	);

	console.log(
		"eaushdhaResponse",
		eaushdhaResponse,
		error,
		stockIntakeButtonClick
	);

	useEffect(() => {
		if (eaushdhaResponse || error) setStockIntakeButtonClick(false);
	}, [eaushdhaResponse, error]);

	useEffect(() => {
		if (stockIntakeButtonClick) {
			setIsDisabled(true);
		}
	}, [stockIntakeButtonClick]);

	useEffect(() => {
		console.log("outwardNumber", outwardNumber);
		if (outwardNumber.length > 0) setIsDisabled(false);
	}, [outwardNumber]);

	useEffect(() => {
		if (eaushdhaResponse && eaushdhaResponse.length > 0) {
			const stockReceiptArray = [];

			for (let i = 0; i < eaushdhaResponse.length; i++) {
				var dateString = eaushdhaResponse[i].exp_date;
				var convertedDate = new Date(dateString.split("/").reverse().join("-"));
				console.log("convertedDate", convertedDate);

				const rowObj = {
					id: `${eaushdhaResponse[i].drug_id}-${i}}`,
					itemId: eaushdhaResponse[i].drug_id,
					item: eaushdhaResponse[i].drug_name,
					supplierName: eaushdhaResponse[i].supplier,
					batchNumber: eaushdhaResponse[i].batch_number,
					expiration: convertedDate
						.toLocaleDateString("en-GB")
						.split("/")
						.join("-"),
					quantity: eaushdhaResponse[i].quantity_In_Pack,
					actualQuantity: eaushdhaResponse[i].quantity_In_Units,
				};
				stockReceiptArray.push(rowObj);
			}
			setValue(stockReceiptArray);
		}
	}, [eaushdhaResponse]);

	const handleCancel = () => {
		console.log("cancel");
		const stockReceiptArray = [];
		for (let i = 0; i < eaushdhaResponse.length; i++) {
			var dateString = eaushdhaResponse[i].exp_date;
			var convertedDate = new Date(dateString.split("/").reverse().join("-"));
			console.log("convertedDate", convertedDate);

			const rowObj = {
				id: `${eaushdhaResponse[i].drug_id}-${i}}`,
				itemId: eaushdhaResponse[i].drug_id,
				item: eaushdhaResponse[i].drug_name,
				supplierName: eaushdhaResponse[i].supplier,
				batchNumber: eaushdhaResponse[i].batch_number,
				expiration: convertedDate
					.toLocaleDateString("en-GB")
					.split("/")
					.join("-"),
				quantity: eaushdhaResponse[i].quantity_In_Pack,
				actualQuantity: eaushdhaResponse[i].quantity_In_Units,
			};
			stockReceiptArray.push(rowObj);
		}
		setValue(stockReceiptArray);
	};

	const updateActualQuantity = (updatedQuantity, row) => {
		console.log("updatedQuantity", updatedQuantity, row);
		const updatedValue = value.map((item) => {
			if (item.id === row.id) {
				console.log("row...", row.id);
				return {
					...item,
					actualQuantity: updatedQuantity,
				};
			}
			return item;
		});
		setValue(updatedValue);
	};
	const handleSave = async () => {
		console.log("save");
		const reponse = await saveReceipt(value);
	};

	// const handleOnChange = () => {
	// 	const stockReceiptArray = [];
	// 	for (let i = 0; i < 10; i++) {
	// 		const rowObj = {
	// 			id: `${i}`,
	// 			item: eaushdhaResponse[i].Drug_name,
	// 			expiration: eaushdhaResponse[i].Exp_date,
	// 			batchNumber: eaushdhaResponse[i].Batch_number,
	// 			quantity: eaushdhaResponse[i].Batch_quantity,
	// 		};
	// 		stockReceiptArray.push(rowObj);
	// 	}
	// 	setValue(stockReceiptArray);
	// };
	console.log("value", value);
	const headers = [
		{ key: "itemId", header: "Item Id" },
		{ key: "item", header: "Item" },
		{ key: "supplierName", header: "Supplier Name" },
		{ key: "batchNumber", header: "Batch Number" },
		{ key: "expiration", header: "Expiration" },
		{ key: "quantity", header: "Batch Quantity" },
		{ key: "actualQuantity", header: "Total Quantity" },
	];
	console.log("isDisabled", isDisabled);
	return (
		<>
			<div>
				<div style={{ display: "flex", width: "50%", maxHeight: "3rem" }}>
					<TextInput
						id="stock-receipt"
						labelText="Outward Number"
						style={{ width: "80%" }}
						onChange={(e) => setOutwardNumber(e.target.value)}
						readOnly={outwardNumber.length == 0 ? false : isDisabled}
					/>
					<Button
						onClick={() => setStockIntakeButtonClick(true)}
						size={"sm"}
						kind="primary"
						disabled={isDisabled}
					>
						Stock Intake
					</Button>
				</div>
				{stockIntakeButtonClick && !eaushdhaResponse && !error ? (
					<Loading />
				) : (
					value &&
					value.length > 0 && (
						<DataTable rows={value} headers={headers}>
							{({
								rows,
								headers,
								getTableProps,
								getHeaderProps,
								getRowProps,
							}) => (
								<>
									{/* <TableContainer>
							<TableToolbar style={{ width: "15rem" }}>
								<TableToolbarContent style={{ justifyContent: "flex-start" }}>
									<TableToolbarSearch
										value={searchText}
										onChange={handleSearch}
									/>
								</TableToolbarContent>
							</TableToolbar> */}
									{console.log("rows", rows)}
									<Table {...getTableProps()} useZebraStyles={true}>
										<TableHead>
											<TableRow>
												{headers.map((header) => (
													<TableHeader
														{...getHeaderProps({
															header,
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
													{row.cells.map((cell) => {
														console.log("row", row);
														if (
															cell.id.includes("actualQuantity") ||
															cell.id.includes("quantity")
														)
															return (
																<TableCell key={cell.id}>
																	<NumberInput
																		size="sm"
																		id={cell.id}
																		labelText={cell.value}
																		value={cell.value}
																		onChange={(e) =>
																			updateActualQuantity(e.target.value, row)
																		}
																	/>
																</TableCell>
															);
														else
															return (
																<TableCell key={cell.id}>
																	{cell.value}
																</TableCell>
															);
													})}
												</TableRow>
											))}
										</TableBody>
									</Table>
									{/* </TableContainer> */}
								</>
							)}
						</DataTable>
					)
				)}
			</div>
			{value && value.length > 0 && (
				<ButtonSet>
					<Button kind="secondary" onClick={handleCancel}>
						Cancel
					</Button>
					<Button kind="primary" onClick={handleSave}>
						Save
					</Button>
				</ButtonSet>
			)}
		</>
	);
};

export default StockReceipt;
