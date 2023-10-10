import React, { useState, useEffect, useRef } from 'react';
import {
  DataTable,
  TableContainer,
  TableCell,
  ComposedModal,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  ModalHeader,
  Button,
} from 'carbon-components-react';
import { Edit16, Save16 } from '@carbon/icons-react';
import styles from './BasicTableModal.module.scss';
import adjustQuantity from '../../service/save-quantity';
import useSWR from 'swr';
import { fetcher, stockRoomURL, stockTakeURL } from '../../utils/api-utils';
import { locationCookieName, successMessage, failureMessage } from '../../../constants';
import { useCookies } from 'react-cookie';
import { ResponseNotification } from '../../components/notifications/response-notification';



const TableModal = (props) => {
  const { showModal, headers, rows, closeModal, stickyColumnName, title, onChildSave } = props;
  const [editedRows, setEditedRows] = useState([...rows]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [cookies] = useCookies();
  const [saveClicked, setSaveClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editRowRef = useRef(null);
  const [quantityDifference, setQuantityDifference] = useState({});
  const [onSuccesful, setOnSuccesful] = useState(false);
  const [onFailure, setOnFailure] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const { data: stockRoom, error: stockRoomError } = useSWR(
    stockRoomURL(cookies[locationCookieName]?.name.trim()),
    fetcher,
  );
  const preventMinus = (e) => {
          if (e.code === 'Minus') {
              e.preventDefault();
          }
      };
  const preventPasteNegative = (e) => {
            const clipboardData = e.clipboardData || window.clipboardData;
            const pastedData = parseFloat(clipboardData.getData('text'));
            if (pastedData < 0) {
                e.preventDefault();
            }
        };

  useEffect(() => {
    if (saveClicked) {
      onChildSave();
      setSaveClicked(false);
    }
  }, [saveClicked, onChildSave]);

useEffect(() => {
    setEditedRows([...rows]);
  }, [rows]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (editRowRef.current && !editRowRef.current.contains(event.target)) {
        setIsEditing(false);
        setEditingRowId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleActualQuantityChange = (rowId, value) => {
    const updatedEditedRows = editedRows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          actualQuantity: value,
        };
      }
      return row;
    });

    setEditedRows(updatedEditedRows);
  const quantity = parseInt(updatedEditedRows.find((row) => row.id === rowId)?.quantity, 10);
    const actualValue = parseInt(value, 10);

    if (!isNaN(quantity) && !isNaN(actualValue) && quantity === actualValue) {
      setIsSaveButtonDisabled(true);
    } else {

      setIsSaveButtonDisabled(false);
    }
  };

  const startEditingRow = (rowId) => {
    setEditingRowId(rowId);

    setIsEditing(true);
  };

  const handleSaveClick = async (rowId) => {
    try {
      const editedRowIndex = editedRows.findIndex((row) => row.id === rowId);

          if (editedRowIndex !== -1) {
            const editedRow = { ...editedRows[editedRowIndex] };
            const { productName, quantity, expiration, batchNumber, actualQuantity } = editedRow;

            const quantityDiff = parseInt(actualQuantity, 10) - parseInt(quantity, 10)  ;


            editedRow.quantity = quantityDiff.toString();


            const updatedRows = [...editedRows];
            updatedRows[editedRowIndex] = editedRow;

            const response = await adjustQuantity(
              productName,
              editedRow.quantity,
              expiration,
              batchNumber,
              stockRoom.results[0]?.uuid
            );
    if (response && response.ok) {
        setEditedRows(updatedRows);
        setOnSuccesful(true);
        setSaveClicked(true);

          console.log('Successfully saved:', editedRow);
        } else {
           setOnFailure(true);
          console.error('Failed to save:', editedRow);
        }
      } else {
        console.error('Row not found for rowId:', rowId);
      }
    } catch (error) {
      console.error('An error occurred during save:', error);
    }

    setEditingRowId(null);
    setIsEditing(false);
  };
 const setOnSuccessAndFailure = (status) => {
      setOnSuccesful(status);
      setOnFailure(status);

    };
    return (
    <ComposedModal open={showModal} onClose={() => closeModal(false)} >
      <ModalHeader >
        <h4>{title}
            </h4>
      </ModalHeader>
  <TableContainer id="modal-table-container" style={{ paddingTop: '2rem' }} >
   {onSuccesful && ResponseNotification('success', 'Success', successMessage, setOnSuccessAndFailure)}
   {onFailure && ResponseNotification('error', 'Error', failureMessage, setOnSuccessAndFailure)}

       <DataTable rows={editedRows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()} useZebraStyles={true}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      {...getHeaderProps({
                        header,
                      })}
                      className={header.key === stickyColumnName ? styles.stickyColumn : ''}
                      key={header.key}
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
                      Currently, there are no stocks available
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`${
                            cell.id.includes(stickyColumnName) ? styles.stickyColumn : ''
                          }`}
                        >
                          {cell.id.includes('quantity') ? (
                            <>
                              {editingRowId === row.id ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                  ref={editRowRef}
                                >
                                  <div style={{ paddingRight:'50px' }}>
                                                                  {cell.value}
                                                                </div>

                                  {isEditing && (
                                    <>
                                      <label htmlFor={`actual-quantity-${row.id}`}>Actual Quantity:</label>
                                      <input
                                        id={`actual-quantity-${row.id}`}
                                        type="number"
                                        value={editedRows.find((r) => r.id === row.id)?.actualQuantity}
                                        onChange={(e) => handleActualQuantityChange(row.id, e.target.value)}
                                         className={`${styles.smallerInput} ${isEditing ? styles.smallerInputActive : ''}`}
                                        style={{ width: '50px' }}
                                        min="0"
                                        onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}
                                      />
                                      <Button
                                        kind="ghost"
                                        size="small"
                                        onClick={() => handleSaveClick(row.id)}
                                        renderIcon={Save16}
                                         disabled={isSaveButtonDisabled}
                                      >

                                      </Button>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <>
                                  {cell.value}
                                  {!isEditing ? (
                                    <Button
                                     style={{float: 'right',}}
                                      kind="ghost"
                                      size="small"
                                      onClick={() => startEditingRow(row.id)}
                                      renderIcon={Edit16}
                                    />
                                  ) : null}
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {cell.id.includes('Actual Quantity') ? (
                                <>
                                  {editingRowId === row.id ? (
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                      ref={editRowRef}
                                    >
                                      <input
                                        id={`actual-quantity-${row.id}`}
                                        type="number"
                                        value={editedRows.find((r) => r.id === row.id)?.actualQuantity}
                                        onChange={(e) => handleActualQuantityChange(row.id, e.target.value)}
                                      />
                                      {isEditing && (
                                        <Button
                                          kind="ghost"
                                          size="small"
                                          onClick={() => handleSaveClick(row.id)}
                                          renderIcon={Save16}
                                        >
                                          Save
                                        </Button>
                                      )}
                                    </div>
                                  ) : (
                                    <>
                                      {cell.value}
                                      {!isEditing ? (
                                        <Button
                                          kind="ghost"
                                          size="small"
                                          onClick={() => startEditingRow(row.id)}
                                          renderIcon={Edit16}
                                        />
                                      ) : null}
                                    </>
                                  )}
                                </>
                              ) : (
                                cell.value
                              )}
                            </>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </TableContainer>
    </ComposedModal>
  );
};

export default TableModal;
