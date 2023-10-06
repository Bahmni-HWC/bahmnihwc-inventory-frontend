import {
  postRequest,
  getRequest,
  stockTakeURL,
} from '../utils/api-utils';

const saveEditedQuantity = async (
  productName,
    quantity,
    actualQuantity,
    expiration,
    batchNumber,
    sourceUuid,
) => {
const itemStockSummaryList = [];

   const encodedProductName = encodeURIComponent(productName);
   const itemResponse = await getRequest(`/openmrs/ws/rest/v2/inventory/item?v=full&q=${encodedProductName}`);
   const itemUuid = itemResponse.results[0]?.uuid;
  itemStockSummaryList.push({
         item: itemUuid,
            expiration,
            quantity,
            actualQuantity,
        });
  const requestBody = {
     operationNumber: "",
     stockroom: sourceUuid,
     itemStockSummaryList,
    };
    return postRequest(stockTakeURL, requestBody);
};

export default saveEditedQuantity;
