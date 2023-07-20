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
	})
		.then((response) => response.json())
		.then((response) => {
			clearTimeout(timeoutId); // Clear the timeout if the request succeeds
			return response;
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

export const swrOptions = {
	revalidateIfStale: false,
	revalidateOnFocus: false,
	revalidateOnReconnect: false,
};
export const stockRoomURL = (locationName) =>
	`/openmrs/ws/rest/v2/inventory/stockroom?q=${locationName}`;

export const prescribedDrugOrders = (patientUuid) =>
	`/openmrs/ws/rest/v1/bahmnicore/drugOrders/prescribedAndActive?getEffectiveOrdersOnly=false&getOtherActive=true&numberOfVisits=5&patientUuid=${patientUuid}&preferredLocale=en`;
