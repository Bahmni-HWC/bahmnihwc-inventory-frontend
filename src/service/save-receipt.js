import {
	postRequest,
	getRequest,
	stockOperationURL,
	stockOperationTypeURL,
} from "../utils/api-utils";
import {getFormattedDate} from "../utils/date-utils";

const saveReceipt = async (items, outwardNumber, destinationUuid) => {
	const instanceTypeResponse = await getRequest(
		stockOperationTypeURL("Receipt")
	);
	const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
	const requestBody = {
		status: "NEW",
		attributes: [],
		items: [],
		operationNumber: "",
		instanceType: instanceTypeUuids,
		operationDate: getFormattedDate,
		source: "",
		destination: destinationUuid,
		institution: "",
		department: "",
	};
	await Promise.all(
		items.map(async (item) => {
			const itemName = item.item;
			const response = await getRequest(
				`/openmrs/ws/rest/v2/inventory/item?v=full&q=${itemName}`
			);
			const itemUuids = response.results.map((result) => result.uuid);
			// Add the item to the requestBody.items array with all corresponding properties
			itemUuids.forEach((itemUuid) => {
				requestBody.items.push({
					item: itemUuid,
					quantity: item.totalQuantity,
					expiration: item.expiration,
					batchNumber: item.batchNumber,
				});
			});
		})
	);
	return postRequest(stockOperationURL, requestBody);
};
export default saveReceipt;
