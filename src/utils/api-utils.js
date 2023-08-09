export const invItemURLByStockroom = (locationUuid,limit) =>
	`/openmrs/ws/rest/v2/inventory/itemStock?stockroom_uuid=${locationUuid}&limit=${limit}`;
export const inventoryItemURL=()=>`/openmrs/ws/rest/v2/inventory/item?limit=1&v=full`;
export const invItemURL=(limit)=>`/openmrs/ws/rest/v2/inventory/item?limit=${limit}&v=full`;
export const activePatientWithDrugOrders = (locationUuid) =>
	`/openmrs/ws/rest/v1/bahmnicore/sql?location_uuid=${locationUuid}&q=emrapi.sqlSearch.activePatientsWithDrugOrders&v=full`;
export const fetcher = (url) =>
	fetch(url).then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json();
	});

const controller = new AbortController();
const timeout = 150000;

const timeoutId = setTimeout(() => {
	controller.abort(); // Abort the request if timeout is reached
}, timeout);

export const fetcherPost = (url, data) =>
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		signal: controller.signal,
	}).then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		clearTimeout(timeoutId);
		return response.json();
	});

export const postRequest = (url, data) =>
	fetch(`${url}`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": "token-value",
		},
		body: JSON.stringify(data),
	});
export const getRequest = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
export const swrOptions = {
	revalidateIfStale: false,
	revalidateOnFocus: false,
	revalidateOnReconnect: false,
};
export const stockRoomURL = (locationName) =>
	`/openmrs/ws/rest/v2/inventory/stockroom?q=${locationName}`;

export const prescribedDrugOrders = (patientUuid) =>
	`/openmrs/ws/rest/v1/bahmnicore/drugOrders/prescribedAndActive?getEffectiveOrdersOnly=false&getOtherActive=true&numberOfVisits=1&patientUuid=${patientUuid}&preferredLocale=en`;
export const stockReceiptURL = () =>
	"/openmrs/ws/rest/v1/eaushadha/stock-receipt";

export const dispenseConceptURL = '/openmrs/ws/rest/v1/concept?q=Dispensed&limit=1'
export const stockOperationURL = "/openmrs/ws/rest/v2/inventory/stockOperation"
export const stockOperationTypeURL = (stockOperationType) => `/openmrs/ws/rest/v2/inventory/stockOperationType?v=full&q=${stockOperationType}`
export const inventoryItemByNameURL = (itemName) => `/openmrs/ws/rest/v2/inventory/item?v=full&q=${itemName}`
export const sessionURL = '/openmrs/ws/rest/v1/session?v=custom:(uuid)'
export const getAllPatient = (locationUuid) => `/openmrs/ws/rest/v1/bahmni/search/patient/lucene?filterOnAllIdentifiers=true&loginLocationUuid=${locationUuid}`