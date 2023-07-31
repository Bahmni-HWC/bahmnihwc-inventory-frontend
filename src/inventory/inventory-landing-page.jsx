import {
    DataTable,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch,
} from "carbon-components-react";
import React, { useState, useEffect } from "react";
import { headers } from "../../constants";
import { useItemStockContext } from "../context/item-stock-context";
import styles from "./inventory.module.scss";
import { Button } from "carbon-components-react";
import { exportToExcel } from "./export-to-excel";

import getFormattedDate from "../utils/date-utils";

export const InventoryLandingPage = () => {
    const [rows, setRows] = useState([]);
    const { itemStock } = useItemStockContext();

    const [searchText, setSearchText] = useState("");

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };
    const handleExportToExcel = () => exportToExcel(filteredRows);

    useEffect(() => {
        if (itemStock?.length > 0) {
            for (let index = 0; index < itemStock.length; index++) {
                const item = itemStock[index];
                const formattedExpirationDate = getFormattedDate;
                const updatedRows = item.details.map((detail, detailIndex) => {
                    const expiration = detail.expiration;
                    const expirationDate = new Date(expiration);
                    const formattedExpirationDate = `${expirationDate.getDate().toString().padStart(2, "0")}-${(expirationDate.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}-${expirationDate.getFullYear()}`;
                    const rowDetails = {
                        id: `${index}-${detail.batchNumber}-${detailIndex}`, // Use a unique identifier for each row
                        productName: item.item.name,
                        quantity: detail.quantity ?? 0,
                        expiration: expiration ? formattedExpirationDate : "No Expiration Date",
                        batchNumber: detail.batchNumber ?? "No Batch Number",
                      };
                })
                setRows((prevState) => {
                    return [...prevState, ...updatedRows]
                });
              }
            }
    }, [itemStock])

    const filteredRows = rows.filter((row) =>
      searchText !== ""
        ? row?.productName?.toLowerCase().includes(searchText?.toLowerCase())
        : row
    );

    const isSortable = (key) => key === "productName";

    return (
        <div className={styles.inventoryContainer}>
            <DataTable rows={filteredRows} headers={headers}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <>
                        <TableContainer>
                            <TableToolbarContent className={styles.tableToolbarContent}>
                                <TableToolbarSearch
                                    value={searchText}
                                    onChange={handleSearch}
                                />
                                {rows.length > 0 && (
                                    <Button
                                        onClick={handleExportToExcel}
                                        kind="tertiary"
                                        size="sm"
                                    >
                                        Export To Excel
                                    </Button>
                                )}
                            </TableToolbarContent>
                            <Table
                                {...getTableProps()}
                                useZebraStyles={true}
                                className={styles.table}
                            >
                                <TableHead>
                                    <TableRow>
                                        {headers.map((header) => (
                                            <TableHeader
                                                {...getHeaderProps({
                                                    header,
                                                    isSortable: isSortable(header.key),
                                                })}
                                                className={
                                                    header.key === "productName"
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
                                    {rows.length === 0 ? (
                                        <TableRow style={{ fontSize: "20px" }}>
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
                                                            cell.id.includes("productName")
                                                                ? styles.stickyColumn
                                                                : ""
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