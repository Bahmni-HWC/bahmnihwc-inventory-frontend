import React from 'react'
import {DataTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'carbon-components-react'
import useSWR from 'swr';
import { fetcher, invItemURL } from '../utils/api-utils';


export const InventoryLandingPage = () =>{
  const rows = [
  ];
  // const {data: results, error:inventoryItemError} = useSWR(invItemURL, fetcher)
  // add fetcher function to get data from api from invItemURL
  
  console.log("results--",results,inventoryItemError);
  
console.log('res',results.results.length);

// if(results.results.length>0){
//     console.log("inside if");
//     for (let index = 0; index < results.results.length; index++) {
//       console.log("index",index);;
//       const newObj = {
//         id:index,
//         productName: results.results[index].item.name,
//         actualQuantity: results.results[index].quantity,
//       };
//       console.log("newObj",newObj);
//       rows.push(newObj);
//     }
//     console.log(rows);
// }

const headers = [
  {
    key: 'productName',
    header: 'Product Name',
  },
  {
    key: 'actualQuantity',
    header: 'Actual Quantity',
  },
];
  return (
    <div>
      <h1>Inside</h1>
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </div>
  )
}
