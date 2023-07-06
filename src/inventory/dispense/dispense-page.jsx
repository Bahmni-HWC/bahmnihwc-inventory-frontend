import React, { useState } from "react";
import {
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
	TableToolbarSearch,
} from "carbon-components-react";
import useSWR from "swr";
import { fetcher, invItemURL, activePatientWithDrugOrders } from "../../utils/api-utils";
import {locationCookieName, dispenseHeaders, activePatients } from "../../../constants";
import { useCookies } from "react-cookie";


export const DispensePage = () => {
	let rows = [];
    const [cookies] = useCookies();
	const { data: items, error: inventoryItemError } = useSWR(
		activePatientWithDrugOrders(cookies[locationCookieName]?.uuid),
		fetcher
	);

	const [searchText, setSearchText] = useState("");

	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};

    if(Array.isArray(items)) {
        rows = items.map((item) => {
            return {
                item,
                id:item.uuid,
                patientName: item.name,
                patientId: item.identifier,

            }
        })

    }
    console.log("item...", items);
	const filteredRows = rows.filter((row) => {
		console.log(
			"first",
			row?.patientName,
			searchText,
			row?.patientName?.toLowerCase().includes(searchText?.toLowerCase())
		);
		return searchText !== ""
			? row?.patientName?.toLowerCase().includes(searchText?.toLowerCase())
			: row;
	});


	const isSortable = (key) => key === "patientName";

    const handleRowClick = (row) => {
        console.log("row click ", row);
    }

	if (items == undefined && inventoryItemError == undefined)
		return <div>Loading...</div>;

	return inventoryItemError ? (
		<div>Something went wrong while fetching items</div>
	) : (

		<div className="inv-datatable" style={{width:'50%'}}>
		<h5 style={{paddingBottom:'1rem'}}>{activePatients}</h5>
			<DataTable rows={filteredRows} headers={dispenseHeaders} stickyHeader={true}>
				{({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
					<>
						<TableContainer >
						<TableToolbar style={{ width: "15rem"}}  >
							<TableToolbarContent style={{ justifyContent: "flex-start" }}>
								<TableToolbarSearch
									value={searchText}
									onChange={handleSearch}
								/>
							</TableToolbarContent>
						</TableToolbar>
						<Table {...getTableProps()} >
							<TableHead>
								<TableRow >
									{headers.map((header) => (
										<TableHeader
											{...getHeaderProps({
												header,
												isSortable: isSortable(header.key),
											})}
										>
											{header.header}
										</TableHeader>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow {...getRowProps({ row })} onClick={()=>handleRowClick(row)}>
										{row.cells.map((cell) => (
											<TableCell key={cell.id}> {
											cell.info.header === "patientName" ?
											<a href="#">{cell.value}</a>:cell.value}</TableCell>
										))}

									</TableRow>
								))}
							</TableBody>
						</Table>
						</TableContainer>
					</>
				)}
			</DataTable>
		</div>
	);
};
