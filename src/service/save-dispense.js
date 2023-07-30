import {
	postRequest,
	getRequest,
	stockOperationURL,
	stockOperationTypeURL,
  inventoryItemURL,
} from "../utils/api-utils";
import getFormattedDate from "../utils/date-utils";

const saveDispense = async (data, sourceStockRoom) => {
	const instanceTypeResponse = await getRequest(
		stockOperationTypeURL("Distribution")
	);
	const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
	const requestBody = {
		status: "NEW",
		attributes: [],
		items: [],
		operationNumber: "",
		instanceType: instanceTypeUuids,
		operationNumber: "",
		operationDate: getFormattedDate,
		patient: data.patientUuid,
		source: sourceStockRoom[0].uuid,
		destination: "",
		institution: "",
		department: "",
	};
	for (const item of data.dispense_drugs) {
		const itemName = encodeURIComponent(item.name); // Get the drugName from the current item
		const response = await getRequest(
			inventoryItemURL(itemName)
		);
		if (response.results.length > 0) {
			const itemUuids = response.results.map((result) => result.uuid);
			for (const itemUuid of itemUuids) {
				requestBody.items.push({
					item: itemUuid,
					quantity: item.prescribedQty,
				});
			}
		} else {
			console.log(`Item '${itemName}' not found in the inventory.`);
		}
	}
	return postRequest(stockOperationURL, requestBody);
};
export default saveDispense;
