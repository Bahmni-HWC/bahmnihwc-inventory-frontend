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
			const itemUuids = response.results[0].uuid;
			// Add the item to the requestBody.items array with all corresponding properties
			itemsArray.push({
				item: itemUuids[0],
				quantity: item.totalQuantity,
				expiration: item.expiration,
				batchNumber: item.batchNumber,
				calculatedExpiration: true,
			});
		})
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
export default saveReceipt;
