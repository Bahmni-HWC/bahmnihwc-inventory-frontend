import {
	Button,
	DataTable,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	TableToolbarContent,
	TableToolbarSearch,
} from 'carbon-components-react';
import React, { useEffect, useState } from 'react';
import { headers } from '../../constants';
import { useItemStockContext } from '../context/item-stock-context';
import { exportToExcel } from './export-to-excel';
import styles from './inventory.module.scss';

const InventoryLandingPage = () => {
	const { itemStock } = useItemStockContext();

	const [rows, setRows] = useState([]);

	const [searchText, setSearchText] = useState('');

	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};
	const handleExportToExcel = () => exportToExcel(filteredRows);

	useEffect(() => {
		if (itemStock?.length > 0) {
			const updatedRows = [];
			for (let index = 0; index < itemStock.length; index++) {
				const item = itemStock[index];
				updatedRows.push(
					...item.details.map((detail, detailIndex) => {
						const { expiration } = detail;
						const expirationDate = new Date(expiration);
						const formattedExpirationDate = `${expirationDate
							.getDate()
							.toString()
							.padStart(2, '0')}-${(expirationDate.getMonth() + 1)
							.toString()
							.padStart(2, '0')}-${expirationDate.getFullYear()}`;
						return {
							id: `${index}-${detail.batchNumber}-${detailIndex}`,
							productName: item.item.name,
							quantity: detail.quantity ?? 0,
							expiration: expiration ? formattedExpirationDate : 'No Expiration Date',
							batchNumber: detail.batchNumber ?? 'No Batch Number',
						};
					})
				);
			}
			setRows(updatedRows);
		} else {
			setRows([]);
		}
	}, [itemStock]);

	const filteredRows = rows.filter((row) =>
		searchText !== '' ? row?.productName?.toLowerCase().includes(searchText?.toLowerCase()) : row
	);

	const isSortable = (key) => key === 'productName';

	return (
		<div className={styles.inventoryContainer}>
			<DataTable rows={filteredRows} headers={headers}>
				{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
					<>
						<TableContainer>
							<TableToolbarContent className={styles.tableToolbarContent}>
								<TableToolbarSearch value={searchText} onChange={handleSearch} />
								{rows.length > 0 && (
									<Button onClick={handleExportToExcel} kind='tertiary' size='sm'>
										Export To Excel
									</Button>
								)}
							</TableToolbarContent>
							<Table {...getTableProps()} useZebraStyles={true} className={styles.table}>
								<TableHead>
									<TableRow>
										{headers.map((header) => (
											<TableHeader
												{...getHeaderProps({
													header,
													isSortable: isSortable(header.key),
												})}
												className={header.key === 'productName' ? styles.stickyColumn : ''}
											>
												{header.header}
											</TableHeader>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.length === 0 ? (
										<TableRow style={{ fontSize: '20px' }}>
											<TableCell colSpan={headers.length}>
												Currently there are no stocks available
											</TableCell>
										</TableRow>
									) : (
										rows.map((row) => (
											<TableRow {...getRowProps({ row })}>
												{row.cells.map((cell) => (
													<TableCell
														key={cell.id}
														className={`${
															cell.id.includes('productName') ? styles.stickyColumn : ''
														} 
												}`}
													>
														{cell.value}
													</TableCell>
												))}
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</>
				)}
			</DataTable>
		</div>
	);
};

export default InventoryLandingPage;
