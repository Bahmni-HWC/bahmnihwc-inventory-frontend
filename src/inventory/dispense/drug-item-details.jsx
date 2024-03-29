import {
  Column,
  DataTable,
  Grid,
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
import { useItemStockContext } from '../../context/item-stock-context';
import styles from './dispense.module.scss';
import { drugItemheader } from '../../../constants';

const DrugItemDetails = (props) => {
  const [drugItems, setDrugItems] = useState([]);
  const [drugInfo, setDrugInfo] = useState([]);
  const { itemStock } = useItemStockContext();

  useEffect(() => {
    if (props.data.dispense_drugs && props.data.dispense_drugs.length > 0) {
      if (JSON.stringify(drugItems) !== JSON.stringify(props.data.dispense_drugs)) {
        setDrugItems(props.data.dispense_drugs);
      }
    }
  }, [props.data]);

  useEffect(() => {
    if (drugInfo && drugInfo.length > 0) {
      let invalid = false;
      drugInfo.forEach((item) => {
        if (item.invalidQty && invalid === false) invalid = true;
      });
      const dispensedDrugItem = drugInfo.filter((item) => item.dispensed === false);
      const modifiedData = drugInfo.filter(
        (item) => item.dispensed === false && item.prescribedQty > 0,
      );
      props.setIsInvalid(invalid || dispensedDrugItem.length === 0 || modifiedData.length === 0);
      props.setModifiedData(modifiedData);
    }
  }, [drugInfo]);

  useEffect(() => {
    if (drugItems && itemStock && drugItems.length > 0 && itemStock.length > 0) {
      const rowObj = [];
      for (const drugItem of drugItems) {
        let isItemPresent = false;
        const isDispensedDrug = dispensedDrug(drugItem.orderAttributes);
        for (const item of itemStock) {
          if (item.item.name.includes(drugItem.drugName)) {
            isItemPresent = true;
            rowObj.push({
              id: drugItem.id,
              itemUuid: item.item.uuid,
              drugName: getTitle(drugItem),
              name: drugItem.drugName,
              avlQty: item.quantity,
              prescribedQty: isDispensedDrug ? 0 : drugItem.quantity,
              invalidQty: !isDispensedDrug && item.quantity < drugItem.quantity,
              dispensed: isDispensedDrug,
            });
          }
        }
        if (!isItemPresent) {
          rowObj.push({
            id: drugItem.id,
            itemUuid: null,
            drugName: getTitle(drugItem),
            name: drugItem.drugName,
            avlQty: 0,
            prescribedQty: isDispensedDrug ? 0 : drugItem.quantity,
            invalidQty: !isDispensedDrug && 0 < drugItem.quantity,
            dispensed: isDispensedDrug,
          });
        }
      }
      setDrugInfo(rowObj);
    }
  }, [drugItems, itemStock]);

  const getTitle = (drug) => {
    let title = '';
    const dosingInstructions = drug.dosingInstructions;
    if (drug.dosingInstructions.frequency !== null) {
      title = `${drug.drugName} - ${dosingInstructions.dose} ${dosingInstructions.doseUnits} | ${dosingInstructions.frequency} | ${drug.duration} ${drug.durationUnits}`;
    } else {
      const administrationInstructions = drug.dosingInstructions.administrationInstructions;
      const parsedobj = JSON.parse(administrationInstructions);
      title = `${drug.drugName} - ${parsedobj.morningDose}-${parsedobj.afternoonDose}-${parsedobj.eveningDose} ${dosingInstructions.doseUnits} | ${drug.duration} ${drug.durationUnits}`;
    }
    return title;
  };

  const handleOnchange = (value, row) => {
    const updatedRow = drugInfo.map((item) => {
      if (item.id === row.id) {
        return {
          ...item,
          prescribedQty: parseInt(value),
          invalidQty: !isSufficient(value, row),
        };
      }
      return item;
    });
    setDrugInfo(updatedRow);
  };

  const isInvalid = (value) => {
    if (value !== '') {
      return isNaN(value);
    }
    return false;
  };

  const isSufficient = (value, row) => {
    const item = drugInfo.find((item) => item.id === row.id);
    if (item) {
      if (item.avlQty > 0 && !item.dispensed) {
        return item.avlQty >= parseInt(value) && parseInt(value) > 0;
      }
      if (item.avlQty === 0) return parseInt(value) === 0;
      return true;
    }
    return false;
  };

  const dispensedDrug = (orderAttributes) => {
    if (orderAttributes == null) return false;

    for (const orderAttribute of orderAttributes) {
      if (orderAttribute.name === 'Dispensed' && orderAttribute.value === 'true') return true;
    }
    return false;
  };

  const isDispensed = (row) => {
    const item = drugInfo.find((item) => item.id === row.id);
    return item?.dispensed ?? false;
  };

  return (
    <Grid>
      <Row>
        <Column
          lg={12}
          sm={6}
          style={{
            paddingTop: '1rem',
            wordWrap: 'break-word',
          }}
          className={styles.itemDrugs}
        >
          <DataTable
            rows={drugInfo}
            headers={drugItemheader}
            className={styles.accordionItem}
            style={{ padding: 0 }}
          >
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader
                          key={header.key}
                          {...getHeaderProps({
                            header,
                          })}
                          disabled={true}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <>
                        <TableRow {...getRowProps({ row })} key={'dispense-drugs'}>
                          {row.cells.map((cell) => {
                            if (cell.id.includes('prescribedQty'))
                              return (
                                <TableCell key={cell.id}>
                                  <TextInput
                                    size='sm'
                                    value={
                                      isDispensed(row)
                                        ? 'Dispensed'
                                        : isInvalid(cell.value)
                                        ? ''
                                        : cell.value
                                    }
                                    id={cell.id}
                                    labelText=''
                                    disabled={isDispensed(row)}
                                    style={!isSufficient(cell.value, row) ? { color: 'red' } : {}}
                                    invalid={!isSufficient(cell.value, row)}
                                    onChange={(e) => handleOnchange(e.target.value, row)}
                                  />
                                </TableCell>
                              );
                            return <TableCell key={cell.id}>{cell.value}</TableCell>;
                          })}
                        </TableRow>
                        {!isSufficient(row.cells[2].value, row) && (
                          <TableRow id='errorMessageWrapper'>
                            <TableCell colSpan={headers.length} className='errorMessage'>
                              Please enter value &lt;= to available quantity
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
        </Column>
      </Row>
    </Grid>
  );
};

export default DrugItemDetails;
