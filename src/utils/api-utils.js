export const invItemURL = (locationName) =>
	`/openmrs/ws/rest/v2/inventory/itemStock?stockroom_uuid=${locationName}`;
export const activePatientWithDrugOrders = (locationUuid) =>
	`/openmrs/ws/rest/v1/bahmnicore/sql?location_uuid=${locationUuid}&q=emrapi.sqlSearch.activePatientsWithDrugOrders&v=full`;
export const fetcher = (url) =>
	fetch(url).then((response) => {
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
export const stockRoomURL = (locationName) => `/openmrs/ws/rest/v2/inventory/stockroom?q=${locationName}`;
