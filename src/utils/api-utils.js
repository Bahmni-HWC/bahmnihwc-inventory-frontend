export const invItemURL = "openmrs/ws/rest/v2/inventory/item";

export const fetcher = async (url) =>
	await fetch(url).then((response) => {
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
