import { postRequest } from "../utils/api-utils";

// eslint-disable-next-line import/prefer-default-export
export const saveDispense = async (data) => {
	const requestBody = {
		status: "NEW",
		attributes: [],
		items: [
			{
				item: "49fc18d0-21a7-44a7-8f48-323399824ddf",
				quantity: 5,
				calculatedExpiration: true,
			},
		],
		patient: "ec5f8bf9-0e18-4417-8e9a-0d6af2005f29",
		operationNumber: "",
		instanceType: "c264f34b-c795-4576-9928-454d1fa20e09",
		operationDate: "12-07-2023 23:38:05",
		source: "53d12a8a-2475-11ee-8006-0242ac13000b",
		institution: "",
		department: "",
	};
	return postRequest(
		"/openmrs/ws/rest/v2/inventory/stockOperation",
		requestBody
	);
};
