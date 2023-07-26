import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcherPost, stockReceiptURL, getRequest, fetcher, stockRoomURL } from "../utils/api-utils";
import saveReceipt from '../service/save-receipt';


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
	Loading,
	ButtonSet,
	Grid,
	Column,
	Row,
	ToastNotification,
	TableContainer,
	Modal,
} from "carbon-components-react";
import {
	failureMessage,
	stockReceiptHeaders,
	successMessage,
} from "../../constants";
import styles from "./stock-receipt.module.scss";
import { getCalculatedQuantity, getStockReceiptObj } from "./eaushadha-response-mapper";
import { headers, locationCookieName } from "../../constants";
import { useCookies } from "react-cookie";



const StockReceipt = () => {
	const [items, setItems] = useState([]);
	const [outwardNumber, setOutwardNumber] = useState("");
	const [stockIntakeButtonClick, setStockIntakeButtonClick] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const [receivedResponse, setReceivedResponse] = useState();
	const [onSuccesful, setOnSuccesful] = useState(false);
	const [onFailure, setOnFailure] = useState(false);
	const [stockReceiptError, setStockReceiptError] = useState();

	const { data: eaushdhaResponse, error } = useSWR(
		stockIntakeButtonClick ? stockReceiptURL : "",
		(url) => fetcherPost(url, { ouid: outwardNumber })
	);
	const [cookies] = useCookies();

    const { data: stockRoom, error: stockRoomError } = useSWR(
    		stockRoomURL(cookies[locationCookieName]?.name.trim()),
    		fetcher
    	);

	const [showModal, setShowModal] = useState(false);
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
			setItems(getStockReceiptObj(eaushdhaResponse));
			setReceivedResponse(eaushdhaResponse);
		}
		if (error) setStockReceiptError(error);
	}, [eaushdhaResponse, error]);

	useEffect(() => {
		if (onSuccesful) {
			setItems([]);
			setReceivedResponse([]);
			setStockIntakeButtonClick(false);
			setIsDisabled(true);
			setOutwardNumber("");
		}
	}, [onSuccesful]);

	const handleCancel = () => {
		setItems(getStockReceiptObj(receivedResponse));
	};

	const updateActualQuantity = (quantity, row, cell) => {
		const updatedValue = items.map((item) => {
			if (item.id === row.id) {
				if (cell.includes("totalQuantity")) {
					return {
						...item,
						totalQuantity: parseInt(quantity),
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
		const handleSave = async () => {
         try {
                    const response = await saveReceipt(items, outwardNumber, stockRoom.results[0]?.uuid);
                      if (response && response.ok) {
                        setOnSuccesful(true);
                      } else {
                        setOnFailure(true);
                      }
                    } catch (error) {
                      setOnFailure(true);
                    }

            	};



	const renderNotificationMessage = (kind, title) => {
		return (
			<ToastNotification
				kind={kind}
				lowContrast={true}
				title={title}
				timeout={5000}
				onClose={() => {
					setOnSuccesful(false);
					setOnFailure(false);
				}}
			/>
		);
	};
	const handleCloseModal = () => {
		setShowModal(false);
	};

	const [rows, setRows] = useState([
		{ id: 1, drugName: "", batchNo: "", expiryDate: "", quantity: 0, totalQuantity: 0 },
	]);
	
	const handleAddRow = () => {
		setRows((prevRows) => [
		...prevRows,
		{ id: prevRows.length + 1, drugName: "", batchNo: "", expiryDate: "", quantity: 0, totalQuantity: 0 },
		]);
	};

	const handleDeleteRow = (id) => {
	setRows((prevRows) => prevRows.filter((row) => row.id !== id));
	};
	
	const handleInputChange = (id, field, value) => {
	setRows((prevRows) =>
		prevRows.map((row) =>
		row.id === id ? { ...row, [field]: value } : row
		)
	);
	};

	return (
		<>
			<Grid style={{ paddingLeft: "0", margin: "0" }}>
				<Column lg={16}>
					<Column lg={3}>
						{onSuccesful &&
							renderNotificationMessage("success", successMessage)}
						{onFailure && renderNotificationMessage("error", failureMessage)}
					</Column>
					<Row>
						<Column sm={8} lg={4}>
							<TextInput
								id="stock-receipt"
								labelText="Outward Number"
								value={outwardNumber}
								style={{ width: "80%" }}
								onChange={(e) => setOutwardNumber(e.target.value)}
								disabled={outwardNumber.length == 0 ? false : isDisabled}
							/>
						</Column>
						<Column sm={8} lg={4} style={{ paddingTop: "1.5rem" }}>
							<Button
								onClick={() => setStockIntakeButtonClick(true)}
								size={"md"}
								kind="primary"
								disabled={isDisabled}
								className={!isDisabled ? styles.buttonColor : ""}
							>
								Stock Fetch
							</Button>
						</Column>
						<Column sm={8} lg={4} style={{ paddingTop: "1.5rem" }}>
							<Button
								onClick={() =>{setShowModal(true)}}
								size={"md"}
								kind="primary"
								// disabled={isDisabled}
								className={!isDisabled ? styles.buttonColor : ""}
							>
								Add New Drug
							</Button>
							{showModal &&
							<Modal open={showModal} onRequestClose={handleCloseModal} primaryButtonText="Save" secondaryButtonText="Cancel" > 
								    <DataTable
									rows={rows}
									headers={["ID", "Drug Name", "Batch No", "Expiry Date", "Quantity", "Total Quantity", "Actions"]}
									render={({ rows, headers, getHeaderProps }) => (
									<TableContainer title="Add New Drug">
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
											<TableRow key={row.id}>
											<TableCell>{row.id}</TableCell>
											<TableCell>
											<TextInput
												id={`drugName-${row.id}`}
												value={row.drugName}
												onChange={(e) =>
													handleInputChange(row.id, "drugName", e.target.value)
												}
												style={{ width: "220px" }} // Set custom width here

												/>
											</TableCell>
											<TableCell>
												<TextInput
												id={`batchNo-${row.id}`}
												value={row.batchNo}
												onChange={(e) =>
													handleInputChange(row.id, "batchNo", e.target.value)
												}
												style={{ width: "100px" }}
												/>
											</TableCell>
											<TableCell>
											<TextInput
												id={`expiryDate-${row.id}`}
												value={row.expiryDate}
												placeholder="dd/mm/yyyy"
												onChange={(e) =>
													handleInputChange(row.id, "expiryDate", e.target.value)
												}
												style={{ width: "100px" }}
												/>
											</TableCell>
											<TableCell>
												<TextInput
												type="number"
												id={`quantity-${row.id}`}
												value={row.quantity}
												onChange={(e) =>
													handleInputChange(row.id, "quantity", e.target.valueAsNumber)
												}
												/>
											</TableCell>
											<TableCell>
												<TextInput
												type="number"
												id={`totalQuantity-${row.id}`}
												value={row.totalQuantity}
												onChange={(e) =>
													handleInputChange(row.id, "totalQuantity", e.target.valueAsNumber)
												}
												/>
											</TableCell>
											<TableCell>
												<Button
												kind="ghost"
												onClick={() => handleDeleteRow(row.id)}
												size="small"
												>
												-
												</Button>

											</TableCell>
											</TableRow>
										))}
										</TableBody>
									</Table>
									<Button
										kind="ghost"
										onClick={handleAddRow}
										size="small"
										>
										+
										</Button>
									</TableContainer>
									)}
									/>
							</Modal>
							}
						</Column>
					</Row>
					{stockReceiptError && <div style={{paddingTop:'1rem'}}>Something went wrong</div>}
					{stockIntakeButtonClick && !eaushdhaResponse && !error ? (
						<Loading />
					) : (
						items &&
						items.length > 0 && (
							<Column sm={16} style={{ paddingTop: "1rem" }}>
								<div className={styles.stockReceiptTable}>
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
																	className={
																		header.key === "item"
																			? styles.stickyColumn
																			: ""
																	}
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
																					labelText={""}
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
																			<TableCell
																				key={cell.id}
																				className={
																					cell.id.includes("item")
																						? styles.stickyColumn
																						: ""
																				}
																			>
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
								</div>
							</Column>
						)
					)}

					{items && items.length > 0 && (
						<ButtonSet className={styles.buttonSet}>
							<Button kind="secondary" onClick={handleCancel}>
								Cancel
							</Button>
							<Button
								kind="primary"
								onClick={handleSave}
								className={styles.buttonColor}
							>
								Save
							</Button>
						</ButtonSet>
					)}
				</Column>
			</Grid>
		</>
	);
};

export default StockReceipt;
