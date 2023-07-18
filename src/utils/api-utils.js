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

export const fetcherPost = (url) => {
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ouid: "ISS/NR/2021-22/2935231" }),
		signal: controller.signal,
	})
		.then((response) => response.json())
		.then((data) => {
			clearTimeout(timeoutId); // Clear the timeout if the request succeeds
			return data;
		});
};

export const postRequest = async (url, data) => {
	return await fetch(`${url}`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": "token-value",
		},
		body: JSON.stringify(data),
	});
};

export const swrOptions = {
	revalidateIfStale: false,
	revalidateOnFocus: false,
	revalidateOnReconnect: false,
};
export const stockRoomURL = (locationName) => `/openmrs/ws/rest/v2/inventory/stockroom?q=${locationName}`;

export const prescribedDrugOrders = (patientUuid) =>
	`/openmrs/ws/rest/v1/bahmnicore/drugOrders/prescribedAndActive?getEffectiveOrdersOnly=false&getOtherActive=true&numberOfVisits=5&patientUuid=${patientUuid}&preferredLocale=en`;
