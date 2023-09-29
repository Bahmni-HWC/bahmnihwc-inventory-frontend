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
			invalid: false
		};
		stockReceiptArray.push(rowObj);
	})
	return stockReceiptArray;
}
export const getLoadStockObj = (response) => 
  Object.keys(response).map((key) => {
    const dateString = new Date(response[key].expiryDate).toLocaleDateString();
    const convertedDate = new Date(dateString.split("/").reverse().join("-"));
    return {
      id: response[key].id,
      item: response[key].drugName.selectedItem,
      batchNumber: response[key].batchNo,
      expiration: convertedDate.toLocaleDateString("en-GB").split("/").join("-"),
      quantity: response[key].quantity,
      totalQuantity: response[key].totalQuantity,
    };
  });

export const getCalculatedQuantity = (quantity, unitPack) => {
	const unitPackValue = unitPack?.split("x");
	let unitPackQuantity = 1;
	unitPackValue.forEach((element) => {
		unitPackQuantity *= element;
	});
	return parseInt(unitPackQuantity * quantity, 10);
};
export const getInwardStockReceiptObj = (response) => {
	const stockReceiptArray = [];
	response?.forEach((element,index) => {
		const dateString = element.exp_date;
		const convertedDate = new Date(dateString.split("/").reverse().join("-"));
		const itemName = element.drug_name.split(/\s+/).join(' ');
		const rowObj = {
			id: `${element.drug_id}-${index}}`,
			itemId: element.drug_id,
			item: itemName,
			supplierName: element.supplier,
			batchNumber: element.batch_number,
			expiration: convertedDate
				.toLocaleDateString("en-GB")
				.split("/")
				.join("-"),
			quantity: element.quantity_In_Pack,
			totalQuantity: element.quantity_In_Units,
			unitPack: element.unitPack,
			invalid: false,
			inwardno: element.inwardno,
		};
		stockReceiptArray.push(rowObj);
	})
	return stockReceiptArray;
}