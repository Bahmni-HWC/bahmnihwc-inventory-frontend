export const getStockReceiptObj = (response) => {
	const stockReceiptArray = [];
	response?.forEach((element,index) => {
		const dateString = element.exp_date;
		const convertedDate = new Date(dateString.split("/").reverse().join("-"));
		const rowObj = {
			id: `${element.drug_id}-${index}}`,
			itemId: element.drug_id,
			item: element.drug_name,
			supplierName: element.supplier,
			batchNumber: element.batch_number,
			expiration: convertedDate
				.toLocaleDateString("en-GB")
				.split("/")
				.join("-"),
			quantity: element.quantity_In_Pack,
			totalQuantity: element.quantity_In_Units,
			unitPack: element.unitPack,
		};
		stockReceiptArray.push(rowObj);
	})
	return stockReceiptArray;
}
export const getLoadStockObj = (response) => {

	const loadStockArray = [];
	
	for (const key in response) {
		const dateString=new Date(response[key].expiryDate).toLocaleDateString()
		const convertedDate = new Date(dateString.split("/").reverse().join("-"));
		const rowObj = {
			id: response[key].id,
			item: response[key].drugName.selectedItem,
			batchNumber: response[key].batchNo,
			expiration: convertedDate
				.toLocaleDateString("en-GB")
				.split("/")
				.join("-"),
			quantity: response[key].quantity,
			totalQuantity: response[key].totalQuantity,
		};
		loadStockArray.push(rowObj);
	}
	return loadStockArray;
}

export const getCalculatedQuantity = (quantity, unitPack) => {
	const unitPackValue = unitPack?.split("x");
	let unitPackQuantity = 1;
	unitPackValue.forEach((element) => {
		unitPackQuantity *= element;
	});
	return parseInt(unitPackQuantity * quantity, 10);
};