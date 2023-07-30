import { dispenseConceptURL, getRequest, postRequest, sessionURL } from "../utils/api-utils";

export const bahmniEncounterPost = async (data, location) => {
	console.log('location', location)
	const dispenseConceptData = await getRequest(dispenseConceptURL);
	const session = await getRequest(sessionURL)
	console.log('session', session)
	const observations = data.dispense_drugs.map((drug) => ({
		providers: [
			{
				uuid: session.currentProvider.uuid,
				name: session.user.username,
			},
		],
		conceptSortWeight: 1,
		status: "FINAL",
		conceptUuid: dispenseConceptData.results[0].uuid,
		orderUuid: drug.id,
		observationDateTime: new Date().getTime(),
		conceptNameToDisplay: "D",
		valueAsString: "Yes",
		concept: {
			uuid: dispenseConceptData.results[0].uuid,
			name: "Dispensed",
			dataType: "Boolean",
		},
		value: true,
	}));

	const requestBody = {
		locationUuid: location.uuid,
		patientUuid: data.patientUuid,
		providers: [
			{
				uuid: session.currentProvider.uuid,
				name: session.user.username,
			},
		],
		observations,
	};

	await postRequest(
		"/openmrs/ws/rest/v1/bahmnicore/bahmniencounter",
		requestBody
	);
};
