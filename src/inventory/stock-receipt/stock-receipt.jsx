import { Add16, Subtract16 } from '@carbon/icons-react';
import {
  Button,
  ButtonSet,
  Column,
  ComboBox,
  DataTable,
  DatePicker,
  DatePickerInput,
  Grid,
  Loading,
  Modal,
  Row,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TextInput,
} from 'carbon-components-react';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';
import saveReceipt from '../../service/save-receipt';
import {
  fetcher,
  fetcherPost,
  invItemURL,
  inventoryItemURL,
  stockReceiptURL,
  stockRoomURL
} from '../../utils/api-utils';

import {
  failureMessage,
  locationCookieName,
  stockReceiptHeaders,
  successMessage
} from '../../../constants';
import styles from './stock-receipt.module.scss';

import { ResponseNotification } from '../../components/notifications/response-notification';
import { getDatePattern } from '../../utils/date-utils';
import {
  getCalculatedQuantity,
  getLoadStockObj,
  getStockReceiptObj,
} from './eaushadha-response-mapper';

const StockReceipt = () => {
  const [items, setItems] = useState([]);
  const [addDrugItems, setAddDrugItems] = useState([]);
  const [outwardNumber, setOutwardNumber] = useState('');
  const [stockIntakeButtonClick, setStockIntakeButtonClick] = useState(false);
  const [isOutwardNumberDisabled, setIsOutwardNumberDisabled] = useState(true);
  const [isLoadStockDisabled, setIsLoadStockDisabled] = useState(true);
  const [isFetchStockDisabled, setIsFetchStockDisabled] = useState(true);
  const [receivedResponse, setReceivedResponse] = useState();
  const [onSuccesful, setOnSuccesful] = useState(false);
  const [onFailure, setOnFailure] = useState(false);
  const [stockReceiptError, setStockReceiptError] = useState();
  const [stockEmptyResonseMessage, setStockEmptyResonseMessage] = useState(false);

  const { data: eaushdhaResponse, error } = useSWR(
    stockIntakeButtonClick ? stockReceiptURL : '',
    (url) => fetcherPost(url, { ouid: outwardNumber }),
  );

  const [cookies] = useCookies();

  const { data: stockRoom, error: stockRoomError } = useSWR(
    stockRoomURL(cookies[locationCookieName]?.name.trim()),
    fetcher,
  );

  let dropdownItems = [];

  const { data: inventoryItems, error: inventoryItemsError } = useSWR(inventoryItemURL(), fetcher);

  let totalInventoryItems = inventoryItems?.length;

  const { data: invItems, error: inventoryItemError } = useSWR(
    invItemURL(totalInventoryItems),
    fetcher,
  );

  if (invItems?.results?.length > 0) {
    for (let index = 0; index < invItems.results.length; index++) {
      dropdownItems.push(invItems.results[index].name);
    }
  }
  const [rows, setRows] = useState([
    { id: 1, drugName: '', batchNo: '', expiryDate: '', quantity: 0, totalQuantity: 0 },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);

  useEffect(() => {
    const hasEmptyOrNegativeFields = rows.some(
      (row) => !row.drugName || !row.batchNo || !row.expiryDate || !row.totalQuantity || row.totalQuantity <= 0,
    );
    setSaveButtonDisabled(hasEmptyOrNegativeFields);
  }, [rows]);

  useEffect(() => {
    if (eaushdhaResponse || error) setStockIntakeButtonClick(false);
  }, [eaushdhaResponse, error]);

  useEffect(() => {
    if (outwardNumber.length > 0) {
      setIsLoadStockDisabled(true);
      setIsOutwardNumberDisabled(false);
      setIsFetchStockDisabled(false);
    } else {
      setIsLoadStockDisabled(false);
      setIsOutwardNumberDisabled(false);
      setIsFetchStockDisabled(true);
    }

    if (items.length > 0) {
      setIsLoadStockDisabled(true);
      setIsOutwardNumberDisabled(true);
      setIsFetchStockDisabled(true);
    }
  }, [items, outwardNumber]);

  useEffect(() => {
    if (eaushdhaResponse && eaushdhaResponse.length > 0) {
      setItems(getStockReceiptObj(eaushdhaResponse));
      setReceivedResponse(eaushdhaResponse);
    }
    if (eaushdhaResponse && eaushdhaResponse.length === 0) {
      setStockEmptyResonseMessage(true);
    }
    if (error) setStockReceiptError(error);
  }, [eaushdhaResponse, error]);

  useEffect(() => {
    if (onSuccesful) {
      setItems([]);
      setReceivedResponse([]);
      setStockIntakeButtonClick(false);
      setIsOutwardNumberDisabled(true);
      setOutwardNumber('');
    }
  }, [onSuccesful]);

  const handleCancel = () => {
    setItems(getStockReceiptObj(receivedResponse));
  };

  const updateActualQuantity = (quantity, row, cell) => {
    const updatedValue = items.map((item) => {
      if (item.id === row.id) {
        if (cell.includes('totalQuantity')) {
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

  const handleSaveDrugButtonClick = async () => {
    try {
      await setAddDrugItems(getLoadStockObj(rows));
      setShowModal(false);
    } catch (error) {
      console.error('An error occurred:', error);
      return;
    }
  };

  useEffect(() => {
    const saveData = async () => {
      try {
        const response = await saveReceipt(addDrugItems, outwardNumber, stockRoom.results[0]?.uuid);
        if (response) {
          response.ok ? setOnSuccesful(true) : setOnFailure(true);
        }
      } catch (error) {
        console.error('An error occurred during saveReceipt:', error);
      }
    };

    if (addDrugItems.length > 0) {
      saveData();
    }
  }, [addDrugItems, outwardNumber]);

  const setOnSuccessAndFailure =(status) => {
    setOnSuccesful(status);
    setOnFailure(status);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { id: prevRows.length + 1, drugName: '', batchNo: '', expiryDate: '', totalQuantity: 0 },
    ]);
  };

  const handleDeleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleComboBoxChange = (rowId, selectedValue) => {
    setRows((prevRows) => prevRows.map((row) => {
        if (row.id === rowId) {
          return { ...row, drugName: selectedValue };
        }
        return row;
      }));
  };

  const handleInputChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const currentDate = new Date();

  const filterItems = (menu) => menu?.item?.toLowerCase().includes(menu?.inputValue?.toLowerCase());

  return (
    <>
      <Grid style={{ paddingLeft: '0', margin: '0' }}>
        <Column lg={16}>
          <Column lg={3}>
            {onSuccesful && ResponseNotification('success','Success', successMessage, setOnSuccessAndFailure)}
            {onFailure && ResponseNotification('error','Error',failureMessage,  setOnSuccessAndFailure)}
          </Column>
          <Row>
            <Column sm={8} lg={4}>
              <TextInput
                id="stock-receipt"
                labelText="Outward Number"
                value={outwardNumber}
                style={{ width: '80%' }}
                onChange={(e) => setOutwardNumber(e.target.value)}
                disabled={isOutwardNumberDisabled}
              />
            </Column>
            <Column sm={8} lg={4} style={{ paddingTop: '1.5rem' }}>
              <Button
                onClick={() => setStockIntakeButtonClick(true)}
                size={'md'}
                kind="primary"
                disabled={isFetchStockDisabled}
                className={!isFetchStockDisabled ? styles.buttonColor : ''}
              >
                Stock Fetch
              </Button>
            </Column>
            <Column sm={8} lg={4} style={{ paddingTop: '1.5rem' }}>
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
                size={'md'}
                kind="primary"
                disabled={isLoadStockDisabled}
                className={!isLoadStockDisabled ? styles.buttonColor : ''}
              >
                Load Stock
              </Button>
              {showModal && (
                <Modal
                  className="add-drug-modal"
                  open={showModal}
                  onRequestClose={handleCloseModal}
                  size="lg"
                  primaryButtonText="Save"
                  secondaryButtonText="Cancel"
                  onRequestSubmit={handleSaveDrugButtonClick}
                  primaryButtonDisabled={isSaveButtonDisabled}
                  modalHeading="Add New Drug"
                >
                  <DataTable
                    rows={rows}
                    headers={[
                      'S.No',
                      'Drug Name',
                      'Batch No',
                      'Expiry Date',
                      'Total Quantity',
                      'Actions',
                    ]}
                    render={({ rows, headers, getHeaderProps }) => (
                      <TableContainer id="stock-table-container">
                        <Table className={styles.addStocktable}>
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
                                  <ComboBox
                                    items={dropdownItems}
                                    shouldFilterItem={filterItems}
                                    selectedItem={row.drugName}
                                    onChange={(selectedItem) =>
                                      handleComboBoxChange(row.id, selectedItem)
                                    }
                                    style={{ width: '270px' }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextInput
                                    id={`batchNo-${row.id}`}
                                    className={styles.batchNumberInput}
                                    value={row.batchNo}
                                    onChange={(e) =>
                                      handleInputChange(row.id, 'batchNo', e.target.value)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <DatePicker
                                    datePickerType="single"
                                    id={`expiryDate-${row.id}`}
                                    dateFormat="d/m/Y"
                                    value={row.expiryDate}
                                    minDate={currentDate}
                                    onChange={(date) =>
                                      handleInputChange(row.id, 'expiryDate', date[0])
                                    }
                                  >
                                    <DatePickerInput
                                      value={row.expiryDate}
                                      onChange={(e) =>
                                        handleInputChange(row.id, 'expiryDate', e.target.value)
                                      }
                                      pattern={getDatePattern}
                                    />
                                  </DatePicker>
                                </TableCell>
                                <TableCell>
                                  <TextInput
                                    type="number"
                                    id={`totalQuantity-${row.id}`}
                                    className={styles.totalQuantityInput}
                                    value={row.totalQuantity}
                                    onChange={(e) =>
                                      handleInputChange(
                                        row.id,
                                        'totalQuantity',
                                        e.target.valueAsNumber,
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    kind="danger--tertiary"
                                    renderIcon={Subtract16}
                                    className={styles.iconButton}
                                    onClick={() => handleDeleteRow(row.id)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Button
                          kind="tertiary"
                          renderIcon={Add16}
                          className={`${styles.iconButton} ${styles.plusButton}`}
                          onClick={handleAddRow}
                        />
                      </TableContainer>
                    )}
                  />
                </Modal>
              )}
            </Column>
          </Row>
          {stockReceiptError && (
            <h3 style={{ paddingTop: '1rem' }}>
              {ResponseNotification('error', 'Error', 'Something went wrong while fetching URL')}
            </h3>
          )}
          {stockEmptyResonseMessage && (
            <div style={{ paddingTop: '20px' }}>
              {ResponseNotification(
                'info',
                'info',
                'No data is received for the outward number. Could you please retry?',
              )}
            </div>
          )}
          {stockIntakeButtonClick && !eaushdhaResponse && !error ? (
            <Loading />
          ) : (
            items &&
            items.length > 0 && (
              <Column sm={16} style={{ paddingTop: '1rem' }}>
                <div className={styles.stockReceiptTable}>
                  <DataTable rows={items} headers={stockReceiptHeaders}>
                    {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                      <>
                        <Table {...getTableProps()} useZebraStyles={true}>
                          <TableHead>
                            <TableRow>
                              {headers.map((header) => (
                                <TableHeader
                                  {...getHeaderProps({
                                    header,
                                  })}
                                  className={header.key === 'item' ? styles.stickyColumn : ''}
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
                                    cell.id.includes('totalQuantity') ||
                                    cell.id.includes('quantity')
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
                                            updateActualQuantity(e.target.value, row, cell.id)
                                          }
                                        />
                                      </TableCell>
                                    );
                                  } else
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        className={
                                          cell.id.includes('item') ? styles.stickyColumn : ''
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
              <Button kind="primary" onClick={handleSave} className={styles.buttonColor}>
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
