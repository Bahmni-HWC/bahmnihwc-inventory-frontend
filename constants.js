export const inventoryHeaderText = "Inventory Management";
export const getLocationName = (name) => `Location: ${name}`;
export const inventoryMenu = ["Inventory", "Dispense"];
export const locationCookieName = "bahmni.user.location";
export const activePatients = "Active Patients";
export const successMessage = "Stock Receipt Saved Successfully";
export const failureMessage = "Stock Receipt Failed to Save";

export const headers = [
	{
		key: "productName",
		header: "Product Name",
	},
	{
		key: "currentQuantity",
		header: "Current Quantity",
	},
];
export const dispenseHeaders = [
	{
		key: "patientId",
		header: "Patient Id",
	},
	{
		key: "patientName",
		header: "Patient Name",
	},
];

export const stockReceiptHeaders = [
	{ key: "itemId", header: "Item Id" },
	{ key: "item", header: "Item" },
	{ key: "supplierName", header: "Supplier Name" },
	{ key: "batchNumber", header: "Batch Number" },
	{ key: "expiration", header: "Expiration" },
	{ key: "quantity", header: "Batch Quantity" },
	{ key: "totalQuantity", header: "Total Quantity" },
];

export const drugItemheader = [
	{ key: "drugName", header: "Drug Name" },
	{ key: "avlQty", header: "Avl.Qty" },
	{ key: "prescribedQty", header: "Pres.Qty" },
];