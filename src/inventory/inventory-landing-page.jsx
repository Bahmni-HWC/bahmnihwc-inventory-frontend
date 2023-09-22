import {
  Button,
  DataTable,
  Link,
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
import { inventoryDetailItemsHeaders, inventoryHeaders } from '../../constants';
import TableModal from '../components/BasicTableModal';
import { useItemStockContext } from '../context/item-stock-context';
import { exportToExcel } from './export-to-excel';
import styles from './inventory.module.scss';
import { LoadStock } from '../components/LoadStock';

const InventoryLandingPage = (props) => {
  const { itemStock } = useItemStockContext();

  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');

  const [searchText, setSearchText] = useState('');

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };
  const handleExportToExcel = () => exportToExcel(filteredRows);

  useEffect(() => {
    if (itemStock?.length > 0) {
      const updatedRows = [];

      updatedRows.push(
        ...itemStock.map((item, index) => ({
          id: `${index}`,
          productName: item.item.name,
          quantity: item.quantity ?? 0,
        })),
      );
      setRows(updatedRows);
    } else {
      setRows([]);
    }
  }, [itemStock]);

  const getItemDetails = (productName) => {
    if (itemStock?.length > 0) {
      const item = itemStock.find((itemObject) => itemObject.item.name === productName);
      const updatedRows = item.details.map((detail, detailIndex) => {
        const { expiration } = detail;
        const expirationDate = new Date(expiration);
        const formattedExpirationDate = `${expirationDate.getDate().toString().padStart(2, '0')}-${(
          expirationDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${expirationDate.getFullYear()}`;
        return {
          id: `${detail.batchNumber}-${detailIndex}`,
          productName: item.item.name,
          quantity: detail.quantity ?? 0,
          expiration: expiration ? formattedExpirationDate : 'No Expiration Date',
          batchNumber: detail.batchNumber ?? 'No Batch Number',
        };
      });
      return updatedRows;
    }
  };

  const filteredRows = rows.filter((row) =>
    searchText !== '' ? row?.productName?.toLowerCase().includes(searchText?.toLowerCase()) : row,
  );

  const isSortable = (key) => key === 'productName';

  const handleClick = (productName) => {
    setSelectedProductName(productName);
    setShowModal(true);
  };

  return (
    <div className={styles.inventoryContainer}>
      <DataTable rows={filteredRows} headers={inventoryHeaders}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <>
          <div className={styles.inventoryContentContainer}>
            <LoadStock setReloadData={props.setReloadData}></LoadStock>
            <TableContainer>
              <TableToolbarContent className={styles.tableToolbarContent}>
                <TableToolbarSearch value={searchText} onChange={handleSearch}/>
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
                            {cell.id.includes('productName') ? (
                              <Link href='#' onClick={() => handleClick(cell.value)}>
                                {cell.value}
                              </Link>
                            ) : (
                              <>{cell.value}</>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          </>
        )}
      </DataTable>
      {showModal && (
        <TableModal
          showModal={showModal}
          headers={inventoryDetailItemsHeaders}
          rows={getItemDetails(selectedProductName)}
          closeModal={() => setShowModal(false)}
          stickyColumnName={'productName'}
          title={`Stock Details for ${selectedProductName}`}
        />
      )}
    </div>
  );
};

export default InventoryLandingPage;
