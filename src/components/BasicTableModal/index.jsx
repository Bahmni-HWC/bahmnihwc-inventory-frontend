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
import saveEditedQuantity from '../../service/save-quantity';
import useSWR from 'swr';
import { fetcher, stockRoomURL, stockTakeURL } from '../../utils/api-utils';
import { locationCookieName } from '../../../constants';
import { useCookies } from 'react-cookie';

const TableModal = (props) => {
  const {
    showModal,
    headers,
    rows,
    closeModal,
    stickyColumnName,
    title,
    onChildSave,

  } = props;

  const [editedRows, setEditedRows] = useState([...rows]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [cookies] = useCookies();
  const [saveClicked, setSaveClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editRowRef = useRef(null);

  const { data: stockRoom, error: stockRoomError } = useSWR(
    stockRoomURL(cookies[locationCookieName]?.name.trim()),
    fetcher,
  );

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
  };

  const startEditingRow = (rowId) => {
    setEditingRowId(rowId);

    setIsEditing(true);
  };

  const handleSaveClick = async (rowId) => {
    try {
      const editedRow = editedRows.find((row) => row.id === rowId);

      if (editedRow) {
        const { productName, quantity, actualQuantity, expiration, batchNumber } = editedRow;

        const response = await saveEditedQuantity(
          productName,
          quantity,
          actualQuantity,
          expiration,
          batchNumber,
          stockRoom.results[0]?.uuid
        );

        if (response && response.ok) {
          setSaveClicked(true);
          console.log('Successfully saved:', editedRow);
        } else {
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

  return (
    <ComposedModal open={showModal} onClose={() => closeModal(false)}>
      <ModalHeader>
        <h4>{title}</h4>
      </ModalHeader>
      <TableContainer id="modal-table-container">
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
                                      <label htmlFor={`actual-quantity-${row.id}`}>Actual Qty:</label>
                                      <input
                                        id={`actual-quantity-${row.id}`}
                                        type="number"
                                        value={editedRows.find((r) => r.id === row.id)?.actualQuantity}
                                        onChange={(e) => handleActualQuantityChange(row.id, e.target.value)}
                                        min="0"
                                        className={`${styles.smallerInput} ${isEditing ? styles.smallerInputActive : ''}`}

                                         onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e') {
                                              e.preventDefault();
                                            }
                                          }}

                                         style={{ width: '50px' }}
                                      />
                                      <Button
                                        kind="ghost"
                                        size="small"
                                        onClick={() => handleSaveClick(row.id)}
                                        renderIcon={Save16}
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
                                      style={{
                                          float: 'right',
                                        }}
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
