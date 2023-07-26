import { postRequest, getRequest } from '../utils/api-utils';
import { getFormattedDate } from './date-utils';



// eslint-disable-next-line import/prefer-default-export

   const saveReceipt = async (items,outwardNumber,destinationUuid) => {

       const instanceTypeResponse = await getRequest(`/openmrs/ws/rest/v2/inventory/stockOperationType?v=full&q=Receipt`);
       const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
       const currentDate = new Date();

   const requestBody = {
        "status": "NEW",
        "attributes": [],
        "items": [],
        "operationNumber": "",
        "instanceType": instanceTypeUuids,
        "operationDate": getFormattedDate(),
        "source": "",
        "destination": destinationUuid,
        "institution": "",
        "department": ""
    };
   await Promise.all(
       items.map(async (item) => {
         const itemName = item.item;
         const response = await getRequest(`/openmrs/ws/rest/v2/inventory/item?v=full&q=${itemName}`);
         const itemUuids = response.results.map((result) => result.uuid);
  // Add the item to the requestBody.items array with all corresponding properties
       itemUuids.forEach((itemUuid) => {
         requestBody.items.push({
           "item": itemUuid,
           "quantity": item.totalQuantity,
           "expiration": item.expiration,
           "batchNumber": item.batchNumber,
         });
       });
      })
      );
  return  postRequest('/openmrs/ws/rest/v2/inventory/stockOperation', requestBody);
};
export default saveReceipt;

