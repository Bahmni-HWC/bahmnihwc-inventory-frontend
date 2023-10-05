import {
  Button,
  ButtonSet,
  Column,
  DataTable,
  DatePicker,
  DatePickerInput,
  Grid,
  Loading,
  Row,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextInput,
} from 'carbon-components-react';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';
import {
  failureMessage,
  locationCookieName,
  stockReceiptHeaders,
  successMessage,
} from '../../../constants';
import '../../../index.scss';
import { ResponseNotification } from '../../components/notifications/response-notification';
import { useItemStockContext } from '../../context/item-stock-context';
import {
  fetcher,
  fetcherPost,
  getLocationAttributes,
  getRequest,
  globalPropertyUrl,
  stockInwardURL,
  stockReceiptURL,
  stockRoomURL
} from '../../utils/api-utils';
import {
  getCalculatedQuantity,
  getInwardStockReceiptObj,
  getStockReceiptObj,
} from './eaushadha-response-mapper';
import styles from './aushada.module.scss';
import { convertToDateTimeFormat } from '../../utils/date-utils';
import { inwardSaveReceipt, saveReceipt } from '../../service/save-receipt';

const Aushada = (props) => {
  const [items, setItems] = useState([]);
  const [outwardNumber, setOutwardNumber] = useState('');
  const [stockIntakeButtonClick, setStockIntakeButtonClick] = useState(false);
  const [isOutwardNumberDisabled, setIsOutwardNumberDisabled] = useState(true);
  const [isFetchStockDisabled, setIsFetchStockDisabled] = useState(true);
  const [receivedResponse, setReceivedResponse] = useState();
  const [onSuccesful, setOnSuccesful] = useState(false);
  const [onFailure, setOnFailure] = useState(false);
  const [stockReceiptError, setStockReceiptError] = useState();
  const [stockEmptyResonseMessage, setStockEmptyResonseMessage] = useState(false);
  const [negativeError, setNegativeError] = useState(false);
  const [outwardNumberExists, setOutwardNumberExists] = useState(false);
  const [inwardNumberExists, setInwardNumberExists] = useState(false);
  const [cookies] = useCookies();
  const { setReloadData } = props;
  const { itemStock} = useItemStockContext();
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [enableEaushadhaInwardApi, setEnableEaushadhaInwardApi] = useState('');
  const [instituteId, setInstituteId] = useState([]);
  const [instituteIdExists, setInstituteIdExists] = useState(false);
  const locationUuid = cookies[locationCookieName].uuid;

  const { data: stockRoom, error: stockRoomError } = useSWR(
    stockRoomURL(cookies[locationCookieName]?.name.trim()),
    fetcher,
  );

  useEffect(async ()=>{
    const response=await getRequest(globalPropertyUrl('eAushadha.inward'))
    if(response==true){
      setEnableEaushadhaInwardApi(true);
    }
  },[enableEaushadhaInwardApi])

  const fetchInstituteIdByLocation = async () => {
    const response = await getRequest(getLocationAttributes(locationUuid));
    response?.results?.forEach((result) => {
      if (result?.attributeType?.display === "institutionId" && result?.value) {
        setInstituteId(result?.value);
        setInstituteIdExists(true)
        return;
      }
      else{
        setInstituteId("Contact Admin to set Institution Id")
      }
    });
  };

  fetchInstituteIdByLocation();

  useEffect(() => {
    if (stockIntakeButtonClick) {
      let outwardMatch = false;
      let inwardNumberMatch = false;
      
      for (const result of itemStock) {
          for (const stockOperation of result.details) {
            const formattedDate = convertToDateTimeFormat(selectedDate);
              if (stockOperation.batchOperation.inwardDate === formattedDate) {
                  inwardNumberMatch = true;
                  break;
              }
              if (stockOperation.batchOperation.outwardId === outwardNumber) {
                  outwardMatch = true;
                  break;
              }
          }
          if (inwardNumberMatch || outwardMatch) break;
      }

    setInwardNumberExists(inwardNumberMatch);
    setOutwardNumberExists(outwardMatch);
    setStockIntakeButtonClick(false);

    if(!inwardNumberMatch && !outwardMatch)
        {
            const fetchData = async () => {
              try {
                let url, requestBody;

                if (enableEaushadhaInwardApi) {
                  url = stockInwardURL();
                  const formattedDate= convertToDateTimeFormat(selectedDate);
                  requestBody = { "inwardDate":formattedDate, "instituteId":instituteId};
                } else {
                  url = stockReceiptURL();
                  requestBody = { ouid: outwardNumber };
                }
                const response = await fetcherPost(url, requestBody);
                if (response) {
                  setItems(enableEaushadhaInwardApi ? getInwardStockReceiptObj(response) : getStockReceiptObj(response));
                  setReceivedResponse(response);
                  setStockEmptyResonseMessage(response.length === 0);
                }
              } catch (error) {
                setStockReceiptError(error);
              }
              setStockIntakeButtonClick(false);
             };
           fetchData();
    }
    }
  }, [stockIntakeButtonClick, outwardNumber,selectedDate,instituteId,items]);

  useEffect(() => {
    if (items.length > 0) {
      let negativeValue = false;
      items.forEach((item) => {
        if (item.invalid) {
          negativeValue = true;
        }
      });
      setNegativeError(negativeValue);
    }
  }, [items]);

  useEffect(() => {
    if (outwardNumber.length > 0 || (isDateSelected && instituteIdExists)) {
      setIsOutwardNumberDisabled(false);
      setIsFetchStockDisabled(false);
    } else {
      setIsOutwardNumberDisabled(false);
      setIsFetchStockDisabled(true);
    }

    if (items.length > 0) {
      setIsOutwardNumberDisabled(true);
      setIsFetchStockDisabled(true);
    }
  }, [items, outwardNumber, isDateSelected,instituteIdExists]);

  useEffect(() => {
    if (onSuccesful) {
      setItems([]);
      setReceivedResponse([]);
      setStockIntakeButtonClick(false);
      setIsOutwardNumberDisabled(true);
      setOutwardNumber('');
      setReloadData(false);
    }
  }, [onSuccesful]);

  const handleCancel = () => {
    setOutwardNumber('');
    setItems('');
  };

  const updateActualQuantity = (quantity, row, cell) => {
    const updatedValue = items.map((item) => {
      if (item.id === row.id) {
        if (cell.includes('totalQuantity')) {
          return {
            ...item,
            totalQuantity: parseInt(quantity),
            invalid: parseInt(quantity) <= 0 || item.quantity <= 0,
          };
        } else {
          return {
            ...item,
            quantity: quantity,
            totalQuantity: getCalculatedQuantity(quantity, item.unitPack),
            invalid: parseInt(quantity) <= 0,
          };
        }
      }
      return item;
    });
    setItems(updatedValue);
  };
  const handleSave = async () => {
    try {
      const formattedDate = convertToDateTimeFormat(selectedDate);
      const response = await(enableEaushadhaInwardApi ? inwardSaveReceipt(items, instituteId,formattedDate, stockRoom.results[0]?.uuid) : saveReceipt(items, outwardNumber, stockRoom.results[0]?.uuid));
      if (response && response.ok) {
        setReloadData(true);
        setOnSuccesful(true);
      } else {
        setOnFailure(true);
      }
    } catch (error) {
      setOnFailure(true);
    }
  };

  const setOnSuccessAndFailure = (status) => {
    setOnSuccesful(status);
    setOnFailure(status);

  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date[0]);
    setIsDateSelected(true);
  };

 return (
    <>
      <Grid style={{ paddingLeft: '0', margin: '0' }}>
        <Column lg={16}>
          <Column lg={3}>
            {onSuccesful &&
              ResponseNotification('success', 'Success', successMessage, setOnSuccessAndFailure)}
                {onFailure &&
              ResponseNotification('error', 'Error', failureMessage, setOnSuccessAndFailure)}
                   </Column>
          <Row>
          {enableEaushadhaInwardApi ? (
              <>
                <Column sm={8} lg={4}>
                <h4 style={{ paddingTop: '1.7rem', fontSize: '1.2rem', color: '#333' }}>
                  Institution ID: {instituteId}
                </h4>
                </Column>
                <Column sm={8} lg={4}>
                  <DatePicker
                    datePickerType='single'
                    dateFormat='d-m-Y'
                    value={selectedDate}
                    onChange={handleDateChange}
                  >
                    <DatePickerInput
                      id='myDatePicker'
                      labelText='Select a date'
                      placeholder='dd/mm/yyyy'
                      pattern='d{1,2}/d{1,2}/d{4}'
                      disabled={!instituteIdExists}
                    />
                  </DatePicker>
                </Column>
              </>) : (
              <>
                <Column sm={8} lg={4}>
                  <TextInput
                    id='stock-receipt'
                    labelText='Outward Number'
                    value={outwardNumber}
                    style={{ width: '80%' }}
                    onChange={(e) => setOutwardNumber(e.target.value)}
                    disabled={isOutwardNumberDisabled}
                  />
                </Column>
              </>
            )}
            <Column sm={8} lg={4} style={{ paddingTop: '1.5rem' }}>
              <Button
                onClick={() => setStockIntakeButtonClick(true)}
                size={'md'}
                kind='primary'
                disabled={isFetchStockDisabled}
                className={!isFetchStockDisabled ? styles.primaryButton : ''}
              >
                Stock Fetch
              </Button>
            </Column>
          </Row>
          {stockReceiptError && (
            <h3 style={{ paddingTop: '1rem' }}>
              {ResponseNotification('error', 'Error', 'Something went wrong while fetching URL')}
            </h3>
          )}

          {stockEmptyResonseMessage &&  (
            <div style={{ paddingTop: '20px' }}>
              {ResponseNotification(
                'info',
                'info',
                'No data is received for the outward number. Could you please retry?',
                setStockEmptyResonseMessage,
              )}
            </div>
          )}
            {inwardNumberExists && (
              <h3 style={{ paddingTop: '1rem' }}>
                {ResponseNotification(
                  'error',
                  'Error',
                  'Institution Id with this Date already fetched. Please enter a new institute id and date',setInwardNumberExists
                )}
              </h3>
            )}
            {outwardNumberExists && (
                      <h3 style={{ paddingTop: '1rem' }}>
                        {ResponseNotification(
                          'error',
                          'Error',
                          'Outward number already exists. Please enter a new outward number',setOutwardNumberExists
                        )}
                      </h3>
                    )}
          {stockIntakeButtonClick && !receivedResponse && !stockReceiptError ? (
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
                                  key={header.key}
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
                            {rows.map((row,index) => (
                              <>
                                <TableRow {...getRowProps({ row })} key='stock-fetch'>
                                  {row.cells.map((cell) => {
                                    if(cell.id.includes('serialNo')){
                                      return(
                                        <TableCell key={cell.id}>
                                          {++index}
                                        </TableCell>
                                      )
                                    }
                                    if (
                                      cell.id.includes('totalQuantity') ||
                                      cell.id.includes('quantity')
                                    ) {
                                      return (
                                        <TableCell key={cell.id}>
                                          <TextInput
                                            type='number'
                                            size='sm'
                                            id={cell.id}
                                            value={cell.value}
                                            invalid={
                                              isNaN(cell.value) || parseInt(cell.value, 10) <= 0
                                            }
                                            labelText={''}
                                            min={0}
                                            onChange={(e) =>
                                              updateActualQuantity(e.target.value, row, cell.id)
                                            }
                                          />
                                        </TableCell>
                                      );
                                    }
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
                                {negativeError && (
                                  <TableRow id='errorMessageWrapper'>
                                    <TableCell colSpan={headers.length} className='errorMessage'>
                                      Value cannot be negative or 0
                                    </TableCell>
                                  </TableRow>
                                )}
                              </>
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
              <Button kind='secondary' onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                kind='primary'
                onClick={handleSave}
                className={!negativeError ? styles.primaryButton : styles.disabledButton}
                disabled={negativeError}
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

export default Aushada;


