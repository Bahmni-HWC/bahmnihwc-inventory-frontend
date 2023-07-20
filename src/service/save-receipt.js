import { postRequest } from '../utils/api-utils';

// eslint-disable-next-line import/prefer-default-export
export const saveReceipt = async (data) => {
  console.log('data', data)
   const requestBody = {
   "status": "NEW",
     "attributes": [],
     "items": [
       {
         "item": "b8252de7-81f6-4379-bdc2-27b3c29b0399",
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
     "destination": "53d12a8a-2475-11ee-8006-0242ac13000b",
     "institution": "",
     "department": ""
   }
    return postRequest('/openmrs/ws/rest/v2/inventory/stockOperation',
        requestBody
    );
}