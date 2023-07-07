import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcherPost } from "../utils/api-utils";
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
} from "carbon-components-react";

const StockReceipt = () => {
	const [value, setValue] = useState([]);
	const [outwardNumber, setOutwardNumber] = useState("");
	const [stockIntakeButtonClick, setStockIntakeButtonClick] = useState(false);

	const { data: eaushdhaResponse, error } = useSWR(
		stockIntakeButtonClick ? "/openmrs/ws/rest/v1/eaushadha/stock-receipt" : "",
		fetcherPost
	);

	console.log("eaushdhaResponse", eaushdhaResponse, error);

	useEffect(() => {
		if (eaushdhaResponse && eaushdhaResponse.length > 0) {
			const stockReceiptArray = [];
			for (let i = 0; i < 10; i++) {
				const rowObj = {
					id: `${i}`,
					item: eaushdhaResponse[i].Drug_name,
					expiration: eaushdhaResponse[i].Exp_date,
					batchNumber: eaushdhaResponse[i].Batch_number,
					quantity: eaushdhaResponse[i].Batch_quantity,
				};
				stockReceiptArray.push(rowObj);
			}
			setValue(stockReceiptArray);
		}
	}, [eaushdhaResponse]);

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
		{ key: "item", header: "Item" },
		{ key: "expiration", header: "Expiration" },
		{ key: "batchNumber", header: "Batch Number" },
		{ key: "quantity", header: "Quantity" },
		{ key: "actualQuantity", header: "Actual Quantity" },
	];
	return (
		<div>
			<div style={{ display: "flex", width: "50%" }}>
				<TextInput
					id="stock-receipt"
					labelText="Outward Number"
					style={{ width: "80%" }}
					onChange={(e) => setOutwardNumber(e.target.value)}
				/>
				<Button onClick={() => setStockIntakeButtonClick(true)} kind="primary">
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
													if (cell.id.includes("actualQuantity"))
														return (
															<TableCell key={cell.id}>
																<NumberInput
																	size="sm"
																	id={cell.id}
																	labelText={cell.value}
																/>
															</TableCell>
														);
													else
														return (
															<TableCell key={cell.id}>{cell.value}</TableCell>
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
	);
};

export default StockReceipt;
