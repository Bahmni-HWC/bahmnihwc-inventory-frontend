import React from 'react'
import {DataTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'carbon-components-react'
import useSWR from 'swr';


export const InventoryLandingPage = () =>{
  const rows = [
  ];
  // const {data: results, error:inventoryItemURL} = useSWR(invItemURL, fetcher)
  // console.log("results--",results,inventoryItemURL);
  
  // const secondFunction = async () => {

  // //   useSWR<
  // //   any,
  // //   Error
  // // >(invItemURL, fetcher)
  // console.log("results",results,inventoryItemURL);

  //   // if(results.data.length>0){
  //   //   console.log("inside if");
  //   //   for (let index = 0; index < results.data.length; index++) {
  //   //     console.log("index",index);
        
  //   //     const newObj = {
  //   //       productName: results.data.results[index].item.name,
  //   //       actualQuantity: results.data.results[index].quantity,
  //   //     };
  //   //     console.log("newObj",newObj);
  //   //     rows.push(newObj);
  //   //   }
  //   //   console.log(rows);
      
  //   // }
  // }

// const results ={
//   "results": [
//       {
//         "item": {
//           "uuid": "69ff5e18-574e-419d-a34b-909872b65294",
//           "name": "Dolo1",
//           "description": null,
//           "retired": false,
//           "retireReason": null,
//           "attributes": [],
//           "codes": [],
//           "department": {
//               "uuid": "7120eb81-6c72-433d-83bc-51bc044909fe",
//               "name": "Department",
//               "description": "Department",
//               "retired": false
//           },
//           "hasExpiration": false,
//           "defaultExpirationPeriod": null,
//           "hasPhysicalInventory": true,
//           "minimumQuantity": 10,
//           "prices": [
//               {
//                   "uuid": "b5e93aaf-1c31-42e2-99a4-6d0e3094ab0c",
//                   "name": "test",
//                   "description": null,
//                   "retired": false,
//                   "price": 1.00
//               }
//           ],
//           "concept": {
//               "uuid": "75143AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
//               "display": "Dolomite",
//               "links": [
//                   {
//                       "rel": "self",
//                       "uri": "https://localhost/openmrs/ws/rest/v1/concept/75143AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
//                       "resourceAlias": "concept"
//                   }
//               ]
//           },
//           "buyingPrice": null,
//           "defaultPrice": {
//               "uuid": "b5e93aaf-1c31-42e2-99a4-6d0e3094ab0c",
//               "name": "test",
//               "description": null,
//               "retired": false,
//               "price": 1.00
//           },
//           "resourceVersion": "1.8"
//       },
//       "expiration": null,
//       "quantity": 10,
//       "actualQuantity": null
//       },
//       {
//         "item": {
//           "uuid": "69ff5e18-574e-419d-a34b-909872b65293",
//           "name": "Dolo2",
//           "description": null,
//           "retired": false,
//           "retireReason": null,
//           "attributes": [],
//           "codes": [],
//           "department": {
//               "uuid": "7120eb81-6c72-433d-83bc-51bc044909fe",
//               "name": "Department",
//               "description": "Department",
//               "retired": false
//           },
//           "hasExpiration": false,
//           "defaultExpirationPeriod": null,
//           "hasPhysicalInventory": true,
//           "minimumQuantity": 10,
//           "prices": [
//               {
//                   "uuid": "b5e93aaf-1c31-42e2-99a4-6d0e3094ab0c",
//                   "name": "test",
//                   "description": null,
//                   "retired": false,
//                   "price": 1.00
//               }
//           ],
//           "concept": {
//               "uuid": "75143AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
//               "display": "Dolomite",
//               "links": [
//                   {
//                       "rel": "self",
//                       "uri": "https://localhost/openmrs/ws/rest/v1/concept/75143AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
//                       "resourceAlias": "concept"
//                   }
//               ]
//           },
//           "buyingPrice": null,
//           "defaultPrice": {
//               "uuid": "b5e93aaf-1c31-42e2-99a4-6d0e3094ab0c",
//               "name": "test",
//               "description": null,
//               "retired": false,
//               "price": 1.00
//           },
//           "resourceVersion": "1.8"
//       },
//       "expiration": null,
//       "quantity": 10,
//       "actualQuantity": null
//       },
//   ],
//   "length": 1
// }
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
      {/* <DataTable rows={rows} headers={headers}>
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
      </DataTable> */}
    </div>
  )
}
