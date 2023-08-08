import {
	postRequest,
	getRequest,
	stockOperationURL,
	stockOperationTypeURL,
	inventoryItemByNameURL,
} from "../utils/api-utils";
import { getFormattedDate } from "../utils/date-utils";

const saveDispense = async (data, sourceStockRoom) => {
	const instanceTypeResponse = await getRequest(
		stockOperationTypeURL("Distribution")
	);

	const itemArray = [];
	if (data.dispense_drugs && Array.isArray(data.dispense_drugs)) {
		const promises = data.dispense_drugs.map(async (item) => {
			const itemName = encodeURIComponent(item.name); // Get the drugName from the current item
			const response = await getRequest(inventoryItemByNameURL(itemName));
			if (response.results.length > 0) {
				itemArray.push({
					item: response.results[0].uuid,
					quantity: item.prescribedQty,
					calculatedExpiration: true,
				});
			} else {
				console.log(`Item '${itemName}' not found in the inventory.`);
			}
		});
		await Promise.all(promises);
	}

	const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
	const requestBody = {
		status: "NEW",
		attributes: [],
		items: itemArray,
		operationNumber: "",
		instanceType: instanceTypeUuids,
		operationDate: getFormattedDate(),
		patient: data.patientUuid,
		source: sourceStockRoom[0].uuid,
		destination: "",
		institution: "",
		department: "",
	};

	return postRequest(stockOperationURL, requestBody);
};
const saveDispenseForAdhocDispense = async (data, sourceStockRoom) => {
	const instanceTypeResponse = await getRequest(
		stockOperationTypeURL("Distribution")
	);

	const itemArray = [];
	if (data.dispense_drugs && Array.isArray(data.dispense_drugs)) {
		const promises = data.dispense_drugs.map((item) => {
			itemArray.push({
				item: item.uuid,
				quantity: item.dispQty,
				calculatedExpiration: true,
			});
		});
		await Promise.all(promises);
	}

	const instanceTypeUuids = instanceTypeResponse.results[0].uuid;
	const requestBody = {
		status: "NEW",
		attributes: [],
		items: itemArray,
		operationNumber: "",
		instanceType: instanceTypeUuids,
		operationDate: getFormattedDate(),
		patient: data.patientUuid,
		source: sourceStockRoom[0].uuid,
		destination: "",
		institution: "",
		department: "",
	};

	return postRequest(stockOperationURL, requestBody);
};
export { saveDispense, saveDispenseForAdhocDispense };
