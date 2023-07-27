export const getMappedDrugs = (visitDrugOrder) => {
	return {
		id: visitDrugOrder.uuid,
		drugName: visitDrugOrder.drug.name,
		drugUuid: visitDrugOrder.drug.uuid,
		quantity: visitDrugOrder.dosingInstructions.quantity,
		dosingInstructions: visitDrugOrder.dosingInstructions,
		duration: visitDrugOrder.duration,
		durationUnits: visitDrugOrder.durationUnits,
	};
};


export const getDrugItems = (patient, prescribedDrugs)=>{
 return {
    id: patient.id,
    name: patient.name,
    dispense_drugs: [...prescribedDrugs],
  }
}