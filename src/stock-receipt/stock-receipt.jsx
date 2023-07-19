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
import { stockReceiptHeaders } from "../../constants";

const StockReceipt = () => {
	const [items, setItems] = useState([]);
	const [outwardNumber, setOutwardNumber] = useState("");
	const [stockIntakeButtonClick, setStockIntakeButtonClick] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const [receivedResponse, setReceivedResponse] = useState();

	const { data: eaushdhaResponse, error } = useSWR(
		stockIntakeButtonClick ? "/openmrs/ws/rest/v1/eaushadha/stock-receipt" : "",
		(url) => fetcherPost(url, { ouid: outwardNumber })
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
		if (outwardNumber.length > 0) setIsDisabled(false);
	}, [outwardNumber]);

	useEffect(() => {
		if (eaushdhaResponse && eaushdhaResponse.length > 0) {
			setItems(getRowObj(eaushdhaResponse));
			setReceivedResponse(eaushdhaResponse);
		}
	}, [eaushdhaResponse]);

	const getRowObj = (response) => {
		const stockReceiptArray = [];
		for (let i = 0; i < response.length; i++) {
			const dateString = response[i].exp_date;
			const convertedDate = new Date(dateString.split("/").reverse().join("-"));
			const rowObj = {
				id: `${response[i].drug_id}-${i}}`,
				itemId: response[i].drug_id,
				item: response[i].drug_name,
				supplierName: response[i].supplier,
				batchNumber: response[i].batch_number,
				expiration: convertedDate
					.toLocaleDateString("en-GB")
					.split("/")
					.join("-"),
				quantity: response[i].quantity_In_Pack,
				totalQuantity: response[i].quantity_In_Units,
				unitPack: response[i].unitPack,
			};
			stockReceiptArray.push(rowObj);
		}
		return stockReceiptArray;
	};

	const handleCancel = () => {
		setItems(getRowObj(receivedResponse));
	};

	const updateActualQuantity = (quantity, row, cell) => {
		const updatedValue = items.map((item) => {
			if (item.id === row.id) {
				if (cell.includes("totalQuantity")) {
					return {
						...item,
						totalQuantity: quantity,
					};
				} else {
					return {
						...item,
						quantity: quantity,
						totalQuantity: getCalculatedQuantity(quantity, item.unitPack),
					};
				}
			}
			return item;
		});
		setItems(updatedValue);
	};

	const getCalculatedQuantity = (quantity, unitPack) => {
		const unitPackValue = unitPack?.split("x");
		let unitPackQuantity = 1;
		unitPackValue.forEach((element) => {
			unitPackQuantity = unitPackQuantity * element;
		});
		return unitPackQuantity * quantity;
	};

	const handleSave = async () => {
		const reponse = await saveReceipt(items);
	};

	return (
		<>
			<div>
				<div style={{ display: "flex", width: "50%" }}>
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
						Stock Fetch
					</Button>
				</div>
				{stockIntakeButtonClick && !eaushdhaResponse && !error ? (
					<Loading />
				) : (
					items &&
					items.length > 0 && (
						<DataTable rows={items} headers={stockReceiptHeaders}>
							{({
								rows,
								headers,
								getTableProps,
								getHeaderProps,
								getRowProps,
							}) => (
								<>
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
														if (
															cell.id.includes("totalQuantity") ||
															cell.id.includes("quantity")
														) {
															return (
																<TableCell key={cell.id}>
																	<TextInput
																		size="sm"
																		id={cell.id}
																		value={cell.value}
																		invalid={isNaN(cell.value)}
																		invalidText="Please enter a valid number"
																		labelText={''}
																		onChange={(e) =>
																			updateActualQuantity(
																				e.target.value,
																				row,
																				cell.id
																			)
																		}
																	/>
																</TableCell>
															);
														} else
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
								</>
							)}
						</DataTable>
					)
				)}
			</div>
			{items && items.length > 0 && (
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
