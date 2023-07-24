export const getRowObj = (response) => {
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
			quantity: element.quantity_in_pack,
			totalQuantity: element.quantity_in_units,
			unitPack: element.unitPack,
		};
		stockReceiptArray.push(rowObj);
	})
	return stockReceiptArray;
}

export const getCalculatedQuantity = (quantity, unitPack) => {
	const unitPackValue = unitPack?.split("x");
	let unitPackQuantity = 1;
	unitPackValue.forEach((element) => {
		unitPackQuantity *= element;
	});
	return parseInt(unitPackQuantity * quantity, 10);
};

