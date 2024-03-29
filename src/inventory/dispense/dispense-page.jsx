import React, { useEffect, useState } from 'react';
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
  Link,
  Button,
  Loading,
  Grid,
  Row,
  Column,
} from 'carbon-components-react';
import useSWR from 'swr';
import { useCookies } from 'react-cookie';
import { fetcher, activePatientWithDrugOrders, prescribedDrugOrders } from '../../utils/api-utils';
import { locationCookieName, dispenseHeaders, activePatients } from '../../../constants';
import CustomModal from '../../components/CustomModal';
import AddItemModal from './add-inventory-item/add-item-modal';
import styles from './dispense.module.scss';
import { saveDispense, saveDispenseForAdhocDispense } from '../../service/save-dispense';
import DrugItemDetails from './drug-item-details';
import { getDrugItems, getMappedDrugs } from './drug-mapper';
import { ResponseNotification } from '../../components/notifications/response-notification';
import { useStockRoomContext } from '../../context/item-stock-context';
import bahmniEncounterPost from '../../service/bahmni-encounter';

const DispensePage = (props) => {
  const { setReloadData } = props;
  let rows = [];

  const [cookies] = useCookies();
  const location = cookies[locationCookieName];

  const { data: items, error: inventoryItemError } = useSWR(
    activePatientWithDrugOrders(location?.uuid),
    fetcher,
  );

  const { stockRoom } = useStockRoomContext();

  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalForAdditionalDispense, setShowModalForAdditionalDispense] = useState(false);
  const [prescribedDrugs, setPrescribedDrugs] = useState([]);
  const [patient, setPatient] = useState({});
  const [modifiedData, setModifiedData] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (!showModal && !showModalForAdditionalDispense) {
      setSearchText('');
      setIsInvalid(false);
      setModifiedData([]);
      setPrescribedDrugs([]);
      setPatient({});
      setReloadData(false);
    }
  }, [showModal, showModalForAdditionalDispense]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  if (Array.isArray(items)) {
    rows = items.map((item) => ({
      item,
      id: item.uuid,
      patientName: item.name,
      patientId: item.identifier,
    }));
  }

  const filteredRows = rows.filter((row) =>
    searchText !== '' ? row?.patientName?.toLowerCase().includes(searchText?.toLowerCase()) : row,
  );

  const { data: drugItems, error: drugItemsError } = useSWR(
    showModal && patient.id ? prescribedDrugOrders(patient.id) : '',
    fetcher,
  );

  useEffect(() => {
    if (drugItems) {
      const { visitDrugOrders } = drugItems;
      const drugOrders = [];
      visitDrugOrders.forEach((visitDrugOrder) => {
        if (isValid(visitDrugOrder)) {
          drugOrders.push(getMappedDrugs(visitDrugOrder));
        }
      });
      if (JSON.stringify(prescribedDrugs) !== JSON.stringify(drugOrders)) {
        setPrescribedDrugs(drugOrders);
      }
    }
  }, [drugItems]);

  const isValid = (visitDrugOrder) => {
    if (visitDrugOrder && !visitDrugOrder.dateStopped) {
      return true;
    }
    return false;
  };
  const isSortable = (key) => key === 'patientName';

  const handleOnLinkClick = (patientDetails) => {
    setShowModal(true);
    setPatient({
      id: patientDetails.id,
      name: patientDetails.cells[1].value,
    });
  };
  const handleSave = async () => {
    const data = {
      patientUuid: patient.id,
      dispense_drugs: modifiedData,
    };
    const response = await saveDispense(data, stockRoom);
    if (response.ok) {
      setReloadData(true);
      setSaveSuccess(true);
      const bahmniEncoutnerResponse = await bahmniEncounterPost(data, location);
    } else {
      setSaveError(true);
    }
    setShowModal(false);
  };

  if (items === undefined && inventoryItemError === undefined) return <Loading />;

  const handleSaveForAdditionalDispense = async () => {
    const data = {
      patientUuid: patient.id,
      dispense_drugs: modifiedData,
    };
    const response = await saveDispenseForAdhocDispense(data, stockRoom);
    if (response.ok) {
      setReloadData(true);
      setSaveSuccess(true);
    } else {
      setSaveError(true);
    }
    setShowModalForAdditionalDispense(false);
  };

  return (
    <div className={styles.dispenseContainer}>
      <Grid>
        <Row>
          <Column>
            <h5 style={{ paddingBottom: '1rem' }}>{activePatients}</h5>
            {saveSuccess &&
              ResponseNotification('success', 'Success', 'Dispense successful', setSaveSuccess)}
            {saveError ||
              (inventoryItemError &&
                ResponseNotification('error', 'Error', 'Dispense failed', setSaveError))}
          </Column>
          <Column sm={3.5}>
            <Button
              onClick={() => {
                setShowModalForAdditionalDispense(true);
              }}
              size={'sm'}
              kind='primary'
              className={styles.dispenseButton}
              disabled={false}
            >
              Dispense
            </Button>
          </Column>
        </Row>
      </Grid>
      <DataTable rows={filteredRows} headers={dispenseHeaders} stickyHeader={true}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <>
            <TableContainer>
              <TableToolbar style={{ width: '14.5rem' }}>
                <TableToolbarContent style={{ justifyContent: 'flex-start' }}>
                  <TableToolbarSearch value={searchText} onChange={handleSearch} />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
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
                  {rows.length === 0 && (
                    <TableRow style={{ fontSize: '20px' }}>
                      <TableCell colSpan={headers.length}>
                        No active patients with drug orders
                      </TableCell>
                    </TableRow>
                  )}
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          <Link href='#' onClick={() => handleOnLinkClick(row)}>
                            {cell.value}
                          </Link>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DataTable>

      {showModal && (
        <CustomModal
          showModal={showModal}
          subTitle={`Dispense drug for ${patient.name}`}
          primaryButton='Dispense'
          secondaryButton='Cancel'
          handleSubmit={handleSave}
          closeModal={() => setShowModal(false)}
          invalid={isInvalid}
        >
          <DrugItemDetails
            data={getDrugItems(patient, prescribedDrugs)}
            modifiedData={modifiedData}
            setModifiedData={setModifiedData}
            isInvalid={isInvalid}
            setIsInvalid={setIsInvalid}
          />
        </CustomModal>
      )}
      {showModalForAdditionalDispense && (
        <CustomModal
          showModal={showModalForAdditionalDispense}
          subTitle={`Dispense drug for`}
          primaryButton='Dispense'
          secondaryButton='Cancel'
          handleSubmit={handleSaveForAdditionalDispense}
          closeModal={() => setShowModalForAdditionalDispense(false)}
          invalid={isInvalid}
        >
          <AddItemModal
            setIsInvalid={setIsInvalid}
            setModifiedData={setModifiedData}
            setPatient={setPatient}
            patient={patient}
          />
        </CustomModal>
      )}
    </div>
  );
};

export default DispensePage;
