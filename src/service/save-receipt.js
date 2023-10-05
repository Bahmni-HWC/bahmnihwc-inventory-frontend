import {
  postRequest,
  getRequest,
  stockOperationURL,
  stockOperationTypeURL,
} from '../utils/api-utils';
import { getFormattedDate } from '../utils/date-utils';

const saveReceipt = async (items, outwardNumber, destinationUuid) => {
  const instanceTypeResponse = await getRequest(stockOperationTypeURL('Receipt'));
  const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
  const itemsArray = [];
  await Promise.all(
    items.map(async (item) => {
      const itemName = encodeURIComponent(item.item);
      const response = await getRequest(`/openmrs/ws/rest/v2/inventory/item?v=full&q=${itemName}`);
      const itemUuid = response.results[0]?.uuid;
      // Add the item to the requestBody.items array with all corresponding properties
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

const inwardSaveReceipt = async (items, institutionId, inwardDate, destinationUuid) => {
  const instanceTypeResponse = await getRequest(stockOperationTypeURL('Receipt'));
  const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
  const itemsArray = [];
  await Promise.all(
    items.map(async (item) => {
      const itemName = encodeURIComponent(item.item);
      const response = await getRequest(`/openmrs/ws/rest/v2/inventory/item?v=full&q=${itemName}`);
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
    // items: itemsArray,
   items: [
      {
          item: "37d4b9c8-635c-4de8-8929-805d3101232b",
          quantity: 2,
          expiration: "30-11-2024",
          batchNumber: "A361",
          calculatedExpiration: true,
          inwardNumber: "INW-0000004"
      },
      {
        item: "3093c9da-b362-473f-b699-05e7fdb52506",
        quantity: 5,
        expiration: "31-07-2025",
        batchNumber: "EM981",
        calculatedExpiration: true,
        inwardNumber: "INW-0000005"
      }
    ],
    operationNumber: '',
    instanceType: instanceTypeUuids,
    operationDate: getFormattedDate(),
    source: '',
    destination: destinationUuid,
    institution: '',
    department: '',
    inwardDate: inwardDate,
    instituteId: institutionId,
  };
  return postRequest(stockOperationURL, requestBody);
};

export { saveReceipt, inwardSaveReceipt };