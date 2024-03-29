export const inventoryHeaderText = "Inventory Management";
export const getLocationName = (name) => `Location: ${name}`;
export const inventoryMenu = ["Inventory", "Dispense"];
export const locationCookieName = "bahmni.user.location";
export const activePatients = "Active Patients";
export const successMessage = "Saved Successfully";
export const failureMessage = "Failed to Save";



export const inventoryHeaders = [
	{
	  key: "productName",
	  header: "Product Name",
	},
	{
	  key: "quantity",
	  header: "Quantity",
	}
  ];

  export const inventoryDetailItemsHeaders = [
	{
	  key: "productName",
	  header: "Product Name",
	},
	{
	  key: "quantity",
	  header: "Quantity",
	},
	{
	  key: "expiration",
	  header: "Expiration",
	},
	{
	  key: "batchNumber",
	  header: "Batch Number",
	}
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
	{ key: "serialNo", header: "S.No"},
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

export const drugItemheaderDispense = [
	{ key: "id", header: "S.No" },
	{ key: "drugName", header: "Drug Name" },
	{ key: "avlQty", header: "Avl. Qty" },
	{ key: "dispQty", header: "Disp. Qty" },
	{ key: "action", header: "Actions" },
]