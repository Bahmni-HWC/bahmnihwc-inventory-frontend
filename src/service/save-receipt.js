import { postRequest } from '../utils/api-utils';
export const saveReceipt = async (data) => {
   const requestBody = {
   "status": "NEW",
     "attributes": [],
     "items": [
       {
         "item": "6e71e78d-a220-49ab-bee3-83227a1053fe",
         "quantity": 200,
         "expiration": "26-07-2023",
         "calculatedExpiration": false,
         "batchNumber":"BDF2002060"
       }
     ],
     "operationNumber": "",
     "instanceType": "fce0b4fc-9402-424a-aacb-f99599e51a9f",
     "operationDate": "12-07-2023 23:38:05",
     "source": "",
     "destination": "5edf18b7-1ae2-11ee-9aca-0242ac17000f",
     "institution": "",
     "department": ""
   }
    return await postRequest('/openmrs/ws/rest/v2/inventory/stockOperation',
        requestBody
    );
}