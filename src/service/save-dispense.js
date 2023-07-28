import { postRequest, getRequest } from '../utils/api-utils';

import getFormattedDate from "../utils/date-utils";



// eslint-disable-next-line import/prefer-default-export

 const saveDispense = async (data, sourceStockRoom) => {
 console.log('data', data )
  console.log('data', data.patientUuid)
  console.log("sourceStockRoom.results[0].uuid....", sourceStockRoom.results[0].uuid)

 const itemUuids = [];
  const instanceTypeResponse = await getRequest(`/openmrs/ws/rest/v2/inventory/stockOperationType?v=full&q=Distribution`);
           const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
           console.log("instanceTypeUuids in js ..", instanceTypeUuids);

   const requestBody = {


        "status": "NEW",
               "attributes": [],
               "items": [],
               "operationNumber": "",
               "instanceType": instanceTypeUuids,
               "operationNumber": "",
                "operationDate": getFormattedDate,
                 "patient": data.patientUuid,
                "source": sourceStockRoom.results[0].uuid,
                "destination": "",
               "institution": "",
               "department": ""


   };
   for (const item of data.dispense_drugs) {
   console.log("item in js ..", item);
                    const itemName = item.name; // Get the drugName from the current item
                    console.log("itemName in const item..", itemName);
                    console.log("prescribedQty..", item.prescribedQty);
                    const response = await getRequest(`/openmrs/ws/rest/v2/inventory/item?v=full&q=${itemName}`);
                    console.log("requestBody in js for getting uuid from itemname ..", requestBody);
                    console.log("response in js for getting uuid from itemname ..", response);
                    if (response.results.length > 0) {
                      // Add the item UUIDs to the itemUuids array
                      const itemUuids = response.results.map((result) => result.uuid);
                for (const itemUuid of itemUuids) {
                console.log("itemUuid in js ..", itemUuid);
                console.log("item.prescribedQty in js ..", item.prescribedQty);
                                       requestBody.items.push({
                                         "item": itemUuid,
                                         "quantity": item.prescribedQty,
                                       });
                                     }

                    } else {
                      console.log(`Item '${itemName}' not found in the inventory.`);
                      // Handle the case where the item is not found (optional)
                    }
                  }
    return postRequest('/openmrs/ws/rest/v2/inventory/stockOperation', requestBody);
}
export default saveDispense;