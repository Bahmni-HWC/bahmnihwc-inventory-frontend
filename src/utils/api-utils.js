export const invItemURL = "/openmrs/ws/rest/v2/inventory/item";
export const activePatientWithDrugOrders = (location_uuid) =>`/openmrs/ws/rest/v1/bahmnicore/sql?location_uuid=${location_uuid}&q=emrapi.sqlSearch.activePatientsWithDrugOrders&v=full`
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
