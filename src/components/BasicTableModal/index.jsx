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
} from 'carbon-components-react';
import React from 'react';
import styles from './BasicTableModal.module.scss';

const TableModal = (props) => {
  const { showModal, headers, rows, closeModal, stickyColumnName, title } = props;

  return (
    <ComposedModal open={showModal} onClose={() => closeModal(false)}>
      <ModalHeader>
        <h4>{title}</h4>
      </ModalHeader>
      <TableContainer id="modal-table-container">
        <DataTable rows={rows} headers={headers}>
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
                      Currently there are no stocks available
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
                          {cell.value}
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
