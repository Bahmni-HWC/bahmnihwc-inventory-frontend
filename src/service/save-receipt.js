import {
  postRequest,
  getRequest,
  stockOperationURL,
  stockOperationTypeURL,
  inventoryItemByDrugIdURL,
} from '../utils/api-utils';
import { getFormattedDate } from '../utils/date-utils';

const saveReceipt = async (items, outwardNumber, destinationUuid) => {
  const instanceTypeResponse = await getRequest(stockOperationTypeURL('Receipt'));
  const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
  const itemsArray = [];
  await Promise.all(
    items.map(async (item) => {
      const response = await getRequest(inventoryItemByDrugIdURL(item.itemId));
      const itemUuid = response.results[0]?.uuid;

      itemsArray.push({
        item: itemUuid,
        quantity: item.totalQuantity,
        expiration: item.expiration,
        batchNumber: item.batchNumber,
        calculatedExpiration: true,
        inwardNo: item.inwardno,
      });
    }),
  );

  const requestBody = {
    status: 'NEW',
    attributes: [],
    items: itemsArray,
    operationNumber: '',
    instanceType: instanceTypeUuids,
    operationDate: getFormattedDate(),
    source: '',
    destination: destinationUuid,
    institution: '',
    department: '',
    outwardId: outwardNumber,
  };
  
  return postRequest(stockOperationURL, requestBody);
};

const inwardSaveReceipt = async (items, institutionId, stockInwardDate, destinationUuid) => {
  const instanceTypeResponse = await getRequest(stockOperationTypeURL('Receipt'));
  const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
  const itemsArray = [];
  await Promise.all(
    items.map(async (item) => {
      const response = await getRequest(inventoryItemByDrugIdURL(item.itemId));
      const itemUuid = response.results[0]?.uuid;
      itemsArray.push({
        item: itemUuid,
        quantity: item.totalQuantity,
        expiration: item.expiration,
        batchNumber: item.batchNumber,
        calculatedExpiration: true,
        inwardNo: item.inwardno,
      });
    }),
  );

  const requestBody = {
    status: 'NEW',
    attributes: [],
    items: itemsArray,
    operationNumber: '',
    instanceType: instanceTypeUuids,
    operationDate: getFormattedDate(),
    source: '',
    destination: destinationUuid,
    institution: '',
    department: '',
    inwardDate: stockInwardDate,
    instituteId: institutionId,
  };
  return postRequest(stockOperationURL, requestBody);
};

export { saveReceipt, inwardSaveReceipt };