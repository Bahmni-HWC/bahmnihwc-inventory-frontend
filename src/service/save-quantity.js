import {
  postRequest,
  getRequest,
  stockOperationURL,
  stockOperationTypeURL,
} from '../utils/api-utils';
import { getFormattedDate } from '../utils/date-utils';

const saveEditedQuantity = async (
  productName,
  quantity,
  expiration,
  batchNumber,
  sourceUuid,
) => {
  try {
    const instanceTypeResponse = await getRequest(stockOperationTypeURL('Adjustment'));
    const instanceTypeUuid = instanceTypeResponse.results[0]?.uuid;


    const encodedProductName = encodeURIComponent(productName);
    const itemResponse = await getRequest(`/openmrs/ws/rest/v2/inventory/item?v=full&q=${encodedProductName}`);
    const itemUuid = itemResponse.results[0]?.uuid;


    const item = {
      item: itemUuid,
      quantity,
      expiration,
      batchNumber,
      calculatedExpiration: true,
    };
    const requestBody = {
      status: 'NEW',
      attributes: [],
      items: [item],
      operationNumber: '',
      instanceType: instanceTypeUuid,
      operationDate: getFormattedDate(),
      source: sourceUuid,
      destination: '',
      institution: '',
      department: '',
    };

    const response = await postRequest(stockOperationURL, requestBody);

    return response;
  } catch (error) {
    console.error('An error occurred during save:', error);
    throw error;
  }
};

export default saveEditedQuantity;

